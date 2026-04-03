"""
query.py - Legal RAG Query Engine

Embeds a user query, retrieves top-k chunks from ChromaDB, and prompts
Mistral with the retrieved context.

Usage:
    python query.py "What are the penalties under section 11 of the IT Act?"
"""

import json
import re
import sys
import time

import chromadb
import requests

CHROMA_DIR = "./backend/chroma_store"
COLLECTION = "legal_acts"

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "mxbai-embed-large"
LLM_MODEL = "mistral"

TOP_K = 8
MAX_TOKENS = 1024
MIN_SIMILARITY = 0.55  # below this = not in database


def embed_query(text: str) -> list[float]:
    """Embed a single query string using the Ollama embedding model."""
    payload = json.dumps(
        {"model": EMBED_MODEL, "input": text},
        ensure_ascii=False,
    ).encode("utf-8")

    response = requests.post(
        f"{OLLAMA_URL}/api/embed",
        data=payload,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["embeddings"][0]


def retrieve(query_embedding: list[float], top_k: int = TOP_K) -> list[dict]:
    """Retrieve the most relevant chunks from ChromaDB."""
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    collection = client.get_collection(COLLECTION)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        chunks.append(
            {
                "text": doc,
                "metadata": meta,
                "similarity": round(1 - dist, 4),
            }
        )

    return chunks


def ask(
    query: str,
    top_k: int = TOP_K,
    stream: bool = True,
    history: list[dict] = [],
) -> dict:
    """Answer a legal question using retrieved legislation excerpts."""
    t0 = time.time()

    print("Decomposing and rewriting query...")
    sub_questions = decompose_query(query)
    print(f"Sub-questions: {sub_questions}\n")

    all_chunks = []
    expanded_queries = []
    for sq in sub_questions:
        expanded = rewrite_query(sq)
        expanded_queries.append(expanded)
        print(f"Expanded sub-question: {expanded}")
        emb = embed_query(expanded)
        sub_chunks = retrieve(emb, top_k=4)
        all_chunks.extend(sub_chunks)

    t_embed = time.time() - t0

    # Deduplicate by source file + section number
    seen = set()
    unique_chunks = []
    for chunk in all_chunks:
        metadata = chunk.get("metadata", {})
        key = (
            metadata.get("source_file", ""),
            metadata.get("section_num", ""),
        )
        if key not in seen:
            seen.add(key)
            unique_chunks.append(chunk)

    chunks = unique_chunks[:5]  # was top_k (8)

    # Unload embed model from VRAM before Mistral loads
    try:
        requests.post(
            f"{OLLAMA_URL}/api/generate",
            data=json.dumps({"model": EMBED_MODEL, "keep_alive": 0}).encode(),
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        time.sleep(2)
    except Exception:
        pass

    t_retrieve = time.time() - t0 - t_embed

    # Retrieval quality check — honest fallback
    top_similarity = max((c["similarity"] for c in chunks), default=0)
    if top_similarity < MIN_SIMILARITY:
        return {
            "answer": (
                "The available legislation database doesn't contain relevant "
                "information for this query. Try rephrasing, or this topic may "
                "not be covered in the current corpus."
            ),
            "expanded_query": expanded_queries[0] if expanded_queries else query,
            "sources": [],
            "timing": {
                "embed_sec": round(t_embed, 3),
                "retrieve_sec": round(t_retrieve, 3),
                "generate_sec": 0,
            },
        }

    prompt = build_prompt(query, chunks, history=history)
    print(
        f"\n[Retrieved {len(chunks)} chunks in {t_retrieve:.2f}s | "
        f"top similarity: {top_similarity} | Generating...]\n"
    )
    answer = generate(prompt, stream=stream)
    t_generate = time.time() - t0 - t_embed - t_retrieve

    sources = [
        {
            "act": c["metadata"].get("act_title", ""),
            "section": c["metadata"].get("section_num", ""),
            "title": c["metadata"].get("section_title", ""),
            "file": c["metadata"].get("source_file", ""),
            "similarity": c["similarity"],
        }
        for c in chunks
    ]

    return {
        "answer": answer,
        "expanded_query": expanded_queries[0] if expanded_queries else query,
        "sources": sources,
        "timing": {
            "embed_sec": round(t_embed, 3),
            "retrieve_sec": round(t_retrieve, 3),
            "generate_sec": round(t_generate, 3),
        },
    }


def build_prompt(query: str, chunks: list[dict], history: list[dict] = []) -> str:
    history_text = ""
    if history:
        history_text = "CONVERSATION HISTORY:\n"
        for msg in history:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"
        history_text += "\n"

    context_blocks = []
    for i, chunk in enumerate(chunks, 1):
        meta = chunk["metadata"]
        header = (
            f"[{i}] {meta.get('act_title', 'Unknown Act')} - Section "
            f"{meta.get('section_num', '?')}: {meta.get('section_title', '')}"
        )
        context_blocks.append(f"{header}\n{chunk['text']}")
    context = "\n\n---\n\n".join(context_blocks)

    return f"""You are a legal assistant for Indian law. The user is the VICTIM.

{history_text}EXCERPTS FROM INDIAN LEGISLATION:
{context}

QUESTION: {query}

INSTRUCTIONS:
- Answer using ONLY the excerpts above
- Cite exact Act name + Section number for every point
- The user is in India — only cite Indian laws
- Do NOT say "consult a lawyer"
- Do NOT mention laws not in the excerpts above

ANSWER:"""


def _post_generate(payload: bytes, stream: bool, timeout: int = 300) -> requests.Response:
    """Issue a generate request to Ollama."""
    return requests.post(
        f"{OLLAMA_URL}/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        stream=stream,
        timeout=timeout,
    )


def generate(prompt: str, stream: bool = True) -> str:
    """Send prompt to Mistral via Ollama and return the generated text."""
    payload = json.dumps(
        {
            "model": LLM_MODEL,
            "prompt": prompt,
            "stream": stream,
            "keep_alive": "10m",
            "options": {
                "num_predict": MAX_TOKENS,
                "temperature": 0,
                "top_p": 0.9,
            },
        }
    ).encode("utf-8")

    response = _post_generate(payload, stream=stream)
    if not response.ok:
        print(f"Ollama error: {response.text}")
        if "terminated" in response.text.lower():
            print("Mistral crashed - waiting 5s and retrying...")
            time.sleep(5)
            response = _post_generate(payload, stream=stream)
            if not response.ok:
                print(f"Retry failed: {response.text}")
        response.raise_for_status()

    if stream:
        full_response = ""
        for line in response.iter_lines():
            if not line:
                continue
            chunk = json.loads(line)
            token = chunk.get("response", "")
            print(token, end="", flush=True)
            full_response += token
            if chunk.get("done"):
                print()
                break
        return full_response

    return response.json()["response"]


def rewrite_query(query: str) -> str:
    """Expand a casual query into more formal legal terminology."""
    payload = json.dumps(
        {
            "model": LLM_MODEL,
            "prompt": f"""Convert this question into formal Indian legal terminology for searching legislation.
Output only the expanded search query, nothing else.

Question: {query}
Legal search query:""",
            "stream": False,
            "keep_alive": "10m",
            "options": {"num_predict": 60, "temperature": 0},
        }
    ).encode("utf-8")

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["response"].strip()
    except Exception:
        return query


def decompose_query(query: str) -> list[str]:
    """Break a legal question into separate sub-questions when appropriate."""
    print(f"Decomposing: '{query}'")
    payload = json.dumps(
        {
            "model": LLM_MODEL,
            "prompt": f"""You are given a single legal question. If it contains multiple distinct legal issues, split it into separate questions. Otherwise return it as-is.

Output ONLY a valid JSON array of strings. No explanation. No preamble.
Return at most 3 items.

Question: {query}

JSON array:""",
            "stream": False,
            "keep_alive": "10m",
            "options": {"num_predict": 150, "temperature": 0},
        }
    ).encode("utf-8")

    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"},
            timeout=30,
        )
        response.raise_for_status()
        text = response.json()["response"].strip()

        match = re.search(r"\[.*\]", text, re.DOTALL)
        if not match:
            return [query]

        parsed = json.loads(match.group())
        if not isinstance(parsed, list):
            return [query]

        sub_questions = [
            item.strip() for item in parsed if isinstance(item, str) and item.strip()
        ]
        return sub_questions[:3] or [query]
    except Exception:
        return [query]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python query.py "your legal question here"')
        sys.exit(1)

    question = " ".join(sys.argv[1:])
    print(f"Query: {question}\n")

    result = ask(question, stream=False)

    print("\n=== Answer ===")
    print(result["answer"].strip())

    print("\n=== Sources ===")
    for i, src in enumerate(result["sources"], 1):
        print(
            f"  [{i}] {src['act']} Section {src['section']} - "
            f"{src['title']} (sim: {src['similarity']})"
        )

    print("\n=== Timing ===")
    timing = result["timing"]
    print(
        f"  Embed: {timing['embed_sec']}s | "
        f"Retrieve: {timing['retrieve_sec']}s | "
        f"Generate: {timing['generate_sec']}s"
    )

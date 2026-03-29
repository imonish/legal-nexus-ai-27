"""
query.py - Legal RAG Query Engine

Embeds a user query, retrieves top-k chunks from ChromaDB, and prompts
Mistral with the retrieved context.

Usage:
    python query.py "What are the penalties under section 11 of the IT Act?"
"""

import json
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
    """Query ChromaDB for the top-k most similar chunks."""
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    collection = client.get_collection(COLLECTION)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    chunks: list[dict] = []
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


def build_prompt(query: str, chunks: list[dict]) -> str:
    """Build the RAG prompt from retrieved chunks."""
    context_blocks = []
    for i, chunk in enumerate(chunks, 1):
        meta = chunk["metadata"]
        header = (
            f"[{i}] {meta.get('act_title', 'Unknown Act')} - "
            f"Section {meta.get('section_num', '?')}: "
            f"{meta.get('section_title', '')}"
        )
        context_blocks.append(f"{header}\n{chunk['text']}")

    context = "\n\n---\n\n".join(context_blocks)

    return f"""You are a legal assistant specializing in Indian law. Your knowledge base contains Indian legislation from 1939 to 2019.
Answer ONLY using the legal text excerpts provided below.
If the excerpts do not contain sufficient information to answer the question, respond with exactly:
"This information is not available in the current database. The query may relate to legislation outside the 1939-2019 range (e.g. IPC 1860, CrPC, Evidence Act 1872)."
Do NOT use your training knowledge. Do NOT fabricate penalties or section numbers.
Cite Act name and Section number for every claim.

LEGAL EXCERPTS:
{context}

USER QUESTION:
{query}

ANSWER (based only on excerpts above):"""


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
                "temperature": 0.2,
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


def ask(query: str, top_k: int = TOP_K, stream: bool = True) -> dict:
    """
    Full RAG pipeline: rewrite -> embed -> retrieve -> generate.
    Returns answer, sources, and timing data.
    """
    t0 = time.time()

    print("Rewriting query...")
    expanded = rewrite_query(query)
    print(f"Expanded: {expanded}\n")

    query_embedding = embed_query(expanded)
    t_embed = time.time() - t0

    # Try to unload the embedding model before generation.
    try:
        requests.post(
            f"{OLLAMA_URL}/api/generate",
            data=json.dumps({"model": EMBED_MODEL, "keep_alive": 0}).encode(),
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        for _ in range(10):
            ps = requests.get(f"{OLLAMA_URL}/api/ps", timeout=5).json()
            loaded = [model["name"] for model in ps.get("models", [])]
            if EMBED_MODEL not in loaded and f"{EMBED_MODEL}:latest" not in loaded:
                break
            time.sleep(1)
    except Exception:
        pass

    chunks = retrieve(query_embedding, top_k=top_k)
    t_retrieve = time.time() - t0 - t_embed

    prompt = build_prompt(query, chunks)
    print(f"\n[Retrieved {len(chunks)} chunks in {t_retrieve:.2f}s | Generating...]\n")
    answer = generate(prompt, stream=stream)
    t_generate = time.time() - t0 - t_embed - t_retrieve

    sources = [
        {
            "act": chunk["metadata"].get("act_title", ""),
            "section": chunk["metadata"].get("section_num", ""),
            "title": chunk["metadata"].get("section_title", ""),
            "file": chunk["metadata"].get("source_file", ""),
            "similarity": chunk["similarity"],
        }
        for chunk in chunks
    ]

    return {
        "answer": answer,
        "sources": sources,
        "timing": {
            "embed_sec": round(t_embed, 3),
            "retrieve_sec": round(t_retrieve, 3),
            "generate_sec": round(t_generate, 3),
        },
    }


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

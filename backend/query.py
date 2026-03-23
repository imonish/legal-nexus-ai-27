"""
query.py — Legal RAG Query Engine

Embeds user query → retrieves top-k chunks from ChromaDB → prompts Mistral with context.

Usage (standalone test):
    python query.py "What are the penalties under section 11 of the IT Act?"
"""

import json
import sys
import time
import requests
import chromadb

# ── Config ─────────────────────────────────────────────────────────────────────
CHROMA_DIR   = "./backend/chroma_store"
COLLECTION   = "legal_acts"

OLLAMA_URL   = "http://localhost:11434"
EMBED_MODEL  = "mxbai-embed-large"
LLM_MODEL    = "mistral"

TOP_K        = 5          # number of chunks to retrieve
MAX_TOKENS   = 1024       # LLM response length cap


# ── Embedding ──────────────────────────────────────────────────────────────────

def embed_query(text: str) -> list[float]:
    """Embed a single query string using mxbai-embed-large."""
    payload = json.dumps(
        {"model": EMBED_MODEL, "input": text},
        ensure_ascii=False
    ).encode("utf-8")

    response = requests.post(
        f"{OLLAMA_URL}/api/embed",
        data=payload,
        headers={"Content-Type": "application/json"},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["embeddings"][0]


# ── Retrieval ──────────────────────────────────────────────────────────────────

def retrieve(query_embedding: list[float], top_k: int = TOP_K) -> list[dict]:
    """Query ChromaDB for the top-k most similar chunks."""
    client     = chromadb.PersistentClient(path=CHROMA_DIR)
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
        chunks.append({
            "text":       doc,
            "metadata":   meta,
            "similarity": round(1 - dist, 4),  # cosine distance → similarity
        })

    return chunks


# ── Prompt Construction ────────────────────────────────────────────────────────

def build_prompt(query: str, chunks: list[dict]) -> str:
    context_blocks = []
    for i, chunk in enumerate(chunks, 1):
        meta = chunk["metadata"]
        header = f"[{i}] {meta.get('act_title', 'Unknown Act')} — Section {meta.get('section_num', '?')}: {meta.get('section_title', '')}"
        context_blocks.append(f"{header}\n{chunk['text']}")

    context = "\n\n---\n\n".join(context_blocks)

    return f"""You are a legal assistant specializing in Indian law. Answer the user's question using ONLY the provided legal text excerpts. Cite the specific Act and Section number when making claims. If the answer is not found in the excerpts, say so clearly — do not fabricate legal information.

LEGAL EXCERPTS:
{context}

USER QUESTION:
{query}

ANSWER:"""


# ── LLM Generation ─────────────────────────────────────────────────────────────

def generate(prompt: str, stream: bool = True) -> str:
    """Send prompt to Mistral via Ollama. Streams output to stdout if stream=True."""
    payload = json.dumps({
        "model":  LLM_MODEL,
        "prompt": prompt,
        "stream": stream,
        "options": {
            "num_predict": MAX_TOKENS,
            "temperature": 0.2,   # low temp — factual legal answers
            "top_p": 0.9,
        },
    }).encode("utf-8")

    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        data=payload,
        headers={"Content-Type": "application/json"},
        stream=stream,
        timeout=120,
    )
    response.raise_for_status()

    full_response = ""

    if stream:
        for line in response.iter_lines():
            if not line:
                continue
            chunk = json.loads(line)
            token = chunk.get("response", "")
            print(token, end="", flush=True)
            full_response += token
            if chunk.get("done"):
                print()  # newline after stream ends
                break
    else:
        full_response = response.json()["response"]

    return full_response


# ── Main RAG Pipeline ──────────────────────────────────────────────────────────

def ask(query: str, top_k: int = TOP_K, stream: bool = True) -> dict:
    """
    Full RAG pipeline: embed → retrieve → generate.
    Returns dict with answer, sources, and timing.
    """
    t0 = time.time()

    # 1. Embed query
    query_embedding = embed_query(query)
    t_embed = time.time() - t0

    # Unload embed model from VRAM so Mistral gets the full 6GB
    requests.post(
        f"{OLLAMA_URL}/api/generate",
        data=json.dumps({"model": EMBED_MODEL, "keep_alive": 0}).encode(),
        headers={"Content-Type": "application/json"},
        timeout=10,
    )

    # 2. Retrieve chunks
    chunks = retrieve(query_embedding, top_k=top_k)
    t_retrieve = time.time() - t0 - t_embed

    # 3. Build prompt + generate
    prompt = build_prompt(query, chunks)
    print(f"\n[Retrieved {len(chunks)} chunks in {t_retrieve:.2f}s | Generating...]\n")
    answer = generate(prompt, stream=stream)
    t_generate = time.time() - t0 - t_embed - t_retrieve

    # 4. Format sources
    sources = [
        {
            "act":        c["metadata"].get("act_title", ""),
            "section":    c["metadata"].get("section_num", ""),
            "title":      c["metadata"].get("section_title", ""),
            "file":       c["metadata"].get("source_file", ""),
            "similarity": c["similarity"],
        }
        for c in chunks
    ]

    return {
        "answer":  answer,
        "sources": sources,
        "timing": {
            "embed_sec":    round(t_embed, 3),
            "retrieve_sec": round(t_retrieve, 3),
            "generate_sec": round(t_generate, 3),
        },
    }


# ── CLI ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python query.py \"your legal question here\"")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    print(f"Query: {query}\n")

    result = ask(query)

    print("\n── Sources ──────────────────────────────────────────────")
    for i, src in enumerate(result["sources"], 1):
        print(f"  [{i}] {src['act']} § {src['section']} — {src['title']} (sim: {src['similarity']})")

    print(f"\n── Timing ───────────────────────────────────────────────")
    t = result["timing"]
    print(f"  Embed: {t['embed_sec']}s | Retrieve: {t['retrieve_sec']}s | Generate: {t['generate_sec']}s")
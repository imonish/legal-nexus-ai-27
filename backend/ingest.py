"""
ingest.py — Legal RAG Pipeline
Extracts sections from Indian legislation PDFs, embeds with mxbai-embed-large via Ollama, stores in ChromaDB.

Usage:
    python ingest.py --pdf_dir /path/to/pdfs
    python ingest.py --pdf_dir /path/to/pdfs --reset  # wipe and rebuild
"""

import os
import re
import json
import argparse
import time
from pathlib import Path

import fitz  # pymupdf
from dotenv import load_dotenv
import chromadb
import requests

load_dotenv()

# ── Config ─────────────────────────────────────────────────────────────────────
BASE_DIR         = Path(__file__).resolve().parent
CHROMA_DIR       = str(BASE_DIR / "chroma_store")
COLLECTION       = "legal_acts"
OLLAMA_URL       = "http://localhost:11434/api/embed"
EMBED_MODEL      = "mxbai-embed-large"
EMBED_BATCH_SIZE = 50
EMBED_SLEEP_SEC  = 0

# mxbai-embed-large: 512 token limit ≈ 1800 chars for legal text (dense tokenization)
EMBED_MAX_CHARS  = 1200

# Section regex: matches "12. Some Title.—" or "12A. Some Title.—"
SECTION_PATTERN = re.compile(
    r'(?m)^(\d+[A-Z]?)\.\s+([A-Za-z][^.\n]{0,80}?)(?:\.[-—]|\.(?:\s{2,}|\n))'
)

MIN_ALPHA_RATIO = 0.45
MIN_CHUNK_WORDS = 20


# ── PDF Extraction ──────────────────────────────────────────────────────────────

def extract_text(pdf_path: Path) -> str:
    doc = fitz.open(str(pdf_path))
    pages = [page.get_text("text") for page in doc]
    doc.close()
    return "\n".join(pages)


def parse_act_header(text: str) -> tuple[str, str]:
    lines = [l.strip() for l in text.split("\n") if l.strip()][:15]
    act_title  = ""
    act_number = ""
    for line in lines:
        if re.search(r'ACT\b', line, re.IGNORECASE) and len(line) > 10:
            if not act_title:
                act_title = line.strip()
        if re.match(r'ACT\s+NO\.?\s+\d+', line, re.IGNORECASE):
            act_number = line.strip()
            break
    return act_title or lines[0], act_number


# ── Chunking ───────────────────────────────────────────────────────────────────

def is_table_chunk(text: str) -> bool:
    if not text:
        return True
    alpha = sum(c.isalpha() for c in text)
    ratio = alpha / len(text)
    words = len(text.split())
    return ratio < MIN_ALPHA_RATIO or words < MIN_CHUNK_WORDS


def split_sections(text: str) -> list[dict]:
    matches = list(SECTION_PATTERN.finditer(text))
    if not matches:
        return []

    chunks = []
    for i, match in enumerate(matches):
        section_num   = match.group(1)
        section_title = match.group(2).strip()
        start = match.start()
        end   = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        section_text  = text[start:end].strip()

        if is_table_chunk(section_text):
            continue

        chunks.append({
            "section_num":   section_num,
            "section_title": section_title,
            "section_text":  section_text,
        })

    return chunks


def truncate_for_embedding(text: str, max_chars: int = EMBED_MAX_CHARS) -> str:
    """
    Hard-truncate to max_chars, cutting at the last whitespace to avoid
    splitting mid-word. mxbai-embed-large has a 512 token context window;
    legal text tokenizes at ~3-4 chars/token so 1800 chars ≈ 450-600 tokens.
    """
    if len(text) <= max_chars:
        return text
    truncated  = text[:max_chars]
    last_space = truncated.rfind(" ")
    return truncated[:last_space] if last_space > max_chars * 0.8 else truncated


def process_pdf(pdf_path: Path) -> list[dict]:
    text = extract_text(pdf_path)
    act_title, act_number = parse_act_header(text)
    sections = split_sections(text)

    # Use full filename (not stem) to avoid collisions between similarly-named PDFs
    file_key = pdf_path.name.replace(" ", "_")

    records = []
    for sec in sections:
        chunk_id  = f"{file_key}__s{sec['section_num']}"
        full_text = (
            f"Act: {act_title}\n"
            f"Section {sec['section_num']}: {sec['section_title']}\n\n"
            f"{sec['section_text']}"
        )
        records.append({
            "id":   chunk_id,
            "text": full_text,           # full text stored in ChromaDB
            "embed_text": truncate_for_embedding(full_text),  # truncated for Ollama
            "metadata": {
                "source_file":   pdf_path.name,
                "act_title":     act_title,
                "act_number":    act_number,
                "section_num":   sec["section_num"],
                "section_title": sec["section_title"],
                "truncated":     len(full_text) > EMBED_MAX_CHARS,  # flag for auditing
            },
        })

    return records


# ── Embedding ──────────────────────────────────────────────────────────────────

def embed_batch(records: list[dict]) -> list[list[float] | None]:
    """
    Send entire batch in ONE Ollama request. Ollama's /api/embed accepts
    a list for 'input', returning all embeddings in a single round trip.
    """
    texts = [r["embed_text"] for r in records]

    payload = json.dumps(
        {"model": EMBED_MODEL, "input": texts},  # list, not single string
        ensure_ascii=False
    ).encode("utf-8")

    try:
        response = requests.post(
            OLLAMA_URL,
            data=payload,
            headers={"Content-Type": "application/json"},
            timeout=120,  # larger batch needs more time
        )
        response.raise_for_status()
        embeddings = response.json()["embeddings"]  # list of lists

        if len(embeddings) != len(records):
            print(f"  [WARN] Expected {len(records)} embeddings, got {len(embeddings)}")

        return embeddings

    except requests.HTTPError:
        print(f"  [HTTP {response.status_code}] {response.text[:200]}")
        print(f"  Falling back to one-by-one for this batch...")
        return _embed_batch_fallback(records)
    except Exception as e:
        print(f"  [EMBED FAIL] {e}")
        return [None] * len(records)


def _embed_batch_fallback(records: list[dict]) -> list[list[float] | None]:
    """One-by-one fallback when batch request fails (e.g. one chunk too long)."""
    embeddings = []
    for r in records:
        payload = json.dumps(
            {"model": EMBED_MODEL, "input": r["embed_text"]},
            ensure_ascii=False
        ).encode("utf-8")
        try:
            response = requests.post(
                OLLAMA_URL,
                data=payload,
                headers={"Content-Type": "application/json"},
                timeout=30,
            )
            response.raise_for_status()
            embeddings.append(response.json()["embeddings"][0])
        except Exception as e:
            print(f"    [SKIP] {r['id']} — {e}")
            embeddings.append(None)
    return embeddings


# ── ChromaDB ───────────────────────────────────────────────────────────────────

def get_collection(reset: bool = False) -> chromadb.Collection:
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    if reset:
        try:
            client.delete_collection(COLLECTION)
            print(f"[reset] Deleted existing collection '{COLLECTION}'")
        except Exception:
            pass
    return client.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"},
    )


# ── Main Ingestion Loop ─────────────────────────────────────────────────────────

def ingest(pdf_dir: str, reset: bool = False):
    pdf_paths = sorted(Path(pdf_dir).glob("*.pdf"))
    if not pdf_paths:
        print(f"No PDFs found in {pdf_dir}")
        return

    print(f"Found {len(pdf_paths)} PDFs")
    collection = get_collection(reset=reset)

    existing_ids = set(collection.get(include=[])["ids"])
    print(f"Already ingested: {len(existing_ids)} chunks")

    all_records: list[dict] = []

    # ── Step 1: Parse all PDFs ──
    for i, pdf_path in enumerate(pdf_paths):
        try:
            records     = process_pdf(pdf_path)
            new_records = [r for r in records if r["id"] not in existing_ids]
            all_records.extend(new_records)

            truncated_count = sum(1 for r in new_records if r["metadata"]["truncated"])
            print(f"[{i+1}/{len(pdf_paths)}] {pdf_path.name}: "
                  f"{len(records)} sections, {len(new_records)} new"
                  + (f", {truncated_count} will be truncated" if truncated_count else ""))
        except Exception as e:
            print(f"[ERROR] {pdf_path.name}: {e}")
            continue

    if not all_records:
        print("Nothing new to ingest.")
        return

    # Deduplicate by ID — keeps last occurrence if same section appears in multiple PDFs
    seen_ids = {}
    for r in all_records:
        seen_ids[r["id"]] = r
    all_records = list(seen_ids.values())

    print(f"\nTotal new chunks to embed: {len(all_records)}")

    # ── Step 2: Embed + upsert in batches ──
    total_failed = 0
    start_time   = time.time()

    for batch_start in range(0, len(all_records), EMBED_BATCH_SIZE):
        batch      = all_records[batch_start : batch_start + EMBED_BATCH_SIZE]
        embeddings = embed_batch(batch)

        # Filter out failed embeddings before upserting
        valid = [
            (r, emb) for r, emb in zip(batch, embeddings)
            if emb is not None
        ]
        failed = len(batch) - len(valid)
        total_failed += failed

        if not valid:
            print(f"  [WARN] batch {batch_start}: all {len(batch)} embeddings failed, skipping")
            continue

        if failed:
            print(f"  [WARN] batch {batch_start}: {failed} chunk(s) skipped")

        good_records = [r   for r, _ in valid]
        good_embeds  = [emb for _, emb in valid]

        # ── Step 3: Upsert into ChromaDB ──
        collection.upsert(
            ids        = [r["id"]       for r in good_records],
            documents  = [r["text"]     for r in good_records],  # full text stored
            embeddings = good_embeds,
            metadatas  = [r["metadata"] for r in good_records],
        )

        done    = min(batch_start + EMBED_BATCH_SIZE, len(all_records))
        elapsed = time.time() - start_time
        rate    = done / elapsed
        eta     = (len(all_records) - done) / rate if rate > 0 else 0
        print(f"  [{done}/{len(all_records)}] {rate:.1f} chunks/sec — ETA {eta/60:.1f} min")

    total = collection.count()
    print(f"\nDone. Total chunks in ChromaDB: {total}")
    if total_failed:
        print(f"[WARN] {total_failed} chunks were skipped due to embedding failures.")


# ── CLI ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Indian legal PDFs into ChromaDB")
    parser.add_argument("--pdf_dir", required=True, help="Folder containing PDF files")
    parser.add_argument("--reset",   action="store_true", help="Wipe collection and rebuild")
    args = parser.parse_args()

    ingest(pdf_dir=args.pdf_dir, reset=args.reset)

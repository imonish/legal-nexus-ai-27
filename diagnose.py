# diagnose_lengths.py — run once from project root
from pathlib import Path
from ingest import process_pdf, EMBED_MAX_CHARS

pdf_paths = sorted(Path("E:/projects/legal-nexus-ai-27/data").glob("*.pdf"))  # adjust path

lengths = []
for pdf_path in pdf_paths:
    try:
        records = process_pdf(pdf_path)
        lengths.extend(len(r["text"]) for r in records)
    except Exception as e:
        print(f"[ERROR] {pdf_path.name}: {e}")

lengths.sort()
print(f"Total chunks: {len(lengths)}")
print(f"Median length: {lengths[len(lengths)//2]}")
print(f"95th percentile: {lengths[int(len(lengths)*0.95)]}")
print(f"99th percentile: {lengths[int(len(lengths)*0.99)]}")
print(f"Max length: {lengths[-1]}")
print(f"Chunks > {EMBED_MAX_CHARS} chars: {sum(1 for l in lengths if l > EMBED_MAX_CHARS)}")
print(f"Chunks > 1200 chars: {sum(1 for l in lengths if l > 1200)}")
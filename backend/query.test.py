# test_query.py — run from E:\projects\legal-nexus-ai-27
import os
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Connect to ChromaDB
client = chromadb.PersistentClient(path="chroma_store")
col = client.get_collection("legal_acts")

# Embed the query
query = "What are the powers of a manager under property administration?"

result = genai.embed_content(
    model="models/gemini-embedding-001",
    content=query,
    task_type="retrieval_query",  # query, not document
)

# Search top 3 closest chunks
hits = col.query(
    query_embeddings=[result["embedding"]],
    n_results=3,
)

# Print results
for i, (doc, meta) in enumerate(zip(hits["documents"][0], hits["metadatas"][0])):
    print(f"\n{'='*60}")
    print(f"Result {i+1}: {meta['act_title']}")
    print(f"Section {meta['section_num']}: {meta['section_title']}")
    print(f"{doc[:400]}")
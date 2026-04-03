"""
api.py — Legal RAG FastAPI Server

Endpoints:
    POST /query     — ask a legal question, get answer + sources
    GET  /health    — sanity check

Usage:
    uvicorn backend.api:app --reload --port 8000 --host 0.0.0.0
"""

import os
import sys
import traceback

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.query import ask, TOP_K

# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Legal Nexus AI",
    description="RAG pipeline over Indian legislation (1939-2019)",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://192.168.1.35:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ────────────────────────────────────────────────────────────────────

class HistoryMessage(BaseModel):
    role:    str
    content: str

class QueryRequest(BaseModel):
    question: str | None = None
    query:    str | None = None
    top_k:    int = TOP_K
    history:  list[HistoryMessage] = []

class SourceItem(BaseModel):
    act:        str
    section:    str
    title:      str
    file:       str
    similarity: float

class QueryResponse(BaseModel):
    question:       str
    answer:         str
    expanded_query: str = ""
    sources:        list[SourceItem]
    timing:         dict

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "database": "legal_acts"}


@app.post("/query", response_model=QueryResponse)
def query_endpoint(req: QueryRequest):
    user_query = (req.question or req.query or "").strip()

    if not user_query:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # Guard for very short non-legal queries
    legal_keywords = [
        "law", "act", "section", "penalty", "rights", "court",
        "legal", "fine", "imprisonment", "offence", "complaint",
        "contract", "property", "tax", "crime", "police", "bail",
        "arrest", "judge", "tribunal", "damages", "liability",
        "what", "how", "when", "who", "can", "does", "is", "are",
        "got", "my", "i", "help", "want", "need",
    ]
    is_legal = any(kw in user_query.lower() for kw in legal_keywords)

    if not is_legal and len(user_query.split()) < 4:
        return QueryResponse(
            question=user_query,
            answer="I'm a legal assistant specializing in Indian legislation. Please ask a legal question — for example: 'What are the penalties under the Insolvency and Bankruptcy Code?' or 'What are tenant rights in India?'",
            expanded_query="",
            sources=[],
            timing={"embed_sec": 0, "retrieve_sec": 0, "generate_sec": 0},
        )

    # Convert history to plain dicts for query.py
    history = [{"role": m.role, "content": m.content} for m in req.history]

    try:
        result = ask(user_query, top_k=req.top_k, stream=False, history=history)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    return QueryResponse(
        question=user_query,
        answer=result["answer"],
        expanded_query=result.get("expanded_query", ""),
        sources=[SourceItem(**s) for s in result["sources"]],
        timing=result["timing"],
    )
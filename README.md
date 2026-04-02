# ⚖️ LexGuide AI — Local RAG-Based Legal Assistant

A fully local AI system that answers legal questions using real Indian legislation with section-level citations.

Built to run entirely on a personal laptop — no APIs, no cloud, no external dependencies.

---

## 🚀 Overview

LexGuide AI allows users to ask legal questions in plain English and receive structured, citation-backed answers sourced from Indian law documents.

Example:
> "What happens if my landlord evicts me?"

→ Returns:
- Relevant legal provisions
- Act name + section number
- Contextual explanation

---

## 🧠 Core Architecture

User Query  
→ Query Rewriting (LLM)  
→ Embedding Generation  
→ Vector Retrieval (Top-K chunks)  
→ Context Injection  
→ LLM Answer Generation  
→ Response with Sources  

---

## ⚙️ Tech Stack

### 🔹 AI / ML
- Mistral 7B (local LLM via Ollama)
- mxbai-embed-large (embeddings)

### 🔹 Backend
- FastAPI
- ChromaDB (vector database)
- PyMuPDF (PDF extraction)

### 🔹 Frontend
- React + Vite
- Tailwind CSS
- Framer Motion

### 🔹 Infrastructure
- Runs locally (no cloud)
- GPU: RTX 3050 (6GB VRAM)
- CPU fallback supported

---

## 📊 Dataset

- 855+ legal PDFs processed  
- 22,000+ text chunks indexed  
- Covers 80+ years of Indian legislation  

Includes:
- IPC (1860)
- CPC (1908)
- CrPC (partial)
- Consumer Protection Act
- Insolvency & Bankruptcy Code
- +800 additional acts

---

## 🔍 Key Features

- ✅ Fully offline RAG pipeline  
- ✅ Legal query rewriting for better retrieval  
- ✅ Section-level citation support  
- ✅ Vector similarity search (ChromaDB)  
- ✅ Real-time UI with source visibility  
- ✅ Optimized for low-VRAM hardware  

---

## ⚡ Performance

| Metric | Value |
|------|------|
| Retrieval Time | ~4 seconds |
| Generation Time | ~45 seconds |
| Embedding Speed | ~14 chunks/sec |
| Total Ingestion Time | ~26 minutes |

---

## 🛠️ Engineering Challenges Solved

- Optimized embedding throughput using batch processing  
- Managed LLM memory constraints under 6GB VRAM  
- Implemented fallback CPU inference pipeline  
- Fixed token limits via controlled chunk truncation  
- Resolved API inconsistencies and timeout failures  
- Designed resumable ingestion pipeline for large datasets  

---

## 📂 Pipeline Details

### 1. Ingestion
- Extract text from PDFs using PyMuPDF  
- Split into sections using regex patterns  
- Filter noisy/low-quality chunks  
- Truncate to fit embedding limits  

### 2. Embedding
- Batch processing (50 chunks per call)  
- Embedded using mxbai model  

### 3. Storage
- Stored in ChromaDB with cosine similarity  

### 4. Query Flow
- Rewrite user query into legal language  
- Retrieve top 8 relevant chunks  
- Inject into prompt  
- Generate answer using Mistral  

---

## 💡 Why This Project Matters

- Demonstrates end-to-end AI system design  
- Works under real-world hardware constraints  
- Combines data engineering, ML, backend, and UI  
- Avoids reliance on external APIs or cloud  

---

## 🔮 Future Improvements

- Chat memory & session context  
- Faster inference using quantized models  
- Full legal dataset coverage (Constitution, Contracts, etc.)  
- Deployment to cloud or hybrid mode  
- Improved latency (<15s target)  

---

## 🧪 How to Run

### Prerequisites
- Python 3.x
- Node.js
- Ollama installed

### Steps

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

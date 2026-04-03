@echo off
echo Starting LexGuide AI...

:: Terminal 1 — Ollama
start "Ollama" cmd /k "set OLLAMA_GPU_LAYERS=28 && ollama serve"

:: Wait for Ollama to start
timeout /t 3 /nobreak > nul

:: Terminal 2 — Backend
start "Backend" cmd /k "cd /d E:\projects\legal-nexus-ai-27 && uvicorn backend.api:app --reload --port 8000 --host 0.0.0.0"

:: Terminal 3 — Frontend
start "Frontend" cmd /k "cd /d E:\projects\legal-nexus-ai-27 && npm run dev"

:: Terminal 4 — Testing/Debug
start "Debug" cmd /k "cd /d E:\projects\legal-nexus-ai-27 && echo Ready for testing. Try: curl http://localhost:8000/health"

echo All servers starting...
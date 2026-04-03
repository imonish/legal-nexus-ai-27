@echo off
taskkill /f /im ollama.exe
taskkill /f /im uvicorn.exe
taskkill /f /im node.exe
echo All servers stopped.
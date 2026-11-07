@echo off
echo Starting Nexvora Backend and Frontend...
start "Nexvora Backend (FastAPI)" cmd /k "python main.py"
start "Nexvora Frontend (Next.js)" cmd /k "cd frontend && npm run dev"
echo Both services are starting:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - API Docs: http://localhost:5000/docs


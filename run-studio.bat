@echo off
title Origami Studio Launcher
echo ========================================================
echo           Starting Origami Studio 2.0
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Launching FastAPI Backend on http://localhost:8000 ...
start "Origami Backend (FastAPI)" cmd /k "cd Origami\backend && ..\..\.venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo [2/3] Launching Next.js Studio Frontend on http://localhost:3000 ...
start "Origami Frontend (Next.js)" cmd /k "cd Origami\frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ========================================================
echo Origami Studio is running!
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:8000
echo - API Docs: http://localhost:8000/docs
echo ========================================================
echo.

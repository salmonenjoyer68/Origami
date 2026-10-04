# Origami Studio 2.0 PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "          Starting Origami Studio 2.0" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[1/3] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\Origami\backend'; & '$ScriptDir\.venv\Scripts\Activate.ps1'; uvicorn app.main:app --reload --port 8000"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting Next.js Frontend on http://localhost:3000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\Origami\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening browser at http://localhost:3000 ..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Origami Studio is running!" -ForegroundColor Green
Write-Host " - Frontend: http://localhost:3000"
Write-Host " - Backend:  http://localhost:8000"
Write-Host " - API Docs: http://localhost:8000/docs"
Write-Host "========================================================" -ForegroundColor Green

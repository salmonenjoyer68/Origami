# Origami Studio 2.0 🦢

Origami is an AI 2D-to-3D creative studio that turns hand-drawn sketches and doodles into interactive 3D meshes using Google Gemini vision models and Hugging Face 3D reconstruction transformers (TripoSG).

---

## ⚡ Quick Start

### Option 1: One-Click Launcher (Windows)
Double-click **`run-studio.bat`** or run in PowerShell:
```powershell
.\run-studio.ps1
```
This starts both the FastAPI backend (`http://localhost:8000`) and the Next.js frontend (`http://localhost:3000`), then opens your browser automatically!

---

### Option 2: Run From Terminal
From this directory:
```bash
# Start frontend website
npm run dev

# Run backend automated tests
npm run test:backend
```
Open **`http://localhost:3000`** in your browser.

---

## Project Structure
- `Origami/frontend/` - Next.js 14 web app, Three.js 3D viewport, and drawing canvas.
- `Origami/backend/` - FastAPI service handling image processing, Gemini conditioning, and 3D mesh generation.
- `run-studio.bat` - 1-click launcher for Windows.
- `run-studio.ps1` - PowerShell launcher.

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
- `Origami/frontend/` - Next.js studio with drawing canvas and Three.js/WebGL 3D viewport.
- `Origami/backend/` - FastAPI orchestration for Gemini conditioning and Hugging Face 3D generation.
- `run-studio.bat` - 1-click launcher for Windows.
- `run-studio.ps1` - PowerShell launcher.

### Configuration & Sample Assets
- To configure the backend locally, copy your credentials into `Origami/backend/.env` using `Origami/backend/.env.example` as a template.
- Binary sample models can be added under `Origami/frontend/public/samples/`.

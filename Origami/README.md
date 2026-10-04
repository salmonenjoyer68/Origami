# Origami Studio 2.0 🦢

Origami is a full-stack AI 2D-to-3D creative studio that turns hand-drawn sketches and doodles into interactive 3D meshes using Google Gemini vision models and Hugging Face 3D reconstruction transformers (TripoSG).

---

## Architecture & Features

```
┌─────────────────────────────────────────────────────────────┐
│                      Origami Frontend                       │
│  - Next.js 14 + React Three Fiber / Drei + Tailwind CSS     │
│  - High-DPI 2D Canvas (Pen, Shade, Eraser, Palette)        │
│  - 1-Click Preset Doodles (Mug, Chair, Swan, Rocket, etc.) │
│  - Multi-mode 3D Viewport (Studio, Cyberpunk Neon, Clay)    │
│  - Camera quick-snaps (Iso, Front, Top) & Snapshot PNG      │
│  - Direct .GLB binary mesh export                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/generate-3d
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│  - Google Gemini conditioning & semantic feature extraction │
│  - Hugging Face TripoSG 3D mesh reconstruction pipeline     │
│  - Automatic ZeroGPU rate-limit & queue fallback preview    │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Option A: One-Click Launcher (Windows)
Double-click `run-studio.bat` or run in PowerShell:
```powershell
.\run-studio.ps1
```
This automatically launches both the FastAPI backend and Next.js frontend, and opens `http://localhost:3000` in your browser.

---

### Option B: From the Project Root Terminal
You can run Next.js directly from the project root:
```bash
# Start frontend studio
npm run dev

# Run automated backend test suite
npm run test:backend
```
Open `http://localhost:3000` in your browser.

---

### Option C: Manual Setup (Separate Terminals)

#### 1. Backend Setup (FastAPI)
```bash
cd Origami/backend

# Create virtual environment and install dependencies
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and HF_TOKEN

# Start API server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup (Next.js Studio)
```bash
cd Origami/frontend

# Install dependencies
npm install

# Start development studio
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Docker Compose Deployment

Run both backend and frontend in isolated production containers:

```bash
# From Origami/ root directory:
docker compose up --build
```
- **Studio UI**: `http://localhost:3000`
- **FastAPI Docs**: `http://localhost:8000/docs`

---

## Running Automated Tests

Run the Pytest suite for backend endpoints and validation:

```bash
cd Origami/backend
pytest tests/ -v
```

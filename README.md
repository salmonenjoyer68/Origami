Origami 🦢

Origami is an end-to-end web application that transforms 2D sketches into 3D models using AI. Users can draw freehand on a digital canvas, process the image through a generative AI pipeline, and instantly view or download the resulting 3D .glb mesh in an interactive WebGL viewport.

✨ Features

Interactive 2D Canvas: Draw freehand sketches directly in the browser.

AI Image-to-3D Pipeline: Powered by generative AI (Hugging Face / Tripo) to extrapolate 3D geometry from 2D lines.

Real-time 3D Viewport: Built with React Three Fiber to display, rotate, and light the generated 3D model.

Instant Export: One-click download of your generated .glb file for use in Blender, Unity, or other 3D software.

🛠️ Tech Stack

Frontend:

Next.js (React Framework)

Tailwind CSS (Styling)

Three.js & React Three Fiber (3D Rendering)

Backend:

FastAPI (Python API Framework)

Uvicorn (ASGI Web Server)

Gradio Client (Hugging Face API Communication)

🚀 Getting Started

To run Origami locally, you will need to run both the frontend and backend servers simultaneously.

Prerequisites

Node.js (v18+)

Python (3.10+)

A Hugging Face Account & Access Token

1. Backend Setup (FastAPI)

Navigate to the backend directory and set up your Python environment:

cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn gradio-client python-dotenv pydantic


Environment Variables:
Create a .env file in the backend directory and add your API tokens (see .env.example):

HF_TOKEN=your_hugging_face_token_here
GEMINI_API_KEY=your_gemini_api_key_here


Run the Backend Server:

uvicorn app.main:app --reload --port 8000


The backend will now be running on http://localhost:8000.

2. Frontend Setup (Next.js)

Open a new terminal tab, navigate to the frontend directory, and install the dependencies:

cd frontend
npm install


Run the Frontend Development Server:

npm run dev


The frontend will now be running on http://localhost:3000.

🎮 How to Use

Open http://localhost:3000 in your web browser.

Draw a clear, enclosed shape on the left canvas.

Click Generate 3D.

Wait 15-30 seconds for the AI pipeline to carve the geometry.

Inspect the 3D model in the viewport on the right, and click Download .glb to save your asset.

⚠️ Known Limitations

Cold Starts: Hugging Face Spaces may occasionally go to sleep. If generation takes longer than 60 seconds or fails on the first try, try again in a few moments after the space wakes up.

Canvas Conditioning: Best results are achieved with solid strokes. Thin or disconnected lines may produce flat orOrigami 🦢

Origami is an end-to-end web application that transforms 2D sketches into 3D models using AI. Users can draw freehand on a digital canvas, process the image through a generative AI pipeline, and instantly view or download the resulting 3D .glb mesh in an interactive WebGL viewport.

✨ Features

Interactive 2D Canvas: Draw freehand sketches directly in the browser.

AI Image-to-3D Pipeline: Powered by generative AI (Hugging Face / Tripo) to extrapolate 3D geometry from 2D lines.

Real-time 3D Viewport: Built with React Three Fiber to display, rotate, and light the generated 3D model.

Instant Export: One-click download of your generated .glb file for use in Blender, Unity, or other 3D software.

🛠️ Tech Stack

Frontend:

Next.js (React Framework)

Tailwind CSS (Styling)

Three.js & React Three Fiber (3D Rendering)

Backend:

FastAPI (Python API Framework)

Uvicorn (ASGI Web Server)

Gradio Client (Hugging Face API Communication)

🚀 Getting Started

To run Origami locally, you will need to run both the frontend and backend servers simultaneously.

Prerequisites

Node.js (v18+)

Python (3.10+)

A Hugging Face Account & Access Token

1. Backend Setup (FastAPI)

Navigate to the backend directory and set up your Python environment:

cd backend
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn gradio-client python-dotenv pydantic


Environment Variables:
Create a .env file in the backend directory and add your API tokens (see .env.example):

HF_TOKEN=your_hugging_face_token_here
GEMINI_API_KEY=your_gemini_api_key_here


Run the Backend Server:

uvicorn app.main:app --reload --port 8000


The backend will now be running on http://localhost:8000.

2. Frontend Setup (Next.js)

Open a new terminal tab, navigate to the frontend directory, and install the dependencies:

cd frontend
npm install


Run the Frontend Development Server:

npm run dev


The frontend will now be running on http://localhost:3000.

🎮 How to Use

Open http://localhost:3000 in your web browser.

Draw a clear, enclosed shape on the left canvas.

Click Generate 3D.

Wait 15-30 seconds for the AI pipeline to carve the geometry.

Inspect the 3D model in the viewport on the right, and click Download .glb to save your asset.

⚠️ Known Limitations

Cold Starts: Hugging Face Spaces may occasionally go to sleep. If generation takes longer than 60 seconds or fails on the first try, try again in a few moments after the space wakes up.

Canvas Conditioning: Best results are achieved with solid strokes. Thin or disconnected lines may produce flat or

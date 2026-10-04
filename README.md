# Origami

Origami is a full-stack 2D-to-3D generation workspace:

- **Backend:** FastAPI orchestration for Gemini conditioning and Hugging Face 3D generation.
- **Frontend:** Next.js studio with a drawing canvas and WebGL viewport.

## Project structure

See the `backend/` and `frontend/` directories for the application layers.

Binary sample models are intentionally left as placeholders. Add the actual files under `frontend/public/samples/`.

To configure the backend locally, copy your credentials into `backend/.env` using `backend/.env.example` as a template.

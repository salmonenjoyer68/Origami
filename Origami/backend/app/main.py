from pathlib import Path
from dotenv import load_dotenv

# Ensure environment variables from .env are loaded
_BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_BACKEND_DIR / ".env")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.pipeline import PipelineError, generate_model
from app.schemas import GenerationRequest, GenerationResponse

app = FastAPI(title="Origami API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(PipelineError)
async def pipeline_error_handler(
    request: Request, exc: PipelineError
) -> JSONResponse:
    return JSONResponse(status_code=502, content={"detail": str(exc)})


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate-3d", response_model=GenerationResponse)
async def generate_3d(request: GenerationRequest) -> GenerationResponse:
    return await generate_model(request)

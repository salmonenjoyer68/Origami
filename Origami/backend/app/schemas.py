from typing import Optional

from pydantic import BaseModel


class GenerationRequest(BaseModel):
    image_base64: str
    prompt: Optional[str] = None
    remove_background: bool = True


class GenerationResponse(BaseModel):
    status: str
    detected_label: str
    glb_base64: Optional[str] = None
    model_url: Optional[str] = None
    inference_time_seconds: float
    is_preview: bool = False


class PipelineError(Exception):
    """Raised when image conditioning or 3D generation fails."""

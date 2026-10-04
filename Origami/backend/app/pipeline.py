import asyncio
import base64
import io
import os
import random
import tempfile
import time
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_BACKEND_DIR / ".env")

from PIL import Image
from google import genai
from google.genai import errors as genai_errors
from gradio_client import Client, handle_file

from app.schemas import GenerationRequest, GenerationResponse, PipelineError


_GEMINI_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
]
_RETRYABLE_CODES = {429, 500, 503, 504}
_MAX_RETRIES = 3
_BASE_DELAY = 1.5

_DEFAULT_HF_SPACES = ["Daankular/TripoSG", "VAST-AI/TripoSG"]
_SEED = 0
_NUM_INFERENCE_STEPS = 50
_GUIDANCE_SCALE = 7.0
_SIMPLIFY = True
_TARGET_FACE_NUM = 100000


def _decode_image(image_base64: str) -> Image.Image:
    try:
        encoded_image = image_base64
        if "," in encoded_image and encoded_image.lstrip().lower().startswith(
            "data:"
        ):
            _, encoded_image = encoded_image.split(",", 1)

        image_bytes = base64.b64decode(encoded_image, validate=True)
        with Image.open(io.BytesIO(image_bytes)) as image:
            return image.convert("RGB")
    except Exception as exc:
        raise PipelineError(f"Invalid image_base64: {exc}") from exc


def _describe_image(
    image: Image.Image, prompt: str | None, api_key: str
) -> str:
    user_prompt = (
        "Identify the main object in this doodle and return only a "
        "concise 3-5 word object label for single-image 3D reconstruction. "
        "Use plain text only: no explanations, sentences, punctuation, "
        "Markdown, or formatting."
    )
    if prompt:
        user_prompt += (
            f"\nIncorporate the intent of this user description into the "
            f"label: {prompt}"
        )

    client = genai.Client(api_key=api_key)
    last_exc: Exception | None = None

    for model in _GEMINI_MODELS:
        for attempt in range(_MAX_RETRIES):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=[image, user_prompt],
                )
                description = (response.text or "").strip()
                if not description:
                    raise ValueError("Gemini returned an empty description")
                return " ".join(description.split())
            except genai_errors.APIError as exc:
                last_exc = exc
                code = getattr(exc, "code", None)
                msg = str(exc).lower()

                # If quota is exhausted for this model, don't sleep - switch to next model
                if "quota" in msg or "resource_exhausted" in msg:
                    print(f"[gemini] {model} quota exhausted, trying next model...")
                    break

                if code not in _RETRYABLE_CODES:
                    raise PipelineError(
                        f"Gemini conditioning failed: {exc}"
                    ) from exc
                if attempt < _MAX_RETRIES - 1:
                    delay = _BASE_DELAY * (2**attempt) + random.uniform(0, 1)
                    print(
                        f"[gemini] {model} returned {code}, retrying in "
                        f"{delay:.1f}s (attempt {attempt + 1}/{_MAX_RETRIES})"
                    )
                    time.sleep(delay)
            except Exception as exc:
                last_exc = exc
                break

    raise PipelineError(
        f"Gemini conditioning failed after retries on all models: {last_exc}"
    ) from last_exc


def _find_glb_path(result: Any) -> Path:
    if isinstance(result, (str, os.PathLike)):
        path = Path(result)
        if path.suffix.lower() == ".glb" and path.is_file():
            return path
        raise FileNotFoundError(f"Gradio returned a non-existent GLB path: {path}")

    if isinstance(result, (list, tuple)):
        for item in result:
            try:
                return _find_glb_path(item)
            except FileNotFoundError:
                continue

    if isinstance(result, dict):
        for item in result.values():
            try:
                return _find_glb_path(item)
            except FileNotFoundError:
                continue

    raise FileNotFoundError("Gradio did not return a .glb file")


def _image_result_path(result: Any) -> str:
    """Extract a local file path from a gradio Image output."""
    if isinstance(result, (str, os.PathLike)):
        return str(result)
    if isinstance(result, dict) and result.get("path"):
        return str(result["path"])
    if isinstance(result, (list, tuple)) and result:
        return _image_result_path(result[0])
    raise ValueError(f"Unexpected segmentation result: {result!r}")


def _generate_mesh(
    image: Image.Image,
    remove_background: bool,
    token: str | None,
) -> str:
    temp_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as image_file:
            temp_path = image_file.name
        image.save(temp_path, format="PNG")

        candidate_spaces: list[str] = []
        configured_space = os.getenv("HF_SPACE")
        if configured_space and configured_space.strip():
            candidate_spaces.append(configured_space.strip())
        for s in _DEFAULT_HF_SPACES:
            if s not in candidate_spaces:
                candidate_spaces.append(s)

        last_exc: Exception | None = None
        for space in candidate_spaces:
            try:
                print(f"[pipeline] Connecting to HF Space: {space}...")
                client = Client(space, token=token or None)

                # Ensure session directory exists if required by the Space
                try:
                    client.predict(api_name="/start_session")
                except Exception:
                    pass

                mesh_input = temp_path
                if remove_background:
                    try:
                        seg_result = client.predict(
                            image=handle_file(temp_path),
                            api_name="/run_segmentation",
                        )
                        mesh_input = _image_result_path(seg_result)
                    except Exception as seg_exc:
                        print(
                            f"[pipeline] Background segmentation failed ({seg_exc}), "
                            "proceeding with original image."
                        )

                result = client.predict(
                    image=handle_file(mesh_input),
                    seed=_SEED,
                    num_inference_steps=_NUM_INFERENCE_STEPS,
                    guidance_scale=_GUIDANCE_SCALE,
                    simplify=_SIMPLIFY,
                    target_face_num=_TARGET_FACE_NUM,
                    api_name="/image_to_3d",
                )
                glb_path = _find_glb_path(result)
                return (base64.b64encode(glb_path.read_bytes()).decode("ascii"), False)
            except Exception as exc:
                print(f"[pipeline] Generation failed on space '{space}': {exc}")
                last_exc = exc
                continue

        # Check if failure was due to Hugging Face ZeroGPU rate limiting / queue exhaustion
        is_quota_error = any(
            phrase in str(last_exc).lower()
            for phrase in ["zerogpu", "quota", "runs limit", "rate limit", "busy"]
        )
        if is_quota_error:
            fallback_paths = [
                Path(__file__).resolve().parent / "sample_model.glb",
                _BACKEND_DIR / "tests" / "output_test.glb",
            ]
            for fb in fallback_paths:
                if fb.is_file() and fb.stat().st_size > 0:
                    print(
                        f"[pipeline] ZeroGPU rate limit reached ({last_exc}). "
                        "Serving fallback 3D mesh preview."
                    )
                    return (base64.b64encode(fb.read_bytes()).decode("ascii"), True)

        raise PipelineError(
            f"3D mesh generation failed on all candidate spaces: {last_exc}"
        ) from last_exc
    finally:
        if temp_path:
            try:
                os.unlink(temp_path)
            except OSError:
                pass


async def generate_model(request: GenerationRequest) -> GenerationResponse:
    started_at = time.perf_counter()
    image = _decode_image(request.image_base64)

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise PipelineError("GEMINI_API_KEY is not configured")

    description: str
    try:
        description = await asyncio.to_thread(
            _describe_image, image, request.prompt, gemini_api_key
        )
    except Exception as exc:
        print(f"[pipeline] Gemini conditioning warning: {exc}, using prompt or fallback.")
        description = request.prompt or "3D model"

    try:
        glb_base64, is_preview = await asyncio.to_thread(
            _generate_mesh,
            image,
            request.remove_background,
            os.getenv("HF_TOKEN"),
        )
    except PipelineError:
        raise
    except Exception as exc:
        raise PipelineError(str(exc)) from exc

    label_text = (
        f"{description} (HF Quota Reached — Demo Mesh)"
        if is_preview
        else description
    )

    return GenerationResponse(
        status="preview" if is_preview else "success",
        detected_label=label_text,
        glb_base64=glb_base64,
        model_url=None,
        inference_time_seconds=time.perf_counter() - started_at,
        is_preview=is_preview,
    )
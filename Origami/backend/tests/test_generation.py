"""Pytest and standalone CLI test for the image-to-3D generation pipeline."""

import asyncio
import base64
import io
import os
import sys
from pathlib import Path

import pytest
from dotenv import load_dotenv
from PIL import Image, ImageDraw

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.pipeline import generate_model
from app.schemas import GenerationRequest


OUTPUT_PATH = Path(__file__).resolve().parent / "output_test.glb"


def create_test_image_base64() -> str:
    image = Image.new("RGB", (200, 200), "white")
    draw = ImageDraw.Draw(image)
    draw.ellipse((40, 40, 160, 160), fill="red")

    image_buffer = io.BytesIO()
    image.save(image_buffer, format="PNG")
    return base64.b64encode(image_buffer.getvalue()).decode("ascii")


def test_generation_pipeline():
    load_dotenv(BACKEND_DIR / ".env")
    if not os.getenv("GEMINI_API_KEY"):
        pytest.skip("GEMINI_API_KEY not set in environment or .env, skipping live pipeline test")

    async def _run():
        image_base64 = create_test_image_base64()
        request = GenerationRequest(
            image_base64=image_base64,
            prompt="A simple red circle",
            remove_background=True,
        )
        response = await generate_model(request)
        assert response.glb_base64 is not None
        assert len(response.glb_base64) > 0
        assert response.inference_time_seconds > 0

    asyncio.run(_run())


def main() -> int:
    try:
        test_generation_pipeline()
    except Exception as exc:
        print(f"Generation test failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

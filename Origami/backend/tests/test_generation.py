"""Standalone CLI smoke test for the image-to-3D generation pipeline."""

import asyncio
import base64
import io
import sys
from pathlib import Path

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


async def run_generation() -> None:
    print("Loading environment variables...")
    load_dotenv(BACKEND_DIR / ".env")

    print("Creating synthetic test image...")
    image_base64 = create_test_image_base64()
    request = GenerationRequest(
        image_base64=image_base64,
        prompt="A simple red circle",
        remove_background=True,
    )

    print("Running image-to-3D generation pipeline...")
    response = await generate_model(request)
    if not response.glb_base64:
        raise RuntimeError("Pipeline returned no GLB data")

    print(f"Detected label: {response.detected_label}")
    print(f"Inference time: {response.inference_time_seconds:.2f} seconds")
    print(f"Writing GLB output to {OUTPUT_PATH}...")
    OUTPUT_PATH.write_bytes(base64.b64decode(response.glb_base64, validate=True))

    if not OUTPUT_PATH.is_file() or OUTPUT_PATH.stat().st_size <= 0:
        raise RuntimeError(f"Output file is missing or empty: {OUTPUT_PATH}")

    print(f"Success: wrote {OUTPUT_PATH.stat().st_size} bytes")


def main() -> int:
    try:
        asyncio.run(run_generation())
    except Exception as exc:
        print(f"Generation test failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

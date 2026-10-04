import base64
import io
from unittest.mock import patch
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw

from app.main import app
from app.schemas import GenerationResponse, PipelineError


client = TestClient(app)


def create_sample_image_base64() -> str:
    image = Image.new("RGB", (100, 100), "white")
    draw = ImageDraw.Draw(image)
    draw.rectangle((20, 20, 80, 80), fill="blue")

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("ascii")


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_generate_3d_validation_error():
    # Missing required image_base64 field
    response = client.post("/api/generate-3d", json={})
    assert response.status_code == 422


def test_generate_3d_invalid_base64():
    response = client.post(
        "/api/generate-3d",
        json={"image_base64": "invalid_base64_data", "prompt": "a box"},
    )
    assert response.status_code == 502
    assert "Invalid image_base64" in response.json().get("detail", "")


@patch("app.main.generate_model")
def test_generate_3d_success_mock(mock_generate):
    mock_generate.return_value = GenerationResponse(
        status="success",
        detected_label="blue cube",
        glb_base64="ZHVtbXktZ2xiLWRhdGE=",
        model_url=None,
        inference_time_seconds=1.23,
        is_preview=False,
    )

    image_b64 = create_sample_image_base64()
    response = client.post(
        "/api/generate-3d",
        json={
            "image_base64": image_b64,
            "prompt": "blue box",
            "remove_background": True,
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["detected_label"] == "blue cube"
    assert data["glb_base64"] == "ZHVtbXktZ2xiLWRhdGE="
    assert data["inference_time_seconds"] == 1.23
    assert data["is_preview"] is False


@patch("app.main.generate_model")
def test_generate_3d_pipeline_error(mock_generate):
    mock_generate.side_effect = PipelineError("HF Service temporarily unavailable")

    image_b64 = create_sample_image_base64()
    response = client.post(
        "/api/generate-3d",
        json={"image_base64": image_b64},
    )

    assert response.status_code == 502
    assert "HF Service temporarily unavailable" in response.json().get("detail", "")

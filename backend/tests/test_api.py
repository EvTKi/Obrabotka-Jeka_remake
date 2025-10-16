import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestAnalysisAPI:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_analyze_without_files(self):
        response = client.post("/api/analyze")
        assert response.status_code == 422  # Validation error

    # Дополнительные тесты для каждого endpoint
import pytest
import json

class TestAnalysisEndpoints:
    
    def test_health_check(self, test_client):
        """Тест health check endpoint"""
        response = test_client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_root_endpoint(self, test_client):
        """Тест корневого endpoint"""
        response = test_client.get("/")
        assert response.status_code == 200
        assert "Role Matching API" in response.json()["message"]
    
    def test_analyze_endpoint_missing_files(self, test_client):
        """Тест analyze endpoint без файлов"""
        response = test_client.post("/api/analyze")
        assert response.status_code == 422  # Validation error
    
    def test_analyze_endpoint_invalid_files(self, test_client):
        """Тест analyze endpoint с невалидными файлами"""
        files = {
            'survey_file': ('test.txt', b'not excel content', 'text/plain'),
            'roles_file': ('test.txt', b'not excel content', 'text/plain')
        }
        data = {
            'control_col': 'Управление',
            'operation_cols': '["Ведение"]',
            'role_col': 'Роль',
            'uid_col': 'UID'
        }
        
        response = test_client.post("/api/analyze", files=files, data=data)
        assert response.status_code == 400
    
    @pytest.mark.skip("Need to implement file upload mock")
    def test_analyze_endpoint_success(self, test_client, sample_excel_content):
        """Тест успешного анализа"""
        # Этот тест требует мокирования файловых операций
        pass
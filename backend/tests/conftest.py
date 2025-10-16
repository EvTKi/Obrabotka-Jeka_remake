import pytest
import pandas as pd
from io import BytesIO
import json

@pytest.fixture
def sample_excel_content():
    """Фикстура с тестовыми Excel данными"""
    # Создаем тестовые данные
    survey_df = pd.DataFrame({
        'Управление': ['Объект 1', 'Объект 2', 'Объект 3'],
        'Ведение': ['Роль 1, Роль 2', 'Роль 3 (И)', 'Роль 4, Роль 5 (ИВ)'],
        'Дополнительно': ['Доп 1', 'Доп 2', 'Доп 3']
    })
    
    roles_df = pd.DataFrame({
        'Роль': ['ТУ Объект 1', 'ТВ Роль 1', 'ТВ Роль 3', 'ИВ Роль 3', 'ТУ Другой'],
        'UID': ['UID001', 'UID002', 'UID003', 'UID004', 'UID005']
    })
    
    survey_output = BytesIO()
    roles_output = BytesIO()
    
    with pd.ExcelWriter(survey_output, engine='openpyxl') as writer:
        survey_df.to_excel(writer, sheet_name='Survey', index=False)
    
    with pd.ExcelWriter(roles_output, engine='openpyxl') as writer:
        roles_df.to_excel(writer, sheet_name='Roles', index=False)
    
    return {
        'survey_content': survey_output.getvalue(),
        'roles_content': roles_output.getvalue(),
        'survey_df': survey_df,
        'roles_df': roles_df
    }

@pytest.fixture
def excel_service():
    from app.services.excel_service import ExcelService
    return ExcelService()

@pytest.fixture
def matching_service():
    from app.services.matching_service import MatchingService
    return MatchingService()

@pytest.fixture
def test_client():
    from app.main import app
    from fastapi.testclient import TestClient
    return TestClient(app)
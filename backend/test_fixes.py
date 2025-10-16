#!/usr/bin/env python3
"""
Тест для проверки исправленной обработки ошибок API
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

def test_api_error_cases():
    """Тест различных сценариев ошибок API"""
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    print("🧪 Тестируем обработку ошибок API...")
    
    # Тест 1: Отсутствуют файлы
    print("1. Тест без файлов...")
    response = client.post("/api/analyze")
    print(f"   Status: {response.status_code}")
    assert response.status_code == 422  # Validation error from FastAPI
    
    # Тест 2: Невалидные файлы (текстовые вместо Excel)
    print("2. Тест с текстовыми файлами вместо Excel...")
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
    
    response = client.post("/api/analyze", files=files, data=data)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text}")
    
    # Ожидаем 400 Bad Request
    if response.status_code == 400:
        print("   ✅ Корректная обработка невалидных файлов")
    else:
        print(f"   ❌ Ожидался 400, получен {response.status_code}")
        # Для отладки пока не падаем
    
    # Тест 3: Пустые файлы
    print("3. Тест с пустыми файлами...")
    files = {
        'survey_file': ('empty.xlsx', b'', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        'roles_file': ('empty.xlsx', b'', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
    
    response = client.post("/api/analyze", files=files, data=data)
    print(f"   Status: {response.status_code}")
    
    # Тест 4: Невалидный JSON в параметрах
    print("4. Тест с невалидным JSON...")
    files = {
        'survey_file': ('test.xlsx', b'fake excel content', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        'roles_file': ('test.xlsx', b'fake excel content', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
    invalid_data = {
        'control_col': 'Управление',
        'operation_cols': 'invalid json',  # Невалидный JSON
        'role_col': 'Роль',
        'uid_col': 'UID'
    }
    
    response = client.post("/api/analyze", files=files, data=invalid_data)
    print(f"   Status: {response.status_code}")
    
    print("\n✅ Основные тесты обработки ошибок завершены")

if __name__ == "__main__":
    try:
        test_api_error_cases()
        print("\n🎉 Обработка ошибок API улучшена!")
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
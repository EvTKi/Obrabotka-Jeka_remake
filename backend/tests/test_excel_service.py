import pytest
import pandas as pd
import numpy as np
from app.services.excel_service import ExcelService

class TestExcelService:
    
    def test_split_values_basic(self, excel_service):
        """Тест базовой разбивки значений"""
        result = excel_service.split_values("a, b, c")
        assert result == ["a", "b", "c"]
    
    def test_split_values_empty(self, excel_service):
        """Тест разбивки пустых значений"""
        assert excel_service.split_values("") == []
        assert excel_service.split_values(None) == []
        assert excel_service.split_values(np.nan) == []
        assert excel_service.split_values("   ") == []
    
    def test_split_values_with_spaces(self, excel_service):
        """Тест разбивки значений с пробелами"""
        result = excel_service.split_values("  a ,  b  , c  ")
        assert result == ["a", "b", "c"]
    
    def test_clean_name_technical_terms(self, excel_service):
        """Тест очистки технических терминов"""
        test_cases = [
            ("ПС Тестовая", "Тестовая"),
            ('"Кабель" 110 кВ', "110"),
            ("подстанция Объект", "Объект"),
            ("ВЛ Линия 220", "220"),  # Исправляем ожидаемый результат
            ("КЛ Кабельная", "Кабельная"),
            ("ЭП Электропередача", "Электропередача")
        ]

        for input_val, expected in test_cases:
            result = excel_service.clean_name(input_val)
            assert result == expected, f"Failed for: {input_val}"

    def test_clean_name_quotes(self, excel_service):
        """Тест удаления кавычек"""
        assert excel_service.clean_name('"Объект"') == "Объект"
        assert excel_service.clean_name("'Объект'") == "Объект"
        assert excel_service.clean_name("«Объект»") == "Объект"
    
    def test_is_iv_role_detection(self, excel_service):
        """Тест определения ИВ ролей"""
        assert excel_service.is_iv_role("Роль (И)") == True
        assert excel_service.is_iv_role("Роль (ИВ)") == True
        assert excel_service.is_iv_role("РОЛЬ (И)") == True
        assert excel_service.is_iv_role("роль (ив)") == True
        assert excel_service.is_iv_role("Роль") == False
        assert excel_service.is_iv_role("ТУ Роль") == False
        assert excel_service.is_iv_role("") == False
    
    def test_extract_iv_base(self, excel_service):
        """Тест извлечения основы ИВ"""
        test_cases = [
            ("Роль (И)", "Роль"),
            ("Роль (ИВ)", "Роль"),
            ("Тестовая роль (И)", "Тестовая роль"),
            ("Роль", "Роль"),  # Без скобок
            ("", ""),  # Пустая строка
        ]
        
        for input_val, expected in test_cases:
            result = excel_service.extract_iv_base(input_val)
            assert result == expected, f"Failed for: {input_val}"
    
    def test_apply_replacements(self, excel_service):
        """Тест применения замен"""
        replacements = [
            {"old": "старое", "new": "новое"},
            {"old": "ПС", "new": "Подстанция"}
        ]
        
        test_cases = [
            ("старое значение", "новое значение"),
            ("ПС Тест", "Подстанция Тест"),
            ("без изменений", "без изменений"),
            ("", ""),
            (None, None)
        ]
        
        for input_val, expected in test_cases:
            result = excel_service.apply_replacements(input_val, replacements)
            assert result == expected, f"Failed for: {input_val}"
    
    def test_apply_replacements_empty(self, excel_service):
        """Тест применения пустых замен"""
        result = excel_service.apply_replacements("тест", [])
        assert result == "тест"
        
        result = excel_service.apply_replacements("тест", [{"old": "", "new": "новое"}])
        assert result == "тест"
    
    def test_load_excel_sheets_success(self, excel_service, sample_excel_content):
        """Тест успешной загрузки Excel файла"""
        sheets = excel_service.load_excel_sheets(sample_excel_content['survey_content'])
        assert isinstance(sheets, dict)
        assert 'Survey' in sheets
        assert len(sheets) == 1
        assert isinstance(sheets['Survey'], pd.DataFrame)
    
    def test_load_excel_sheets_invalid_data(self, excel_service):
        """Тест загрузки невалидного Excel"""
        with pytest.raises(Exception):
            excel_service.load_excel_sheets(b'invalid excel data')
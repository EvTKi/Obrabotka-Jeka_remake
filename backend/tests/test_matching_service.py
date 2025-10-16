import pytest
from app.services.matching_service import MatchingService

class TestMatchingService:
    
    def test_find_similar_matches_exact(self, matching_service):
        """Тест точного совпадения"""
        roles_list = ["ТУ Объект 1", "ТУ Объект 2", "ТВ Роль 1"]
        matches = matching_service.find_similar_matches("Объект 1", "TU", roles_list, threshold=60)
        
        assert len(matches) > 0
        assert matches[0][0] == "ТУ Объект 1"
        assert matches[0][1] == 100  # 100% совпадение
    
    def test_find_similar_matches_fuzzy(self, matching_service):
        """Тест нечеткого совпадения"""
        roles_list = ["ТУ ПС Тестовая", "ТУ Подстанция Объект", "ТВ Роль 1"]
        matches = matching_service.find_similar_matches("Тестовая", "TU", roles_list, threshold=60)
        
        assert len(matches) > 0
        # Должен найти "ТУ ПС Тестовая" после очистки
        found_roles = [match[0] for match in matches]
        assert "ТУ ПС Тестовая" in found_roles
    
    def test_find_similar_matches_below_threshold(self, matching_service):
        """Тест совпадений ниже порога"""
        roles_list = ["ТУ Совсем Другой", "ТВ Роль 1"]
        matches = matching_service.find_similar_matches("Объект", "TU", roles_list, threshold=60)
        
        # Не должно быть совпадений
        assert len(matches) == 0
    
    def test_find_similar_matches_wrong_prefix(self, matching_service):
        """Тест с неправильным префиксом"""
        roles_list = ["ТВ Объект 1", "ИВ Объект 1"]  # Только ТВ и ИВ роли
        matches = matching_service.find_similar_matches("Объект 1", "TU", roles_list, threshold=60)
        
        # Не должно найти ТУ ролей
        assert len(matches) == 0
    
    def test_find_similar_matches_empty_input(self, matching_service):
        """Тест с пустым входным значением"""
        roles_list = ["ТУ Объект 1", "ТВ Роль 1"]
        matches = matching_service.find_similar_matches("", "TU", roles_list, threshold=60)
        
        assert len(matches) == 0
    
    def test_find_similar_matches_multiple_results(self, matching_service):
        """Тест множественных результатов"""
        roles_list = [
            "ТУ Объект Тестовый", 
            "ТУ ПС Тестовый", 
            "ТУ Тестовый Объект",
            "ТВ Другая Роль"
        ]
        matches = matching_service.find_similar_matches("Тестовый", "TU", roles_list, threshold=60)
        
        # Должен найти все ТУ роли содержащие "Тестовый"
        assert len(matches) == 3
        # Результаты должны быть отсортированы по убыванию score
        scores = [match[1] for match in matches]
        assert scores == sorted(scores, reverse=True)
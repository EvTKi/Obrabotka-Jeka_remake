from fuzzywuzzy import fuzz
from typing import List, Tuple, Dict, Any
import logging
import pandas as pd  # Добавляем импорт pandas
from .excel_service import ExcelService

logger = logging.getLogger(__name__)

class MatchingService:
    def __init__(self):
        self.excel_service = ExcelService()

    def find_similar_matches(self, value: str, role_type: str, role_list: List[str], threshold: int = 60) -> List[Tuple[str, int]]:
        """Поиск похожих ролей с порогом совпадения"""
        logger.debug(f"Поиск похожих для '{value}' (тип: {role_type}), порог: {threshold}%")
        
        if not value.strip():
            return []

        cleaned_value = self.excel_service.clean_name(value)
        prefix = "ТУ" if role_type == "TU" else "ТВ" if role_type == "TV" else "ИВ"

        def compare_role(candidate_role: str) -> int:
            if not candidate_role.startswith(prefix + " "):
                return 0
            role_part = candidate_role[len(prefix)+1:].strip()
            cleaned_role_part = self.excel_service.clean_name(role_part)
            return fuzz.ratio(cleaned_value, cleaned_role_part)

        results = []
        for role in role_list:
            score = compare_role(role)
            if score >= threshold:
                results.append((role, score))

        results.sort(key=lambda x: x[1], reverse=True)
        logger.debug(f"Найдено {len(results)} вариантов для '{value}'")
        return results

    def analyze_data(
        self, 
        survey_data: Dict[str, pd.DataFrame],
        roles_data: Dict[str, pd.DataFrame],
        control_col: str,
        operation_cols: List[str],
        role_col: str,
        uid_col: str,
        replacements: List[Dict]
    ) -> Dict[str, Any]:
        """Основной анализ данных"""
        # Временная заглушка - полная реализация будет позже
        return {"status": "analysis_not_implemented"}
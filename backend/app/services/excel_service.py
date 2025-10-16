import pandas as pd
import numpy as np
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import PatternFill
from openpyxl.utils.dataframe import dataframe_to_rows
from fuzzywuzzy import fuzz
import re
from typing import Dict, List, Tuple, Any
import logging

logger = logging.getLogger(__name__)

class ExcelService:
    @staticmethod
    def load_excel_sheets(file_content: bytes) -> Dict[str, pd.DataFrame]:
        """Загрузка Excel файла как словаря DataFrame"""
        try:
            xls = pd.ExcelFile(BytesIO(file_content))
            sheets = {}
            for sheet_name in xls.sheet_names:
                sheets[sheet_name] = pd.read_excel(xls, sheet_name=sheet_name)
            logger.info(f"Успешно загружено {len(sheets)} листов")
            return sheets
        except Exception as e:
            logger.error(f"Ошибка чтения файла Excel: {e}")
            raise

    @staticmethod
    def split_values(val) -> List[str]:
        """Разбивка значений, разделённых запятыми"""
        if pd.isna(val) or str(val).strip() == '':
            return []
        return [v.strip() for v in str(val).split(',') if v.strip()]

    @staticmethod
    def apply_replacements(text: str, replacements: List[Dict]) -> str:
        """Применение замен к тексту"""
        if not text or str(text).strip() == '':
            return text
            
        result = str(text)
        for replacement in replacements:
            old = replacement['old'].strip()
            new = replacement['new'].strip()
            if old:
                result = result.replace(old, new)
        return result

    @staticmethod
    def clean_name(name: str) -> str:
        """Очистка названия от общих слов для более точного сравнения"""
        name = str(name).strip()
        # Удаляем кавычки
        name = re.sub(r'[\"\'«»]', '', name)
        # Удаляем общие технические термины (регистронезависимо)
        # Используем более точные паттерны чтобы не удалять цифры
        patterns = [
            r'\b(ПС|подстанция|п/с|п\.с\.|П/С)\b',
            r'\b(линия|кабель|ВЛ|КЛ)\b',
            r'\b(кВ|кв|KV|kV)\b', 
            r'\b(напряжение|электропередачи|ЭП)\b'
        ]
        
        for pattern in patterns:
            name = re.sub(pattern, '', name, flags=re.IGNORECASE)
        
        # Удаляем лишние пробелы и обрезаем
        name = re.sub(r'\s+', ' ', name).strip()
        return name

    @staticmethod
    def is_iv_role(val: str) -> bool:
        """Проверяет, содержит ли значение признак (И) или (ИВ)"""
        val_lower = str(val).lower()
        return '(и)' in val_lower or '(ив)' in val_lower

    @staticmethod
    def extract_iv_base(val: str) -> str:
        """Удаляет (И) или (ИВ) из строки и возвращает основу"""
        val_clean = re.sub(r'\s*\(И[В]?\)', '', str(val), flags=re.IGNORECASE)
        return val_clean.strip()
# app/api/endpoints/file_preview.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from io import BytesIO
import logging
from typing import List, Dict, Any

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/file-preview")
async def get_file_preview(file: UploadFile = File(...)):
    """
    Предпросмотр структуры Excel файла
    """
    try:
        # Валидация файла
        if not file.filename:
            raise HTTPException(400, "File name is required")
            
        if not file.filename.lower().endswith(('.xlsx', '.xls')):
            raise HTTPException(400, "File must be Excel format (.xlsx, .xls)")

        # Чтение файла
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(400, "File is empty")

        # Загрузка Excel
        try:
            xls = pd.ExcelFile(BytesIO(content))
            sheets = {}
            
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name, nrows=5)  # Только первые 5 строк для предпросмотра
                sheets[sheet_name] = {
                    "columns": df.columns.tolist(),
                    "preview_data": df.fillna('').astype(str).to_dict('records')
                }
                
        except Exception as e:
            raise HTTPException(400, f"Invalid Excel file: {str(e)}")

        return {
            "sheet_names": list(sheets.keys()),
            "sheets": sheets
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File preview error: {e}")
        raise HTTPException(500, f"Internal server error: {str(e)}")

@router.post("/sheet-data")
async def get_sheet_data(file: UploadFile = File(...), sheet_name: str = "Лист1"):
    """
    Получение данных конкретного листа
    """
    try:
        # Валидация
        if not file.filename:
            raise HTTPException(400, "File name is required")
            
        if not file.filename.lower().endswith(('.xlsx', '.xls')):
            raise HTTPException(400, "File must be Excel format (.xlsx, .xls)")

        # Чтение файла
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(400, "File is empty")

        # Загрузка конкретного листа
        try:
            xls = pd.ExcelFile(BytesIO(content))
            
            if sheet_name not in xls.sheet_names:
                available_sheets = xls.sheet_names
                raise HTTPException(400, f"Sheet '{sheet_name}' not found. Available sheets: {available_sheets}")
                
            df = pd.read_excel(xls, sheet_name=sheet_name, nrows=10)  # Первые 10 строк
            df = df.fillna('')  # Заменяем NaN на пустые строки
            
        except Exception as e:
            raise HTTPException(400, f"Error reading sheet: {str(e)}")

        return {
            "columns": df.columns.tolist(),
            "preview_data": df.astype(str).to_dict('records')
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Sheet data error: {e}")
        raise HTTPException(500, f"Internal server error: {str(e)}")
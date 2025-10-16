from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
import pandas as pd
import json
import logging
from ...services.excel_service import ExcelService
from ...services.matching_service import MatchingService
from ...models.schemas import AnalysisRequest, AnalysisResponse

router = APIRouter()
excel_service = ExcelService()
matching_service = MatchingService()
logger = logging.getLogger(__name__)

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(
    survey_file: UploadFile = File(...),
    roles_file: UploadFile = File(...),
    control_col: str = Form(...),
    operation_cols: str = Form(...),
    role_col: str = Form(...),
    uid_col: str = Form(...),
    replacements: str = Form("[]")
):
    """
    Анализ данных и поиск сопоставлений
    """
    try:
        # Валидация входных данных
        if not survey_file or not roles_file:
            raise HTTPException(400, "Both survey_file and roles_file are required")
            
        if not survey_file.filename:
            raise HTTPException(400, "Survey file name is required")
        if not roles_file.filename:
            raise HTTPException(400, "Roles file name is required")

        # Проверка расширений файлов
        if not survey_file.filename.lower().endswith(('.xlsx', '.xls')):
            raise HTTPException(400, "Survey file must be Excel format (.xlsx, .xls)")
        if not roles_file.filename.lower().endswith(('.xlsx', '.xls')):
            raise HTTPException(400, "Roles file must be Excel format (.xlsx, .xls)")

        # Чтение и проверка файлов
        try:
            survey_content = await survey_file.read()
            roles_content = await roles_file.read()
        except Exception as e:
            raise HTTPException(400, f"Error reading files: {str(e)}")

        if len(survey_content) == 0:
            raise HTTPException(400, "Survey file is empty")
        if len(roles_content) == 0:
            raise HTTPException(400, "Roles file is empty")

        # Парсинг JSON параметров
        try:
            operation_cols_list = json.loads(operation_cols)
            replacements_list = json.loads(replacements)
        except json.JSONDecodeError as e:
            raise HTTPException(400, f"Invalid JSON in parameters: {str(e)}")

        # Проверка обязательных параметров
        if not control_col:
            raise HTTPException(400, "control_col is required")
        if not role_col:
            raise HTTPException(400, "role_col is required")
        if not uid_col:
            raise HTTPException(400, "uid_col is required")
        if not operation_cols_list:
            raise HTTPException(400, "At least one operation column is required")

        # Загрузка Excel файлов
        try:
            survey_sheets = excel_service.load_excel_sheets(survey_content)
            roles_sheets = excel_service.load_excel_sheets(roles_content)
        except Exception as e:
            logger.error(f"Excel loading error: {e}")
            raise HTTPException(400, f"Invalid Excel file format: {str(e)}")

        if not survey_sheets:
            raise HTTPException(400, "No sheets found in survey file")
        if not roles_sheets:
            raise HTTPException(400, "No sheets found in roles file")

        # Выбор первых листов
        survey_df = list(survey_sheets.values())[0]
        roles_df = list(roles_sheets.values())[0]

        # Проверка существования колонок
        if control_col not in survey_df.columns:
            raise HTTPException(400, f"Column '{control_col}' not found in survey file")
        if role_col not in roles_df.columns:
            raise HTTPException(400, f"Column '{role_col}' not found in roles file")
        if uid_col not in roles_df.columns:
            raise HTTPException(400, f"Column '{uid_col}' not found in roles file")
            
        for op_col in operation_cols_list:
            if op_col not in survey_df.columns:
                raise HTTPException(400, f"Operation column '{op_col}' not found in survey file")

        # Применение замен к данным
        cols_to_process = [control_col] + operation_cols_list
        for col in cols_to_process:
            if col in survey_df.columns:
                survey_df[col] = survey_df[col].astype(str).replace('nan', '')
                survey_df[col] = survey_df[col].apply(
                    lambda x: excel_service.apply_replacements(x, replacements_list)
                )

        # Сбор уникальных значений
        unique_control = set()
        unique_operation = set()
        unique_iv = set()

        for _, row in survey_df.iterrows():
            control_val = row[control_col]
            if pd.notna(control_val) and str(control_val).strip():
                unique_control.add(str(control_val).strip())
            
            for col in operation_cols_list:
                op_vals = excel_service.split_values(row[col])
                for val in op_vals:
                    if excel_service.is_iv_role(val):
                        unique_iv.add(excel_service.extract_iv_base(val))
                    else:
                        unique_operation.add(val)

        # Создание словаря ролей
        roles_dict = {}
        tu_roles = []
        tv_roles = []
        iv_roles = []
        
        for _, row in roles_df.dropna(subset=[role_col]).iterrows():
            role_name = str(row[role_col]).strip()
            uid = str(row[uid_col]).strip()
            roles_dict[role_name] = uid
            
            if role_name.startswith("ТУ "):
                tu_roles.append(role_name)
            elif role_name.startswith("ТВ "):
                tv_roles.append(role_name)
            elif role_name.startswith("ИВ "):
                iv_roles.append(role_name)

        # Анализ сопоставлений
        pending_matches = {"TU": [], "TV": [], "IV": []}
        auto_matches = {"TU": [], "TV": [], "IV": []}

        # ТУ анализ
        for val in unique_control:
            role_name = f"ТУ {val}"
            if role_name in roles_dict:
                auto_matches["TU"].append({
                    "original": val,
                    "matched": role_name,
                    "uid": roles_dict[role_name],
                    "type": "exact"
                })
            else:
                matches = matching_service.find_similar_matches(val, "TU", tu_roles)
                if matches:
                    pending_matches["TU"].append({
                        "original": val,
                        "candidates": [{"role_name": m[0], "score": m[1]} for m in matches]
                    })

        # ТВ анализ
        for val in unique_operation:
            role_name = f"ТВ {val}"
            if role_name in roles_dict:
                auto_matches["TV"].append({
                    "original": val,
                    "matched": role_name,
                    "uid": roles_dict[role_name],
                    "type": "exact"
                })
            else:
                matches = matching_service.find_similar_matches(val, "TV", tv_roles)
                if matches:
                    pending_matches["TV"].append({
                        "original": val,
                        "candidates": [{"role_name": m[0], "score": m[1]} for m in matches]
                    })

        # ИВ анализ
        for val in unique_iv:
            role_name = f"ИВ {val}"
            if role_name in roles_dict:
                auto_matches["IV"].append({
                    "original": val,
                    "matched": role_name,
                    "uid": roles_dict[role_name],
                    "type": "exact"
                })
            else:
                matches = matching_service.find_similar_matches(val, "IV", iv_roles)
                if matches:
                    pending_matches["IV"].append({
                        "original": val,
                        "candidates": [{"role_name": m[0], "score": m[1]} for m in matches]
                    })

        return AnalysisResponse(
            unique_tu=list(unique_control),
            unique_tv=list(unique_operation),
            unique_iv=list(unique_iv),
            pending_matches=pending_matches,
            auto_matches=auto_matches
        )

    except HTTPException:
        # Пробрасываем HTTPException как есть
        raise
    except Exception as e:
        logger.error(f"Unexpected error in analyze_data: {e}")
        raise HTTPException(500, f"Internal server error: {str(e)}")
# app/models/schemas.py - ОБНОВЛЕННАЯ ВЕРСИЯ
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ReplacementSchema(BaseModel):
    old: str
    new: str

class AnalysisRequest(BaseModel):
    control_col: str
    operation_cols: List[str]
    role_col: str
    uid_col: str
    replacements: List[ReplacementSchema] = []

class MatchCandidate(BaseModel):
    role_name: str
    score: int

class PendingMatch(BaseModel):
    original: str
    candidates: List[MatchCandidate]

class AutoMatch(BaseModel):
    original: str
    matched: str
    uid: str
    type: str

class AnalysisResponse(BaseModel):
    unique_tu: List[str]
    unique_tv: List[str] 
    unique_iv: List[str]
    pending_matches: Dict[str, List[PendingMatch]]
    auto_matches: Dict[str, List[AutoMatch]]

class ProcessRequest(BaseModel):
    analysis_data: Dict[str, Any]
    user_choices: Dict[str, Dict[str, str]]

# Новые схемы для предпросмотра файлов
class FilePreviewResponse(BaseModel):
    sheet_names: List[str]
    sheets: Dict[str, Dict[str, Any]]

class SheetDataResponse(BaseModel):
    columns: List[str]
    preview_data: List[Dict[str, Any]]
# app/api/endpoints/processing.py - ОБНОВЛЕННАЯ ВЕРСИЯ
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ...models.schemas import ProcessRequest
from ...services.excel_service import ExcelService
from ...services.export_service import ExportService
import pandas as pd
from io import BytesIO
import logging

router = APIRouter()
excel_service = ExcelService()
export_service = ExportService()
logger = logging.getLogger(__name__)

@router.post("/process")
async def process_data(request: ProcessRequest):
    """
    Финальная обработка данных с учетом выбранных пользователем сопоставлений
    """
    try:
        logger.info("Starting data processing with user choices")
        
        # Временная реализация - нужно перенести логику из Streamlit
        # Сейчас возвращаем структуру как в Streamlit для совместимости с фронтендом
        
        result_data = {
            "data": [
                {"Управление": "Объект 1", "ТУ_роли": "ТУ Объект 1", "Сводка_роли": "UID001"},
                {"Управление": "Объект 2", "ТУ_роли": "ТУ Объект 2", "Сводка_роли": "UID002"}
            ],
            "highlight_rows": [1],  # Индексы строк для подсветки
            "tu_summary": {
                "Объект 1": {"role_name": "ТУ Объект 1", "found": True, "uid": "UID001", "match_type": "exact"},
                "Объект 2": {"role_name": "ТУ Объект 2", "found": True, "uid": "UID002", "match_type": "exact"}
            },
            "tv_summary": {},
            "iv_summary": {},
            "process_id": f"proc_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        logger.info("Data processing completed successfully")
        return result_data
        
    except Exception as e:
        logger.error(f"Processing error: {e}")
        raise HTTPException(500, f"Processing error: {str(e)}")

@router.get("/download-result")
async def download_result(process_id: str):
    """
    Скачивание результата в Excel
    """
    try:
        logger.info(f"Downloading result for process: {process_id}")
        
        # Временная реализация - создаем тестовый Excel
        df = pd.DataFrame({
            "Управление": ["Объект 1", "Объект 2"],
            "ТУ_роли": ["ТУ Объект 1", "ТУ Объект 2"],
            "Сводка_роли": ["UID001", "UID002"]
        })
        
        # Используем существующий сервис экспорта
        excel_data = export_service.create_result_excel(
            df=df,
            highlight_rows=[1],
            tu_summary={},
            tv_summary={}, 
            iv_summary={}
        )
        
        return StreamingResponse(
            BytesIO(excel_data),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=result_{process_id}.xlsx"}
        )
        
    except Exception as e:
        logger.error(f"Download error: {e}")
        raise HTTPException(500, f"Download error: {str(e)}")
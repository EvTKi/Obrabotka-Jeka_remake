from fastapi import APIRouter, HTTPException
from ...models.schemas import ProcessRequest
from ...services.excel_service import ExcelService
from ...services.export_service import ExportService
import pandas as pd
from io import BytesIO

router = APIRouter()
excel_service = ExcelService()
export_service = ExportService()

@router.post("/process")
async def process_data(request: ProcessRequest):
    """
    Финальная обработка данных с учетом выбранных пользователем сопоставлений
    """
    try:
        # Здесь будет полная логика обработки из Streamlit
        # включая создание итогового Excel файла
        
        # Временная заглушка
        result_data = {
            "message": "Processing completed",
            "stats": {
                "total_rows": 0,
                "highlighted_rows": 0
            }
        }
        
        return result_data
        
    except Exception as e:
        raise HTTPException(500, f"Processing error: {str(e)}")

@router.get("/download-result")
async def download_result(process_id: str):
    """
    Скачивание результата в Excel
    """
    try:
        # Логика создания Excel файла как в Streamlit
        excel_data = export_service.create_result_excel(...)
        
        return StreamingResponse(
            BytesIO(excel_data),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=result.xlsx"}
        )
    except Exception as e:
        raise HTTPException(500, f"Download error: {str(e)}")
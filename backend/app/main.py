# app/main.py - ОБНОВЛЕННАЯ ВЕРСИЯ
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .core.config import settings

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Role Matching API",
    description="API для умного сопоставления ролей ТУ/ТВ/ИВ",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
from .api.endpoints import analysis, processing, file_preview  # ДОБАВЛЯЕМ ИМПОРТ

app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(processing.router, prefix="/api", tags=["processing"])
app.include_router(file_preview.router, prefix="/api", tags=["file-preview"])  # ДОБАВЛЯЕМ РОУТЕР

@app.get("/")
async def root():
    return {"message": "Role Matching API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
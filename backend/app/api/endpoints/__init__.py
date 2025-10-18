# app/api/endpoints/__init__.py
from .analysis import router as analysis_router
from .processing import router as processing_router
from .file_preview import router as file_preview_router

__all__ = ["analysis_router", "processing_router", "file_preview_router"]
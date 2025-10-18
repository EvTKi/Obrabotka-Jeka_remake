// src/hooks/useFilePreview.ts - ОБНОВЛЯЕМ ТИП
import { useState, useCallback } from 'react';
import { apiService } from '../services/api'; 

// ОБНОВЛЯЕМ ИНТЕРФЕЙС ДЛЯ СООТВЕТСТВИЯ НОВОМУ ТИПУ
interface FilePreview {
  sheetNames: string[];
  columns: string[];
  previewData: any[];
}

export const useFilePreview = () => {
  const [previews, setPreviews] = useState<{
    survey?: FilePreview;
    roles?: FilePreview;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilePreview = useCallback(async (file: File, type: 'survey' | 'roles') => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Используем реальный API сервис - теперь тип совместим
      const previewData = await apiService.getFilePreview(file);
      
      setPreviews(prev => ({
        ...prev,
        [type]: previewData
      }));

    } catch (err: any) {
      console.error('File preview error:', err);
      setError(`Ошибка загрузки файла: ${err.message}`);
      
      // Fallback: используем mock данные если API недоступно
      const mockPreviewData = await apiService.getMockFilePreview(file);
      
      setPreviews(prev => ({
        ...prev,
        [type]: mockPreviewData
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPreview = useCallback((type: 'survey' | 'roles') => {
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[type];
      return newPreviews;
    });
  }, []);

  return {
    previews,
    loading,
    error,
    getFilePreview,
    clearPreview
  };
};
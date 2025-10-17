// src/hooks/useFilePreview.ts - ОБНОВЛЕННАЯ ВЕРСИЯ
import { useState, useCallback } from 'react';
import { apiService } from '../services/api'; // Теперь используем!

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
      // Используем реальный API сервис
      const previewData = await apiService.getFilePreview(file);
      
      setPreviews(prev => ({
        ...prev,
        [type]: previewData
      }));

    } catch (err: any) {
      console.error('File preview error:', err);
      setError(`Ошибка загрузки файла: ${err.message}`);
      
      // Fallback: используем mock данные если API недоступно
      const mockSheetNames = ['Лист1'];
      const mockColumns = ['Управление', 'Ведение', 'Роль', 'UID', 'Описание'];
      const mockPreviewData = Array(3).fill(0).map((_, i) => ({
        Управление: `Объект ${i + 1}`,
        Ведение: `Операция ${i + 1}`,
        Роль: `Роль ${i + 1}`,
        UID: `UID00${i + 1}`,
        Описание: `Описание ${i + 1}`
      }));

      setPreviews(prev => ({
        ...prev,
        [type]: {
          sheetNames: mockSheetNames,
          columns: mockColumns,
          previewData: mockPreviewData
        }
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
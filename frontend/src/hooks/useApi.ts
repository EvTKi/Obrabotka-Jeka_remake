// src/hooks/useApi.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useCallback } from 'react';
import { apiService, AnalysisRequest, AnalysisResponse, ProcessRequest } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Убираем analyzeFiles если он не используется
  const processData = useCallback(async (request: ProcessRequest): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.processData(request);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Ошибка обработки данных';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadResult = useCallback(async (processId: string): Promise<Blob | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.downloadResult(processId);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Ошибка скачивания';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    processData, // Оставляем только используемые методы
    downloadResult,
    clearError,
  };
};
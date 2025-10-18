// src/hooks/useAnalysisProcess.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useCallback } from 'react';
import { apiService, AnalysisRequest, ProcessRequest } from '../services/api';

export const useAnalysisProcess = () => {
  const [processingState, setProcessingState] = useState<{
    status: 'idle' | 'analyzing' | 'processing' | 'completed' | 'error';
    error: string | null;
    processId: string | null;
  }>({
    status: 'idle',
    error: null,
    processId: null
  });

  // ИСПРАВЛЕНИЕ: добавляем параметры файлов
  const analyzeData = useCallback(async (surveyFile: File, rolesFile: File, request: AnalysisRequest) => {
    setProcessingState({ status: 'analyzing', error: null, processId: null });
    
    try {
      // Теперь передаем реальные файлы
      const result = await apiService.analyzeFiles(surveyFile, rolesFile, request);
      setProcessingState(prev => ({ ...prev, status: 'completed' }));
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Ошибка анализа';
      setProcessingState({ status: 'error', error: errorMessage, processId: null });
      throw error;
    }
  }, []);

  // Остальные методы без изменений
  const processWithChoices = useCallback(async (request: ProcessRequest) => {
    setProcessingState({ status: 'processing', error: null, processId: null });
    
    try {
      const result = await apiService.processData(request);
      const processId = result.process_id || `proc_${Date.now()}`;
      
      setProcessingState({ status: 'completed', error: null, processId });
      return { ...result, processId };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Ошибка обработки';
      setProcessingState({ status: 'error', error: errorMessage, processId: null });
      throw error;
    }
  }, []);

  const downloadResult = useCallback(async (processId: string) => {
    try {
      const blob = await apiService.downloadResult(processId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `результат_сопоставления_${processId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Ошибка скачивания';
      setProcessingState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const resetProcess = useCallback(() => {
    setProcessingState({ status: 'idle', error: null, processId: null });
  }, []);

  return {
    processingState,
    analyzeData,
    processWithChoices,
    downloadResult,
    resetProcess
  };
};
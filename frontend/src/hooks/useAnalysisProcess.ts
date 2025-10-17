// src/hooks/useAnalysisProcess.ts
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

  const analyzeData = useCallback(async (request: AnalysisRequest) => {
    setProcessingState({ status: 'analyzing', error: null, processId: null });
    
    try {
      // TODO: Заменить на реальные файлы когда будет готов бэкенд
      const mockSurveyFile = new File([], 'survey.xlsx');
      const mockRolesFile = new File([], 'roles.xlsx');
      
      const result = await apiService.analyzeFiles(mockSurveyFile, mockRolesFile, request);
      setProcessingState(prev => ({ ...prev, status: 'completed' }));
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Ошибка анализа';
      setProcessingState({ status: 'error', error: errorMessage, processId: null });
      throw error;
    }
  }, []);

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
      
      // Создаем ссылку для скачивания
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
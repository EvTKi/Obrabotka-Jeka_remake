// src/services/api.ts - ОБНОВЛЕННЫЕ ИНТЕРФЕЙСЫ
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ОБНОВЛЕННЫЕ ИНТЕРФЕЙСЫ ДЛЯ ПРЕДПРОСМОТРА ФАЙЛОВ
export interface FilePreviewResponse {
  sheet_names: string[]; // Изменено с sheetNames на sheet_names
  sheets: { // ДОБАВЛЯЕМ НОВОЕ ПОЛЕ
    [sheetName: string]: {
      columns: string[];
      preview_data: any[];
    };
  };
}

export interface SheetDataResponse {
  columns: string[];
  preview_data: any[]; // Изменено с previewData на preview_data
}

// АДАПТИРОВАННЫЙ ИНТЕРФЕЙС ДЛЯ ФРОНТЕНДА
export interface FrontendFilePreview {
  sheetNames: string[];
  columns: string[];
  previewData: any[];
}

// Существующие интерфейсы (оставляем без изменений)
export interface AnalysisRequest {
  control_col: string;
  operation_cols: string[];
  role_col: string;
  uid_col: string;
  replacements: Array<{ old: string; new: string }>;
}

export interface AnalysisResponse {
  unique_tu: string[];
  unique_tv: string[];
  unique_iv: string[];
  pending_matches: {
    TU: Array<{
      original: string;
      candidates: Array<{ role_name: string; score: number }>;
    }>;
    TV: Array<{
      original: string;
      candidates: Array<{ role_name: string; score: number }>;
    }>;
    IV: Array<{
      original: string;
      candidates: Array<{ role_name: string; score: number }>;
    }>;
  };
  auto_matches: {
    TU: Array<{ original: string; matched: string; uid: string; type: string }>;
    TV: Array<{ original: string; matched: string; uid: string; type: string }>;
    IV: Array<{ original: string; matched: string; uid: string; type: string }>;
  };
}

export interface ProcessRequest {
  analysis_data: any;
  user_choices: {
    TU: Record<string, string>;
    TV: Record<string, string>;
    IV: Record<string, string>;
  };
}

class ApiService {
  // ОБНОВЛЕННЫЙ МЕТОД ДЛЯ ПРЕДПРОСМОТРА
  async getFilePreview(file: File): Promise<FrontendFilePreview> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<FilePreviewResponse>('/api/file-preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      
      // ПРЕОБРАЗОВАНИЕ СТРУКТУРЫ ДЛЯ ФРОНТЕНДА
      const backendData = response.data;
      
      // Если бэкенд возвращает структуру с sheets, берем первый лист
      if (backendData.sheets && Object.keys(backendData.sheets).length > 0) {
        const firstSheetName = Object.keys(backendData.sheets)[0];
        const firstSheet = backendData.sheets[firstSheetName];
        
        return {
          sheetNames: backendData.sheet_names || [],
          columns: firstSheet?.columns || [],
          previewData: firstSheet?.preview_data || []
        };
      }
      
      // Если структура уже в нужном формате (fallback)
      return {
        sheetNames: backendData.sheet_names || [],
        columns: [],
        previewData: []
      };
      
    } catch (error) {
      console.error('File preview API error:', error);
      // Fallback на заглушку
      return this.getMockFilePreview(file);
    }
  }

  async getSheetData(file: File, sheetName: string): Promise<SheetDataResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheet_name', sheetName);

    try {
      const response = await api.post<SheetDataResponse>('/api/sheet-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Возвращаем данные как есть от бэкенда
      return response.data;
      
    } catch (error) {
      console.error('Sheet data API error:', error);
      // Fallback на заглушку
      return this.getMockSheetData(file, sheetName);
    }
  }

  // МЕТОДЫ-ЗАГЛУШКИ (обновляем возвращаемый тип)
  public async getMockFilePreview(file: File): Promise<FrontendFilePreview> {
    console.warn('Using mock file preview - real endpoint not available');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sheetNames: ['Лист1', 'Лист2'],
          columns: ['Управление', 'Ведение', 'Роль', 'UID', 'Описание'],
          previewData: Array(3).fill(0).map((_, i) => ({
            Управление: `Объект ${i + 1}`,
            Ведение: `Операция ${i + 1}, Операция ${i + 2}`,
            Роль: `Роль ${i + 1}`,
            UID: `UID00${i + 1}`,
            Описание: `Описание объекта ${i + 1}`
          }))
        });
      }, 500);
    });
  }

  private async getMockSheetData(file: File, sheetName: string): Promise<SheetDataResponse> {
    console.warn('Using mock sheet data - real endpoint not available');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          columns: ['Управление', 'Ведение', 'Роль', 'UID'],
          preview_data: Array(3).fill(0).map((_, i) => ({
            Управление: `Объект ${i + 1}`,
            Ведение: `Операция ${i + 1}`,
            Роль: `Роль ${i + 1}`,
            UID: `UID00${i + 1}`
          }))
        });
      }, 300);
    });
  }

  // СУЩЕСТВУЮЩИЕ МЕТОДЫ (оставляем без изменений)
  async analyzeFiles(
    surveyFile: File,
    rolesFile: File,
    params: AnalysisRequest
  ): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('survey_file', surveyFile);
    formData.append('roles_file', rolesFile);
    formData.append('control_col', params.control_col);
    formData.append('operation_cols', JSON.stringify(params.operation_cols));
    formData.append('role_col', params.role_col);
    formData.append('uid_col', params.uid_col);
    formData.append('replacements', JSON.stringify(params.replacements));

    const response = await api.post<AnalysisResponse>('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async processData(request: ProcessRequest): Promise<any> {
    const response = await api.post('/api/process', request);
    return response.data;
  }

  async downloadResult(processId: string): Promise<Blob> {
    const response = await api.get(`/api/download-result?process_id=${processId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await api.get('/health');
    return response.data;
  }

  // Метод для получения только списка колонок (обновляем тип)
  async getFileColumns(file: File, sheetName: string = 'Лист1'): Promise<string[]> {
    const data = await this.getSheetData(file, sheetName);
    return data.columns;
  }
}

export const apiService = new ApiService();
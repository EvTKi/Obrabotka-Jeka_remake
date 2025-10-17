import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

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

    const response = await api.post<AnalysisResponse>('/api/analyze', formData);
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
}

export const apiService = new ApiService();
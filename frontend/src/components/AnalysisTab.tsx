// src/components/AnalysisTab.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useFilePreview } from '../hooks/useFilePreview';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';
import { AnalysisRequest, ProcessRequest } from '../services/api';

// Импортируем компоненты секций
import { FileUploadSection } from './sections/FileUploadSection';
import { FilePreviewSection } from './sections/FilePreviewSection';
import { SettingsSection } from './sections/SettingsSection';
import { ReplacementsSection } from './sections/ReplacementsSection';
import { AnalysisResultsSection } from './sections/AnalysisResultsSection';
import { ProcessStatus } from './ProcessStatus';

interface Replacement {
  old: string;
  new: string;
}

interface AnalysisTabProps {
  onDataProcessed: (data: any) => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ onDataProcessed }) => {
  // Хуки - убираем неиспользуемый analyzeFiles
  const { loading: apiLoading, error: apiError, clearError } = useApi();
  const { previews, loading: previewLoading, getFilePreview, clearPreview } = useFilePreview();
  const { processingState, analyzeData, processWithChoices, downloadResult } = useAnalysisProcess();

  // Состояния
  const [surveyFile, setSurveyFile] = useState<File | null>(null);
  const [rolesFile, setRolesFile] = useState<File | null>(null);
  const [replacements, setReplacements] = useState<Replacement[]>([{ old: '', new: '' }]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  
  // Исправляем тип userChoices согласно ProcessRequest
  const [userChoices, setUserChoices] = useState<ProcessRequest['user_choices']>({
    TU: {},
    TV: {},
    IV: {}
  });

  // Настройки
  const [settings, setSettings] = useState({
    controlCol: '',
    operationCols: [] as string[],
    roleCol: '',
    uidCol: ''
  });

  // Обработчики ошибок
  useEffect(() => {
    if (apiError) {
      alert(`Ошибка: ${apiError}`);
      clearError();
    }
  }, [apiError, clearError]);

  // Обработчики файлов
  const handleSurveyFileChange = async (file: File | null) => {
    setSurveyFile(file);
    if (file) {
      await getFilePreview(file, 'survey');
    } else {
      clearPreview('survey');
      setSettings(prev => ({ ...prev, controlCol: '', operationCols: [] }));
    }
  };

  const handleRolesFileChange = async (file: File | null) => {
    setRolesFile(file);
    if (file) {
      await getFilePreview(file, 'roles');
    } else {
      clearPreview('roles');
      setSettings(prev => ({ ...prev, roleCol: '', uidCol: '' }));
    }
  };

  // Основные обработчики
  const handleAnalyze = async () => {
      if (!surveyFile || !rolesFile) {
        alert('Пожалуйста, загрузите оба файла');
        return;
      }

      if (!settings.controlCol || !settings.roleCol || !settings.uidCol || settings.operationCols.length === 0) {
        alert('Пожалуйста, укажите все необходимые столбцы');
        return;
      }

      const requestParams: AnalysisRequest = {
        control_col: settings.controlCol,
        operation_cols: settings.operationCols,
        role_col: settings.roleCol,
        uid_col: settings.uidCol,
        replacements: replacements.filter(rep => rep.old.trim() && rep.new.trim())
      };

      try {
        // ПЕРЕДАЕМ РЕАЛЬНЫЕ ФАЙЛЫ В analyzeData
        const result = await analyzeData(surveyFile, rolesFile, requestParams);
        setAnalysisData(result);
      } catch (error) {
        console.error('Analysis error:', error);
      }
    };

  const handleProcess = async () => {
    if (!analysisData) return;

    // Исправляем тип согласно ProcessRequest
    const processRequest: ProcessRequest = {
      analysis_data: analysisData,
      user_choices: userChoices // Теперь тип совместим
    };

    try {
      const result = await processWithChoices(processRequest);
      onDataProcessed({
        ...result,
        status: 'completed'
      });
    } catch (error) {
      console.error('Processing error:', error);
    }
  };

  const handleDownload = async (processId: string) => {
    try {
      await downloadResult(processId);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  // Обработчик для обновления userChoices
  const handleUserChoiceChange = (newUserChoices: ProcessRequest['user_choices']) => {
    setUserChoices(newUserChoices);
  };

  return (
    <div className="analysis-tab">
      {/* Секция загрузки файлов */}
      <FileUploadSection
        surveyFile={surveyFile}
        rolesFile={rolesFile}
        onSurveyFileChange={handleSurveyFileChange}
        onRolesFileChange={handleRolesFileChange}
        previewLoading={previewLoading}
      />

      {/* Показываем остальные секции только если файлы загружены */}
      {surveyFile && rolesFile && (
        <>
          {/* Предпросмотр файлов */}
          <FilePreviewSection
            surveyFile={surveyFile}
            rolesFile={rolesFile}
            previews={previews}
          />

          {/* Настройки обработки */}
          <SettingsSection
            settings={settings}
            onSettingsChange={setSettings}
            previews={previews}
          />

          {/* Замены */}
          <ReplacementsSection
            replacements={replacements}
            onReplacementsChange={setReplacements}
          />

          {/* Статус обработки */}
          <div className="streamlit-section">
            <h3>📈 Статус обработки</h3>
            <ProcessStatus
              status={processingState.status}
              error={processingState.error}
              processId={processingState.processId}
              onDownload={handleDownload}
            />
          </div>

          {/* Кнопка анализа */}
          <div className="action-section">
            <button 
              onClick={handleAnalyze}
              disabled={apiLoading || !settings.controlCol || !settings.roleCol || !settings.uidCol || settings.operationCols.length === 0}
              className={`streamlit-button primary ${apiLoading ? 'loading' : ''}`}
            >
              {apiLoading ? '🔍 Анализ...' : '🔍 Анализ и подготовка сопоставления'}
            </button>
          </div>

          {/* Результаты анализа */}
          {analysisData && (
            <AnalysisResultsSection
              analysisData={analysisData}
              userChoices={userChoices}
              onUserChoice={handleUserChoiceChange}
              onProcess={handleProcess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisTab;
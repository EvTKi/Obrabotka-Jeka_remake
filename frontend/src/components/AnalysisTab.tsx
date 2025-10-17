// src/components/AnalysisTab.tsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { AnalysisRequest } from '../services/api';
import { 
  InfoBox, 
  // WarningBox, // TODO: будет использоваться позже
  // SuccessBox  // TODO: будет использоваться позже  
} from './MessageBoxes';
import './AnalysisTab.css';

interface Replacement {
  old: string;
  new: string;
}

interface AnalysisTabProps {
  onDataProcessed: (data: any) => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ onDataProcessed }) => {
  const { loading, error, analyzeFiles, clearError } = useApi();
  
  const [surveyFile, setSurveyFile] = useState<File | null>(null);
  const [rolesFile, setRolesFile] = useState<File | null>(null);
  const [replacements, setReplacements] = useState<Replacement[]>([{ old: '', new: '' }]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [userChoices, setUserChoices] = useState<Record<string, Record<string, string>>>({
    TU: {},
    TV: {},
    IV: {}
  });

  // Настройки по умолчанию (временные, потом будут динамические)
  const [settings, setSettings] = useState({
    controlCol: 'Управление',
    operationCols: ['Ведение'],
    roleCol: 'Роль',
    uidCol: 'UID'
  });

  useEffect(() => {
    if (error) {
      alert(`Ошибка: ${error}`);
      clearError();
    }
  }, [error, clearError]);

  const handleAddReplacement = () => {
    setReplacements([...replacements, { old: '', new: '' }]);
  };

  const handleRemoveReplacement = (index: number) => {
    if (replacements.length > 1) {
      setReplacements(replacements.filter((_, i) => i !== index));
    }
  };

  const handleReplacementChange = (index: number, field: keyof Replacement, value: string) => {
    const updated = [...replacements];
    updated[index][field] = value;
    setReplacements(updated);
  };

  const handleUserChoice = (category: 'TU' | 'TV' | 'IV', original: string, selectedRole: string) => {
    setUserChoices(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [original]: selectedRole
      }
    }));
  };

  const handleAnalyze = async () => {
    if (!surveyFile || !rolesFile) {
      alert('Пожалуйста, загрузите оба файла');
      return;
    }

    const requestParams: AnalysisRequest = {
      control_col: settings.controlCol,
      operation_cols: settings.operationCols,
      role_col: settings.roleCol,
      uid_col: settings.uidCol,
      replacements: replacements.filter(rep => rep.old.trim() && rep.new.trim())
    };

    const result = await analyzeFiles(surveyFile, rolesFile, requestParams);
    
    if (result) {
      setAnalysisData(result);
    }
  };

  const handleProcess = async () => {
    if (!analysisData) return;

    const processRequest = {
      analysis_data: analysisData,
      user_choices: userChoices
    };

    // TODO: Вызов API для обработки
    console.log('Process request:', processRequest);
    
    // Временная заглушка - вызовем onDataProcessed с mock данными
    const mockProcessedData = {
      data: Array(10).fill(0).map((_, i) => ({
        Управление: `Объект ${i + 1}`,
        Ведение: `Роль ${i + 1}, Роль ${i + 2}`,
        ТУ_ожидаемо: 1,
        ТУ_найдено: i % 2,
        ТВ_ожидаемо: 2,
        ТВ_найдено: 1,
        ТУ_роли: i % 2 ? `ТУ Объект ${i + 1}` : '',
        ТВ_роли: `ТВ Роль ${i + 1}`,
        Сводка_роли: i % 2 ? `UID00${i + 1}` : ''
      })),
      highlight_rows: [1, 3, 5, 7, 9],
      tu_summary: {},
      tv_summary: {},
      iv_summary: {}
    };

    onDataProcessed(mockProcessedData);
  };

  // Функция для преобразования данных анализа в табличный формат
  const getAnalysisTableData = (category: 'TU' | 'TV' | 'IV') => {
    if (!analysisData) return [];

    const autoMatches = analysisData.auto_matches[category] || [];
    const pendingMatches = analysisData.pending_matches[category] || [];

    // Автоматические совпадения
    const autoRows = autoMatches.map((match: any) => ({
      value: match.original,
      role: match.matched,
      found: true,
      type: match.type,
      uid: match.uid
    }));

    // Ожидающие подтверждения
    const pendingRows = pendingMatches.map((match: any) => ({
      value: match.original,
      role: 'Не найдено',
      found: false,
      type: 'Не найдено',
      candidates: match.candidates
    }));

    return [...autoRows, ...pendingRows];
  };

  return (
    <div className="analysis-tab">
      {/* 📥 Загрузите файлы - точно как в Streamlit */}
      <div className="streamlit-section">
        <h3>📥 Загрузите файлы</h3>
        
        <div className="file-upload-section">
          <div className="file-upload">
            <label><strong>Перечень (Excel)</strong></label>
            <input 
              type="file" 
              accept=".xlsx,.xls"
              onChange={(e) => setSurveyFile(e.target.files?.[0] || null)}
              className="file-input"
            />
            {surveyFile && (
              <div className="file-status">
                ✅ {surveyFile.name}
              </div>
            )}
          </div>
          
          <div className="file-upload">
            <label><strong>Файл с ролями (Excel)</strong></label>
            <input 
              type="file" 
              accept=".xlsx,.xls"
              onChange={(e) => setRolesFile(e.target.files?.[0] || null)}
              className="file-input"
            />
            {rolesFile && (
              <div className="file-status">
                ✅ {rolesFile.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {!surveyFile || !rolesFile ? (
        <InfoBox>
          <p>Пожалуйста, загрузите оба файла для продолжения.</p>
        </InfoBox>
      ) : (
        <>
          {/* ⚙️ Настройки обработки - точно как в Streamlit */}
          <div className="streamlit-section">
            <h3>⚙️ Настройки обработки</h3>
            <div className="settings-columns">
              <div className="setting-group">
                <label>Столбец управления:</label>
                <input 
                  type="text"
                  value={settings.controlCol}
                  onChange={(e) => setSettings(prev => ({...prev, controlCol: e.target.value}))}
                  className="streamlit-input"
                  placeholder="Например: Управление"
                />
                <div className="help-text">Столбец с признаком 'Управление'</div>
              </div>
              <div className="setting-group">
                <label>Столбец ролей:</label>
                <input 
                  type="text"
                  value={settings.roleCol}
                  onChange={(e) => setSettings(prev => ({...prev, roleCol: e.target.value}))}
                  className="streamlit-input"
                  placeholder="Например: Роль"
                />
                <div className="help-text">Столбец с наименованием роли</div>
              </div>
            </div>
            
            <div className="setting-group">
              <label>Столбцы ведения:</label>
              <input 
                type="text"
                value={settings.operationCols.join(', ')}
                onChange={(e) => setSettings(prev => ({
                  ...prev, 
                  operationCols: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="streamlit-input"
                placeholder="Например: Ведение, Операции"
              />
              <div className="help-text">Столбцы с признаком 'Ведение' (через запятую)</div>
            </div>
          </div>

          {/* 🔁 Замены перед обработкой - точно как в Streamlit */}
          <div className="streamlit-section">
            <h3>🔁 Замены перед обработкой</h3>
            <p>Укажите, какие значения нужно заменить перед сопоставлением</p>
            
            <div className="replacements-container">
              {replacements.map((replacement, index) => (
                <div key={index} className="replacement-row">
                  <div className="replacement-input-group">
                    <input
                      type="text"
                      placeholder="Заменить"
                      value={replacement.old}
                      onChange={(e) => handleReplacementChange(index, 'old', e.target.value)}
                      className="streamlit-input replacement-input"
                    />
                    <span className="replacement-arrow">→</span>
                    <input
                      type="text"
                      placeholder="На"
                      value={replacement.new}
                      onChange={(e) => handleReplacementChange(index, 'new', e.target.value)}
                      className="streamlit-input replacement-input"
                    />
                  </div>
                  {replacements.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveReplacement(index)}
                      className="streamlit-button remove-button"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={handleAddReplacement}
              className="streamlit-button secondary"
            >
              ➕ Добавить замену
            </button>
          </div>

          {/* 🔍 Кнопка анализа - точно как в Streamlit */}
          <div className="action-section">
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className={`streamlit-button primary ${loading ? 'loading' : ''}`}
            >
              {loading ? '🔍 Анализ...' : '🔍 Анализ и подготовка сопоставления'}
            </button>
          </div>

          {/* 📊 Результаты анализа - точно как в Streamlit */}
          {analysisData && (
            <div className="streamlit-section">
              <h3>📊 Результаты анализа</h3>
              <p>Уникальные значения из исходных данных и их сопоставление:</p>
              
              <div className="analysis-columns">
                {(['TU', 'TV', 'IV'] as const).map(category => (
                  <div key={category} className="analysis-column">
                    <h4>
                      {category === 'TU' && '🔹 Управление (ТУ)'}
                      {category === 'TV' && '🔹 Ведение (ТВ)'}
                      {category === 'IV' && '🔹 Информационное ведение (ИВ)'}
                    </h4>
                    <div className="analysis-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Исходное значение</th>
                            <th>Сопоставленная роль</th>
                            <th>Найдено</th>
                            <th>Тип</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getAnalysisTableData(category).map((item: any, index) => (
                            <tr 
                              key={index} 
                              className={
                                item.found ? 'streamlit-match-exact' : 
                                item.candidates ? 'streamlit-match-suggested' : 'streamlit-match-none'
                              }
                            >
                              <td>{item.value}</td>
                              <td>{item.role}</td>
                              <td>{item.found ? '✅ Да' : '❌ Нет'}</td>
                              <td>{item.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🤔 Выбор сопоставлений - точно как в Streamlit */}
              {analysisData.pending_matches && 
                Object.values(analysisData.pending_matches).some((arr: any) => arr.length > 0) && (
                <div className="streamlit-section">
                  <h3>🤔 Требуется подтверждение сопоставлений</h3>
                  <p>Найдены неопределенные совпадения. Пожалуйста, выберите правильный вариант:</p>
                  
                  {(['TU', 'TV', 'IV'] as const).map(category => (
                    analysisData.pending_matches[category]?.length > 0 && (
                      <div key={category} className="matching-section">
                        <h4>
                          {category === 'TU' && '🔹 Управление (ТУ)'}
                          {category === 'TV' && '🔹 Ведение (ТВ)'}
                          {category === 'IV' && '🔹 Информационное ведение (ИВ)'}
                        </h4>
                        {analysisData.pending_matches[category].map((match: any, index: number) => (
                          <div key={index} className="streamlit-match-suggested match-option">
                            <div className="match-original">
                              <strong>Исходное значение:</strong> {match.original}
                            </div>
                            <div className="match-candidates">
                              {match.candidates.map((candidate: any, candIndex: number) => (
                                <label key={candIndex} className="candidate-option">
                                  <input 
                                    type="checkbox"
                                    onChange={() => handleUserChoice(category, match.original, candidate.role_name)}
                                  />
                                  <span className="candidate-text">
                                    ✅ {candidate.role_name} ({candidate.score}% совпадения)
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                  
                  <button 
                    onClick={handleProcess}
                    className="streamlit-button primary confirm-button"
                  >
                    ✅ Подтвердить выбор и обработать
                  </button>
                </div>
              )}

              {/* Если нет предложений для выбора */}
              {analysisData.pending_matches && 
                Object.values(analysisData.pending_matches).every((arr: any) => arr.length === 0) && (
                <div className="action-section">
                  <button 
                    onClick={handleProcess}
                    className="streamlit-button primary"
                  >
                    ✅ Обработать без выбора
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisTab;
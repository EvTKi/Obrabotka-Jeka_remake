// src/components/sections/AnalysisResultsSection.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import { ProcessRequest } from '../../services/api';
import './AnalysisResultsSection.css';

interface AnalysisResultsSectionProps {
  analysisData: any;
  userChoices: ProcessRequest['user_choices'];
  onUserChoice: (choices: ProcessRequest['user_choices']) => void;
  onProcess: () => void;
}

export const AnalysisResultsSection: React.FC<AnalysisResultsSectionProps> = ({
  analysisData,
  userChoices,
  onUserChoice,
  onProcess
}) => {
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

  const handleUserChoice = (category: 'TU' | 'TV' | 'IV', original: string, selectedRole: string) => {
    const newChoices = {
      ...userChoices,
      [category]: {
        ...userChoices[category],
        [original]: selectedRole
      }
    };
    onUserChoice(newChoices);
  };

  const hasPendingMatches = analysisData.pending_matches && 
    Object.values(analysisData.pending_matches).some((arr: any) => arr.length > 0);

  return (
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

      {/* Выбор сопоставлений */}
      {hasPendingMatches && (
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
                            checked={userChoices[category]?.[match.original] === candidate.role_name}
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
            onClick={onProcess}
            className="streamlit-button primary confirm-button"
          >
            ✅ Подтвердить выбор и обработать
          </button>
        </div>
      )}

      {/* Если нет предложений для выбора */}
      {!hasPendingMatches && analysisData && (
        <div className="action-section">
          <button 
            onClick={onProcess}
            className="streamlit-button primary"
          >
            ✅ Обработать без выбора
          </button>
        </div>
      )}
    </div>
  );
};
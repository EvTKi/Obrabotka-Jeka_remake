// src/components/ProcessStatus.tsx
import React from 'react';
import './ProcessStatus.css';

interface ProcessStatusProps {
  status: 'idle' | 'analyzing' | 'processing' | 'completed' | 'error';
  error?: string | null;
  processId?: string | null;
  onDownload?: (processId: string) => void;
}

export const ProcessStatus: React.FC<ProcessStatusProps> = ({
  status,
  error,
  processId,
  onDownload
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'analyzing':
        return {
          icon: '🔍',
          message: 'Анализ данных...',
          color: 'var(--streamlit-info)',
          borderColor: 'var(--streamlit-info-border)'
        };
      case 'processing':
        return {
          icon: '⚙️',
          message: 'Обработка данных...',
          color: 'var(--streamlit-info)',
          borderColor: 'var(--streamlit-info-border)'
        };
      case 'completed':
        return {
          icon: '✅',
          message: 'Обработка завершена!',
          color: 'var(--streamlit-success)',
          borderColor: 'var(--streamlit-success-border)'
        };
      case 'error':
        return {
          icon: '❌',
          message: 'Произошла ошибка',
          color: '#f8d7da',
          borderColor: '#f5c6cb'
        };
      default:
        return {
          icon: '⏳',
          message: 'Готов к работе',
          color: 'var(--streamlit-info)',
          borderColor: 'var(--streamlit-info-border)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div 
      className="process-status"
      style={{
        backgroundColor: config.color,
        borderColor: config.borderColor
      }}
    >
      <div className="status-header">
        <span className="status-icon">{config.icon}</span>
        <span className="status-message">{config.message}</span>
      </div>
      
      {error && (
        <div className="error-details">
          <strong>Ошибка:</strong> {error}
        </div>
      )}
      
      {processId && status === 'completed' && (
        <div className="process-actions">
          <div className="process-id">
            <strong>ID процесса:</strong> {processId}
          </div>
          {onDownload && (
            <button 
              onClick={() => onDownload(processId)}
              className="streamlit-button download-btn"
            >
              📥 Скачать результат
            </button>
          )}
        </div>
      )}
    </div>
  );
};
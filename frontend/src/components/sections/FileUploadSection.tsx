// src/components/sections/FileUploadSection.tsx
import React from 'react';
import { InfoBox } from '../MessageBoxes';
import './FileUploadSection.css';

interface FileUploadSectionProps {
  surveyFile: File | null;
  rolesFile: File | null;
  onSurveyFileChange: (file: File | null) => void;
  onRolesFileChange: (file: File | null) => void;
  previewLoading: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  surveyFile,
  rolesFile,
  onSurveyFileChange,
  onRolesFileChange,
  previewLoading
}) => {
  return (
    <div className="streamlit-section">
      <h3>📥 Загрузите файлы</h3>
      
      <div className="file-upload-section">
        <div className="file-upload">
          <label><strong>Перечень (Excel)</strong></label>
          <input 
            type="file" 
            accept=".xlsx,.xls"
            onChange={(e) => onSurveyFileChange(e.target.files?.[0] || null)}
            className="file-input"
          />
          {surveyFile && (
            <div className="file-status">
              ✅ {surveyFile.name}
              {previewLoading && <span className="loading-text"> (загрузка...)</span>}
            </div>
          )}
        </div>
        
        <div className="file-upload">
          <label><strong>Файл с ролями (Excel)</strong></label>
          <input 
            type="file" 
            accept=".xlsx,.xls"
            onChange={(e) => onRolesFileChange(e.target.files?.[0] || null)}
            className="file-input"
          />
          {rolesFile && (
            <div className="file-status">
              ✅ {rolesFile.name}
              {previewLoading && <span className="loading-text"> (загрузка...)</span>}
            </div>
          )}
        </div>
      </div>

      {(!surveyFile || !rolesFile) && (
        <InfoBox>
          <p>Пожалуйста, загрузите оба файла для продолжения.</p>
        </InfoBox>
      )}
    </div>
  );
};
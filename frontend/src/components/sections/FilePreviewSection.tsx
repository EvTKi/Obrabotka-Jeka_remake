// src/components/sections/FilePreviewSection.tsx - ДОБАВЛЯЕМ ЗАЩИТУ
import React from 'react';
import { FilePreviewTable } from '../FilePreviewTable';
import './FilePreviewSection.css';

interface FilePreviewSectionProps {
  surveyFile: File;
  rolesFile: File;
  previews: {
    survey?: {
      sheetNames: string[];
      columns: string[];
      previewData: any[];
    };
    roles?: {
      sheetNames: string[];
      columns: string[];
      previewData: any[];
    };
  };
}

export const FilePreviewSection: React.FC<FilePreviewSectionProps> = ({
  surveyFile,
  rolesFile,
  previews
}) => {
  // Защита от undefined
  const surveyPreview = previews.survey || { sheetNames: [], columns: [], previewData: [] };
  const rolesPreview = previews.roles || { sheetNames: [], columns: [], previewData: [] };

  return (
    <div className="streamlit-section">
      <h3>👀 Предпросмотр данных</h3>
      
      <div className="preview-section">
        <div className="preview-column">
          <h4>📊 Перечень: {surveyFile.name}</h4>
          <FilePreviewTable
            data={surveyPreview.previewData}
            columns={surveyPreview.columns}
            title={`Данные из ${surveyFile.name}`}
          />
        </div>
        
        <div className="preview-column">
          <h4>👥 Роли: {rolesFile.name}</h4>
          <FilePreviewTable
            data={rolesPreview.previewData}
            columns={rolesPreview.columns}
            title={`Данные из ${rolesFile.name}`}
          />
        </div>
      </div>
    </div>
  );
};
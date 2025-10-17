// src/components/sections/FilePreviewSection.tsx
import React from 'react';
import { FilePreviewTable } from '../FilePreviewTable';
import './FilePreviewSection.css';

interface FilePreview {
  sheetNames: string[];
  columns: string[];
  previewData: any[];
}

interface FilePreviewSectionProps {
  surveyFile: File | null;
  rolesFile: File | null;
  previews: {
    survey?: FilePreview;
    roles?: FilePreview;
  };
}

export const FilePreviewSection: React.FC<FilePreviewSectionProps> = ({
  surveyFile,
  rolesFile,
  previews
}) => {
  if (!surveyFile || !rolesFile || (!previews.survey && !previews.roles)) {
    return null;
  }

  return (
    <div className="streamlit-section">
      <h3>📄 Предпросмотр файлов</h3>
      <div className="preview-section">
        {surveyFile && previews.survey && (
          <FilePreviewTable
            data={previews.survey.previewData}
            columns={previews.survey.columns}
            title="Перечень"
          />
        )}
        {rolesFile && previews.roles && (
          <FilePreviewTable
            data={previews.roles.previewData}
            columns={previews.roles.columns}
            title="Роли"
          />
        )}
      </div>
    </div>
  );
};
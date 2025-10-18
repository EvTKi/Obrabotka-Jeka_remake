// src/components/FilePreviewTable.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import './FilePreviewTable.css';

interface FilePreviewTableProps {
  data: any[] | undefined; // Добавляем undefined
  columns: string[] | undefined; // Добавляем undefined
  title: string;
}

export const FilePreviewTable: React.FC<FilePreviewTableProps> = ({ 
  data, 
  columns, 
  title 
}) => {
  // Защита от undefined
  const safeData = data || [];
  const safeColumns = columns || [];

  if (!safeData.length || !safeColumns.length) {
    return (
      <div className="file-preview">
        <h4>{title}</h4>
        <div className="no-preview">Нет данных для отображения</div>
      </div>
    );
  }

  return (
    <div className="file-preview">
      <h4>{title}</h4>
      <div className="preview-table">
        <table>
          <thead>
            <tr>
              {safeColumns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {safeColumns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {row[column] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="preview-info">
        Показано первых {safeData.length} строк
      </div>
    </div>
  );
};
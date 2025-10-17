// src/components/FilePreviewTable.tsx
import React from 'react';
import './FilePreviewTable.css';

interface FilePreviewTableProps {
  data: any[];
  columns: string[];
  title: string;
}

export const FilePreviewTable: React.FC<FilePreviewTableProps> = ({ 
  data, 
  columns, 
  title 
}) => {
  if (!data.length || !columns.length) {
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
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
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
        Показано первых {data.length} строк
      </div>
    </div>
  );
};
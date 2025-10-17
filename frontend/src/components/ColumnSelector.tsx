// src/components/ColumnSelector.tsx
import React from 'react';
import './ColumnSelector.css';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  label: string;
  helpText?: string;
  multiple?: boolean;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onColumnsChange,
  label,
  helpText,
  multiple = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions, option => option.value);
      onColumnsChange(selected);
    } else {
      onColumnsChange([e.target.value]);
    }
  };

  return (
    <div className="column-selector">
      <label className="selector-label">{label}</label>
      <select
        multiple={multiple}
        value={multiple ? selectedColumns : selectedColumns[0] || ''}
        onChange={handleChange}
        className="streamlit-select"
        size={multiple ? Math.min(columns.length, 6) : 1}
      >
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
      {helpText && (
        <div className="help-text">{helpText}</div>
      )}
    </div>
  );
};
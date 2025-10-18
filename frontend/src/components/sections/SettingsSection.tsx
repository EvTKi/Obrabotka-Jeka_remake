// src/components/sections/SettingsSection.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import { ColumnSelector } from '../ColumnSelector';
import './SettingsSection.css';

interface SettingsSectionProps {
  settings: {
    controlCol: string;
    operationCols: string[];
    roleCol: string;
    uidCol: string;
  };
  onSettingsChange: (settings: any) => void;
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

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onSettingsChange,
  previews
}) => {
  // Защита от undefined
  const surveyColumns = previews.survey?.columns || [];
  const rolesColumns = previews.roles?.columns || [];

  const handleControlColChange = (columns: string[]) => {
    onSettingsChange({ ...settings, controlCol: columns[0] || '' });
  };

  const handleOperationColsChange = (columns: string[]) => {
    onSettingsChange({ ...settings, operationCols: columns });
  };

  const handleRoleColChange = (columns: string[]) => {
    onSettingsChange({ ...settings, roleCol: columns[0] || '' });
  };

  const handleUidColChange = (columns: string[]) => {
    onSettingsChange({ ...settings, uidCol: columns[0] || '' });
  };

  return (
    <div className="streamlit-section">
      <h3>⚙️ Настройки обработки</h3>
      
      <div className="settings-columns">
        <div className="settings-group">
          <h4>📊 Перечень (опросный лист)</h4>
          
          <ColumnSelector
            columns={surveyColumns}
            selectedColumns={[settings.controlCol].filter(Boolean)}
            onColumnsChange={handleControlColChange}
            label="Столбец управления (ТУ)"
            helpText="Выберите столбец с объектами управления"
            multiple={false}
          />

          <ColumnSelector
            columns={surveyColumns}
            selectedColumns={settings.operationCols}
            onColumnsChange={handleOperationColsChange}
            label="Столбцы ведения (ТВ)"
            helpText="Выберите один или несколько столбцов с операциями"
            multiple={true}
          />
        </div>

        <div className="settings-group">
          <h4>👥 Файл с ролями</h4>
          
          <ColumnSelector
            columns={rolesColumns}
            selectedColumns={[settings.roleCol].filter(Boolean)}
            onColumnsChange={handleRoleColChange}
            label="Столбец с названиями ролей"
            helpText="Выберите столбец с наименованиями ролей (ТУ..., ТВ..., ИВ...)"
            multiple={false}
          />

          <ColumnSelector
            columns={rolesColumns}
            selectedColumns={[settings.uidCol].filter(Boolean)}
            onColumnsChange={handleUidColChange}
            label="Столбец с UID ролей"
            helpText="Выберите столбец с уникальными идентификаторами ролей"
            multiple={false}
          />
        </div>
      </div>
    </div>
  );
};
// src/components/sections/SettingsSection.tsx
import React from 'react';
import { ColumnSelector } from '../ColumnSelector';
import './SettingsSection.css';

interface Settings {
  controlCol: string;
  operationCols: string[];
  roleCol: string;
  uidCol: string;
}

interface SettingsSectionProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  previews: {
    survey?: { columns: string[] };
    roles?: { columns: string[] };
  };
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onSettingsChange,
  previews
}) => {
  const handleControlColChange = (cols: string[]) => {
    onSettingsChange({ ...settings, controlCol: cols[0] || '' });
  };

  const handleOperationColsChange = (cols: string[]) => {
    onSettingsChange({ ...settings, operationCols: cols });
  };

  const handleRoleColChange = (cols: string[]) => {
    onSettingsChange({ ...settings, roleCol: cols[0] || '' });
  };

  const handleUidColChange = (cols: string[]) => {
    onSettingsChange({ ...settings, uidCol: cols[0] || '' });
  };

  return (
    <div className="streamlit-section">
      <h3>⚙️ Настройки обработки</h3>
      
      <div className="settings-section">
        <h4>🔹 Столбцы перечня</h4>
        <div className="settings-columns">
          {previews.survey && (
            <ColumnSelector
              columns={previews.survey.columns}
              selectedColumns={[settings.controlCol]}
              onColumnsChange={handleControlColChange}
              label="Столбец управления:"
              helpText="Столбец с признаком 'Управление'"
              multiple={false}
            />
          )}
          {previews.survey && (
            <ColumnSelector
              columns={previews.survey.columns.filter(col => col !== settings.controlCol)}
              selectedColumns={settings.operationCols}
              onColumnsChange={handleOperationColsChange}
              label="Столбцы ведения:"
              helpText="Столбцы с признаком 'Ведение' (можно выбрать несколько)"
              multiple={true}
            />
          )}
        </div>

        <h4>🔹 Столбцы ролей</h4>
        <div className="settings-columns">
          {previews.roles && (
            <ColumnSelector
              columns={previews.roles.columns}
              selectedColumns={[settings.roleCol]}
              onColumnsChange={handleRoleColChange}
              label="Столбец ролей:"
              helpText="Столбец с наименованием роли"
              multiple={false}
            />
          )}
          {previews.roles && (
            <ColumnSelector
              columns={previews.roles.columns.filter(col => col !== settings.roleCol)}
              selectedColumns={[settings.uidCol]}
              onColumnsChange={handleUidColChange}
              label="Столбец UID:"
              helpText="Столбец с UID роли"
              multiple={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};
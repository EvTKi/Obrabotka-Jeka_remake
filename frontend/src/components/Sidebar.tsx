// src/components/Sidebar.tsx
import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>💡 Инструкция</h2>
      </div>
      
      <div className="sidebar-content">
        <ul className="instruction-list">
          <li>Загрузите <strong>Перечень</strong> и <strong>Файл с ролями</strong></li>
          <li>Укажите столбцы: <strong>роль и UID</strong></li>
          <li>🔍 Сначала увидите <strong>анализ уникальных значений</strong></li>
          <li>🔁 Добавьте замены (опционально)</li>
          <li>🔍 Нажмите <strong>"Анализ и подготовка сопоставления"</strong></li>
          <li>🤔 Для неопределенных случаев <strong>выберите правильный вариант</strong></li>
          <li>✅ Нажмите <strong>"Подтвердить выбор и обработать"</strong></li>
          <li>
            <strong>Результат:</strong>
            <ul>
              <li><strong>ТУ_роли/ТВ_роли/ИВ_роли</strong> → наименования</li>
              <li><strong>Сводка_роли</strong> → только UID через !</li>
              <li>Подсветка, сводные списки с типом сопоставления</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
// src/App.tsx
import React, { useState } from 'react';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import Sidebar from './components/Sidebar';
import './App.css';
import './styles/streamlit-theme.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'results'>('analysis');
  const [processedData, setProcessedData] = useState<any>(null);

  return (
    <div className="main-container">
      {/* Боковая панель как в Streamlit */}
      <Sidebar />
      
      {/* Основной контент */}
      <div className="main-content">
        {/* Заголовок точно как в Streamlit */}
        <div className="streamlit-header">
          <h1>🧩 Умное сопоставление ролей ТУ/ТВ/ИВ</h1>
          <p className="streamlit-subtitle">С поддержкой ролей (И)/(ИВ) → префикс ИВ (Информационное ведение)</p>
        </div>

        <div className="streamlit-divider"></div>

        {/* Вкладки точно как в Streamlit */}
        <div className="streamlit-tabs">
          <button 
            className={`streamlit-tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📁 Настройка
          </button>
          <button 
            className={`streamlit-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Результаты
          </button>
        </div>

        {/* Контент вкладок */}
        <div className="content-container">
          {activeTab === 'analysis' && (
            <AnalysisTab onDataProcessed={setProcessedData} />
          )}
          {activeTab === 'results' && (
            <ResultsTab processedData={processedData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
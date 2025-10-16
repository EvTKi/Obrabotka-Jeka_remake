import React, { useState } from 'react';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import Sidebar from './components/Sidebar';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'results'>('analysis');
  const [processedData, setProcessedData] = useState<any>(null);

  return (
    <div className="main">
      {/* Боковая панель */}
      <Sidebar />
      
      {/* Основной контент */}
      <div className="main-content">
        {/* Заголовок как в Streamlit */}
        <div className="header-container">
          <h1>🧩 Умное сопоставление ролей ТУ/ТВ/ИВ</h1>
          <p className="subtitle">С поддержкой ролей (И)/(ИВ) → префикс ИВ (Информационное ведение)</p>
        </div>

        <div className="divider"></div>

        {/* Вкладки как в Streamlit */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📁 Настройка
          </button>
          <button 
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
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
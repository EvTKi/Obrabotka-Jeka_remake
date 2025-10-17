// src/components/ResultsTab.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import { ProcessStatus } from './ProcessStatus';
import './ResultsTab.css';

interface ProcessedData {
  data: any[];
  highlight_rows: number[];
  tu_summary: Record<string, any>;
  tv_summary: Record<string, any>;
  iv_summary: Record<string, any>;
  processId?: string;
  status?: string;
}

interface ResultsTabProps {
  processedData: ProcessedData | null;
  onDownload?: (processId: string) => void;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ processedData, onDownload }) => {
  if (!processedData) {
    return (
      <div className="results-tab">
        <div className="streamlit-info-box">
          Пожалуйста, обработайте данные на вкладке "Настройка".
        </div>
      </div>
    );
  }

  const { data, highlight_rows, tu_summary, tv_summary, iv_summary, processId, status } = processedData;

  // Функция для проверки, нужно ли подсвечивать строку
  const shouldHighlight = (index: number) => {
    return highlight_rows.includes(index);
  };

  // Функция для преобразования сводных данных в табличный формат
  const getSummaryData = (summary: Record<string, any>) => {
    return Object.entries(summary).map(([value, data]) => ({
      value,
      role: data.role_name || data.role || '',
      found: data.found ? '✅' : '❌',
      uid: data.uid || '',
      type: data.match_type || data.type || ''
    }));
  };

  return (
    <div className="results-tab">
      {/* Статус обработки */}
      {status && (
        <ProcessStatus
          status={status as any}
          processId={processId}
          onDownload={onDownload}
        />
      )}

      <h2>📊 Результаты по строкам</h2>
      
      <div className="results-section">
        {highlight_rows.length > 0 && (
          <div className="streamlit-warning-box">
            ⚠️ Подсвечено {highlight_rows.length} строк с несоответствием количества ролей.
          </div>
        )}

        <div className="results-table">
          {data && data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr 
                    key={index} 
                    className={shouldHighlight(index) ? 'streamlit-highlight-row' : ''}
                  >
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td key={cellIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">Нет данных для отображения</div>
          )}
        </div>
      </div>

      {/* Сводные списки */}
      <div className="summary-section">
        <h2>📑 Сводные списки ролей</h2>
        
        <div className="summary-columns">
          <div className="summary-column">
            <h3>🔹 Управление (ТУ)</h3>
            <div className="summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Значение</th>
                    <th>Сопоставленная роль</th>
                    <th>Найдено</th>
                    <th>UID</th>
                    <th>Тип сопоставления</th>
                  </tr>
                </thead>
                <tbody>
                  {getSummaryData(tu_summary).map((item, index) => (
                    <tr key={index}>
                      <td>{item.value}</td>
                      <td>{item.role}</td>
                      <td>{item.found}</td>
                      <td>{item.uid}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="summary-column">
            <h3>🔹 Ведение (ТВ)</h3>
            <div className="summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Значение</th>
                    <th>Сопоставленная роль</th>
                    <th>Найдено</th>
                    <th>UID</th>
                    <th>Тип сопоставления</th>
                  </tr>
                </thead>
                <tbody>
                  {getSummaryData(tv_summary).map((item, index) => (
                    <tr key={index}>
                      <td>{item.value}</td>
                      <td>{item.role}</td>
                      <td>{item.found}</td>
                      <td>{item.uid}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="summary-column">
            <h3>🔹 Информационное ведение (ИВ)</h3>
            <div className="summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Значение</th>
                    <th>Сопоставленная роль</th>
                    <th>Найдено</th>
                    <th>UID</th>
                    <th>Тип сопоставления</th>
                  </tr>
                </thead>
                <tbody>
                  {getSummaryData(iv_summary).map((item, index) => (
                    <tr key={index}>
                      <td>{item.value}</td>
                      <td>{item.role}</td>
                      <td>{item.found}</td>
                      <td>{item.uid}</td>
                      <td>{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTab;
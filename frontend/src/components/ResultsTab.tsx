import React from 'react';
import './ResultsTab.css';
interface ProcessedData {
  data: any[];
  highlight_rows: number[];
  tu_summary: Record<string, any>;
  tv_summary: Record<string, any>;
  iv_summary: Record<string, any>;
}

interface ResultsTabProps {
  processedData: ProcessedData | null;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ processedData }) => {
  if (!processedData) {
    return (
      <div className="results-tab">
        <div className="info-box">
          Пожалуйста, обработайте данные на вкладке "Настройка".
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // TODO: Реализовать скачивание Excel
    alert('Функция скачивания будет реализована после интеграции с API');
  };

  // Mock данные для результатов
  const mockResults = [
    { Управление: 'Объект 1', Ведение: 'Роль 1, Роль 2', ТУ_ожидаемо: 1, ТУ_найдено: 1, ТВ_ожидаемо: 2, ТВ_найдено: 1 },
    { Управление: 'Объект 2', Ведение: 'Роль 3 (И)', ТУ_ожидаемо: 1, ТУ_найдено: 0, ТВ_ожидаемо: 1, ТВ_найдено: 1 },
  ];

  const mockSummary = {
    tu: [
      { value: 'Объект 1', role: 'ТУ Объект 1', found: '✅', uid: 'UID001', type: 'Точное' },
      { value: 'Объект 2', role: 'ТУ Объект 2', found: '❌', uid: '', type: 'Не найдено' }
    ],
    tv: [
      { value: 'Роль 1', role: 'ТВ Роль 1', found: '✅', uid: 'UID002', type: 'Точное' },
      { value: 'Роль 2', role: 'ТВ Роль 2', found: '❌', uid: '', type: 'Не найдено' }
    ],
    iv: [
      { value: 'Роль 3', role: 'ИВ Роль 3', found: '✅', uid: 'UID004', type: 'Точное' }
    ]
  };

  return (
    <div className="results-tab">
      <h2>📊 Результаты по строкам</h2>
      
      <div className="results-section">
        <div className="warning-box">
          ⚠️ Подсвечено {processedData.highlight_rows.length} строк с несоответствием количества ролей.
        </div>

        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>Управление</th>
                <th>Ведение</th>
                <th>ТУ_ожидаемо</th>
                <th>ТУ_найдено</th>
                <th>ТВ_ожидаемо</th>
                <th>ТВ_найдено</th>
                <th>ТУ_роли</th>
                <th>ТВ_роли</th>
                <th>Сводка_роли</th>
              </tr>
            </thead>
            <tbody>
              {mockResults.map((row, index) => (
                <tr key={index} className={index === 1 ? 'highlight-row' : ''}>
                  <td>{row.Управление}</td>
                  <td>{row.Ведение}</td>
                  <td>{row.ТУ_ожидаемо}</td>
                  <td>{row.ТУ_найдено}</td>
                  <td>{row.ТВ_ожидаемо}</td>
                  <td>{row.ТВ_найдено}</td>
                  <td>ТУ Объект 1</td>
                  <td>ТВ Роль 1</td>
                  <td>UID001!UID002</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  {mockSummary.tu.map((item, index) => (
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
                  {mockSummary.tv.map((item, index) => (
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
                  {mockSummary.iv.map((item, index) => (
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

      <div className="download-section">
        <button onClick={handleDownload} className="download-btn">
          📥 Скачать результат (Excel с подсветкой и UID)
        </button>
      </div>
    </div>
  );
};

export default ResultsTab;
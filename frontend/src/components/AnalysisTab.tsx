import React, { useState } from 'react';

interface Replacement {
  old: string;
  new: string;
}

interface AnalysisTabProps {
  onDataProcessed: (data: any) => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ onDataProcessed }) => {
  const [surveyFile, setSurveyFile] = useState<File | null>(null);
  const [rolesFile, setRolesFile] = useState<File | null>(null);
  const [replacements, setReplacements] = useState<Replacement[]>([{ old: '', new: '' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAddReplacement = () => {
    setReplacements([...replacements, { old: '', new: '' }]);
  };

  const handleRemoveReplacement = (index: number) => {
    if (replacements.length > 1) {
      setReplacements(replacements.filter((_, i) => i !== index));
    }
  };

  const handleReplacementChange = (index: number, field: keyof Replacement, value: string) => {
    const updated = [...replacements];
    updated[index][field] = value;
    setReplacements(updated);
  };

  const handleAnalyze = async () => {
    if (!surveyFile || !rolesFile) {
      alert('Пожалуйста, загрузите оба файла');
      return;
    }

    setIsProcessing(true);
    setShowAnalysis(true);
    
    try {
      // TODO: Реализовать вызов API
      console.log('Анализ данных...');
      
      // Временная заглушка
      setTimeout(() => {
        const mockData = {
          data: [],
          highlight_rows: [],
          tu_summary: {},
          tv_summary: {},
          iv_summary: {}
        };
        onDataProcessed(mockData);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка анализа:', error);
      setIsProcessing(false);
    }
  };

  // Mock данные для анализа
  const mockAnalysisData = {
    tu: [
      { value: 'Объект 1', role: 'ТУ Объект 1', found: true, type: 'Точное' },
      { value: 'ПС Тестовая', role: 'ТУ ПС Тестовая', found: false, type: 'Не найдено' }
    ],
    tv: [
      { value: 'Роль 1', role: 'ТВ Роль 1', found: true, type: 'Точное' },
      { value: 'Кабель 110', role: 'ТВ Кабель 110', found: false, type: 'Не найдено' }
    ],
    iv: [
      { value: 'Роль 3', role: 'ИВ Роль 3', found: true, type: 'Точное' },
      { value: 'Данные 5', role: 'ИВ Данные 5', found: false, type: 'Не найдено' }
    ]
  };

  return (
    <div className="analysis-tab">
      {/* 📥 Загрузите файлы */}
      <div className="section">
        <h3>📥 Загрузите файлы</h3>
        
        <div className="file-upload-section">
          <div className="file-upload">
            <label><strong>Перечень (Excel)</strong></label>
            <input 
              type="file" 
              accept=".xlsx,.xls"
              onChange={(e) => setSurveyFile(e.target.files?.[0] || null)}
              className="file-input"
            />
            {surveyFile && <div className="file-status">✅ {surveyFile.name}</div>}
          </div>
          
          <div className="file-upload">
            <label><strong>Файл с ролями (Excel)</strong></label>
            <input 
              type="file" 
              accept=".xlsx,.xls"
              onChange={(e) => setRolesFile(e.target.files?.[0] || null)}
              className="file-input"
            />
            {rolesFile && <div className="file-status">✅ {rolesFile.name}</div>}
          </div>
        </div>
      </div>

      {surveyFile && rolesFile ? (
        <>
          {/* Выбор листов и столбцов */}
          <div className="section">
            <h3>📄 Лист: <strong>Перечень</strong></h3>
            <div className="preview-table">
              <p>Лист1 (3 строки × 3 столбца)</p>
              <table>
                <thead>
                  <tr>
                    <th>Управление</th>
                    <th>Ведение</th>
                    <th>Дополнительно</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Объект 1</td><td>Роль 1, Роль 2</td><td>Доп 1</td></tr>
                  <tr><td>Объект 2</td><td>Роль 3 (И)</td><td>Доп 2</td></tr>
                  <tr><td>Объект 3</td><td>Роль 4, Роль 5 (ИВ)</td><td>Доп 3</td></tr>
                </tbody>
              </table>
            </div>

            <div className="columns">
              <div className="column">
                <h4>🔹 Столбец: <strong>Управление</strong></h4>
                <select className="form-select">
                  <option>Управление</option>
                  <option>Ответственный</option>
                </select>
                <p className="help-text">Например: 'Ответственный', 'Управление'</p>
              </div>
              
              <div className="column">
                <h4>🔹 Столбцы: <strong>Ведение</strong></h4>
                <select multiple className="form-select multiple">
                  <option>Ведение</option>
                  <option>Операции</option>
                </select>
                <p className="help-text">Может быть несколько столбцов. Роли в ячейке могут быть через запятую.</p>
              </div>
            </div>

            <h3>📄 Лист: <strong>Роли</strong></h3>
            <div className="preview-table">
              <p>Roles (5 строк × 2 столбца)</p>
              <table>
                <thead>
                  <tr>
                    <th>Роль</th>
                    <th>UID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>ТУ Объект 1</td><td>UID001</td></tr>
                  <tr><td>ТВ Роль 1</td><td>UID002</td></tr>
                  <tr><td>ТВ Роль 3</td><td>UID003</td></tr>
                  <tr><td>ИВ Роль 3</td><td>UID004</td></tr>
                  <tr><td>ТУ Другой</td><td>UID005</td></tr>
                </tbody>
              </table>
            </div>

            <div className="columns">
              <div className="column">
                <h4>🔹 Столбец: <strong>Роли и UID</strong></h4>
                <select className="form-select">
                  <option>Роль</option>
                  <option>Наименование</option>
                </select>
                <p className="help-text">Например: 'Роль', 'Наименование'</p>
              </div>
              
              <div className="column">
                <h4>🔹 Столбец: <strong>UID роли</strong></h4>
                <select className="form-select">
                  <option>UID</option>
                  <option>Идентификатор</option>
                </select>
                <p className="help-text">Например: 'UID', 'Идентификатор'</p>
              </div>
            </div>
          </div>

          {/* Анализ уникальных значений */}
          {showAnalysis && (
            <div className="section">
              <h3>🔍 Анализ уникальных значений (до замен)</h3>
              <p>Уникальные значения из исходных данных и их сопоставление:</p>
              
              <div className="analysis-columns">
                <div className="analysis-column">
                  <h4>Управление (ТУ)</h4>
                  <div className="analysis-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Исходное значение</th>
                          <th>Сопоставленная роль</th>
                          <th>Найдено</th>
                          <th>Тип</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAnalysisData.tu.map((item, index) => (
                          <tr key={index} className={item.found ? 'match-exact' : 'match-none'}>
                            <td>{item.value}</td>
                            <td>{item.role}</td>
                            <td>{item.found ? '✅ Да' : '❌ Нет'}</td>
                            <td>{item.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="analysis-column">
                  <h4>Ведение (ТВ)</h4>
                  <div className="analysis-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Исходное значение</th>
                          <th>Сопоставленная роль</th>
                          <th>Найдено</th>
                          <th>Тип</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAnalysisData.tv.map((item, index) => (
                          <tr key={index} className={item.found ? 'match-exact' : 'match-none'}>
                            <td>{item.value}</td>
                            <td>{item.role}</td>
                            <td>{item.found ? '✅ Да' : '❌ Нет'}</td>
                            <td>{item.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="analysis-column">
                  <h4>Информационное ведение (ИВ)</h4>
                  <div className="analysis-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Исходное значение</th>
                          <th>Сопоставленная роль</th>
                          <th>Найдено</th>
                          <th>Тип</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAnalysisData.iv.map((item, index) => (
                          <tr key={index} className={item.found ? 'match-exact' : 'match-none'}>
                            <td>{item.value}</td>
                            <td>{item.role}</td>
                            <td>{item.found ? '✅ Да' : '❌ Нет'}</td>
                            <td>{item.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Замены */}
          <div className="section">
            <h3>🔁 Замены перед обработкой</h3>
            <p>Укажите, какие значения нужно заменить перед сопоставлением</p>
            
            <div className="replacements-container">
              {replacements.map((replacement, index) => (
                <div key={index} className="replacement-row">
                  <div className="replacement-input-group">
                    <input
                      type="text"
                      placeholder="Заменить"
                      value={replacement.old}
                      onChange={(e) => handleReplacementChange(index, 'old', e.target.value)}
                      className="replacement-input"
                    />
                    <span className="replacement-arrow">→</span>
                    <input
                      type="text"
                      placeholder="На"
                      value={replacement.new}
                      onChange={(e) => handleReplacementChange(index, 'new', e.target.value)}
                      className="replacement-input"
                    />
                  </div>
                  {replacements.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveReplacement(index)}
                      className="remove-replacement-btn"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={handleAddReplacement}
              className="add-replacement-btn"
            >
              ➕ Добавить замену
            </button>
          </div>

          {/* Кнопка анализа */}
          <div className="action-section">
            <button 
              onClick={handleAnalyze}
              disabled={isProcessing}
              className="analyze-btn primary"
            >
              {isProcessing ? '🔍 Анализ...' : '🔍 Анализ и подготовка сопоставления'}
            </button>
          </div>

          {/* Выбор сопоставлений (после анализа) */}
          {showAnalysis && !isProcessing && (
            <div className="section">
              <h3>🤔 Требуется подтверждение сопоставлений</h3>
              <p>Найдены неопределенные совпадения. Пожалуйста, выберите правильный вариант:</p>
              
              <div className="matching-section">
                <h4>Управление (ТУ)</h4>
                <div className="match-option match-suggested">
                  <label>
                    <input type="checkbox" />
                    <strong>Исходное значение:</strong> ПС Тестовая
                  </label>
                  <div className="match-candidates">
                    <label><input type="radio" name="tu_match" /> ✅ ТУ ПС Тестовая (85% совпадения)</label>
                    <label><input type="radio" name="tu_match" /> ✅ ТУ Тестовая Подстанция (78% совпадения)</label>
                  </div>
                </div>
              </div>
              
              <button className="confirm-btn primary">
                ✅ Подтвердить выбор и обработать
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="info-box">
          <p>Пожалуйста, загрузите оба файла для продолжения.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisTab;
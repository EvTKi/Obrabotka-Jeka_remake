// src/components/sections/ReplacementsSection.tsx
import React from 'react';
import './ReplacementsSection.css';

interface Replacement {
  old: string;
  new: string;
}

interface ReplacementsSectionProps {
  replacements: Replacement[];
  onReplacementsChange: (replacements: Replacement[]) => void;
}

export const ReplacementsSection: React.FC<ReplacementsSectionProps> = ({
  replacements,
  onReplacementsChange
}) => {
  const handleAddReplacement = () => {
    onReplacementsChange([...replacements, { old: '', new: '' }]);
  };

  const handleRemoveReplacement = (index: number) => {
    if (replacements.length > 1) {
      onReplacementsChange(replacements.filter((_, i) => i !== index));
    }
  };

  const handleReplacementChange = (index: number, field: keyof Replacement, value: string) => {
    const updated = [...replacements];
    updated[index][field] = value;
    onReplacementsChange(updated);
  };

  return (
    <div className="streamlit-section">
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
                className="streamlit-input replacement-input"
              />
              <span className="replacement-arrow">→</span>
              <input
                type="text"
                placeholder="На"
                value={replacement.new}
                onChange={(e) => handleReplacementChange(index, 'new', e.target.value)}
                className="streamlit-input replacement-input"
              />
            </div>
            {replacements.length > 1 && (
              <button 
                type="button"
                onClick={() => handleRemoveReplacement(index)}
                className="streamlit-button remove-button"
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
        className="streamlit-button secondary"
      >
        ➕ Добавить замену
      </button>
    </div>
  );
};
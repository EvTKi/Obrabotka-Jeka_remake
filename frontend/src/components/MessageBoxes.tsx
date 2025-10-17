// src/components/MessageBoxes.tsx
import React from 'react';

interface MessageBoxProps {
  type: 'info' | 'success' | 'warning';
  children: React.ReactNode;
}

export const MessageBox: React.FC<MessageBoxProps> = ({ type, children }) => {
  const getClassName = () => {
    switch (type) {
      case 'info': return 'streamlit-info-box';
      case 'success': return 'streamlit-success-box';
      case 'warning': return 'streamlit-warning-box';
      default: return 'streamlit-info-box';
    }
  };

  return (
    <div className={getClassName()}>
      {children}
    </div>
  );
};

export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MessageBox type="info">{children}</MessageBox>
);

export const SuccessBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MessageBox type="success">{children}</MessageBox>
);

export const WarningBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MessageBox type="warning">{children}</MessageBox>
);
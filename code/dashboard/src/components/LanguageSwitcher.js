// src/components/LanguageSwitcher.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const switcherStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const buttonStyle = (isActive) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: isActive ? '#ffffff' : 'transparent',
    color: isActive ? '#2c5530' : '#ffffff',
    transition: 'all 0.2s ease',
    minWidth: '40px'
  });

  return (
    <div style={switcherStyle}>
      <button
        style={buttonStyle(language === 'hi')}
        onClick={() => setLanguage('hi')}
        title="हिंदी में स्विच करें"
      >
        हि
      </button>
      <button
        style={buttonStyle(language === 'en')}
        onClick={() => setLanguage('en')}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
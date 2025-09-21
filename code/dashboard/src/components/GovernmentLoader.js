// src/components/GovernmentLoader.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function GovernmentLoader() {
  const { t } = useLanguage();
  
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    color: 'white',
    fontFamily: 'Inter, sans-serif'
  };

  const logoStyle = {
    width: '120px',
    height: '120px',
    background: 'var(--primary-gold)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    marginBottom: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    animation: 'logoSpin 3s ease-in-out infinite',
    border: '4px solid rgba(255, 255, 255, 0.2)'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '0.5rem',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    animation: 'fadeInUp 1s ease-out'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: '3rem',
    opacity: 0.9,
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
    animation: 'fadeInUp 1s ease-out 0.3s both'
  };

  const spinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.2)',
    borderTop: '4px solid var(--primary-gold)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem'
  };

  const loadingTextStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
    animation: 'pulse 2s ease-in-out infinite'
  };

  const decorativePattern = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
                      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 2px, transparent 2px)`,
    backgroundSize: '40px 40px',
    animation: 'patternMove 10s linear infinite',
    pointerEvents: 'none'
  };

  return (
    <>
      <style>{`
        @keyframes logoSpin {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
      
      <div style={containerStyle}>
        <div style={decorativePattern}></div>
        
        {/* Government Logo */}
        <div style={logoStyle}>
          🏛️
        </div>
        
        {/* Title and Subtitle */}
        <h1 style={titleStyle}>
          {t('title')}
        </h1>
        <p style={subtitleStyle}>
          {t('subtitle')}
        </p>
        
        {/* Loading Spinner */}
        <div style={spinnerStyle}></div>
        
        {/* Loading Text */}
        <p style={loadingTextStyle}>
          {t('loading')}
        </p>
        
        {/* Version Info */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0.7,
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 5px 0' }}>{t('poweredBy')}</p>
          <p style={{ margin: 0, fontSize: '12px' }}>{t('version')}</p>
        </div>
      </div>
    </>
  );
}
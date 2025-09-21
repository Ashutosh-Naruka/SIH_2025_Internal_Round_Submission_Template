// src/components/GovernmentBranding.js
import React from 'react';

// Government Logo Component
export function GovernmentLogo({ size = 'medium' }) {
  const sizeMap = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 60, height: 60, fontSize: 24 },
    large: { width: 80, height: 80, fontSize: 32 }
  };
  
  const logoSize = sizeMap[size];
  
  return (
    <div 
      className="gov-logo" 
      style={{
        width: logoSize.width,
        height: logoSize.height,
        fontSize: logoSize.fontSize
      }}
    >
      🏛️
    </div>
  );
}

// Jharkhand State Emblem (simplified representation)
export function StateEmblem() {
  return (
    <div style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--primary-green), var(--secondary-green))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-gold)',
      fontSize: '2rem',
      fontWeight: 'bold',
      boxShadow: 'var(--shadow-lg)',
      border: '3px solid var(--primary-gold)'
    }}>
      झा
    </div>
  );
}

// Official Colors Palette
export const GovernmentColors = {
  primary: {
    green: '#2c5530',
    gold: '#DAA520',
    secondary: '#4a7c59'
  },
  neutral: {
    white: '#ffffff',
    lightGray: '#f8fafc',
    darkGray: '#1e293b'
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

// Government Header Pattern
export function GovernmentPattern() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, var(--primary-gold) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, var(--primary-gold) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      pointerEvents: 'none'
    }} />
  );
}

// Official Ashoka Chakra inspired design
export function AshokaChakra({ size = 24, color = 'var(--primary-gold)' }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontSize: size * 0.6
    }}>
      ⚙️
    </div>
  );
}

// Government Footer
export function GovernmentFooter({ t }) {
  return (
    <footer style={{
      background: 'var(--primary-green)',
      color: 'var(--text-white)',
      padding: 'var(--space-xl)',
      marginTop: 'var(--space-2xl)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <GovernmentPattern />
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-xl)',
        position: 'relative',
        zIndex: 2
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <StateEmblem />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>झारखंड सरकार</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Government of Jharkhand</p>
            </div>
          </div>
          <p style={{ opacity: 0.9, lineHeight: 1.6 }}>
            नागरिक समस्या प्रबंधन प्रणाली - आपकी आवाज, हमारी प्राथमिकता
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-gold)' }}>🔗 Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://jharkhand.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                🏛️ About Jharkhand
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://jharkhand.gov.in/scheme" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                📋 Government Schemes
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://cm.jharkhand.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                👤 Chief Minister
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="mailto:support@jharkhand.gov.in" 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                📧 Contact Support
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://jharkhandtenders.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                📄 Tenders & Procurement
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-gold)' }}>📞 Emergency Numbers</h4>
          <div style={{ fontSize: '1.1rem' }}>
            <div style={{ marginBottom: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚨</span> <strong>Emergency:</strong> <a href="tel:112" style={{ color: 'var(--primary-gold)', textDecoration: 'none' }}>112</a>
            </div>
            <div style={{ marginBottom: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚓</span> <strong>Police:</strong> <a href="tel:100" style={{ color: 'var(--primary-gold)', textDecoration: 'none' }}>100</a>
            </div>
            <div style={{ marginBottom: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚒</span> <strong>Fire:</strong> <a href="tel:101" style={{ color: 'var(--primary-gold)', textDecoration: 'none' }}>101</a>
            </div>
            <div style={{ marginBottom: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏥</span> <strong>Ambulance:</strong> <a href="tel:108" style={{ color: 'var(--primary-gold)', textDecoration: 'none' }}>108</a>
            </div>
          </div>
        </div>
        
        <div>
          <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--primary-gold)' }}>🌐 Resources</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://digitalindia.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                💻 Digital India
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://mygov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                🏛️ MyGov
              </a>
            </li>
            <li style={{ marginBottom: 'var(--space-xs)' }}>
              <a 
                href="https://services.india.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'none', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.9'}
              >
                ⚙️ Online Services
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.2)',
        marginTop: 'var(--space-xl)',
        paddingTop: 'var(--space-lg)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <p style={{ margin: 0, opacity: 0.9 }}>
          © 2024 Government of Jharkhand. All rights reserved. | 
          <span style={{ marginLeft: 'var(--space-xs)' }}>Version 1.0.0</span>
        </p>
      </div>
    </footer>
  );
}
// src/components/HamburgerMenu.js
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HamburgerMenu({ activeTab, onTabChange, tabs }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const hamburgerStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1001,
    background: 'var(--primary-green)',
    border: '2px solid var(--primary-gold)',
    borderRadius: '12px',
    width: '52px',
    height: '52px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 25px rgba(44, 85, 48, 0.4)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const lineStyle = (index) => ({
    width: '22px',
    height: '3px',
    background: 'white',
    margin: '2px 0',
    transition: 'all 0.3s ease',
    transformOrigin: 'center',
    borderRadius: '2px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    transform: isOpen 
      ? index === 0 ? 'rotate(45deg) translate(5px, 5px)'
      : index === 1 ? 'opacity(0)'
      : 'rotate(-45deg) translate(7px, -6px)'
      : 'none'
  });

  const menuStyle = {
    position: 'fixed',
    top: '80px',
    left: '20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '2px solid var(--border-light)',
    zIndex: 999,
    minWidth: '280px',
    padding: '16px',
    transform: isOpen ? 'translateX(0) scale(1)' : 'translateX(-20px) scale(0.95)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  };

  const menuItemStyle = (isActive) => ({
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: isActive 
      ? 'linear-gradient(135deg, var(--primary-green), var(--secondary-green))'
      : 'transparent',
    color: isActive ? 'white' : 'var(--text-primary)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    margin: '4px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
  });

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    zIndex: 998,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease'
  };

  const handleMenuItemClick = (tabId) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  // Only show on mobile/tablet
  const shouldShowMenu = window.innerWidth <= 1024;

  if (!shouldShowMenu) return null;

  return (
    <>
      {/* Hamburger Button */}
      <button
        style={hamburgerStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'var(--secondary-green)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'var(--primary-gold)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(44, 85, 48, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'var(--primary-green)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'var(--primary-gold)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(44, 85, 48, 0.4)';
          }
        }}
        aria-label="Menu"
      >
        <span style={lineStyle(0)}></span>
        <span style={lineStyle(1)}></span>
        <span style={lineStyle(2)}></span>
      </button>

      {/* Overlay */}
      <div 
        style={overlayStyle}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu */}
      <div style={menuStyle}>
        <div style={{
          marginBottom: '16px',
          padding: '0 4px'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {t('title')}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            {t('subtitle')}
          </p>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '12px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={menuItemStyle(activeTab === tab.id)}
              onClick={() => handleMenuItemClick(tab.id)}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'var(--light-green)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          marginTop: '12px',
          paddingTop: '12px'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            {t('quickStats') || 'Quick Stats'}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '11px'
          }}>
            <div style={{
              padding: '8px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: '700', color: 'var(--primary-green)' }}>
                📊 {/* This would be dynamic */}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {t('totalIssues')}
              </div>
            </div>
            <div style={{
              padding: '8px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: '700', color: 'var(--success)' }}>
                ✅ {/* This would be dynamic */}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {t('resolved')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
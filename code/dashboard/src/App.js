// src/App.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import IssueMap from './components/IssueMap';
import IssuePanel from './components/IssuePanel';
import StatsCards from './components/StatsCards';
import Analytics from './components/Analytics';
import AIInsights from './components/AIInsights';
import ResourceOptimizer from './components/ResourceOptimizer';
import { GovernmentFooter } from './components/GovernmentBranding';
import HamburgerMenu from './components/HamburgerMenu';
import GovernmentLoader from './components/GovernmentLoader';
import './App.css';

// Main Dashboard Component
function DashboardContent() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'issues'), snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <GovernmentLoader />;
  }

  const tabs = [
    { id: 'overview', label: t('overview'), icon: '🗺️' },
    { id: 'management', label: t('management'), icon: '📋' },
    { id: 'analytics', label: t('analytics'), icon: '📊' },
    { id: 'ai', label: t('aiInsights'), icon: '🤖' },
    { id: 'optimizer', label: t('resourceOptimizer'), icon: '⚙️' }
  ];

  return (
    <div className="App">
      {/* Hamburger Menu */}
      <HamburgerMenu 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      
      {/* Government Header */}
      <header className="gov-header">
        <div className="header-content">
          <div className="header-left">
            <div className="gov-logo">
              🏛️
            </div>
            <div className="header-text">
              <h1 className="header-title">{t('title')}</h1>
              <p className="header-subtitle">{t('subtitle')}</p>
            </div>
          </div>
          <div className="header-right">
            <LanguageSwitcher />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <StatsCards issues={issues} />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <div className="nav-tabs-container">
          {/* Back to Home Button */}
          <button
            className="nav-tab"
            onClick={() => setActiveTab('overview')}
            style={{
              backgroundColor: activeTab === 'overview' ? 'transparent' : 'var(--light-green)',
              border: '2px solid var(--primary-green)',
              color: 'var(--primary-green)',
              fontWeight: '600'
            }}
          >
            <span className="nav-tab-icon">🏠</span>
            {t('backToHome')}
          </button>
          
          {tabs.filter(tab => tab.id !== 'overview').map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <div 
            className="overview-mobile"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-xl)',
              height: '75vh'
            }}>
            {/* Map Card */}
            <div className="card" style={{ height: '100%' }}>
              <div className="card-header">
                <h2 className="card-title">
                  🗺️ {t('map')}
                </h2>
              </div>
              <div className="card-body" style={{ height: 'calc(100% - 80px)' }}>
                <IssueMap issues={issues} />
              </div>
            </div>
            
            {/* Recent Issues Card */}
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <h2 className="card-title">
                  📋 {t('recent')} ({issues.slice(0, 10).length})
                </h2>
              </div>
              <div className="card-body" style={{ 
                flex: '1',
                overflow: 'hidden',
                padding: '0'
              }}>
                <div style={{
                  height: '100%',
                  overflowY: 'auto',
                  padding: 'var(--space-lg)'
                }}>
                  <IssuePanel issues={issues.slice(0, 10)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                📋 {t('management')}
              </h2>
            </div>
            <div className="card-body">
              <IssuePanel issues={issues} />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <Analytics issues={issues} />}

        {activeTab === 'ai' && <AIInsights issues={issues} />}

        {activeTab === 'optimizer' && <ResourceOptimizer issues={issues} />}
      </main>

      {/* Government Footer */}
      <GovernmentFooter t={t} />
    </div>
  );
}

// App wrapper with Language Provider
function App() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}

export default App;

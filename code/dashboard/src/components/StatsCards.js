// src/components/StatsCards.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function StatsCards({ issues }) {
  const { t } = useLanguage();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const stats = {
    total: issues.length,
    todayReports: issues.filter(issue => {
      const createdAt = issue.createdAt?.toDate?.() || new Date(issue.createdAt);
      return createdAt >= todayStart;
    }).length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
    pending: issues.filter(issue => issue.status !== 'resolved').length,
    inProgress: issues.filter(issue => issue.status === 'in-progress').length,
    avgResponseTime: calculateAvgResponseTime(issues)
  };

  function calculateAvgResponseTime(issues) {
    const resolvedIssues = issues.filter(issue => 
      issue.status === 'resolved' && issue.updatedAt && issue.createdAt
    );
    
    if (resolvedIssues.length === 0) return 'N/A';
    
    const totalTime = resolvedIssues.reduce((sum, issue) => {
      const created = issue.createdAt?.toDate?.() || new Date(issue.createdAt);
      const resolved = issue.updatedAt?.toDate?.() || new Date(issue.updatedAt);
      return sum + (resolved - created);
    }, 0);
    
    const avgHours = Math.round((totalTime / resolvedIssues.length) / (1000 * 60 * 60));
    return `${avgHours}h`;
  }

  const statsData = [
    {
      title: t('totalIssues'),
      value: stats.total,
      icon: '📊',
      color: 'var(--primary-green)',
      bgColor: 'rgba(44, 85, 48, 0.1)'
    },
    {
      title: t('pendingIssues'),
      value: stats.pending,
      icon: '⏳',
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: t('inProgressIssues'),
      value: stats.inProgress,
      icon: '🔧',
      color: 'var(--info)',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      title: t('resolvedIssues'),
      value: stats.resolved,
      icon: '✅',
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: t('today'),
      value: stats.todayReports,
      icon: '📅',
      color: 'var(--primary-gold)',
      bgColor: 'rgba(218, 165, 32, 0.1)'
    }
  ];

  const cardStyle = (stat) => ({
    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}08)`,
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    border: `3px solid ${stat.color}40`,
    minHeight: '140px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    margin: '0',
    width: '100%'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  };

  const titleStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: '0',
    lineHeight: '1.4'
  };

  const valueStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0.5rem 0 0 0',
    lineHeight: '1',
    letterSpacing: '-0.02em'
  };

  const iconStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    flexShrink: '0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  const decorativeElement = (color) => ({
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '50px',
    height: '50px',
    background: `${color}15`,
    borderRadius: '50%',
    border: `2px solid ${color}40`,
    opacity: 0.6
  });

  return (
    <div style={gridStyle}>
      {statsData.map((stat, index) => (
        <div 
          key={index} 
          style={cardStyle(stat)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.borderColor = stat.color + '60';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.borderColor = stat.color + '40';
          }}
        >
          {/* Decorative background element */}
          <div style={decorativeElement(stat.color)}></div>
          
          <div style={headerStyle}>
            <div>
              <h3 style={titleStyle}>{stat.title}</h3>
              <p style={{
                ...valueStyle,
                color: stat.color
              }}>{stat.value}</p>
              
              {/* Progress bar for visual appeal */}
              <div style={{
                width: '100%',
                height: '4px',
                background: `${stat.color}20`,
                borderRadius: '2px',
                marginTop: '1rem',
                position: 'relative'
              }}>
                <div style={{
                  width: '70%',
                  height: '100%',
                  background: stat.color,
                  borderRadius: '2px',
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}></div>
              </div>
            </div>
            
            <div 
              style={{
                ...iconStyle,
                background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                color: 'white'
              }}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

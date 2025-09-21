// civic-dashboard/src/components/AIInsights.js
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AIInsights({ issues }) {
  const { t } = useLanguage();
  
  // Calculate AI-powered insights
  const insights = {
    totalProcessed: issues.filter(i => i.aiAnalysis).length,
    avgConfidence: issues.filter(i => i.aiAnalysis).reduce((sum, i) => sum + (i.aiAnalysis.confidence || 0), 0) / issues.filter(i => i.aiAnalysis).length || 0,
    topCategories: getTopCategories(issues),
    highImpactIssues: issues.filter(i => i.impactScore > 75).sort((a, b) => b.impactScore - a.impactScore),
    departmentWorkload: getDepartmentWorkload(issues),
    predictedHotspots: getPredictedHotspots(issues)
  };

  function getTopCategories(issues) {
    const categories = {};
    issues.forEach(issue => {
      const cat = issue.category || 'general';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  }

  function getDepartmentWorkload(issues) {
    const departments = {};
    issues.filter(i => i.status !== 'resolved').forEach(issue => {
      const dept = issue.department || 'general';
      departments[dept] = (departments[dept] || 0) + 1;
    });
    return Object.entries(departments).map(([name, count]) => ({ name, count }));
  }

  function getPredictedHotspots(issues) {
    // Simple clustering by proximity
    const hotspots = [];
    const processed = new Set();
    
    issues.forEach((issue, index) => {
      if (processed.has(index)) return;
      
      const nearby = issues.filter((other, otherIndex) => {
        if (index === otherIndex || processed.has(otherIndex)) return false;
        const distance = calculateDistance(issue.location, other.location);
        return distance < 1; // Within 1km
      });
      
      if (nearby.length >= 2) {
        hotspots.push({
          center: issue.location,
          count: nearby.length + 1,
          avgImpact: (nearby.reduce((sum, i) => sum + (i.impactScore || 0), 0) + (issue.impactScore || 0)) / (nearby.length + 1)
        });
        
        nearby.forEach((_, i) => processed.add(issues.indexOf(nearby[i])));
        processed.add(index);
      }
    });
    
    return hotspots.sort((a, b) => b.avgImpact - a.avgImpact).slice(0, 5);
  }

  function calculateDistance(pos1, pos2) {
    if (!pos1 || !pos2) return Infinity;
    const R = 6371; // Earth's radius in km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h2 className="card-title">
            🤖 {t('aiInsightsTitle')}
          </h2>
        </div>
      </div>
      
      <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
        
        {/* AI Processing Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 {t('analysis') || 'AI Analysis'}</h3>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{t('processedIssues') || 'Processed Issues'}:</span>
                <strong>{insights.totalProcessed}/{issues.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{t('avgConfidence') || 'Avg Confidence'}:</span>
                <strong>{Math.round(insights.avgConfidence * 100)}%</strong>
              </div>
            </div>
            
            <h4 style={{ marginBottom: '12px', color: 'var(--primary-green)' }}>
              📊 {t('topCategories') || 'Top Categories'}:
            </h4>
            {insights.topCategories.map(([cat, count]) => (
              <div key={cat} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 12px',
                margin: '4px 0',
                background: 'var(--bg-tertiary)',
                borderRadius: '6px'
              }}>
                <span style={{ textTransform: 'capitalize' }}>{t(cat) || cat}</span>
                <strong style={{ color: 'var(--primary-green)' }}>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* High Impact Issues */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚡ {t('highImpactIssues') || 'High Impact Issues'}</h3>
          </div>
          <div className="card-body">
            {insights.highImpactIssues.slice(0, 5).map(issue => (
              <div key={issue.id} style={{ 
                padding: '12px', 
                borderLeft: '4px solid var(--error)', 
                marginBottom: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: '0 8px 8px 0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {t(issue.category) || issue.category}
                  </strong>
                  <span style={{ 
                    background: 'var(--error)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {issue.impactScore}/100
                  </span>
                </div>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {issue.description.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Department Workload */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏢 {t('departmentWorkload') || 'Department Workload'}</h3>
          </div>
          <div className="card-body">
            {insights.departmentWorkload.map(dept => (
              <div key={dept.name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                margin: '6px 0',
                background: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ 
                  textTransform: 'capitalize',
                  color: 'var(--text-primary)'
                }}>
                  {dept.name.replace('_', ' ')}
                </span>
                <div style={{
                  background: 'var(--primary-green)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  {dept.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predicted Hotspots */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔥 {t('predictedHotspots') || 'Predicted Hotspots'}</h3>
          </div>
          <div className="card-body">
            {insights.predictedHotspots.length > 0 ? (
              insights.predictedHotspots.map((hotspot, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  borderLeft: '4px solid var(--warning)', 
                  marginBottom: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {t('hotspot') || 'Hotspot'} {index + 1}
                    </strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {hotspot.count} {t('issues') || 'issues'} | {t('average') || 'Avg'}: {Math.round(hotspot.avgImpact)}/100
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ 
                textAlign: 'center',
                color: 'var(--text-secondary)',
                padding: '20px'
              }}>
                📍 {t('noHotspots') || 'No hotspots found'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// civic-dashboard/src/components/ResourceOptimizer.js
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResourceOptimizer({ issues }) {
  const { t } = useLanguage();
  const [optimization, setOptimization] = useState(null);

  useEffect(() => {
    if (issues.length > 0) {
      const optimized = optimizeResources(issues);
      setOptimization(optimized);
    }
  }, [issues]);

  function optimizeResources(issues) {
    const pendingIssues = issues.filter(i => i.status !== 'resolved');
    
    // Group by department
    const departmentGroups = pendingIssues.reduce((groups, issue) => {
      const dept = issue.department || 'general';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(issue);
      return groups;
    }, {});

    // Calculate optimal routes for each department
    const departmentOptimization = Object.entries(departmentGroups).map(([dept, deptIssues]) => {
      // Sort by priority
      const sortedIssues = deptIssues.sort((a, b) => (b.priority || 50) - (a.priority || 50));
      
      // Calculate total estimated cost and time
      const totalCost = sortedIssues.reduce((sum, issue) => sum + (issue.estimatedCost || 5000), 0);
      const estimatedDays = Math.ceil(sortedIssues.length / 3); // Assume 3 issues per day
      
      // Group nearby issues for efficient routing
      const routes = createOptimalRoutes(sortedIssues);
      
      return {
        department: dept,
        totalIssues: sortedIssues.length,
        highPriorityIssues: sortedIssues.filter(i => (i.priority || 50) > 70).length,
        totalCost,
        estimatedDays,
        routes,
        efficiency: calculateEfficiency(sortedIssues)
      };
    });

    // Overall optimization suggestions
    const suggestions = generateOptimizationSuggestions(departmentOptimization, pendingIssues);

    return {
      departments: departmentOptimization,
      suggestions,
      totalPendingIssues: pendingIssues.length,
      totalEstimatedCost: departmentOptimization.reduce((sum, d) => sum + d.totalCost, 0),
      averageEfficiency: departmentOptimization.reduce((sum, d) => sum + d.efficiency, 0) / departmentOptimization.length
    };
  }

  function createOptimalRoutes(issues) {
    // Simple clustering by proximity
    const routes = [];
    const processed = new Set();

    issues.forEach((issue, index) => {
      if (processed.has(index)) return;

      const route = [issue];
      const nearby = issues.filter((other, otherIndex) => {
        if (index === otherIndex || processed.has(otherIndex)) return false;
        const distance = calculateDistance(issue.location, other.location);
        return distance < 2; // Within 2km
      });

      route.push(...nearby);
      routes.push({
        id: routes.length + 1,
        issues: route,
        estimatedTime: route.length * 2, // 2 hours per issue
        priority: route.reduce((sum, i) => sum + (i.priority || 50), 0) / route.length
      });

      nearby.forEach((_, i) => processed.add(issues.indexOf(nearby[i])));
      processed.add(index);
    });

    return routes.sort((a, b) => b.priority - a.priority);
  }

  function calculateDistance(pos1, pos2) {
    if (!pos1 || !pos2) return 100;
    const R = 6371;
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function calculateEfficiency(issues) {
    const highPriority = issues.filter(i => (i.priority || 50) > 70).length;
    return Math.min(100, (highPriority / issues.length) * 100 + 20);
  }

  function generateOptimizationSuggestions(departments, allIssues) {
    const suggestions = [];

    // Check for overloaded departments
    departments.forEach(dept => {
      if (dept.totalIssues > 10) {
        suggestions.push({
          type: 'warning',
          message: `${dept.department} has ${dept.totalIssues} pending issues. Consider allocating more resources.`,
          priority: 'high'
        });
      }
    });

    // Suggest cost-effective batching
    const totalHighPriority = allIssues.filter(i => (i.priority || 50) > 70).length;
    if (totalHighPriority > 5) {
      suggestions.push({
        type: 'optimization',
        message: `${totalHighPriority} high-priority issues detected. Batch processing could save 20% time.`,
        priority: 'medium'
      });
    }

    return suggestions;
  }

  if (!optimization) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>{t('resourceCalculating')}</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h2 className="card-title">
            🎯 {t('resourceOptimizerTitle')}
          </h2>
        </div>
      </div>
      
      {/* Overall Stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card resource-stats-card" style={{ 
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: '#ffffff',
          textAlign: 'center',
          border: '3px solid #3b82f6',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body">
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>
              {optimization.totalPendingIssues}
            </h3>
            <p style={{ margin: 0, opacity: 1, fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{t('pendingIssuesCount')}</p>
          </div>
        </div>
        
        <div className="card resource-stats-card" style={{ 
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#ffffff',
          textAlign: 'center',
          border: '3px solid #ef4444',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body">
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>
              ₹{(optimization.totalEstimatedCost / 1000).toFixed(0)}K
            </h3>
            <p style={{ margin: 0, opacity: 1, fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{t('estimatedCost')}</p>
          </div>
        </div>
        
        <div className="card resource-stats-card" style={{ 
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#ffffff',
          textAlign: 'center',
          border: '3px solid #10b981',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card-body">
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>
              {Math.round(optimization.averageEfficiency)}%
            </h3>
            <p style={{ margin: 0, opacity: 1, fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{t('efficiencyScore')}</p>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h3 className="card-title">💡 {t('optimizationSuggestions')}</h3>
        </div>
        <div className="card-body">
          {optimization.suggestions.length > 0 ? (
            optimization.suggestions.map((suggestion, index) => (
              <div key={index} style={{ 
                padding: '16px', 
                borderLeft: `4px solid ${suggestion.priority === 'high' ? 'var(--error)' : 'var(--warning)'}`,
                background: 'var(--bg-tertiary)',
                marginBottom: '12px',
                borderRadius: '0 8px 8px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>
                    {suggestion.type === 'warning' ? '⚠️' : '⚡'}
                  </span>
                  <div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>
                      {suggestion.priority === 'high' ? t('highPriority') : t('mediumPriority')}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {suggestion.message}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
              🎉 {t('noSpecialSuggestions')}
            </p>
          )}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
        {optimization.departments.map(dept => (
          <div key={dept.department} className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ textTransform: 'capitalize' }}>
                🏢 {dept.department.replace('_', ' ')}
              </h3>
            </div>
            <div className="card-body">
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ 
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--info)' }}>
                    {dept.totalIssues}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {t('totalIssuesCount')}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--error)' }}>
                    {dept.highPriorityIssues}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {t('highPriority')}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--warning)' }}>
                    ₹{(dept.totalCost / 1000).toFixed(0)}K
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {t('estimatedCost')}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--success)' }}>
                    {dept.estimatedDays} {t('days')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {t('completionTime')}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginBottom: '16px',
                padding: '12px',
                background: `linear-gradient(135deg, var(--success)15, var(--success)05)`,
                borderRadius: '8px',
                border: '1px solid var(--success)30'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {t('efficiencyScore')}
                  </span>
                  <span style={{ 
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--success)'
                  }}>
                    {Math.round(dept.efficiency)}%
                  </span>
                </div>
              </div>
              
              <h4 style={{ 
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: 'var(--primary-green)'
              }}>
                🛣️ {t('optimalRoutes')} ({dept.routes.length})
              </h4>
              
              {dept.routes.slice(0, 3).map(route => (
                <div key={route.id} style={{ 
                  fontSize: '12px',
                  background: 'var(--bg-tertiary)',
                  padding: '8px 12px',
                  marginBottom: '6px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>{t('route')} {route.id}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {route.issues.length} {t('issues')}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                    {route.estimatedTime} {t('hours')} | {t('priority')}: {Math.round(route.priority)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

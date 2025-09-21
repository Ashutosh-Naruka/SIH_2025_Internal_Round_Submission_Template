// civic-dashboard/src/components/IssuePanel.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import ImageModal from './ImageModal';

function IssuePanel({ issues }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [imageModal, setImageModal] = useState({ isOpen: false, issue: null });

  // Enhanced updateIssueStatus with notifications (Day 8)
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await updateDoc(doc(db, 'issues', issueId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Day 8 addition - Add notification
      const notification = {
        id: Date.now(),
        message: `Issue ${issueId.slice(-6)} updated to ${newStatus}`,
        type: 'success',
        timestamp: new Date()
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
      
    } catch (error) {
      // Day 8 addition - Error notification
      const notification = {
        id: Date.now(),
        message: `Error updating issue: ${error.message}`,
        type: 'error',
        timestamp: new Date()
      };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true;
    return issue.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'reported': '#3b82f6',
      'assigned': '#f59e0b', 
      'in-progress': '#f59e0b',
      'resolved': '#10b981',
      'closed': '#6b7280'
    };
    return colors[status] || '#3b82f6';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'reported': t('reported'),
      'assigned': t('assign'),
      'in-progress': t('inProgress'),
      'resolved': t('resolved'),
      'closed': t('closed')
    };
    return labels[status] || status;
  };

  return (
    <div>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{ 
          position: 'fixed', 
          top: '100px', 
          right: '20px', 
          zIndex: 1000,
          maxWidth: '350px'
        }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                background: notification.type === 'success' ? '#dcfce7' : '#fef2f2',
                color: notification.type === 'success' ? '#166534' : '#dc2626',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Filter Section */}
      <div style={{ 
        marginBottom: '24px',
        padding: '16px',
        background: 'var(--bg-primary)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)'
      }}>
        <label style={{ 
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)'
        }}>
          {t('filter')} {t('status')}
        </label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid var(--border-medium)',
            background: 'var(--bg-primary)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="all">{t('totalIssues')} ({issues.length})</option>
          <option value="reported">{t('reported')}</option>
          <option value="assigned">{t('assign')}</option>
          <option value="in-progress">{t('inProgress')}</option>
          <option value="resolved">{t('resolved')}</option>
        </select>
      </div>

      {/* Issues Grid */}
      <div style={{ 
        display: 'grid',
        gap: '20px',
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '4px' // for scrollbar
      }}>
        {filteredIssues.map(issue => (
          <div 
            key={issue.id} 
            className="card"
            style={{
              display: 'grid',
              gridTemplateColumns: issue.imageUrl ? '1fr 120px' : '1fr',
              gap: '20px',
              padding: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Issue Content */}
            <div>
              {/* Header with Category and Status */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h4 style={{ 
                  margin: '0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textTransform: 'capitalize'
                }}>
                  {t(issue.category) || issue.category}
                </h4>
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: getStatusColor(issue.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {getStatusLabel(issue.status)}
                </span>
              </div>

              {/* Description */}
              <p style={{ 
                margin: '0 0 12px 0',
                color: 'var(--text-primary)',
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {issue.description}
              </p>

              {/* Meta Information */}
              <div style={{ 
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <span>📍 {issue.reportedBy}</span>
                <span>📅 {issue.createdAt?.toDate?.()?.toLocaleDateString() || t('date')}</span>
                {issue.priority && (
                  <span>🔥 {t('priority')}: {issue.priority}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => updateIssueStatus(issue.id, 'assigned')}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--warning)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  👤 {t('assign')}
                </button>
                <button 
                  onClick={() => updateIssueStatus(issue.id, 'in-progress')}
                  className="btn btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--info)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⚡ {t('markInProgress')}
                </button>
                <button 
                  onClick={() => updateIssueStatus(issue.id, 'resolved')}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--success)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✅ {t('markResolved')}
                </button>
              </div>
            </div>

            {/* Issue Image */}
            {issue.imageUrl && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <img 
                  src={issue.imageUrl} 
                  alt={t('imageAlt')}
                  style={{ 
                    width: '120px', 
                    height: '90px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '2px solid var(--border-light)'
                  }}
                  onClick={() => setImageModal({ 
                    isOpen: true, 
                    issue: issue
                  })}
                />
                <button 
                  onClick={() => setImageModal({ 
                    isOpen: true, 
                    issue: issue
                  })}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    background: 'var(--primary-green)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-green)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--primary-green)';
                  }}
                >
                  🔍 {t('viewImage')}
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Empty State */}
        {filteredIssues.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
              No issues found
            </h3>
            <p style={{ margin: 0 }}>
              No issues match the selected filter.
            </p>
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        issue={imageModal.issue}
        onClose={() => setImageModal({ isOpen: false, issue: null })}
        onUpdateStatus={updateIssueStatus}
      />
    </div>
  );
}

export default IssuePanel;

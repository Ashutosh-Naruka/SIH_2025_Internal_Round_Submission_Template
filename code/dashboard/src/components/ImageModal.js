// src/components/ImageModal.js
import React from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ImageModal({ isOpen, issue, onClose, onUpdateStatus }) {
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!isOpen) return;
    
    // Save original scroll position
    const scrollY = window.scrollY;
    
    // Add body class for modal
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      
      // Remove body class and restore scroll
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  const updateIssueStatus = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'issues', issue.id), {
        status: newStatus,
        updatedAt: new Date()
      });
      if (onUpdateStatus) onUpdateStatus(issue.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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

  if (!isOpen || !issue) return null;

  const modalContent = (
    <div 
      className="modal-container"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="modal-content-inner"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '90vw',
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {issue.imageUrl ? (
            <img 
              src={issue.imageUrl} 
              alt="Issue Image"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              📷 No Image Available
            </div>
          )}
        </div>
        
        {/* Details Section */}
        <div style={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          {/* Issue Header */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                color: '#1f2937',
                textTransform: 'capitalize'
              }}>
                {t(issue.category) || issue.category}
              </h2>
              <span style={{
                backgroundColor: getStatusColor(issue.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {issue.status}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#374151' }}>Description</h3>
            <p style={{ margin: 0, lineHeight: '1.5', color: '#6b7280' }}>
              {issue.description}
            </p>
          </div>
          
          {/* Details */}
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <p style={{ margin: '4px 0' }}><strong>Reported by:</strong> {issue.reportedBy}</p>
            <p style={{ margin: '4px 0' }}><strong>Date:</strong> {issue.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</p>
            {issue.priority && (
              <p style={{ margin: '4px 0' }}><strong>Priority:</strong> {issue.priority}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: 'auto'
          }}>
            <button
              onClick={() => updateIssueStatus('assigned')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d97706';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f59e0b';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              👤 {t('assign')}
            </button>
            
            <button
              onClick={() => updateIssueStatus('in-progress')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ⚡ {t('markInProgress')}
            </button>
            
            <button
              onClick={() => updateIssueStatus('resolved')}
              style={{
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ✅ {t('markResolved')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

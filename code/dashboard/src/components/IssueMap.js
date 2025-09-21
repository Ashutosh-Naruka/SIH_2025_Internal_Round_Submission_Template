// src/components/IssueMap.js
import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from '../contexts/LanguageContext';
import ImageModal from './ImageModal';

export default function IssueMap({ issues }) {
  const { t } = useLanguage();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [imageModal, setImageModal] = useState({ isOpen: false, issue: null });
  
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
    <div style={{ width: '100%', height: '100vh' }}>
      <Map
        initialViewState={{
          longitude: 77.209,   // Default: Delhi, change if needed
          latitude: 28.6139,
          zoom: 10
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {issues.map((issue, idx) => (
          <Marker
            key={issue.id}
            longitude={issue.location?.longitude + idx * 0.00005} // slight shift per issue
            latitude={issue.location?.latitude + idx * 0.00005}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedIssue(issue);
            }}
          >
            <div style={{ fontSize: '24px', cursor: 'pointer' }}>📍</div>
          </Marker>
        ))}

        {selectedIssue && (
          <Popup
            longitude={selectedIssue.location?.longitude}
            latitude={selectedIssue.location?.latitude}
            anchor="top"
            onClose={() => setSelectedIssue(null)}
            closeOnClick={false}
            className="custom-popup"
          >
            <div style={{ 
              minWidth: '280px',
              maxWidth: '320px',
              fontFamily: 'Inter, sans-serif',
              maxHeight: '450px',
              overflowY: 'auto',
              position: 'relative',
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '2px solid var(--border-light)'
              }}>
                <div>
                  <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {t(selectedIssue.category) || selectedIssue.category}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: getStatusColor(selectedIssue.status),
                    color: 'white'
                  }}>
                    {getStatusLabel(selectedIssue.status)}
                  </span>
                </div>
                
                {selectedIssue.priority && (
                  <div style={{
                    padding: '4px 6px',
                    background: 'var(--warning)',
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    🔥 {selectedIssue.priority}
                  </div>
                )}
              </div>

              {/* Description */}
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                lineHeight: '1.4',
                color: 'var(--text-primary)'
              }}>
                {selectedIssue.description}
              </p>

              {/* Image */}
              {selectedIssue.imageUrl && (
                <div style={{
                  marginBottom: '12px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid var(--border-light)',
                  position: 'relative',
                  maxWidth: '100%',
                  backgroundColor: 'var(--bg-tertiary)'
                }}>
                  <img
                    src={
                      selectedIssue.imageUrl.startsWith("data:image")
                        ? selectedIssue.imageUrl
                        : `data:image/jpeg;base64,${selectedIssue.imageUrl}`
                    }
                    alt={t('imageAlt')}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      display: 'block'
                    }}
                    onClick={() => {
                      setImageModal({
                        isOpen: true,
                        issue: selectedIssue
                      });
                      // Close the map popup when modal opens
                      setSelectedIssue(null);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary); font-size: 12px;">${t('noImage')}</div>`;
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    🖼️ {t('viewImage')}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                padding: '8px',
                background: 'var(--bg-tertiary)',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                    📍 {t('reportedBy')}
                  </div>
                  <div>{selectedIssue.reportedBy}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                    📅 {t('date')}
                  </div>
                  <div>
                    {selectedIssue.createdAt?.toDate
                      ? selectedIssue.createdAt.toDate().toLocaleDateString()
                      : new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        issue={imageModal.issue}
        onClose={() => setImageModal({ isOpen: false, issue: null })}
      />
    </div>
  );
}

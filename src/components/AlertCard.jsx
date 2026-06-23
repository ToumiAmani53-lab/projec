import React from 'react';
import './AlertCard.css';

const SEVERITY_CONFIG = {
  urgent: { color: 'var(--color-urgent)', label: 'Urgent' },
  attention: { color: 'var(--color-warn)', label: 'Attention' },
  info: { color: 'var(--color-info)', label: 'Info' },
};

const AlertCard = ({ alert, onMarkRead, onDelete }) => {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;

  return (
    <div className={`alert-card ${alert.isRead ? 'is-read' : ''}`} style={{ '--accent': config.color }}>
      <div className="alert-pin" />
      <div className="alert-card-top">
        <span className="alert-severity-tag">{config.label}</span>
        {alert.farm && <span className="alert-farm-tag">{alert.farm.name}</span>}
      </div>
      <p className="alert-message">{alert.message}</p>
      <div className="alert-card-bottom">
        <span className="alert-date">
          {new Date(alert.createdAt).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <div className="alert-actions">
          {!alert.isRead && (
            <button className="alert-action-btn" onClick={() => onMarkRead(alert._id)}>
              Marquer lu
            </button>
          )}
          <button className="alert-action-btn alert-action-delete" onClick={() => onDelete(alert._id)}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;

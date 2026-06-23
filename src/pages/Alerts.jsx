import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AlertCard from '../components/AlertCard.jsx';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/alerts');
      setAlerts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleMarkRead = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/read`);
      setAlerts((prev) => prev.map((a) => (a._id === alertId ? { ...a, isRead: true } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (alertId) => {
    try {
      await api.delete(`/alerts/${alertId}`);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !a.isRead;
    return a.severity === filter;
  });

  return (
    <div className="alerts-page">
      <h1 className="dash-title">Alertes</h1>
      <p className="dash-subtitle">Anomalies météo et échéances de récolte détectées sur vos parcelles.</p>

      <div className="alerts-filters">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'unread', label: 'Non lues' },
          { key: 'urgent', label: 'Urgentes' },
          { key: 'attention', label: 'Attention' },
          { key: 'info', label: 'Info' },
        ].map((f) => (
          <button
            key={f.key}
            className={`alert-filter-btn ${filter === f.key ? 'is-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="dash-loading">Chargement des alertes…</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
            <path
              d="M24 8a10 10 0 0 0-10 10v7l-4 7h28l-4-7v-7A10 10 0 0 0 24 8ZM19 38a5 5 0 0 0 10 0"
              stroke="var(--color-line)"
              strokeWidth="1.8"
            />
          </svg>
          <h3>Aucune alerte</h3>
          <p>Tout est calme sur vos parcelles pour le moment.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {filtered.map((alert) => (
            <AlertCard key={alert._id} alert={alert} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;

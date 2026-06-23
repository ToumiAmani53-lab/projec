import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import WeatherPanel from '../components/WeatherPanel.jsx';
import './FarmDetail.css';

const FarmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const farmRes = await api.get(`/farms/${id}`);
      setFarm(farmRes.data.data);

      try {
        const weatherRes = await api.get(`/weather/farm/${id}`);
        setWeather(weatherRes.data.data.weather);
      } catch (weatherErr) {
        setError(weatherErr.response?.data?.message || 'Météo indisponible pour le moment.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Parcelle introuvable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer définitivement cette parcelle ?')) return;
    setDeleting(true);
    try {
      await api.delete(`/farms/${id}`);
      navigate('/app');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="dash-loading">Chargement…</p>;
  if (!farm) return <p className="dash-loading">Parcelle introuvable.</p>;

  const daysToHarvest = farm.expectedHarvestDate
    ? Math.ceil((new Date(farm.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="farm-detail">
      <button className="back-link" onClick={() => navigate('/app')}>
        ← Retour au tableau de bord
      </button>

      <div className="farm-detail-header">
        <div>
          <h1 className="farm-detail-title">{farm.name}</h1>
          <p className="farm-detail-meta">
            {farm.cropType} · {farm.areaHectares} ha · {farm.location.address || `${farm.location.latitude.toFixed(3)}, ${farm.location.longitude.toFixed(3)}`}
          </p>
        </div>
        <button className="btn-delete-farm" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Suppression…' : 'Supprimer la parcelle'}
        </button>
      </div>

      {daysToHarvest !== null && (
        <div className={`harvest-banner ${daysToHarvest <= 5 ? 'is-near' : ''}`}>
          <span className="harvest-icon">🌾</span>
          <div>
            <strong>
              {daysToHarvest > 0
                ? `Récolte estimée dans ${daysToHarvest} jour(s)`
                : daysToHarvest === 0
                ? 'Récolte estimée aujourd\'hui'
                : `Récolte dépassée depuis ${Math.abs(daysToHarvest)} jour(s)`}
            </strong>
            <span>Date prévue : {new Date(farm.expectedHarvestDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      {weather && (
        <div className="weather-section">
          <h2 className="section-title">Météo et prévisions sur 7 jours</h2>
          <WeatherPanel weather={weather} />
        </div>
      )}

      {farm.notes && (
        <div className="farm-notes">
          <h2 className="section-title">Notes</h2>
          <p>{farm.notes}</p>
        </div>
      )}
    </div>
  );
};

export default FarmDetail;

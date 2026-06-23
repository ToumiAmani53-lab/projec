import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    cropType: '',
    plantingDate: '',
    areaHectares: 1,
    address: '',
  });
  const [position, setPosition] = useState({ lat: 36.8065, lng: 10.1815 });

  const loadFarms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/farms');
      setFarms(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await api.post('/farms', {
        name: form.name,
        cropType: form.cropType,
        plantingDate: form.plantingDate,
        areaHectares: form.areaHectares,
        address: form.address,
        latitude: position.lat,
        longitude: position.lng,
      });
      setShowForm(false);
      setForm({ name: '', cropType: '', plantingDate: '', areaHectares: 1, address: '' });
      loadFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de la parcelle');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dash">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Bonjour, {user?.name?.split(' ')[0]}</h1>
          <p className="dash-subtitle">Vos parcelles, leur météo et leurs récoltes, en un coup d'œil.</p>
        </div>
        <button className="btn-add-farm" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Annuler' : '+ Ajouter une parcelle'}
        </button>
      </div>

      {showForm && (
        <div className="new-farm-card">
          <h2 className="new-farm-title">Nouvelle parcelle</h2>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="new-farm-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Nom de la parcelle</label>
                  <input
                    className="form-input"
                    placeholder="ex : Parcelle Nord"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type de culture</label>
                  <input
                    className="form-input"
                    placeholder="ex : Blé, Tomate, Olivier..."
                    value={form.cropType}
                    onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de plantation</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.plantingDate}
                    onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Surface (hectares)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-input"
                    value={form.areaHectares}
                    onChange={(e) => setForm({ ...form, areaHectares: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse / repère (optionnel)</label>
                  <input
                    className="form-input"
                    placeholder="ex : Région de Béja"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Position sur la carte</label>
                <p className="map-hint">Cliquez sur la carte à l'emplacement de votre parcelle.</p>
                <LocationPicker onChange={setPosition} height={260} />
                <p className="coords-display">
                  📍 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={creating} style={{ marginTop: '16px' }}>
              {creating ? 'Création…' : 'Créer la parcelle'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="dash-loading">Chargement de vos parcelles…</p>
      ) : farms.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 48 48" width="56" height="56" fill="none">
            <path d="M8 40h32M12 40V20l8-8 8 8v20M28 40V14l8-8 8 8v26" stroke="var(--color-line)" strokeWidth="1.8" />
          </svg>
          <h3>Aucune parcelle pour le moment</h3>
          <p>Ajoutez votre première parcelle pour commencer à suivre sa météo et ses alertes.</p>
        </div>
      ) : (
        <div className="farms-grid">
          {farms.map((farm) => (
            <div key={farm._id} className="farm-card" onClick={() => navigate(`/app/parcelle/${farm._id}`)}>
              <div className="farm-card-top">
                <h3>{farm.name}</h3>
                <span className="farm-crop-tag">{farm.cropType}</span>
              </div>
              <p className="farm-address">{farm.location.address || `${farm.location.latitude.toFixed(3)}, ${farm.location.longitude.toFixed(3)}`}</p>
              <div className="farm-card-bottom">
                <span>🌱 Planté le {new Date(farm.plantingDate).toLocaleDateString('fr-FR')}</span>
                {farm.expectedHarvestDate && (
                  <span>🌾 Récolte ~ {new Date(farm.expectedHarvestDate).toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

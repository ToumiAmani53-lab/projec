import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Experts.css';

const Experts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/experts');
        setExperts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleContact = (expertId) => {
    navigate(`/app/messages/${expertId}`);
  };

  const filtered = experts.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="experts-page">
      <h1 className="dash-title">Nos experts</h1>
      <p className="dash-subtitle">Agronomes disponibles pour répondre à vos questions.</p>

      <input
        className="form-input experts-search"
        placeholder="Rechercher par nom ou spécialité…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="dash-loading">Chargement des experts…</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Aucun expert trouvé</h3>
          <p>Revenez plus tard, de nouveaux experts rejoignent régulièrement la plateforme.</p>
        </div>
      ) : (
        <div className="experts-grid">
          {filtered.map((expert) => (
            <div key={expert._id} className="expert-card">
              <div className="expert-avatar">{expert.name.charAt(0).toUpperCase()}</div>
              <h3>{expert.name}</h3>
              {expert.specialty && <span className="expert-specialty-tag">{expert.specialty}</span>}
              {expert.bio && <p className="expert-bio">{expert.bio}</p>}
              {user?.role === 'agriculteur' && (
                <button className="btn-add-farm expert-contact-btn" onClick={() => handleContact(expert._id)}>
                  Contacter
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experts;

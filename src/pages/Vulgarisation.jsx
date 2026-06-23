import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Vulgarisation.css';

const CATEGORIES = [
  { key: 'all', label: 'Tous' },
  { key: 'irrigation', label: 'Irrigation' },
  { key: 'maladies', label: 'Maladies' },
  { key: 'fertilisation', label: 'Fertilisation' },
  { key: 'climat', label: 'Climat' },
  { key: 'recolte', label: 'Récolte' },
  { key: 'general', label: 'Général' },
];

const Vulgarisation = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const loadArticles = async (cat) => {
    setLoading(true);
    try {
      const params = cat && cat !== 'all' ? { category: cat } : {};
      const { data } = await api.get('/articles', { params });
      setArticles(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(category);
  }, [category]);

  return (
    <div className="vulg-page">
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Vulgarisation</h1>
          <p className="dash-subtitle">Conseils pratiques rédigés par nos experts agronomes.</p>
        </div>
        {user?.role === 'expert' && (
          <Link to="/app/vulgarisation/nouveau" className="btn-add-farm">
            + Nouvel article
          </Link>
        )}
      </div>

      <div className="alerts-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`alert-filter-btn ${category === c.key ? 'is-active' : ''}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="dash-loading">Chargement des articles…</p>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <h3>Aucun article pour cette catégorie</h3>
          <p>Revenez bientôt, nos experts publient régulièrement.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map((article) => (
            <Link to={`/app/vulgarisation/${article._id}`} key={article._id} className="article-card">
              <span className="article-category-tag">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.content.slice(0, 120)}{article.content.length > 120 ? '…' : ''}</p>
              <div className="article-card-footer">
                <span>Par {article.author?.name}</span>
                <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vulgarisation;

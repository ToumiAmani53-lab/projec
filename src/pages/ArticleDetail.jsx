import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Vulgarisation.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/articles/${id}`);
        setArticle(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await api.delete(`/articles/${id}`);
      navigate('/app/vulgarisation');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) return <p className="dash-loading">Chargement…</p>;
  if (!article) return <p className="dash-loading">Article introuvable.</p>;

  const isAuthor = user?._id === article.author?._id;

  return (
    <div className="article-detail">
      <button className="back-link" onClick={() => navigate('/app/vulgarisation')}>
        ← Retour à la vulgarisation
      </button>

      <div className="article-detail-header">
        <span className="article-category-tag">{article.category}</span>
        <h1 className="article-detail-title">{article.title}</h1>
        <div className="article-detail-meta">
          <span className="article-detail-author">{article.author?.name}</span>
          {article.author?.specialty && <span>· {article.author.specialty}</span>}
          <span>· {new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      <p className="article-detail-content">{article.content}</p>

      {article.cropTags?.length > 0 && (
        <div className="article-detail-tags">
          {article.cropTags.map((tag) => (
            <span key={tag} className="article-tag">{tag}</span>
          ))}
        </div>
      )}

      {isAuthor && (
        <button className="btn-delete-farm" style={{ marginTop: '24px' }} onClick={handleDelete}>
          Supprimer l'article
        </button>
      )}
    </div>
  );
};

export default ArticleDetail;

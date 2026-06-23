import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Vulgarisation.css';

const CATEGORY_OPTIONS = ['general', 'irrigation', 'maladies', 'fertilisation', 'climat', 'recolte'];

const ArticleEditor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'general',
    cropTags: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        cropTags: form.cropTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const { data } = await api.post('/articles', payload);
      navigate(`/app/vulgarisation/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication. Vérifiez que vous êtes bien connecté en tant qu'expert.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="article-detail">
      <button className="back-link" onClick={() => navigate('/app/vulgarisation')}>
        ← Annuler
      </button>

      <div className="editor-card">
        <h1 className="article-detail-title" style={{ fontSize: '24px' }}>Nouvel article</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="ex : Bien gérer l'irrigation en période de canicule"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cultures concernées (séparées par des virgules)</label>
            <input
              className="form-input"
              value={form.cropTags}
              onChange={(e) => setForm({ ...form, cropTags: e.target.value })}
              placeholder="ex : Tomate, Blé, Olivier"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contenu</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: 240 }}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Rédigez votre conseil ici…"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Publication…' : "Publier l'article"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;

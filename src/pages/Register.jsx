import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agriculteur',
    phone: '',
    specialty: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || t('auth_register_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-lang-row">
        <LanguageSwitcher variant="light" />
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
            <path d="M16 4c4 4 8 8 8 14a8 8 0 1 1-16 0c0-6 4-10 8-14Z" fill="var(--color-green-deep)" />
            <path d="M16 11v15" stroke="var(--color-wheat)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="auth-brand-name">SoundFarm</span>
        </div>

        <h1 className="auth-title">{t('auth_register_title')}</h1>
        <p className="auth-subtitle">{t('auth_register_subtitle')}</p>

        {error && <div className="form-error">{error}</div>}

        <div className="role-toggle">
          <button
            type="button"
            className={`role-toggle-btn ${form.role === 'agriculteur' ? 'is-active' : ''}`}
            onClick={() => setForm({ ...form, role: 'agriculteur' })}
          >
            🌾 {t('auth_role_farmer')}
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${form.role === 'expert' ? 'is-active' : ''}`}
            onClick={() => setForm({ ...form, role: 'expert' })}
          >
            🎓 {t('auth_role_expert')}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">{t('auth_name')}</label>
            <input
              id="name"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">{t('auth_email')}</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('auth_password')}</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder={t('auth_password_min')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">{t('auth_phone')}</label>
            <input
              id="phone"
              className="form-input"
              placeholder="+216 ..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {form.role === 'expert' && (
            <div className="form-group">
              <label className="form-label" htmlFor="specialty">{t('auth_specialty')}</label>
              <input
                id="specialty"
                className="form-input"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth_register_loading') : t('auth_register_btn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth_has_account')} <Link to="/connexion">{t('nav_login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

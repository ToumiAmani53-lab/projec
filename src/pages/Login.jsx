import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || t('auth_login_error'));
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

        <h1 className="auth-title">{t('auth_login_title')}</h1>
        <p className="auth-subtitle">{t('auth_login_subtitle')}</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth_login_loading') : t('auth_login_btn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('auth_no_account')} <Link to="/inscription">{t('nav_signup')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

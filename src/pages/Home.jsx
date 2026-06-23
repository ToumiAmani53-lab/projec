import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Démo front-end uniquement : pas d'endpoint de contact dédié côté backend pour le moment.
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="home-page">
      {/* ===== NAVBAR ===== */}
      <header className="home-navbar">
        <div className="home-navbar-inner">
          <div className="home-brand">
            <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
              <path d="M16 4c4 4 8 8 8 14a8 8 0 1 1-16 0c0-6 4-10 8-14Z" fill="var(--color-green-deep)" />
              <path d="M16 11v15" stroke="var(--color-wheat)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>SoundFarm</span>
          </div>

          <nav className={`home-nav-links ${mobileMenuOpen ? 'is-open' : ''}`}>
            <a href="#hero" onClick={() => setMobileMenuOpen(false)}>{t('nav_home')}</a>
            <a href="#apropos" onClick={() => setMobileMenuOpen(false)}>{t('nav_about')}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>{t('nav_contact')}</a>
            <Link to="/connexion" className="home-nav-login" onClick={() => setMobileMenuOpen(false)}>
              {t('nav_login')}
            </Link>
            <Link to="/inscription" className="home-nav-cta" onClick={() => setMobileMenuOpen(false)}>
              {t('nav_signup')}
            </Link>
            <LanguageSwitcher variant="light" />
          </nav>

          <button
            className="home-menu-toggle"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
              <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">{t('hero_tag')}</span>
          <h1 className="hero-title">
            {t('hero_title_1')}<br />{t('hero_title_2')}
          </h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
          <div className="hero-actions">
            <Link to="/inscription" className="hero-btn-primary">{t('hero_cta_primary')}</Link>
            <a href="#apropos" className="hero-btn-secondary">{t('hero_cta_secondary')}</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card hero-card-weather">
            <span className="hero-card-label">{t('hero_weather_location')}</span>
            <div className="hero-card-temp">27°</div>
            <span className="hero-card-condition">{t('hero_weather_condition')}</span>
          </div>
          <div className="hero-card hero-card-alert">
            <span className="alert-pin-static" />
            <strong>{t('hero_alert_title')}</strong>
            <span>{t('hero_alert_subtitle')}</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="feature-item">
          <span className="feature-icon">🌦️</span>
          <h3>{t('feature_weather_title')}</h3>
          <p>{t('feature_weather_desc')}</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔔</span>
          <h3>{t('feature_alerts_title')}</h3>
          <p>{t('feature_alerts_desc')}</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💬</span>
          <h3>{t('feature_experts_title')}</h3>
          <p>{t('feature_experts_desc')}</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🤖</span>
          <h3>{t('feature_ai_title')}</h3>
          <p>{t('feature_ai_desc')}</p>
        </div>
      </section>

      {/* ===== À PROPOS ===== */}
      <section id="apropos" className="about-section">
        <div className="about-text">
          <span className="hero-tag">{t('about_tag')}</span>
          <h2 className="section-h2">{t('about_title')}</h2>
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
        </div>
        <div className="about-stats">
          <div className="about-stat">
            <strong>{t('about_stat1')}</strong>
            <span>{t('about_stat1_label')}</span>
          </div>
          <div className="about-stat">
            <strong>{t('about_stat2')}</strong>
            <span>{t('about_stat2_label')}</span>
          </div>
          <div className="about-stat">
            <strong>{t('about_stat3')}</strong>
            <span>{t('about_stat3_label')}</span>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="contact-section">
        <div className="contact-info">
          <span className="hero-tag">{t('contact_tag')}</span>
          <h2 className="section-h2">{t('contact_title')}</h2>
          <p>{t('contact_subtitle')}</p>
          <div className="contact-detail">
            <strong>{t('contact_email_label')}</strong>
            <span>contact@soundfarm.app</span>
          </div>
          <div className="contact-detail">
            <strong>{t('contact_phone_label')}</strong>
            <span>+216 00 000 000</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleContactSubmit}>
          {contactSent && (
            <div className="contact-success">{t('contact_form_success')}</div>
          )}
          <div className="form-group">
            <label className="form-label">{t('contact_form_name')}</label>
            <input
              className="form-input"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact_form_email')}</label>
            <input
              type="email"
              className="form-input"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact_form_message')}</label>
            <textarea
              className="form-textarea"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary">{t('contact_form_submit')}</button>
        </form>
      </section>

      <footer className="home-footer">
        <span>© {new Date().getFullYear()} SoundFarm. {t('footer_rights')}</span>
      </footer>
    </div>
  );
};

export default Home;

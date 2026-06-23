import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import './LanguageSwitcher.css';

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'تونسي' },
];

const LanguageSwitcher = ({ variant = 'light' }) => {
  const { lang, changeLang } = useLanguage();

  return (
    <div className={`lang-switcher lang-switcher-${variant}`}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-switcher-btn ${lang === l.code ? 'is-active' : ''}`}
          onClick={() => changeLang(l.code)}
          aria-label={l.label}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

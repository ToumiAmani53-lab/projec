import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import './Layout.css';

const navItems = [
  { to: '/app', labelKey: 'side_dashboard', icon: 'field' },
  { to: '/app/alertes', labelKey: 'side_alerts', icon: 'bell' },
  { to: '/app/chat', labelKey: 'side_chat', icon: 'chat' },
  { to: '/app/vulgarisation', labelKey: 'side_vulg', icon: 'book' },
  { to: '/app/experts', labelKey: 'side_experts', icon: 'experts' },
  { to: '/app/messages', labelKey: 'side_messages', icon: 'messages' },
];

const Icon = ({ name }) => {
  const icons = {
    field: (
      <path d="M3 20h18M5 20V10l3-3 3 3v10M13 20V7l3-3 3 3v13" strokeWidth="1.6" strokeLinecap="round" />
    ),
    bell: (
      <path
        d="M12 4a5 5 0 0 0-5 5v3.5L5 16h14l-2-3.5V9a5 5 0 0 0-5-5ZM9.5 19a2.5 2.5 0 0 0 5 0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    chat: (
      <path
        d="M4 5h16v10H9l-4 4v-4H4Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    book: (
      <path
        d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5ZM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    experts: (
      <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="7" r="2.2" />
        <path d="M15.5 13.3c2.5.4 4.5 2.6 4.5 5.7" />
      </g>
    ),
    messages: (
      <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v10H9l-4 4v-4H4Z" />
        <path d="M8 9h8M8 12h5" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
      {icons[name]}
    </svg>
  );
};

const Layout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="sf-shell">
      <aside className={`sf-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="sf-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
            <path
              d="M16 4c4 4 8 8 8 14a8 8 0 1 1-16 0c0-6 4-10 8-14Z"
              fill="var(--color-green-deep)"
            />
            <path d="M16 11v15" stroke="var(--color-wheat)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="sf-brand-name">SoundFarm</span>
        </div>

        <nav className="sf-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) => `sf-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sf-lang-row">
          <LanguageSwitcher variant="dark" />
        </div>

        <div className="sf-user-card">
          <div className="sf-user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <div className="sf-user-info">
            <strong>{user?.name}</strong>
            <span className="sf-role-tag">
              {user?.role === 'expert' ? t('auth_role_expert') : t('auth_role_farmer')}
            </span>
          </div>
        </div>
        <button className="sf-logout-btn" onClick={handleLogout}>
          {t('side_logout')}
        </button>
      </aside>

      <button className="sf-menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
          <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <main className="sf-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

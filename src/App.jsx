import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext.jsx';

import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FarmDetail from './pages/FarmDetail.jsx';
import Alerts from './pages/Alerts.jsx';
import Chat from './pages/Chat.jsx';
import Vulgarisation from './pages/Vulgarisation.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import ArticleEditor from './pages/ArticleEditor.jsx';
import Experts from './pages/Experts.jsx';
import Messages from './pages/Messages.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/connexion" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ===== Vitrine publique ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/connexion" element={user ? <Navigate to="/app" replace /> : <Login />} />
      <Route path="/inscription" element={user ? <Navigate to="/app" replace /> : <Register />} />

      {/* ===== Application connectée ===== */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="parcelle/:id" element={<FarmDetail />} />
        <Route path="alertes" element={<Alerts />} />
        <Route path="chat" element={<Chat />} />
        <Route path="vulgarisation" element={<Vulgarisation />} />
        <Route path="vulgarisation/nouveau" element={<ArticleEditor />} />
        <Route path="vulgarisation/:id" element={<ArticleDetail />} />
        <Route path="experts" element={<Experts />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<Messages />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <LanguageProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </LanguageProvider>
);

export default App;

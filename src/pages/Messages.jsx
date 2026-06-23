import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    setLoadingConvos(true);
    try {
      const { data } = await api.get('/messages/conversations');
      setConversations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvos(false);
    }
  };

  const loadThread = async (otherUserId) => {
    setLoadingMessages(true);
    setError('');
    try {
      const { data } = await api.get(`/messages/${otherUserId}`);
      setMessages(data.data);

      // Détermine les infos de l'interlocuteur depuis le 1er message, ou depuis la liste de conversations
      if (data.data.length > 0) {
        const first = data.data[0];
        const other = first.sender._id === otherUserId ? first.sender : null;
        if (other) setActiveUser(other);
      }
      const convo = conversations.find((c) => c.otherUser._id === otherUserId);
      if (convo) setActiveUser(convo.otherUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger cette conversation.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadThread(userId);
    } else {
      setActiveUser(null);
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    setSending(true);
    setError('');
    try {
      const { data } = await api.post('/messages', { recipientId: userId, content: input.trim() });
      setMessages((prev) => [...prev, data.data]);
      setInput('');
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || "Le message n'a pas pu être envoyé.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="messages-page">
      <aside className="conversations-list">
        <h2 className="conversations-title">Conversations</h2>
        {loadingConvos ? (
          <p className="dash-loading">Chargement…</p>
        ) : conversations.length === 0 ? (
          <p className="conversations-empty">
            Aucune conversation pour le moment.{' '}
            {user?.role === 'agriculteur' && (
              <span className="conversations-link" onClick={() => navigate('/app/experts')}>
                Contactez un expert
              </span>
            )}
          </p>
        ) : (
          conversations.map((c) => (
            <button
              key={c.conversationId}
              className={`conversation-item ${userId === c.otherUser._id ? 'is-active' : ''}`}
              onClick={() => navigate(`/app/messages/${c.otherUser._id}`)}
            >
              <div className="conversation-avatar">{c.otherUser.name.charAt(0).toUpperCase()}</div>
              <div className="conversation-info">
                <strong>{c.otherUser.name}</strong>
                <span>{c.lastMessage}</span>
              </div>
              {c.unreadCount > 0 && <span className="conversation-badge">{c.unreadCount}</span>}
            </button>
          ))
        )}
      </aside>

      <section className="thread-panel">
        {!userId ? (
          <div className="thread-empty">
            <p>Sélectionnez une conversation pour commencer à discuter.</p>
          </div>
        ) : (
          <>
            <div className="thread-header">
              <div className="conversation-avatar">{(activeUser?.name || '?').charAt(0).toUpperCase()}</div>
              <div>
                <strong>{activeUser?.name || 'Conversation'}</strong>
                {activeUser?.specialty && <span className="thread-specialty">{activeUser.specialty}</span>}
              </div>
            </div>

            <div className="thread-messages">
              {loadingMessages ? (
                <p className="dash-loading">Chargement des messages…</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m._id}
                    className={`thread-bubble ${m.sender._id === user._id ? 'thread-bubble-self' : 'thread-bubble-other'}`}
                  >
                    {m.content}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {error && <div className="form-error">{error}</div>}

            <form className="thread-input-row" onSubmit={handleSend}>
              <input
                className="form-input"
                placeholder="Écrivez votre message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
              />
              <button type="submit" className="chat-send-btn" disabled={sending || !input.trim()}>
                Envoyer
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default Messages;

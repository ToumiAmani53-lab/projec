import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import './Chat.css';

const SUGGESTIONS = [
  "Quand dois-je arroser mes tomates cette semaine ?",
  "Comment reconnaître un stress hydrique sur le blé ?",
  "Que faire en cas de risque de gel annoncé ?",
  "Quels sont les signes d'une maladie fongique ?",
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/chat/history');
      setMessages(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setError('');
    setInput('');

    // Affichage optimiste du message utilisateur
    const tempUserMsg = { _id: `temp-${Date.now()}`, role: 'user', content, createdAt: new Date() };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: content });
      setMessages((prev) => [...prev, data.data]);
    } catch (err) {
      setError(err.response?.data?.message || "L'assistant IA n'a pas pu répondre. Vérifiez la clé OpenAI côté serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1 className="dash-title">Assistant IA</h1>
        <p className="dash-subtitle">Posez vos questions agricoles, obtenez une réponse rapide.</p>
      </div>

      <div className="chat-window">
        {loadingHistory ? (
          <p className="dash-loading">Chargement de la conversation…</p>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>Commencez par une question, ou essayez l'une de ces suggestions :</p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chat-suggestion-btn" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m._id} className={`chat-bubble chat-bubble-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-assistant chat-bubble-loading">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          className="form-input chat-input"
          placeholder="Écrivez votre question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Chat;

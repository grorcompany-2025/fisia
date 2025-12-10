import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Settings, Trash2, MessageSquare, Key } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('claude_api_key') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('claude_api_key'));
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet-20241022');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveApiKey = () => {
    localStorage.setItem('claude_api_key', apiKey);
    setShowSettings(false);
  };

  const clearChat = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el chat?')) {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      alert('Por favor, configura tu API Key primero');
      setShowSettings(true);
      return;
    }

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        messages: newMessages,
        apiKey: apiKey,
        model: selectedModel,
        maxTokens: 4096
      });

      setMessages([
        ...newMessages,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al comunicarse con Claude';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessages([
        ...newMessages,
        { role: 'error', content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <MessageSquare size={28} />
            <h1>ClaudeWeb</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={clearChat}
              title="Borrar chat"
            >
              <Trash2 size={20} />
            </button>
            <button
              className="btn-icon"
              onClick={() => setShowSettings(!showSettings)}
              title="Configuración"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-content">
            <h3><Key size={20} /> Configuración</h3>

            <div className="form-group">
              <label>API Key de Anthropic</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api..."
                className="input"
              />
              <small>
                Obtén tu API Key en{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">
                  console.anthropic.com
                </a>
              </small>
            </div>

            <div className="form-group">
              <label>Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="input"
              >
                <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recomendado)</option>
                <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Rápido)</option>
                <option value="claude-3-opus-20240229">Claude 3 Opus (Potente)</option>
              </select>
            </div>

            <button onClick={saveApiKey} className="btn-primary">
              Guardar Configuración
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome">
            <MessageSquare size={64} />
            <h2>Bienvenido a ClaudeWeb</h2>
            <p>Escribe un mensaje para comenzar a chatear con Claude AI</p>
            {!apiKey && (
              <button onClick={() => setShowSettings(true)} className="btn-primary">
                Configurar API Key
              </button>
            )}
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.role}`}>
                <div className="message-content">
                  <strong>{msg.role === 'user' ? 'Tú' : msg.role === 'error' ? 'Error' : 'Claude'}:</strong>
                  <pre>{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message message-assistant">
                <div className="message-content">
                  <strong>Claude:</strong>
                  <div className="loading">Pensando...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje... (Enter para enviar)"
            className="textarea"
            rows="3"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="btn-send"
            disabled={loading || !input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

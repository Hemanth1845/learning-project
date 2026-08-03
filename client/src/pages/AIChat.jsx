import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AIChat = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token]);

  const handleCreateSession = async () => {
    try {
      const res = await fetch(`${API_URL}/aichat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: 'New Conversation' })
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(prev => [data, ...prev]);
        setActiveSession(data);
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/aichat/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        if (data.length > 0) {
          if (!activeSession) {
            loadSession(data[0]._id);
          }
        } else {
          // Auto create a session if the list is empty, preventing a disabled prompt
          handleCreateSession();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const res = await fetch(`${API_URL}/aichat/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendDoubt = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    const queryText = customQuery || chatInput;
    if (!queryText.trim() || chatLoading || !activeSession) return;

    // Add message optimistically
    const updatedMessages = [...activeSession.messages, { sender: 'user', message: queryText, timestamp: new Date() }];
    setActiveSession(prev => ({
      ...prev,
      messages: updatedMessages
    }));
    if (!customQuery) setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/aichat/sessions/${activeSession._id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: queryText })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRenameSession = async (sessionId) => {
    const newTitle = prompt('Enter a new conversation title:');
    if (!newTitle || !newTitle.trim()) return;

    try {
      const res = await fetch(`${API_URL}/aichat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle.trim() })
      });
      if (res.ok) {
        fetchSessions();
        if (activeSession && activeSession._id === sessionId) {
          loadSession(sessionId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await fetch(`${API_URL}/aichat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s._id !== sessionId));
        if (activeSession && activeSession._id === sessionId) {
          setActiveSession(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (sessionId, currentPin) => {
    try {
      const res = await fetch(`${API_URL}/aichat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPinned: !currentPin })
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderMessageText = (text) => {
    if (!text) return '';
    const parts = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, linkText, url] = match;
      const matchIndex = match.index;
      
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      
      parts.push(
        <a 
          href={url} 
          key={matchIndex}
          style={{ 
            color: 'var(--accent-secondary)', 
            fontWeight: 'bold', 
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {linkText}
        </a>
      );
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Left Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', maxHeight: '720px', overflowY: 'auto' }}>
        <button onClick={handleCreateSession} className="primary-btn" style={{ width: '100%', padding: '10px 0' }}>
          ➕ New Conversation
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Recent Chats</span>
          {sessions.map(s => {
            const isActive = activeSession && activeSession._id === s._id;
            return (
              <div 
                key={s._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? 'var(--accent-secondary)' : 'var(--border-glass)'}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <div onClick={() => loadSession(s._id)} style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white', marginRight: '8px' }}>
                  {s.isPinned ? '📌 ' : ''}{s.title}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleTogglePin(s._id, s.isPinned)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }} title="Pin">📌</button>
                  <button onClick={() => handleRenameSession(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }} title="Rename">✏️</button>
                  <button onClick={() => handleDeleteSession(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#f43f5e' }} title="Delete">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '450px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)' }}>AI doubt Solver Advisor</h2>
          <p style={{ color: 'var(--text-muted)' }}>Ask placement roadmap, coding tasks, or CS theory doubts. Context is RAG-retrieved from your notes.</p>
        </div>

        {/* Suggested doubts */}
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>SUGGESTED DOUBTS:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="filter-tag" style={{ fontSize: '0.75rem', cursor: 'pointer', padding: '5px 12px' }} onClick={(e) => handleSendDoubt(e, "How does ACID properties work in DBMS?")}>
              DBMS ACID?
            </span>
            <span className="filter-tag" style={{ fontSize: '0.75rem', cursor: 'pointer', padding: '5px 12px' }} onClick={(e) => handleSendDoubt(e, "Explain Banker's Algorithm in OS")}>
              Banker's Algorithm?
            </span>
            <span className="filter-tag" style={{ fontSize: '0.75rem', cursor: 'pointer', padding: '5px 12px' }} onClick={(e) => handleSendDoubt(e, "What is Retrieval-Augmented Generation (RAG)?")}>
              RAG Models?
            </span>
          </div>
        </div>

        {/* Scrollable messages history container */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '420px' }}>
          {activeSession ? (
            activeSession.messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(0, 242, 254, 0.25)' : 'var(--border-glass)'}`,
                  padding: '14px 18px',
                  borderRadius: '8px',
                  maxWidth: '85%',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: msg.sender === 'user' ? 'var(--accent-secondary)' : '#a78bfa', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {msg.sender === 'user' ? 'Student' : 'AI Mentor'}
                </div>
                <div>{renderMessageText(msg.message)}</div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '80px 0' }}>
              Select a conversation from the sidebar or start a new one to begin chatting.
            </div>
          )}

          {chatLoading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI Tutor is searching database contexts...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendDoubt} style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <input 
            type="text"
            className="form-input"
            style={{ flex: 1, background: 'rgba(0,0,0,0.25)', height: '46px', fontSize: '0.92rem' }}
            placeholder="Type your placement doubt here..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={chatLoading || !activeSession}
          />
          <button type="submit" className="primary-btn" style={{ padding: '0 32px', fontSize: '0.95rem', height: '46px' }} disabled={chatLoading || !activeSession}>
            Ask Advisor 🚀
          </button>
        </form>
      </section>
    </div>
  );
};

export default AIChat;

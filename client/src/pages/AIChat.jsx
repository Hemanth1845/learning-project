import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AIChat = () => {
  const { token, API_URL } = useContext(AuthContext);

  const [chatHistory, setChatHistory] = useState([
    { 
      sender: 'ai', 
      message: "Hello! I am your AI Doubt Solver Tutor. Ask me any questions about Operating Systems (OS), Database Management (DBMS), Generative AI, LangChain agents, or RAG models, and I will retrieve accurate answers for you!" 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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

  const handleSendDoubt = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    const queryText = customQuery || chatInput;
    if (!queryText.trim() || chatLoading) return;

    setChatHistory(prev => [...prev, { sender: 'user', message: queryText }]);
    if (!customQuery) setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/dashboard/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: queryText })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { sender: 'ai', message: data.message }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { sender: 'ai', message: 'Sorry, I encountered an error connecting to the AI Tutor backend. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>AI Doubt Solver Tutor</h2>
        <p style={{ color: 'var(--text-muted)' }}>Ask questions about syllabus chapters or advanced LLM architectures. Context is dynamically retrieved from your course notes.</p>
      </div>

      {/* Main Chat Layout card */}
      <section className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '450px' }}>
        
        {/* Helper quick tags */}
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>SUGGESTED DOUBTS:</span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="filter-tag" style={{ fontSize: '0.78rem', cursor: 'pointer', padding: '6px 14px' }} onClick={(e) => handleSendDoubt(e, "How does ACID properties work in DBMS?")}>
              ACID in DBMS?
            </span>
            <span className="filter-tag" style={{ fontSize: '0.78rem', cursor: 'pointer', padding: '6px 14px' }} onClick={(e) => handleSendDoubt(e, "Explain Banker's CPU Scheduling Algorithm in OS")}>
              Banker's Algorithm?
            </span>
            <span className="filter-tag" style={{ fontSize: '0.78rem', cursor: 'pointer', padding: '6px 14px' }} onClick={(e) => handleSendDoubt(e, "What is LangChain framework used for?")}>
              LangChain Framework?
            </span>
            <span className="filter-tag" style={{ fontSize: '0.78rem', cursor: 'pointer', padding: '6px 14px' }} onClick={(e) => handleSendDoubt(e, "Explain Retrieval-Augmented Generation (RAG) models")}>
              RAG Models?
            </span>
          </div>
        </div>

        {/* Scrollable messages history container */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '420px' }}>
          {chatHistory.map((msg, index) => (
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
                {msg.sender === 'user' ? 'Student Doubt' : 'AI Doubt Solver Tutor'}
              </div>
              <div>{renderMessageText(msg.message)}</div>
            </div>
          ))}

          {chatLoading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI Tutor is searching database contexts...</span>
            </div>
          )}
        </div>

        {/* Query Input Form */}
        <form onSubmit={handleSendDoubt} style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
          <input 
            type="text"
            className="form-input"
            style={{ flex: 1, background: 'rgba(0,0,0,0.25)', height: '46px', fontSize: '0.92rem' }}
            placeholder="Type your academic or technical doubt here..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={chatLoading}
          />
          <button type="submit" className="primary-btn" style={{ padding: '0 32px', fontSize: '0.95rem', height: '46px' }} disabled={chatLoading}>
            Ask Tutor 🚀
          </button>
        </form>

      </section>

    </div>
  );
};

export default AIChat;

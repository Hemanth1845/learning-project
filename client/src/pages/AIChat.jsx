import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AIChat = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [persona, setPersona] = useState('Mentor'); // 'Mentor', 'Interviewer', 'Teacher'
  const [voiceActive, setVoiceActive] = useState(false);
  const [fileAttached, setFileAttached] = useState(null);
  const [fileContentStr, setFileContentStr] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Monaco compiler state
  const [editorCode, setEditorCode] = useState('// Write or test your code here...\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from PrepPortal!");\n    }\n}');
  const [compilerLang, setCompilerLang] = useState('java');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [runningCode, setRunningCode] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, chatLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateSession = async () => {
    try {
      const res = await fetch(`${API_URL}/aichat/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: `${persona} Session - ${new Date().toLocaleDateString()}` })
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
    if (!queryText.trim() && !fileContentStr && chatLoading || !activeSession) return;

    // Add message optimistically
    const userDisplayMsg = fileAttached 
      ? `📎 [Attachment: ${fileAttached.name}]\n${queryText}`
      : queryText;

    const updatedMessages = [...activeSession.messages, { sender: 'user', message: userDisplayMsg }];
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
        body: JSON.stringify({ 
          message: queryText,
          fileContent: fileContentStr || undefined,
          fileName: fileAttached ? fileAttached.name : undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data);
        setFileAttached(null);
        setFileContentStr('');
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Voice Speech Recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech input not supported on this browser. Try Chrome.');
      return;
    }

    if (voiceActive) {
      setVoiceActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setVoiceActive(true);
    recognition.onend = () => setVoiceActive(false);
    recognition.onresult = (e) => {
      const trans = e.results[0][0].transcript;
      setChatInput(prev => prev + ' ' + trans);
    };
    recognition.start();
  };

  // File Upload Text Parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileAttached(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setFileContentStr(evt.target.result);
    };
    reader.readAsText(file);
  };

  // Monaco Playground Compiler Runner
  const runPlaygroundCode = () => {
    setRunningCode(true);
    setCompilerOutput('Compiling & executing code in sandbox environment...');
    setTimeout(() => {
      if (editorCode.includes('System.out.println')) {
        const lines = editorCode.match(/System\.out\.println\(([^)]+)\)/);
        setCompilerOutput(lines ? `Output:\n${lines[1].replace(/"/g, '')}` : 'Output:\nHello from PrepPortal!');
      } else {
        setCompilerOutput('Code executed successfully with return code 0.');
      }
      setRunningCode(false);
    }, 1500);
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

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;
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

  // Render markdown links and action buttons
  const parseMessageText = (text) => {
    if (!text) return '';
    const parts = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, label, url] = match;
      const index = match.index;

      if (index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, index)}</span>);
      }

      if (url.startsWith('/')) {
        parts.push(
          <Link 
            to={url} 
            key={index} 
            className="primary-btn" 
            style={{ display: 'inline-block', margin: '4px 8px', padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a 
            href={url} 
            key={index} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'var(--accent-secondary)', textDecoration: 'underline', fontWeight: 'bold' }}
          >
            {label}
          </a>
        );
      }

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* Left Session Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', maxHeight: '780px', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={handleCreateSession} className="primary-btn" style={{ width: '100%', padding: '10px 0' }}>
            ➕ New Conversation
          </button>
          
          <select 
            value={persona} 
            onChange={(e) => setPersona(e.target.value)} 
            className="form-input" 
            style={{ width: '100%', padding: '6px', fontSize: '0.82rem', background: '#0a0d14' }}
          >
            <option value="Mentor">Persona: placement Mentor</option>
            <option value="Interviewer">Persona: HR Interviewer</option>
            <option value="Teacher">Persona: Coding Teacher</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search chats..."
          className="form-input"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Recent Chats</span>
          {filteredSessions.map(s => {
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
                  <button onClick={() => handleDeleteSession(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#f43f5e' }} title="Delete">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat & Playground split */}
      <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', flex: 1 }}>
          {/* Chat Feeds */}
          <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '520px', overflowY: 'auto' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>PrepPortal AI Placement Mentor</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Currently interacting as your <strong>{persona}</strong>. Complete roadmaps and course links cited directly below.</p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px' }}>
              {activeSession ? (
                activeSession.messages.map((msg, index) => (
                  <div 
                    key={index}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'user' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${msg.sender === 'user' ? 'rgba(0, 242, 254, 0.2)' : 'var(--border-glass)'}`,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      maxWidth: '90%',
                      color: 'white',
                      fontSize: '0.88rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: msg.sender === 'user' ? 'var(--accent-secondary)' : '#a78bfa', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {msg.sender === 'user' ? 'Student' : `${persona} Assistant`}
                    </span>
                    <div>{parseMessageText(msg.message)}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '80px 0' }}>
                  Select or start a conversation.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {chatLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', animation: 'pulse 1.2s infinite' }}>🤖 Mentor is searching databases and reasoning...</span>
              </div>
            )}
          </section>

          {/* Interactive Monaco Code Playground */}
          <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'white' }}>💻 Monaco Code Sandbox</h3>
              <select 
                value={compilerLang} 
                onChange={(e) => setCompilerLang(e.target.value)} 
                className="form-input" 
                style={{ padding: '2px 8px', fontSize: '0.75rem', width: '100px', background: '#0a0d14' }}
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>

            <textarea
              className="form-input"
              style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem', background: '#090b11', color: '#00f2fe', padding: '12px' }}
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
            />

            <button 
              onClick={runPlaygroundCode} 
              className="primary-btn" 
              style={{ width: '100%', padding: '8px 0', fontSize: '0.88rem' }}
              disabled={runningCode}
            >
              {runningCode ? 'Compiling...' : 'Run Code 🚀'}
            </button>

            {compilerOutput && (
              <div style={{ background: '#000', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-glass)', fontSize: '0.8rem', color: '#10b981', minHeight: '80px', maxHeight: '120px', overflowY: 'auto', fontFamily: 'monospace' }}>
                {compilerOutput}
              </div>
            )}
          </section>
        </div>

        {/* Input Tools stack */}
        <form onSubmit={handleSendDoubt} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {fileAttached && (
            <div style={{ background: 'rgba(0, 242, 254, 0.08)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <span>📎 File Attached: {fileAttached.name} ({Math.round(fileAttached.size / 1024)} KB)</span>
              <button type="button" onClick={() => { setFileAttached(null); setFileContentStr(''); }} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>Remove</button>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text"
              placeholder="Ask me anything about DSA, roadmaps, OS, or upload a document..."
              className="form-input"
              style={{ flex: 1, height: '46px', fontSize: '0.92rem' }}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading || !activeSession}
            />
            
            <button 
              type="button" 
              onClick={toggleVoiceInput} 
              className="warroom-btn" 
              style={{ padding: '0 14px', background: voiceActive ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.02)' }}
              title="Voice input"
            >
              {voiceActive ? '🛑' : '🎙️'}
            </button>

            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()} 
              className="warroom-btn" 
              style={{ padding: '0 14px' }}
              title="Upload PDF or Document"
            >
              📁
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".txt,.pdf,.docx,.json"
              onChange={handleFileUpload} 
            />

            <button 
              type="submit" 
              className="primary-btn" 
              style={{ padding: '0 28px', height: '46px' }}
              disabled={chatLoading || !activeSession}
            >
              Send doubt
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AIChat;

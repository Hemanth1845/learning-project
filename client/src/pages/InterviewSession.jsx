import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const InterviewSession = () => {
  const { id } = useParams();
  const { token, API_URL } = useContext(AuthContext);
  const [interview, setInterview] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && id) {
      fetchInterview();
    }
  }, [token, id]);

  useEffect(() => {
    scrollToBottom();
  }, [interview?.chatHistory, submitting]);

  const fetchInterview = async () => {
    try {
      const res = await fetch(`${API_URL}/interviews/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setInterview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || submitting) return;

    const messageToSend = inputValue;
    setInputValue('');
    setSubmitting(true);

    // Optimistically update UI chat history so the user sees their response instantly
    setInterview(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, { sender: 'user', message: messageToSend, timestamp: new Date() }]
    }));

    try {
      const res = await fetch(`${API_URL}/interviews/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await res.json();
      setInterview(data);
    } catch (err) {
      console.error(err);
      alert('Error sending response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Joining War Room...</div>;
  }

  if (!interview) {
    return <div style={{ color: 'white', padding: '32px' }}>Interview session not found.</div>;
  }

  const isCompleted = interview.status === 'completed';
  const feedback = interview.feedback;

  return (
    <div className="interview-container">
      
      {/* Top Session Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#11141a', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active War Room</span>
          <h2 style={{ fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖</span> {interview.companyName} Interview Session
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className={`difficulty-pill ${interview.difficulty.toLowerCase()}`}>
            {interview.difficulty} Mode
          </span>
          <span style={{ color: isCompleted ? 'var(--color-solved)' : 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.9rem', alignSelf: 'center' }}>
            {isCompleted ? 'COMPLETED' : `ROUND ${Math.floor(interview.chatHistory.length / 2) + 1}/4`}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        // Chat Interface
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
          
          {/* Messages Feed */}
          <div className="chat-messages">
            {interview.chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-bubble ${msg.sender}`}
              >
                <div style={{ fontSize: '0.75rem', color: msg.sender === 'ai' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.7)', marginBottom: '4px', fontWeight: 600 }}>
                  {msg.sender === 'ai' ? 'AI INTERVIEWER' : 'YOU'}
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.message}</div>
              </div>
            ))}
            
            {submitting && (
              <div className="chat-bubble ai" style={{ opacity: 0.85 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '4px', fontWeight: 600 }}>
                  AI INTERVIEWER
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  <span>Evaluating answer and preparing next question...</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <span style={{ animation: 'bounce 1s infinite alternate' }}>.</span>
                    <span style={{ animation: 'bounce 1s infinite alternate 0.2s' }}>.</span>
                    <span style={{ animation: 'bounce 1s infinite alternate 0.4s' }}>.</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleSend} className="chat-input-bar" style={{ marginTop: '16px' }}>
            <input 
              type="text" 
              className="chat-input"
              placeholder="Type your response here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={submitting}
              required
            />
            <button type="submit" className="chat-send-btn" disabled={submitting}>
              {submitting ? 'Analyzing...' : 'Send Answer'}
            </button>
          </form>

        </div>
      ) : (
        // Completed Scorecard Dashboard
        <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: 'white' }}>🎉 Interview Evaluation Complete!</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your responses were evaluated by Gemini AI. Here is your feedback scorecard.</p>
            <p style={{ color: 'var(--color-points)', fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' }}>⚡ +100 XP Claimed!</p>
          </div>

          <div className="scorecard-panel">
            
            {/* Left: Overall Score Radial & Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', borderRight: '1px solid var(--border-glass)', paddingRight: '32px' }}>
              <div className="scorecard-circle-wrapper">
                <div className="score-radial" style={{ '--percentage': feedback?.overallScore || 0 }}>
                  <span className="score-number">{feedback?.overallScore || 0}%</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Overall Score</h3>
              </div>
              
              <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'white', marginBottom: '8px' }}>Performance Summary</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{feedback?.summary}</p>
              </div>
            </div>

            {/* Right: Strengths, Weaknesses, Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div>
                <h4 style={{ color: 'var(--color-solved)', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>✓</span> Strengths Identified
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedback?.strengths?.map((str, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(16, 185, 129, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--color-solved)', fontSize: '0.9rem', color: 'white' }}>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--color-hard)', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠</span> Areas to Improve
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedback?.weaknesses?.map((weak, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(239, 68, 68, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--color-hard)', fontSize: '0.9rem', color: 'white' }}>
                      {weak}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💡</span> Study Recommendations
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedback?.tips?.map((tip, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(0, 242, 254, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)', fontSize: '0.9rem', color: 'white' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
            <button onClick={() => navigate('/interviews')} className="warroom-btn" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Return to Interview Hub
            </button>
            <button onClick={() => navigate('/')} className="primary-btn" style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
              Go to Home Dashboard
            </button>
          </div>

        </div>
      )}

      {/* Bounce keyframe animation inject for evaluation indicator */}
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
      `}</style>

    </div>
  );
};

export default InterviewSession;

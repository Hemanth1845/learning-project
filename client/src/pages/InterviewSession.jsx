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

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const reportHtml = `
      <html>
        <head>
          <title>Mock Interview Report - ${interview?.companyName || 'Evaluation'}</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #1f2937; padding: 40px; line-height: 1.6; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px; }
            .score-badge { font-size: 24px; font-weight: bold; color: #2563eb; background: #eff6ff; padding: 10px 20px; border-radius: 8px; display: inline-block; }
            .section-title { font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 10px; color: #1e293b; border-left: 4px solid #3b82f6; padding-left: 10px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 6px; }
            .question-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 20px; page-break-inside: avoid; }
            .q-title { font-weight: bold; color: #0f172a; margin-bottom: 8px; }
            .ans-box { font-style: italic; color: #475569; background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #cbd5e1; margin-bottom: 12px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px; font-size: 14px; }
            .metric-item { background: #f1f5f9; padding: 8px; border-radius: 4px; text-align: center; }
            .metric-val { font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <h1>Mock Interview Feedback Report</h1>
          <p><strong>Company:</strong> ${interview?.companyName}</p>
          <p><strong>Difficulty:</strong> ${interview?.difficulty}</p>
          <p><strong>Date:</strong> ${new Date(interview?.createdAt || Date.now()).toLocaleDateString()}</p>
          <div class="score-badge">Overall Score: ${feedback?.overallScore || 0}%</div>
          
          <div class="section-title">Summary</div>
          <p>${feedback?.summary || 'No summary generated.'}</p>
          
          <div class="section-title">Strengths</div>
          <ul>
            \${feedback?.strengths?.map(s => \`<li>\${s}</li>\`).join('') || '<li>N/A</li>'}
          </ul>
          
          <div class="section-title">Areas to Improve</div>
          <ul>
            \${feedback?.weaknesses?.map(w => \`<li>\${w}</li>\`).join('') || '<li>N/A</li>'}
          </ul>
          
          <div class="section-title">Recommendations</div>
          <ul>
            \${feedback?.tips?.map(t => \`<li>\${t}</li>\`).join('') || '<li>N/A</li>'}
          </ul>
          
          \${feedback?.questionsReport && feedback.questionsReport.length > 0 ? \`
            <div class="section-title">Question-wise Evaluation Report</div>
            \${feedback.questionsReport.map((q, idx) => \`
              <div class="question-card">
                <div class="q-title">Q\${idx + 1}: \${q.question}</div>
                <p><strong>Your Answer:</strong></p>
                <div class="ans-box">\${q.userAnswer}</div>
                <p><strong>Expected Ideal Answer:</strong></p>
                <div class="ans-box" style="background:#f0fdf4; border-color:#bbf7d0;">\${q.expectedAnswer}</div>
                <div class="metrics-grid">
                  <div class="metric-item">Relevance: <span class="metric-val">\${q.relevance}%</span></div>
                  <div class="metric-item">Technical: <span class="metric-val">\${q.technical}%</span></div>
                  <div class="metric-item">Grammar: <span class="metric-val">\${q.grammar}%</span></div>
                  <div class="metric-item">Confidence: <span class="metric-val">\${q.confidence}%</span></div>
                </div>
                <p><strong>Suggestions:</strong> \${q.suggestions}</p>
                <p><strong>Model Response:</strong> \${q.improvedAnswer}</p>
                <p><strong>Recommended Study Resources:</strong> \${q.resources}</p>
              </div>
            \`).join('')}
          \` : ''}
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(reportHtml);
    printWindow.document.close();
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

          {feedback?.questionsReport && feedback.questionsReport.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px', marginTop: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '16px' }}>📝 Question-wise Evaluation Report</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {feedback.questionsReport.map((q, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>Q{idx + 1}: {q.question}</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '12px 0' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Answer</span>
                        <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px', fontStyle: 'italic' }}>"{q.userAnswer}"</p>
                      </div>
                      <div style={{ background: 'rgba(16, 185, 129, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-solved)', textTransform: 'uppercase' }}>Expected Ideal Answer</span>
                        <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px' }}>{q.expectedAnswer}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: 'white' }}>Relevance: <strong>{q.relevance}%</strong></span>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: 'white' }}>Technical: <strong>{q.technical}%</strong></span>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: 'white' }}>Grammar: <strong>{q.grammar}%</strong></span>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: 'white' }}>Confidence: <strong>{q.confidence}%</strong></span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '8px' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>Suggestions:</strong> {q.suggestions}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      <strong style={{ color: 'var(--color-solved)' }}>Model Response:</strong> {q.improvedAnswer}
                    </p>
                    {q.resources && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        📚 <strong>Recommended Resources:</strong> {q.resources}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
            <button onClick={downloadPDF} className="warroom-btn" style={{ padding: '12px 24px', fontSize: '0.95rem', background: 'var(--accent-gradient)', border: 'none', color: 'white' }}>
              📥 Download PDF Report
            </button>
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

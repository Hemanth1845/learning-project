import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// High-Fidelity Placement Studio Style Textbook Content Parser
const TextbookContentParser = ({ text, pageTitle }) => {
  if (!text) return null;

  const blocks = text.split('\n\n');

  const renderList = (lines) => {
    return (
      <ul style={{ paddingLeft: '24px', listStyleType: 'none', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {lines.map((line, idx) => {
          const content = line.replace(/^[\s-*•\d.]+\.?\s*/, '').trim();
          
          const parts = content.split('**');
          const formattedContent = parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} style={{ color: '#111111', fontWeight: 700 }}>{part}</strong>;
            }
            return part;
          });

          return (
            <li key={idx} style={{ 
              position: 'relative', 
              color: '#333333', 
              fontSize: '0.92rem', 
              lineHeight: '1.65',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: '-16px', 
                color: '#e67e22', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                lineHeight: '1.2' 
              }}>•</span>
              {formattedContent}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderAsciiTable = (lines) => {
    const dataLines = lines.filter(line => line.includes('|') && !line.includes('+--') && !line.includes('==='));
    if (dataLines.length === 0) return null;

    const rows = dataLines.map(line => {
      return line.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    });

    const isChart = lines.some(l => l.includes('--->') || l.includes('===>') || l.includes('CONCEPT FLOW'));
    if (isChart) {
      return (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px 0',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          color: '#334155',
          overflowX: 'auto',
          whiteSpace: 'pre'
        }}>
          {lines.join('\n')}
        </div>
      );
    }

    const headerRow = rows[0];
    const bodyRows = rows.slice(1);

    return (
      <div style={{ overflowX: 'auto', margin: '24px 0', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fdf2f0', borderBottom: '2px solid #f8d7da' }}>
              {headerRow.map((cell, idx) => (
                <th key={idx} style={{ 
                  padding: '12px 16px', 
                  color: '#b02a37', 
                  fontSize: '0.88rem', 
                  fontWeight: 700, 
                  fontFamily: 'system-ui, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} style={{ 
                borderBottom: rIdx === bodyRows.length - 1 ? 'none' : '1px solid #f1f5f9',
                background: rIdx % 2 === 1 ? '#f8fafc' : '#ffffff' 
              }}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} style={{ 
                    padding: '12px 16px', 
                    color: '#334155', 
                    fontSize: '0.88rem', 
                    fontFamily: 'system-ui, sans-serif',
                    lineHeight: '1.5'
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderText = (content) => {
    const parts = content.split('**');
    const formatted = parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} style={{ color: '#111111', fontWeight: 700 }}>{part}</strong>;
      }
      return part;
    });

    return (
      <p style={{ 
        color: '#2d3748', 
        fontSize: '0.94rem', 
        lineHeight: '1.7', 
        margin: '14px 0',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>{formatted}</p>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Section titles starting with ### or ##
        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const headingText = trimmed.replace(/^###?\s+/, '').replace(/\*\*/g, '').trim();
          
          const matchNum = pageTitle.match(/Page (\d+):/);
          const pageNum = matchNum ? matchNum[1] : '';

          return (
            <div key={bIdx} style={{ margin: '28px 0 14px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h4 style={{ 
                fontFamily: 'Georgia, serif', 
                color: '#111111', 
                fontSize: '1.35rem', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {pageNum && (
                  <span style={{ 
                    background: '#e67e22', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: '26px', 
                    height: '26px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    fontFamily: 'system-ui, sans-serif'
                  }}>{pageNum}</span>
                )}
                {headingText}
              </h4>
            </div>
          );
        }

        // ASCII Tables and Diagrams
        if (trimmed.startsWith('+--') || trimmed.includes('|')) {
          const lines = trimmed.split('\n');
          if (lines.some(l => l.includes('|'))) {
            return <div key={bIdx}>{renderAsciiTable(lines)}</div>;
          }
        }

        // List elements
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          const lines = trimmed.split('\n');
          return <div key={bIdx}>{renderList(lines)}</div>;
        }

        // Solved Example / Highlight Card
        const isExampleBox = trimmed.includes('Q:') || trimmed.includes('Question:') || trimmed.includes('Solution:') || trimmed.toLowerCase().includes('example') || trimmed.toLowerCase().includes('worksheet');
        if (isExampleBox) {
          const lines = trimmed.split('\n');
          const titleLine = lines[0].replace(/^###?\s+/, '').replace(/\*\*/g, '').replace(/^✨\s*/, '').trim();
          const restLines = lines.slice(1).join('\n');

          return (
            <div key={bIdx} style={{
              background: '#edf2ff',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '8px',
              padding: '20px',
              margin: '24px 0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
            }}>
              <h5 style={{ 
                color: '#2563eb', 
                fontWeight: 700, 
                fontSize: '0.96rem', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                <span>✨</span> {titleLine || 'Solved Example'}
              </h5>
              <div style={{ 
                color: '#334155', 
                fontSize: '0.9rem', 
                lineHeight: '1.65',
                fontFamily: 'system-ui, sans-serif',
                whiteSpace: 'pre-wrap'
              }}>
                {restLines}
              </div>
            </div>
          );
        }

        // Code blocks / Formula callouts
        if (trimmed.startsWith('```') || trimmed.startsWith('`')) {
          const cleanCode = trimmed.replace(/```[a-zA-Z0-9]*\n?/g, '').replace(/```/g, '').replace(/`/g, '').trim();
          return (
            <div key={bIdx} style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '16px 20px',
              margin: '18px 0',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.88rem',
              color: '#1e293b',
              textAlign: 'center',
              lineHeight: '1.45',
              whiteSpace: 'pre-wrap'
            }}>
              {cleanCode}
            </div>
          );
        }

        // Paragraph text
        return <div key={bIdx}>{renderText(trimmed)}</div>;
      })}
    </div>
  );
};

const AptitudeMastery = () => {
  const { token, API_URL, reloadProfile } = useContext(AuthContext);

  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('quant'); // 'quant', 'logical', 'verbal'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [detailTab, setDetailTab] = useState('theory'); // 'theory', 'quiz'
  const [activePageIdx, setActivePageIdx] = useState(0); // Active page index for textbook reader

  // Quiz active states
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizTimer, setQuizTimer] = useState(30); // Dynamic per-question timer
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchAptitudeData();
    }
  }, [token]);

  // Handle quiz timer countdown per-question
  useEffect(() => {
    if (viewMode === 'detail' && detailTab === 'quiz' && quizStarted && !quizFinished && quizTimer > 0) {
      const interval = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            // Timer expired for this question, auto-advance with no answer/wrong
            setTimeout(() => {
              handleAutoAdvance(-1);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [viewMode, detailTab, quizStarted, quizFinished, quizTimer, currentQuestionIndex]);

  const fetchAptitudeData = async () => {
    try {
      const res = await fetch(`${API_URL}/aptitude`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [userAnswers, setUserAnswers] = useState([]);
  const [quizAnalytics, setQuizAnalytics] = useState(null);

  const handleSelectTopic = async (topic) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${topic._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const fullTopic = await res.json();
        setSelectedTopic(fullTopic);
        setViewMode('detail');
        setDetailTab('theory');
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setQuizFinished(false);
        setQuizScore(0);
        setActivePageIdx(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (topic) => {
    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${topic._id}/toggle-complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        fetchAptitudeData();
        setSelectedTopic(prev => ({ ...prev, completed: data.completed }));
        reloadProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (topic) => {
    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${topic._id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        fetchAptitudeData();
        setSelectedTopic(prev => ({ ...prev, bookmarked: data.bookmarked }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${selectedTopic._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const freshTopic = await res.json();
        setSelectedTopic(freshTopic);
        
        const qCount = freshTopic.quizQuestions?.length || 0;
        setUserAnswers(new Array(qCount).fill(null));
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setQuizFinished(false);
        setQuizStarted(false); // Show the animated start screen first
        setQuizStartTime(null);
        setDetailTab('quiz');
        setQuizAnalytics(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const beginQuizExecution = () => {
    const questions = selectedTopic.quizQuestions || [];
    const firstQ = questions[0];
    const initialTimer = firstQ?.difficulty === 'Hard' ? 60 : 30;
    setQuizTimer(initialTimer);
    setQuizStartTime(Date.now());
    setQuizStarted(true);
  };

  const handleAnswerSelect = (optIdx) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = optIdx;
    setUserAnswers(updated);
  };

  const handleAutoAdvance = (ansIdx) => {
    const updated = [...userAnswers];
    updated[currentQuestionIndex] = ansIdx;
    setUserAnswers(updated);

    const questions = selectedTopic.quizQuestions || [];
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextQ = questions[nextIdx];
      setQuizTimer(nextQ?.difficulty === 'Hard' ? 60 : 30);
    } else {
      finishQuiz(updated);
    }
  };

  const finishQuiz = async (answersOverride) => {
    const questions = selectedTopic.quizQuestions || [];
    const activeAnswers = answersOverride || userAnswers;
    
    let correctCount = 0;
    const mappedAnswers = [];
    
    questions.forEach((q, idx) => {
      const userAns = activeAnswers[idx];
      const isCorrect = userAns === q.correctIdx;
      if (isCorrect) correctCount++;
      mappedAnswers.push({
        qId: q._id,
        subtopic: q.subtopic,
        correct: isCorrect
      });
    });

    const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const timeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 60;

    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${selectedTopic._id}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: scorePercent,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          timeTaken,
          answers: mappedAnswers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setXpEarned(data.xpEarned);
        setQuizAnalytics(data.history);
        fetchAptitudeData();
        setSelectedTopic(prev => ({ ...prev, completed: true }));
        reloadProfile();
      }
    } catch (err) {
      console.error(err);
    }
    setQuizFinished(true);
  };

  if (loading || !categories) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Aptitude Modules...</div>;
  }

  const activeCategory = categories[selectedCategoryKey];
  const activeTopicIndex = activeCategory ? activeCategory.topics.findIndex(t => t._id === selectedTopic?._id) : -1;

  const handlePrevTopic = () => {
    if (activeCategory && activeTopicIndex > 0) {
      handleSelectTopic(activeCategory.topics[activeTopicIndex - 1]);
    }
  };

  const handleNextTopic = () => {
    if (activeCategory && activeTopicIndex < activeCategory.topics.length - 1) {
      handleSelectTopic(activeCategory.topics[activeTopicIndex + 1]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* View Mode: List view of categories and cards */}
      {viewMode === 'list' && (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>📈 Aptitude Mastery Platform</h2>
              <p style={{ color: 'var(--text-muted)' }}>Learn tricks, memorize formulas, and take timed placement tests for company assessments.</p>
            </div>
            
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '4px', borderRadius: '8px' }}>
              {Object.keys(categories).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedCategoryKey(key)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    background: selectedCategoryKey === key ? 'var(--accent-gradient)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {categories[key].title}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {activeCategory.topics.map(topic => (
              <div
                key={topic._id}
                className="glass-card"
                onClick={() => handleSelectTopic(topic)}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  background: topic.completed ? 'rgba(46, 204, 113, 0.04)' : 'rgba(255,255,255,0.01)',
                  borderColor: topic.completed ? 'var(--color-solved)' : 'var(--border-glass)',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      background: topic.difficulty === 'Easy' ? 'rgba(46,204,113,0.1)' : topic.difficulty === 'Medium' ? 'rgba(241,196,15,0.1)' : 'rgba(231,76,60,0.1)',
                      color: topic.difficulty === 'Easy' ? '#2ecc71' : topic.difficulty === 'Medium' ? '#f1c40f' : '#e74c3c'
                    }}>
                      {topic.difficulty}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {topic.duration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'white', marginTop: '16px', fontWeight: 700 }}>
                    {topic.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '8px', lineHeight: '1.4' }}>
                    {topic.desc || 'Complete this topic and attempt timed test challenges.'}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {topic.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--color-solved)', fontWeight: 600 }}>
                    {topic.completed ? '✓ Mastered' : '⏳ Unsolved'}
                  </span>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
                    ⚡ +{topic.xpReward} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View Mode: Topic detailed roadmap & timed quiz solver */}
      {viewMode === 'detail' && selectedTopic && (
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            <div>
              <button
                onClick={() => setViewMode('list')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                &larr; Back to Catalog
              </button>
              <h2 style={{ fontSize: '1.8rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedTopic.title}
                <button
                  onClick={() => handleToggleBookmark(selectedTopic)}
                  style={{ background: 'transparent', border: 'none', color: selectedTopic.bookmarked ? '#f59e0b' : 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
                >
                  {selectedTopic.bookmarked ? '★' : '☆'}
                </button>
              </h2>
            </div>
            
            {/* Tab switchers */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setDetailTab('theory')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  background: detailTab === 'theory' ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: detailTab === 'theory' ? '#a78bfa' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                📖 Concept Theory
              </button>
              <button
                onClick={startQuiz}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  background: detailTab === 'quiz' ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: detailTab === 'quiz' ? '#a78bfa' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                ⏳ timed Quiz
              </button>
            </div>
          </div>

          {/* TAB 1: CONCEPT THEORY SHEET */}
          {detailTab === 'theory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Textbook progress bar */}
              {selectedTopic.concepts && selectedTopic.concepts.length > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: '6px', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Textbook Progress:</span>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', flex: 1, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${((activePageIdx + 1) / selectedTopic.concepts.length) * 100}%`, background: 'var(--accent-gradient)', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 700, marginLeft: '16px' }}>
                    Page {activePageIdx + 1} of {selectedTopic.concepts.length}
                  </span>
                </div>
              )}

              {/* Two-column layout: Left sidebar for chapters, Right pane for reader */}
              <div style={{ display: 'flex', gap: '20px', minHeight: '520px' }}>
                
                {/* Left sidebar: page list */}
                <div style={{ 
                  width: '260px', 
                  flexShrink: 0,
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  maxHeight: '650px', 
                  overflowY: 'auto',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <h4 style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', marginBottom: '8px' }}>
                    📖 Table of Contents
                  </h4>
                  {selectedTopic.concepts && selectedTopic.concepts.map((concept, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePageIdx(idx)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: activePageIdx === idx ? '#ffffff' : 'transparent',
                        border: '1px solid',
                        borderColor: activePageIdx === idx ? '#cbd5e1' : 'transparent',
                        color: activePageIdx === idx ? '#0f172a' : '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: activePageIdx === idx ? 600 : 500,
                        boxShadow: activePageIdx === idx ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {concept.term || `Page ${idx + 1}`}
                    </button>
                  ))}
                </div>

                {/* Right pane: reading page */}
                <div style={{ 
                  flex: 1, 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '36px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}>
                  {selectedTopic.concepts && selectedTopic.concepts[activePageIdx] ? (
                    <div>
                      {/* Module Placement Studio Header */}
                      <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888888', fontWeight: 600 }}>
                          Module {String(activePageIdx + 1).padStart(2, '0')}
                        </span>
                        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.1rem', color: '#111111', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>
                          {selectedTopic.concepts[activePageIdx].term.replace(/^Page \d+:\s*/, '')}
                        </h1>
                        <div style={{ width: '40px', height: '3px', background: '#e67e22', margin: '0 auto' }} />
                      </div>

                      {/* Content Renderer */}
                      <TextbookContentParser 
                        text={selectedTopic.concepts[activePageIdx].definition} 
                        pageTitle={selectedTopic.concepts[activePageIdx].term} 
                      />
                    </div>
                  ) : (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
                      No content available for this page.
                    </div>
                  )}

                  {/* Previous / Next Page Turners */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid #f1f5f9', 
                    paddingTop: '20px',
                    marginTop: 'auto'
                  }}>
                    <button
                      disabled={activePageIdx === 0}
                      onClick={() => setActivePageIdx(prev => Math.max(0, prev - 1))}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        background: activePageIdx === 0 ? '#f1f5f9' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: activePageIdx === 0 ? '#94a3b8' : '#0f172a',
                        cursor: activePageIdx === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                    >
                      ⏮️ Previous Page
                    </button>
                    <button
                      disabled={!selectedTopic.concepts || activePageIdx === selectedTopic.concepts.length - 1}
                      onClick={() => setActivePageIdx(prev => Math.min(selectedTopic.concepts.length - 1, prev + 1))}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '6px',
                        background: (!selectedTopic.concepts || activePageIdx === selectedTopic.concepts.length - 1) ? '#f1f5f9' : '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: (!selectedTopic.concepts || activePageIdx === selectedTopic.concepts.length - 1) ? '#94a3b8' : '#0f172a',
                        cursor: (!selectedTopic.concepts || activePageIdx === selectedTopic.concepts.length - 1) ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                    >
                      Next Page ⏭️
                    </button>
                  </div>
                </div>

              </div>

              {/* Shortcut Tricks container & complete footer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <div style={{ padding: '20px', background: 'rgba(46, 204, 113, 0.04)', borderLeft: '4px solid #2ecc71', borderRadius: '6px' }}>
                  <h4 style={{ color: '#2ecc71', fontWeight: 700, fontSize: '1rem', marginBottom: '10px' }}>💡 Shortcut Tricks & Formula Sheets</h4>
                  <ul style={{ paddingLeft: '20px', listStyleType: 'decimal', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedTopic.shortcuts && selectedTopic.shortcuts.map((trick, idx) => (
                      <li key={idx} style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.4' }}>{trick}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Read the shortcuts carefully before attempting the Timed Quiz challenge!
                  </span>
                  <button
                    onClick={() => handleToggleComplete(selectedTopic)}
                    className="primary-btn"
                    style={{
                      padding: '10px 24px',
                      fontSize: '0.9rem',
                      background: selectedTopic.completed ? 'rgba(46, 204, 113, 0.15)' : 'var(--accent-gradient)',
                      borderColor: selectedTopic.completed ? 'var(--color-solved)' : 'transparent',
                      color: selectedTopic.completed ? '#2ecc71' : 'white'
                    }}
                  >
                    {selectedTopic.completed ? '✓ Topic Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE TIMED QUIZ */}
          {detailTab === 'quiz' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.08); }
                  100% { transform: scale(1); }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-6px); }
                }
                .glow-button:hover {
                  box-shadow: 0 0 35px rgba(139, 92, 246, 0.8) !important;
                  transform: scale(1.05) !important;
                }
              `}</style>

              {!quizFinished ? (
                !quizStarted ? (
                  /* Animated Start Screen */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '32px', textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ animation: 'pulse 2s infinite', fontSize: '4.5rem' }}>⏱️</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h3 style={{ fontSize: '2.2rem', color: 'white', fontWeight: 800 }}>{selectedTopic.title} timed Quiz</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: '1.6', margin: '0 auto' }}>
                        Ready to test your placement readiness? This timed quiz features strict constraints to mimic real interview platform environments.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '520px', width: '100%', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'left' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>📋</span>
                        <div>
                          <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, margin: 0 }}>Questions</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedTopic.quizQuestions.length} Questions</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>⏳</span>
                        <div>
                          <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, margin: 0 }}>Timer Mode</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per-Question Limits</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>⚡</span>
                        <div>
                          <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, margin: 0 }}>Easy-Medium</p>
                          <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 600 }}>30 Seconds Limit</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem' }}>🔥</span>
                        <div>
                          <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, margin: 0 }}>Hard Challenge</p>
                          <span style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 600 }}>60 Seconds Limit</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={beginQuizExecution}
                      className="primary-btn glow-button"
                      style={{
                        padding: '16px 48px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '30px',
                        background: 'var(--accent-gradient)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                        transition: 'all 0.3s ease',
                        animation: 'bounce 2s infinite'
                      }}
                    >
                      Start Assessment &rarr;
                    </button>
                  </div>
                ) : (
                  /* Quiz Questions */
                  <>
                    {/* Timer & Question counters bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Question {currentQuestionIndex + 1} of {selectedTopic.quizQuestions.length}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          background: selectedTopic.quizQuestions[currentQuestionIndex]?.difficulty === 'Hard' ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
                          color: selectedTopic.quizQuestions[currentQuestionIndex]?.difficulty === 'Hard' ? '#e74c3c' : '#2ecc71'
                        }}>
                          {selectedTopic.quizQuestions[currentQuestionIndex]?.difficulty || 'Easy-Medium'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: quizTimer <= 15 ? '#e74c3c' : 'white',
                        background: quizTimer <= 15 ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.03)',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}>
                        ⏱️ {quizTimer}s remaining
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${((currentQuestionIndex) / selectedTopic.quizQuestions.length) * 100}%`,
                        background: 'var(--accent-gradient)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    {/* Question box */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'white', lineHeight: '1.6', fontWeight: 600, whiteSpace: 'pre-wrap' }}>
                        {selectedTopic.quizQuestions[currentQuestionIndex].q}
                      </h3>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedTopic.quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                        const isSelected = userAnswers[currentQuestionIndex] === idx;

                        let optBg = 'rgba(255,255,255,0.01)';
                        let optBorder = 'var(--border-glass)';
                        let optColor = 'white';

                        if (isSelected) {
                          optBg = 'rgba(139, 92, 246, 0.12)';
                          optBorder = '#a78bfa';
                          optColor = '#c084fc';
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleAnswerSelect(idx)}
                            style={{
                              padding: '16px 20px',
                              background: optBg,
                              border: '1px solid',
                              borderColor: optBorder,
                              borderRadius: '8px',
                              color: optColor,
                              cursor: 'pointer',
                              fontSize: '0.92rem',
                              fontWeight: 600,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'var(--transition-smooth)'
                            }}
                            className="quiz-option-btn"
                          >
                            <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                            {isSelected && <span style={{ color: '#c084fc' }}>● Selected</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Question Map Progress (Non-clickable to prevent jumping) */}
                    <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '10px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>Question Progress Map:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedTopic.quizQuestions.map((_, idx) => {
                          const isCurrent = idx === currentQuestionIndex;
                          const isAnswered = userAnswers[idx] !== null;
                          return (
                            <div
                              key={idx}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '6px',
                                background: isCurrent ? 'var(--accent-secondary)' : isAnswered ? 'rgba(46, 204, 113, 0.12)' : 'rgba(255,255,255,0.03)',
                                border: '1px solid',
                                borderColor: isCurrent ? 'var(--accent-secondary)' : isAnswered ? '#2ecc71' : 'var(--border-glass)',
                                color: isCurrent ? 'white' : isAnswered ? '#2ecc71' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {idx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      {currentQuestionIndex < selectedTopic.quizQuestions.length - 1 ? (
                        <button
                          onClick={() => handleAutoAdvance(userAnswers[currentQuestionIndex])}
                          className="primary-btn"
                          style={{ padding: '10px 32px' }}
                        >
                          Next Question &rarr;
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAutoAdvance(userAnswers[currentQuestionIndex])}
                          className="primary-btn"
                          style={{ padding: '10px 32px', background: 'rgba(46, 204, 113, 0.15)', borderColor: '#2ecc71', color: '#2ecc71' }}
                        >
                          Finish Quiz &rarr;
                        </button>
                      )}
                    </div>
                  </>
                )
              ) : (
                /* Quiz Complete screen */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '3.5rem' }}>🏆</span>
                    <h3 style={{ fontSize: '2rem', color: 'white', fontWeight: 800 }}>Assessment Finished!</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', background: 'rgba(0,0,0,0.15)', padding: '24px 32px', borderRadius: '12px', border: '1px solid var(--border-glass)', width: '100%', maxWidth: '640px', marginTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                          {userAnswers.filter((ans, idx) => ans === selectedTopic.quizQuestions[idx].correctIdx).length} / {selectedTopic.quizQuestions.length}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Score</span>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-glass)', height: '100%', justifySelf: 'center' }}></div>
                      <div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2ecc71' }}>
                          {quizAnalytics ? quizAnalytics.accuracy : 0}%
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Accuracy</span>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-glass)', height: '100%', justifySelf: 'center' }}></div>
                      <div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f1c40f' }}>
                          {quizAnalytics ? Math.floor(quizAnalytics.timeTaken / 60) : 0}m {quizAnalytics ? quizAnalytics.timeTaken % 60 : 0}s
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Time Taken</span>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-glass)', height: '100%', justifySelf: 'center' }}></div>
                      <div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#e67e22' }}>
                          +{xpEarned}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>XP Earned</span>
                      </div>
                    </div>
                  </div>

                  {/* Topic Analysis cards */}
                  {quizAnalytics && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(46, 204, 113, 0.2)', background: 'rgba(46, 204, 113, 0.02)' }}>
                        <h4 style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🟢 Strong Areas (&gt;=80% Acc)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          {quizAnalytics.strongTopics && quizAnalytics.strongTopics.length > 0 ? quizAnalytics.strongTopics.map((sub, idx) => (
                            <span key={idx} style={{ color: 'white', fontSize: '0.85rem' }}>✓ {sub}</span>
                          )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No strong areas detected yet.</span>}
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(231, 76, 60, 0.2)', background: 'rgba(231, 76, 60, 0.02)' }}>
                        <h4 style={{ color: '#e74c3c', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🔴 Weak Areas (&lt;50% Acc)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          {quizAnalytics.weakTopics && quizAnalytics.weakTopics.length > 0 ? quizAnalytics.weakTopics.map((sub, idx) => (
                            <span key={idx} style={{ color: 'white', fontSize: '0.85rem' }}>⚠️ {sub}</span>
                          )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Perfect! No weak areas detected.</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Practice */}
                  {quizAnalytics && quizAnalytics.weakTopics && quizAnalytics.weakTopics.length > 0 && (
                    <div style={{ background: 'rgba(241,196,15,0.06)', borderLeft: '4px solid #f1c40f', padding: '16px 20px', borderRadius: '6px' }}>
                      <strong style={{ color: '#f1c40f', fontSize: '0.9rem' }}>💡 Recommended Practice Focus:</strong>
                      <p style={{ color: 'white', fontSize: '0.85rem', marginTop: '6px', lineHeight: '1.4' }}>
                        To boost your score for product interviews, we recommend re-reading the <strong>{quizAnalytics.weakTopics.join(', ')}</strong> textbook modules and practicing standard formulas.
                      </p>
                    </div>
                  )}

                  {/* Review Solutions Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700, borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                      📝 Detailed Review & Solutions
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {selectedTopic.quizQuestions.map((q, qIdx) => {
                        const userAns = userAnswers[qIdx];
                        const isCorrect = userAns === q.correctIdx;
                        return (
                          <div key={qIdx} style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.9rem' }}>
                                Question {qIdx + 1}
                              </span>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: isCorrect ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                                color: isCorrect ? '#2ecc71' : '#e74c3c'
                              }}>
                                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            </div>
                            
                            <p style={{ color: 'white', fontSize: '1rem', lineHeight: '1.5', marginBottom: '16px', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                              {q.q}
                            </p>

                            {/* Option list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                              {q.options.map((opt, oIdx) => {
                                const isCorrectOpt = oIdx === q.correctIdx;
                                const isUserOpt = oIdx === userAns;
                                
                                let border = 'var(--border-glass)';
                                let bg = 'transparent';
                                let textCol = 'var(--text-main)';
                                
                                if (isCorrectOpt) {
                                  bg = 'rgba(46, 204, 113, 0.08)';
                                  border = '#2ecc71';
                                  textCol = '#2ecc71';
                                } else if (isUserOpt) {
                                  bg = 'rgba(231, 76, 60, 0.08)';
                                  border = '#e74c3c';
                                  textCol = '#e74c3c';
                                }

                                return (
                                  <div key={oIdx} style={{ padding: '12px 16px', border: '1px solid', borderColor: border, borderRadius: '6px', background: bg, color: textCol, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                    {isCorrectOpt && <span style={{ fontWeight: 700 }}>Correct Answer</span>}
                                    {!isCorrectOpt && isUserOpt && <span style={{ fontWeight: 700 }}>Your Answer</span>}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderLeft: '4px solid var(--accent-secondary)', borderRadius: '4px' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                Explanation:
                              </strong>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.4' }}>
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                      onClick={() => setViewMode('list')}
                      className="primary-btn"
                      style={{ padding: '12px 48px', fontSize: '0.95rem' }}
                    >
                      Back to Catalog
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next / Prev footer navigation */}
          {detailTab === 'theory' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '32px' }}>
              <button
                onClick={handlePrevTopic}
                disabled={activeTopicIndex <= 0}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: activeTopicIndex <= 0 ? 'var(--text-muted)' : 'white',
                  cursor: activeTopicIndex <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                &larr; Previous Topic
              </button>
              <button
                onClick={handleNextTopic}
                disabled={activeTopicIndex >= (activeCategory ? activeCategory.topics.length - 1 : 0)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: activeTopicIndex >= (activeCategory ? activeCategory.topics.length - 1 : 0) ? 'var(--text-muted)' : 'white',
                  cursor: activeTopicIndex >= (activeCategory ? activeCategory.topics.length - 1 : 0) ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Next Topic &rarr;
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AptitudeMastery;

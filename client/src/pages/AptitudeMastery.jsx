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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizTimer, setQuizTimer] = useState(60); // 1 minute per quiz question
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchAptitudeData();
    }
  }, [token]);

  // Handle quiz timer countdown
  useEffect(() => {
    if (viewMode === 'detail' && detailTab === 'quiz' && !quizFinished && quizTimer > 0) {
      const interval = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            // Timer expired, auto-submit or move to next
            handleAnswerSelect(-1); // wrong answer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [viewMode, detailTab, quizFinished, quizTimer]);

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

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setViewMode('detail');
    setDetailTab('theory');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
    setQuizScore(0);
    setQuizTimer(60);
    setActivePageIdx(0); // Reset page index when switching topics
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

  const startQuiz = () => {
    setDetailTab('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizTimer(60);
  };

  const handleAnswerSelect = (optIdx) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(optIdx);

    const questions = selectedTopic.quizQuestions || [];
    const correctIdx = questions[currentQuestionIndex].correctIdx;

    if (optIdx === correctIdx) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const questions = selectedTopic.quizQuestions || [];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizTimer(60);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const questions = selectedTopic.quizQuestions || [];
    const finalPercent = Math.round((quizScore / questions.length) * 100);

    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${selectedTopic._id}/submit-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: finalPercent })
      });
      if (res.ok) {
        const data = await res.json();
        setXpEarned(data.xpEarned);
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
              {!quizFinished ? (
                <>
                  {/* Timer & Question counters bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Question {currentQuestionIndex + 1} of {selectedTopic.quizQuestions.length}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: quizTimer <= 15 ? '#e74c3c' : 'white',
                      background: quizTimer <= 15 ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.03)',
                      padding: '6px 16px',
                      borderRadius: '4px'
                    }}>
                      ⏱️ {quizTimer}s remaining
                    </span>
                  </div>

                  {/* Question box */}
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', lineHeight: '1.5', fontWeight: 600 }}>
                      {selectedTopic.quizQuestions[currentQuestionIndex].q}
                    </h3>
                  </div>

                  {/* Options options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedTopic.quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                      const isAnswered = selectedAnswer !== null;
                      const isCorrect = idx === selectedTopic.quizQuestions[currentQuestionIndex].correctIdx;
                      const isSelected = idx === selectedAnswer;

                      let optBg = 'rgba(255,255,255,0.01)';
                      let optBorder = 'var(--border-glass)';
                      let optColor = 'white';

                      if (isAnswered) {
                        if (isCorrect) {
                          optBg = 'rgba(46, 204, 113, 0.08)';
                          optBorder = 'var(--color-solved)';
                          optColor = '#2ecc71';
                        } else if (isSelected) {
                          optBg = 'rgba(231, 76, 60, 0.08)';
                          optBorder = '#e74c3c';
                          optColor = '#e74c3c';
                        } else {
                          optBg = 'rgba(255,255,255,0.01)';
                          optBorder = 'rgba(255,255,255,0.03)';
                          optColor = 'var(--text-muted)';
                        }
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
                            borderRadius: '6px',
                            color: optColor,
                            cursor: isAnswered ? 'default' : 'pointer',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <span>{idx + 1}. {opt}</span>
                          {isAnswered && isCorrect && <span>✓ Correct</span>}
                          {isAnswered && isSelected && !isCorrect && <span>✗ Incorrect</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation card (visible only after answering) */}
                  {selectedAnswer !== null && (
                    <div style={{ padding: '20px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-glass)', borderRadius: '6px', marginTop: '12px' }}>
                      <strong style={{ color: 'var(--accent-secondary)', display: 'block', fontSize: '0.88rem', textTransform: 'uppercase' }}>
                        Solution Explanation:
                      </strong>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '6px', lineHeight: '1.4' }}>
                        {selectedTopic.quizQuestions[currentQuestionIndex].explanation || 'Explanation details successfully calculated.'}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {selectedAnswer !== null && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <button
                        onClick={handleNextQuestion}
                        className="primary-btn"
                        style={{ padding: '10px 32px', fontSize: '0.9rem' }}
                      >
                        {currentQuestionIndex < selectedTopic.quizQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz →'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Quiz Complete screen */
                <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '3rem' }}>🏆</span>
                  <h3 style={{ fontSize: '1.8rem', color: 'white', fontWeight: 700 }}>Quiz Completed!</h3>
                  
                  <div style={{ display: 'flex', gap: '40px', background: 'rgba(0,0,0,0.15)', padding: '24px 48px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                        {quizScore} / {selectedTopic.quizQuestions.length}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', uppercase: true }}>Final Score</span>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f1c40f' }}>
                        +{xpEarned}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', uppercase: true }}>XP Earned</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: '1.5' }}>
                    Excellent work! You have finished the timed quiz for {selectedTopic.title} and updated your placement profile.
                  </p>

                  <button
                    onClick={() => {
                      setViewMode('list');
                    }}
                    className="primary-btn"
                    style={{ padding: '12px 32px', fontSize: '0.9rem', marginTop: '12px' }}
                  >
                    Back to Topics Catalog
                  </button>
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

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const renderFormattedText = (text) => {
  if (!text) return '';
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} style={{ color: 'white', fontWeight: 700 }}>{part}</strong>;
    }
    return part;
  });
};

const MarkdownViewer = ({ content }) => {
  if (!content) return null;
  
  const lines = content.split('\n');
  const rendered = [];
  let listItems = [];
  let inTable = false;
  let tableRows = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  
  const flushList = (key) => {
    if (listItems.length > 0) {
      rendered.push(
        <ul key={`ul-${key}`} style={{ marginLeft: '20px', marginBottom: '16px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block handling
    if (inCodeBlock) {
      if (trimmed.startsWith('```')) {
        inCodeBlock = false;
        rendered.push(
          <pre key={`code-${i}`} style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-glass)',
            padding: '16px',
            borderRadius: '6px',
            overflowX: 'auto',
            fontSize: '0.88rem',
            color: '#c9d1d9',
            fontFamily: 'monospace',
            marginBottom: '16px',
            whiteSpace: 'pre'
          }}>
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
      } else {
        codeBlockLines.push(lines[i]);
      }
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushList(i);
      inCodeBlock = true;
      continue;
    }

    if (trimmed.startsWith('|')) {
      flushList(i);
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable && !trimmed.startsWith('|')) {
      inTable = false;
      if (tableRows.length > 0) {
        const headers = tableRows[0].split('|').map(h => h.trim()).filter(h => h);
        const rows = tableRows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c));
        rendered.push(
          <div key={`table-${i}`} style={{ overflowX: 'auto', marginBottom: '20px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', background: 'rgba(0,0,0,0.15)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                  {headers.map((h, idx) => <th key={idx} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'white' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: rIdx < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    {row.map((cell, cIdx) => <td key={cIdx} style={{ padding: '12px 16px', color: 'var(--text-main)' }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    }

    if (trimmed.startsWith('---')) {
      flushList(i);
      rendered.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '24px 0' }} />);
    } else if (trimmed.startsWith('###')) {
      flushList(i);
      rendered.push(<h4 key={i} style={{ fontSize: '1.25rem', color: 'white', marginTop: '24px', marginBottom: '12px', fontWeight: 700 }}>{trimmed.replace('###', '').trim()}</h4>);
    } else if (trimmed.startsWith('##')) {
      flushList(i);
      rendered.push(<h3 key={i} style={{ fontSize: '1.4rem', color: 'white', marginTop: '28px', marginBottom: '14px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>{trimmed.replace('##', '').trim()}</h3>);
    } else if (trimmed.startsWith('#')) {
      flushList(i);
      rendered.push(<h2 key={i} style={{ fontSize: '1.7rem', color: 'white', marginTop: '32px', marginBottom: '16px', fontWeight: 800 }}>{trimmed.replace('#', '').trim()}</h2>);
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      listItems.push(<li key={`li-${i}`} style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.6' }}>{renderFormattedText(trimmed.substring(1).trim())}</li>);
    } else if (trimmed.startsWith('> [!TIP]')) {
      flushList(i);
      let tipContent = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        tipContent += lines[j].replace('>', '').replace('[!TIP]', '').trim() + ' ';
        j++;
      }
      i = j - 1;
      rendered.push(
        <div key={i} style={{ padding: '16px', background: 'rgba(46, 204, 113, 0.08)', borderLeft: '4px solid #2ecc71', borderRadius: '4px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong style={{ color: '#2ecc71', fontSize: '0.88rem', textTransform: 'uppercase' }}>💡 High-Yield Tip</strong>
          <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>{renderFormattedText(tipContent)}</p>
        </div>
      );
    } else if (trimmed.startsWith('> [!WARNING]') || trimmed.startsWith('> [!CAUTION]')) {
      flushList(i);
      let warnContent = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        warnContent += lines[j].replace('>', '').replace('[!WARNING]', '').replace('[!CAUTION]', '').trim() + ' ';
        j++;
      }
      i = j - 1;
      rendered.push(
        <div key={i} style={{ padding: '16px', background: 'rgba(231, 76, 60, 0.08)', borderLeft: '4px solid #e74c3c', borderRadius: '4px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong style={{ color: '#e74c3c', fontSize: '0.88rem', textTransform: 'uppercase' }}>⚠️ Common Pitfall</strong>
          <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>{renderFormattedText(warnContent)}</p>
        </div>
      );
    } else if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!ANALOGY]')) {
      flushList(i);
      let noteContent = '';
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        noteContent += lines[j].replace('>', '').replace('[!NOTE]', '').replace('[!ANALOGY]', '').trim() + ' ';
        j++;
      }
      i = j - 1;
      rendered.push(
        <div key={i} style={{ padding: '16px', background: 'rgba(230, 126, 34, 0.08)', borderLeft: '4px solid #e67e22', borderRadius: '4px', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <strong style={{ color: '#e67e22', fontSize: '0.88rem', textTransform: 'uppercase' }}>💡 Real-Life Analogy</strong>
          <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>{renderFormattedText(noteContent)}</p>
        </div>
      );
    } else if (trimmed !== '') {
      flushList(i);
      rendered.push(<p key={i} style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}>{renderFormattedText(line)}</p>);
    }
  }
  flushList(lines.length);

  return <div>{rendered}</div>;
};

const TheoryHub = () => {
  const { token, API_URL, reloadProfile } = useContext(AuthContext);
  
  const [subjects, setSubjects] = useState([]);
  const [activeSubjectId, setActiveSubjectId] = useState('dsa');
  const [activeChapter, setActiveChapter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [codeLang, setCodeLang] = useState('cpp');
  const [expandedFAQIndex, setExpandedFAQIndex] = useState(null);

  useEffect(() => {
    if (token) {
      fetchTheoryData();
    }
  }, [token]);

  const fetchTheoryData = async () => {
    try {
      const res = await fetch(`${API_URL}/theory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (ch) => {
    try {
      const res = await fetch(`${API_URL}/theory/chapters/${ch._id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setSubjects(prev => prev.map(sub => {
          if (sub.id !== activeSubjectId) return sub;
          const updatedChapters = sub.chapters.map(c => {
            if (c._id !== ch._id) return c;
            return { ...c, completed: data.completed };
          });
          const completedCount = updatedChapters.filter(c => c.completed).length;
          const progressPercent = sub.totalChapters > 0 ? Math.round((completedCount / sub.totalChapters) * 100) : 0;
          return {
            ...sub,
            chapters: updatedChapters,
            completedChapters: completedCount,
            progress: progressPercent
          };
        }));

        if (activeChapter && activeChapter._id === ch._id) {
          setActiveChapter(prev => ({ ...prev, completed: data.completed }));
        }
        reloadProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (ch) => {
    try {
      const res = await fetch(`${API_URL}/theory/chapters/${ch._id}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubjects(prev => prev.map(sub => {
          if (sub.id !== activeSubjectId) return sub;
          return {
            ...sub,
            chapters: sub.chapters.map(c => {
              if (c._id !== ch._id) return c;
              return { ...c, bookmarked: data.bookmarked };
            })
          };
        }));

        if (activeChapter && activeChapter._id === ch._id) {
          setActiveChapter(prev => ({ ...prev, bookmarked: data.bookmarked }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChapter = (ch) => {
    setActiveChapter(ch);
    setExpandedFAQIndex(null);
  };

  const handleCloseChapter = () => {
    setActiveChapter(null);
  };

  const activeSubject = subjects.find(s => s.id === activeSubjectId);
  const activeChapterIndex = activeSubject ? activeSubject.chapters.findIndex(c => c._id === activeChapter?._id) : -1;

  const handlePrevChapter = () => {
    if (activeSubject && activeChapterIndex > 0) {
      handleSelectChapter(activeSubject.chapters[activeChapterIndex - 1]);
    }
  };

  const handleNextChapter = () => {
    if (activeSubject && activeChapterIndex < activeSubject.chapters.length - 1) {
      handleSelectChapter(activeSubject.chapters[activeChapterIndex + 1]);
    }
  };

  // Filter chapters based on search query
  const getFilteredChapters = (chapters) => {
    if (!searchQuery.trim()) return chapters;
    return chapters.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Placement Encyclopedia...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="scorecard-panel">
      
      {/* Left Sidebar Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <h3 style={{ color: 'white', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Theory Catalog
          </h3>
          {/* Search bar inside Theory Hub */}
          <input 
            type="text" 
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '0.85rem',
              marginTop: '12px'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subjects.map(item => (
            <div 
              key={item.id}
              onClick={() => {
                setActiveSubjectId(item.id);
                setActiveChapter(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeSubjectId === item.id ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                borderLeft: activeSubjectId === item.id ? '3px solid var(--accent-secondary)' : '3px solid transparent',
                color: activeSubjectId === item.id ? 'white' : 'var(--text-main)',
                transition: 'var(--transition-smooth)'
              }}
              className="theory-sidebar-item"
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.title}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-solved)' }}>{item.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.progress}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                  {item.completedChapters} / {item.totalChapters} chapters
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Workspace */}
      <div className="glass-card" style={{ padding: '32px' }}>
        {activeSubject && !activeChapter && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>{activeSubject.icon}</span> {activeSubject.title}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                  {activeSubject.description || 'Complete all chapters to unlock exclusive placement badges and prepare for interviews.'}
                </p>
              </div>
              
              <button 
                onClick={() => window.open('https://drive.google.com/file/d/1FQGGORBNB3yJrbhvwaPpAa7BHufdp-x3/view?usp=sharing', '_blank')}
                className="primary-btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                📥 Download Complete Notes PDF
              </button>
            </div>

            {/* Statistics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{activeSubject.totalChapters}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Total Chapters</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-solved)' }}>{activeSubject.completedChapters}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Completed Chapters</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-points)' }}>{activeSubject.progress}%</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>Subject Mastery</div>
              </div>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1c40f' }}>{activeSubject.totalChapters * 20}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>XP Available</div>
              </div>
            </div>

            {/* Chapters list grid */}
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '16px', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '10px' }}>
                Chapters Directory
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {getFilteredChapters(activeSubject.chapters).map((ch, idx) => (
                  <div 
                    key={ch._id}
                    onClick={() => handleSelectChapter(ch)}
                    style={{ 
                      background: ch.completed ? 'rgba(46, 204, 113, 0.04)' : 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--border-glass)', 
                      borderColor: ch.completed ? 'var(--color-solved)' : 'var(--border-glass)',
                      borderRadius: '12px', 
                      padding: '24px', 
                      cursor: 'pointer', 
                      transition: 'var(--transition-smooth)',
                      position: 'relative'
                    }}
                    className="topic-card-item"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: ch.completed ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                        Chapter {ch.order}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBookmark(ch);
                          }}
                          style={{ background: 'transparent', border: 'none', color: ch.bookmarked ? '#f59e0b' : 'var(--text-muted)', fontSize: '1.1rem', cursor: 'pointer' }}
                        >
                          {ch.bookmarked ? '★' : '☆'}
                        </button>
                      </div>
                    </div>
                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginTop: '12px' }}>{ch.title}</h4>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-secondary)', marginTop: '16px', fontWeight: 600 }}>
                      {ch.completed ? '✓ Mastered' : '⏳ Practice Now'} &rarr;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Chapter view */}
        {activeSubject && activeChapter && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header / Breadcrumb navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <div>
                <button 
                  onClick={handleCloseChapter}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  &larr; Back to Subjects
                </button>
                <h2 style={{ fontSize: '1.8rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {activeChapter.title}
                  <button 
                    onClick={() => handleToggleBookmark(activeChapter)}
                    style={{ background: 'transparent', border: 'none', color: activeChapter.bookmarked ? '#f59e0b' : 'var(--text-muted)', fontSize: '1.3rem', cursor: 'pointer' }}
                    title="Bookmark Chapter"
                  >
                    {activeChapter.bookmarked ? '★' : '☆'}
                  </button>
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-points)', fontWeight: 600, background: 'rgba(241,196,15,0.1)', padding: '6px 12px', borderRadius: '4px' }}>
                  ⚡ +{activeChapter.xpReward} XP
                </span>
                <button 
                  onClick={() => handleToggleComplete(activeChapter)}
                  className="primary-btn"
                  style={{
                    padding: '10px 24px',
                    fontSize: '0.9rem',
                    background: activeChapter.completed ? 'rgba(46, 204, 113, 0.15)' : 'var(--accent-gradient)',
                    borderColor: activeChapter.completed ? 'var(--color-solved)' : 'transparent',
                    color: activeChapter.completed ? '#2ecc71' : 'white'
                  }}
                >
                  {activeChapter.completed ? '✓ Mastered' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Core Markdown Content */}
            <div className="chapter-body-content" style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <MarkdownViewer content={activeChapter.content} />
            </div>

            {/* Code Examples Section */}
            {activeChapter.codeExamples && activeChapter.codeExamples.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '16px' }}>💻 Programming Implementations</h3>
                
                {/* Language selectors */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  {activeChapter.codeExamples.map(ex => (
                    <button
                      key={ex.language}
                      onClick={() => setCodeLang(ex.language)}
                      style={{
                        padding: '6px 16px',
                        background: codeLang === ex.language ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                        border: '1px solid',
                        borderColor: codeLang === ex.language ? '#a78bfa' : 'transparent',
                        borderRadius: '4px',
                        color: codeLang === ex.language ? 'white' : 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {ex.language.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Code display block */}
                {activeChapter.codeExamples.map(ex => {
                  if (ex.language !== codeLang) return null;
                  return (
                    <pre 
                      key={ex.language}
                      style={{
                        background: '#0d1117',
                        padding: '16px',
                        borderRadius: '6px',
                        overflowX: 'auto',
                        fontSize: '0.88rem',
                        color: '#c9d1d9',
                        fontFamily: 'monospace'
                      }}
                    >
                      <code>{ex.code}</code>
                    </pre>
                  );
                })}
              </div>
            )}

            {/* Tips & Pitfalls split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ background: 'rgba(46, 204, 113, 0.03)', border: '1px solid rgba(46, 204, 113, 0.15)', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ color: '#2ecc71', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>💡 High-Yield Interview Tips</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {activeChapter.interviewTips || 'Discuss memory constraints and computational limits dynamically during interviews.'}
                </p>
              </div>

              <div style={{ background: 'rgba(231, 76, 60, 0.03)', border: '1px solid rgba(231, 76, 60, 0.15)', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ color: '#e74c3c', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>⚠️ Common Pitfalls & Mistakes</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {activeChapter.commonMistakes || 'Ignoring edge cases, off-by-one indices bounds checks, and pointer references null warnings.'}
                </p>
              </div>
            </div>

            {/* Accordion Q&A list */}
            {activeChapter.realInterviewQuestions && activeChapter.realInterviewQuestions.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '16px' }}>🎯 Real Interview Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeChapter.realInterviewQuestions.map((q, idx) => (
                    <div 
                      key={idx}
                      style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', overflow: 'hidden' }}
                    >
                      <div 
                        onClick={() => setExpandedFAQIndex(expandedFAQIndex === idx ? null : idx)}
                        style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}
                      >
                        <span style={{ fontWeight: 600, color: 'white', fontSize: '0.92rem' }}>
                          Q: {q.question}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
                          {expandedFAQIndex === idx ? '▲' : '▼'}
                        </span>
                      </div>
                      {expandedFAQIndex === idx && (
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.5', background: 'rgba(0,0,0,0.1)' }}>
                          {q.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company FAQs tags */}
            {activeChapter.companyFAQs && activeChapter.companyFAQs.length > 0 && (
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Frequently Asked By:
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {activeChapter.companyFAQs.map((faq, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '4px 12px',
                        background: 'rgba(0, 242, 254, 0.08)',
                        border: '1px solid rgba(0, 242, 254, 0.2)',
                        borderRadius: '16px',
                        fontSize: '0.78rem',
                        color: 'var(--accent-secondary)',
                        fontWeight: 600
                      }}
                    >
                      🏢 {faq.companyName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next / Prev footer navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '32px' }}>
              <button
                onClick={handlePrevChapter}
                disabled={activeChapterIndex <= 0}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: activeChapterIndex <= 0 ? 'var(--text-muted)' : 'white',
                  cursor: activeChapterIndex <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                &larr; Previous Chapter
              </button>
              <button
                onClick={handleNextChapter}
                disabled={activeChapterIndex >= (activeSubject ? activeSubject.chapters.length - 1 : 0)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  color: activeChapterIndex >= (activeSubject ? activeSubject.chapters.length - 1 : 0) ? 'var(--text-muted)' : 'white',
                  cursor: activeChapterIndex >= (activeSubject ? activeSubject.chapters.length - 1 : 0) ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Next Chapter &rarr;
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default TheoryHub;

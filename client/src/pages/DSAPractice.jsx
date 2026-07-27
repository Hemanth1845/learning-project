import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const highlightCode = (code, lang) => {
  if (!code) return '';
  
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'python') {
    const regex = /(#[^\n]*)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|\b(def|class|return|if|else|elif|for|in|while|import|from|try|except|pass|True|False|None|print|and|or|not|is|lambda|global|nonlocal|with|as|yield|del|break|continue)\b|([()\[\]{}])|\b(\d+)\b/g;

    return escaped.replace(regex, (match, comment, string, keyword, bracket, number) => {
      if (comment) return `<span style="color: #6a9955; font-style: italic;">${comment}</span>`;
      if (string) return `<span style="color: #ce9178;">${string}</span>`;
      if (keyword) return `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`;
      if (bracket) return `<span style="color: #ffd700;">${bracket}</span>`;
      if (number) return `<span style="color: #b5cea8;">${number}</span>`;
      return match;
    });
  } 
  else {
    let regex;
    if (lang === 'javascript') {
      regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)|\b(function|const|let|var|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|new|class|import|export|from|true|false|null|undefined|console|log)\b|([()\[\]{}])|\b(\d+)\b/g;
    } else {
      regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|\b(class|public|private|protected|static|void|int|double|float|char|boolean|string|vector|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|new|true|false|null|vector|include|using|namespace|std)\b|([()\[\]{}])|\b(\d+)\b/g;
    }

    return escaped.replace(regex, (match, comment, string, keyword, bracket, number) => {
      if (comment) return `<span style="color: #6a9955; font-style: italic;">${comment}</span>`;
      if (string) return `<span style="color: #ce9178;">${string}</span>`;
      if (keyword) return `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`;
      if (bracket) return `<span style="color: #ffd700;">${bracket}</span>`;
      if (number) return `<span style="color: #b5cea8;">${number}</span>`;
      return match;
    });
  }
};

const DSAPractice = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ points: 0, problemsSolved: 0, rank: 999 });
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Split-screen workspace states
  const [activeProblem, setActiveProblem] = useState(null);
  const [editorLang, setEditorLang] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [compilerLoading, setCompilerLoading] = useState(false);
  const [compilerResults, setCompilerResults] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [terminalError, setTerminalError] = useState('');
  const [showXPModal, setShowXPModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const topics = [
    'All', 'Arrays', 'Dynamic Programming', 'Binary Search', 'Stacks & Queues', 
    'Strings', 'Linked Lists', 'Recursion & Backtracking', 'Sliding Window', 
    'Heaps', 'Greedy', 'Trees', 'Graphs', 'Tries', 'Bit Manipulation'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (token) {
      fetchProblems();
      fetchBookmarks();
    }
  }, [token]);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/dsa`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProblems(data.problems || []);
      setStats(data.stats || { points: 0, problemsSolved: 0, rank: 999 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/bookmarks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookmarkedIds(data.dsa.map(p => p._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSolve = async (id) => {
    try {
      const res = await fetch(`${API_URL}/dsa/${id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Update problems state
      setProblems(prev =>
        prev.map(p => p._id === id ? { ...p, solved: data.solved } : p)
      );
      // Update stats state
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (id) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType: 'dsa', itemId: id })
      });
      const data = await res.json();
      if (data.bookmarked) {
        setBookmarkedIds(prev => [...prev, id]);
      } else {
        setBookmarkedIds(prev => prev.filter(bId => bId !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartPractice = (prob) => {
    setActiveProblem(prob);
    setTerminalOutput('');
    setTerminalError('');
    // Auto-populate custom input with cleaned example 1 input
    let initialInput = '';
    if (prob.examples && prob.examples.length > 0) {
      const rawInput = prob.examples[0].input || '';
      let clean = rawInput;
      if (clean.includes('=')) {
        clean = clean.split('=').pop();
      }
      clean = clean.replace(/[\[\]]/g, '').trim();
      initialInput = clean.split(',').map(x => x.trim()).join(' ');
    }
    setCustomInput(initialInput);
    setCompilerResults(null);
    const initialLang = 'javascript';
    setEditorLang(initialLang);
    
    const template = getDefaultTemplate(prob.title, initialLang);
    setEditorCode(template);
  };

  useEffect(() => {
    if (problems.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const probId = params.get('problemId');
      if (probId) {
        const found = problems.find(p => p._id === probId || p.problemId === Number(probId));
        if (found) {
          handleStartPractice(found);
        }
      }
    }
  }, [problems]);

  const handleLangChange = (lang) => {
    setEditorLang(lang);
    if (activeProblem) {
      const template = getDefaultTemplate(activeProblem.title, lang);
      setEditorCode(template);
    }
  };

  const handleClearOutput = () => {
    setTerminalOutput('');
    setTerminalError('');
    setCompilerResults(null);
  };

  const getDefaultTemplate = (title, lang) => {
    if (lang === 'javascript') {
      return `// JavaScript normal compiler\n// Write your solution code here. Output using console.log\n\n`;
    }
    if (lang === 'python') {
      return `# Python 3 normal compiler\n# Write your solution code here. Output using print()\n\n`;
    }
    if (lang === 'java') {
      return `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here. Output using System.out.println\n    }\n}`;
    }
    return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here. Output using cout\n    return 0;\n}`;
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    const { selectionStart, selectionEnd, value } = textarea;

    // 1. Handle Backspace (deleting bracket pairs, e.g. () or [] or "")
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
      const charBefore = value.charAt(selectionStart - 1);
      const charAfter = value.charAt(selectionStart);
      const bracketPairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'"
      };
      if (bracketPairs[charBefore] === charAfter) {
        e.preventDefault();
        // Clear character after the cursor
        textarea.setSelectionRange(selectionStart, selectionStart + 1);
        document.execCommand('insertText', false, '');
        // Clear character before the cursor
        textarea.setSelectionRange(selectionStart - 1, selectionStart);
        document.execCommand('insertText', false, '');
        return;
      }
    }

    // 2. Handle Tab Key (Indentation)
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
      return;
    }

    // 3. Handle Auto-Close Brackets & Quotes
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key] !== undefined) {
      e.preventDefault();
      document.execCommand('insertText', false, e.key + pairs[e.key]);
      // Move cursor back inside the bracket pair
      textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
      return;
    }

    // 4. Overwrite Closing Characters
    const closingChars = [')', ']', '}', '"', "'"];
    if (closingChars.includes(e.key) && value.charAt(selectionStart) === e.key && selectionStart === selectionEnd) {
      e.preventDefault();
      textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
      return;
    }

    // 5. Handle Auto-Indentation on Enter Key
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Find current line and its indentation
      const lines = value.substring(0, selectionStart).split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Match leading whitespace
      const match = currentLine.match(/^(\s*)/);
      let indent = match ? match[1] : '';
      
      // If previous line ended with a colon (Python syntax) or left brace (JS/Java/C++), add extra indent
      if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) {
        indent += '    ';
      }
      
      const newlineValue = '\n' + indent;
      document.execCommand('insertText', false, newlineValue);
      return;
    }
  };

  const handleScroll = (e) => {
    const textarea = e.target;
    const highlightPre = document.getElementById('highlight-pre');
    if (highlightPre) {
      highlightPre.scrollTop = textarea.scrollTop;
      highlightPre.scrollLeft = textarea.scrollLeft;
    }
  };

  const handleRunCode = async () => {
    if (!activeProblem) return;
    setCompilerLoading(true);
    setTerminalOutput('');
    setTerminalError('');
    setCompilerResults(null);

    try {
      const res = await fetch(`${API_URL}/dsa/${activeProblem._id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: editorLang,
          code: editorCode,
          customInput: customInput
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTerminalOutput(data.output || 'Process finished with exit code 0.');
        } else {
          setTerminalError(data.error || 'Execution Error.');
          setTerminalOutput(data.output || '');
        }
      } else {
        setTerminalError('Server error running code.');
      }
    } catch (error) {
      console.error(error);
      setTerminalError('Network error executing code.');
    } finally {
      setCompilerLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!activeProblem) return;
    setCompilerLoading(true);
    setTerminalOutput('');
    setTerminalError('');
    setCompilerResults(null);

    try {
      const res = await fetch(`${API_URL}/dsa/${activeProblem._id}/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: editorLang,
          code: editorCode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCompilerResults(data);
        
        if (data.success) {
          setTerminalOutput('✓ All hidden test cases passed successfully! Submission complete.');
          // Update solved status locally
          setProblems(prev =>
            prev.map(p => p._id === activeProblem._id ? { ...p, solved: true } : p)
          );
          
          setTimeout(() => {
            fetchProblems();
            setShowXPModal(true);
          }, 800);
        } else {
          setTerminalError(data.error || 'Submission failed: Output did not match expected testcase values.');
        }
      } else {
        setTerminalError('Server error submitting solution.');
      }
    } catch (error) {
      console.error(error);
      setTerminalError('Network error submitting solution.');
    } finally {
      setCompilerLoading(false);
    }
  };

  const handleClosePractice = () => {
    setActiveProblem(null);
    setCompilerResults(null);
  };

  // Filter problems based on active topic and difficulty tags
  const filteredProblems = problems.filter(p => {
    const topicMatch = selectedTopic === 'All' || p.topic === selectedTopic;
    const diffMatch = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    return topicMatch && diffMatch;
  });

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading DSA Practice Hub...</div>;
  }

  // Count progress indicators
  const totalInTopic = filteredProblems.length;
  const solvedInTopic = filteredProblems.filter(p => p.solved).length;
  const progressPercent = totalInTopic > 0 ? Math.round((solvedInTopic / totalInTopic) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* RENDER ACTIVE PRACTICE split-pane IDE WORKSPACE */}
      {activeProblem ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 120px)' }}>
          {/* Workspace Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', padding: '12px 20px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={handleClosePractice}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ← Back to List
              </button>
              <div>
                <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{activeProblem.problemId}. {activeProblem.title}</span>
                  <span className={`difficulty-pill ${activeProblem.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                    {activeProblem.difficulty}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-points)' }}>⚡ {activeProblem.xp} XP</span>
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language:</span>
              <select 
                value={editorLang}
                onChange={(e) => handleLangChange(e.target.value)}
                style={{ background: '#111', border: '1px solid var(--border-glass)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                <option value="javascript">JavaScript (Node)</option>
                <option value="python">Python 3</option>
                <option value="java">Java 21</option>
                <option value="cpp">C++ (GCC)</option>
              </select>
            </div>
          </div>

          {/* IDE Split Screen */}
          <div style={{ display: 'grid', gridTemplateColumns: isFullscreen ? '1fr' : '1fr 1.2fr', gap: isFullscreen ? '0px' : '20px', flex: 1, overflow: 'hidden' }}>
            
            {/* Left Column: Problem Information */}
            <div className="glass-card" style={{ display: isFullscreen ? 'none' : 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', padding: '24px' }}>
              
              <div>
                <h3 style={{ fontSize: '1rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '12px' }}>
                  📝 Problem Description
                </h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                  {activeProblem.description || 'No description seeded for this problem.'}
                </div>
              </div>

              {activeProblem.examples && activeProblem.examples.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '12px' }}>
                    💡 Examples
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeProblem.examples.map((ex, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '8px' }}>Example {idx + 1}:</h4>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> <span style={{ color: 'white' }}>{ex.input}</span></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>Output:</span> <span style={{ color: 'var(--color-points)' }}>{ex.output}</span></div>
                          {ex.explanation && (
                            <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Explanation: {ex.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '12px' }}>
                  🏫 Related Topics & Subtopics
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="filter-tag active" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                    🏷️ {activeProblem.topic}
                  </span>
                  <span className={`difficulty-pill ${activeProblem.difficulty.toLowerCase()}`} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    Subtopic: {activeProblem.difficulty}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: OnlineGDB Compiler Interface */}
            <div style={isFullscreen ? {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: '#0a0f1d',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '24px',
              boxSizing: 'border-box',
              overflowY: 'auto'
            } : {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'hidden'
            }}>
              
              {/* Compiler Header Bar */}
              <div style={{ display: 'flex', background: '#1c2833', padding: '10px 16px', borderRadius: '8px 8px 0 0', border: '1px solid var(--border-glass)', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: 'white', fontWeight: 'bold', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📄 main.{editorLang === 'javascript' ? 'js' : editorLang === 'python' ? 'py' : editorLang === 'java' ? 'java' : 'cpp'}
                </span>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    type="button"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-glass)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isFullscreen ? "🗜️ Minimize" : "📺 Fullscreen"}
                  </button>

                  <button 
                    onClick={handleRunCode}
                    disabled={compilerLoading}
                    style={{
                      background: '#27ae60',
                      border: 'none',
                      color: 'white',
                      padding: '8px 18px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    className="gdb-btn-hover"
                  >
                    ▶ Run
                  </button>

                  <button 
                    onClick={handleSubmitCode}
                    disabled={compilerLoading}
                    style={{
                      background: '#2980b9',
                      border: 'none',
                      color: 'white',
                      padding: '8px 18px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    className="gdb-btn-hover"
                  >
                    📤 Submit
                  </button>
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1.2, border: '1px solid var(--border-glass)', marginTop: '-16px', borderRadius: '0 0 8px 8px', background: '#121212' }}>
                <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {/* Simulated Line numbers */}
                  <div style={{ width: '40px', background: '#181818', borderRight: '1px solid #282828', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.78rem', color: '#555', fontFamily: 'Consolas, Monaco, monospace', userSelect: 'none', lineHeight: '1.5', zIndex: 3 }}>
                    {Array.from({ length: Math.max(15, editorCode.split('\n').length) }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Highlighted pre code container (behind the textarea) */}
                  <pre 
                    id="highlight-pre"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '40px', // Align with textarea left margin (after line numbers)
                      right: 0,
                      bottom: 0,
                      margin: 0,
                      padding: '16px',
                      background: 'transparent',
                      color: '#a9b7c6',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '0.92rem',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      whiteSpace: 'pre',
                      wordWrap: 'normal',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                    dangerouslySetInnerHTML={{ __html: highlightCode(editorCode, editorLang) }}
                  />

                  {/* Code textarea field (transparent text on top) */}
                  <textarea
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onScroll={handleScroll}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '40px',
                      right: 0,
                      bottom: 0,
                      background: 'transparent',
                      border: 'none',
                      color: 'transparent',
                      caretColor: '#ffffff', // Make sure caret is visible
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '0.92rem',
                      padding: '16px',
                      resize: 'none',
                      outline: 'none',
                      lineHeight: '1.5',
                      overflowY: 'auto',
                      whiteSpace: 'pre',
                      wordWrap: 'normal',
                      zIndex: 2
                    }}
                    placeholder="// Write your solution code here..."
                  />
                </div>
              </div>

              {/* Custom Input (Stdin) Textbox */}
              <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#1c2833', border: '1px solid var(--border-glass)' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Custom Input (stdin)</label>
                <textarea 
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter inputs here (e.g. 0\n1\n0\n3\n12)"
                  rows="2"
                  style={{
                    background: '#121212',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    color: 'white',
                    fontFamily: 'monospace',
                    padding: '8px 12px',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Output Console Terminal */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', flex: 0.8, minHeight: '150px', background: '#000000', border: '2px solid #2c3e50', padding: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', paddingBottom: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    Console stdout / stderr
                  </span>
                  <button
                    onClick={handleClearOutput}
                    type="button"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#e74c3c',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      fontFamily: 'monospace',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                    className="clear-btn-hover"
                  >
                    Clear Output
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                  {compilerLoading && (
                    <div style={{ color: '#27ae60' }}>⚙️ Compiling and executing process...</div>
                  )}

                  {!compilerLoading && !terminalOutput && !terminalError && !compilerResults && (
                    <div style={{ color: '#555' }}>Terminal ready. Click "Run" to test custom inputs, or "Submit" to test suite.</div>
                  )}

                  {terminalOutput && (
                    <div style={{ color: '#ffffff' }}>{terminalOutput}</div>
                  )}

                  {terminalError && (
                    <div style={{ color: '#fda4af' }}>{terminalError}</div>
                  )}

                  {/* Submission Test Case Results */}
                  {compilerResults && compilerResults.testResults && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#f1c40f', textTransform: 'uppercase' }}>Submission Assertions:</span>
                      {compilerResults.testResults.map((tr, trIdx) => (
                        <div key={trIdx} style={{ fontSize: '0.8rem', color: tr.passed ? '#2ecc71' : '#e74c3c' }}>
                          Testcase {trIdx + 1}: {tr.passed ? 'Passed ✓' : 'Failed ✗'} (Input: {tr.input} | Expected: {tr.expected} | Got: {tr.output})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedTopic === 'All' ? (
            <>
              {/* Page Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'white' }}>DSA Practice Hub</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Select a topic section below to access handpicked, frequently asked interview challenges grouped by difficulty.
                  </p>
                </div>
                
                {/* Completion Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600 }}>
                    {problems.filter(p => p.solved).length} / {problems.length} Overall Problems Completed
                  </span>
                  <div style={{ width: '220px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <div style={{ width: `${problems.length > 0 ? Math.round((problems.filter(p => p.solved).length / problems.length) * 100) : 0}%`, height: '100%', background: 'var(--color-solved)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>

              {/* Hero Gamified Score Cards */}
              <section className="dsa-hero-stats">
                <div className="dsa-stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.8rem' }}>⚡</span>
                    <div className="dsa-stat-title" style={{ marginTop: '8px' }}>Total XP Points</div>
                  </div>
                  <div className="dsa-stat-value" style={{ color: 'var(--accent-secondary)' }}>{stats.points}</div>
                </div>

                <div className="dsa-stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.8rem' }}>🏆</span>
                    <div className="dsa-stat-title" style={{ marginTop: '8px' }}>Problems Solved</div>
                  </div>
                  <div className="dsa-stat-value" style={{ color: 'var(--color-solved)' }}>{stats.problemsSolved}</div>
                </div>

                <div className="dsa-stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.8rem' }}>👑</span>
                    <div className="dsa-stat-title" style={{ marginTop: '8px' }}>Global Ranking</div>
                  </div>
                  <div className="dsa-stat-value" style={{ color: 'var(--color-hard)' }}>#{stats.rank}</div>
                </div>
              </section>

              {/* Grid of Topic Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
                {topics.filter(t => t !== 'All').map(topic => {
                  const topicProblems = problems.filter(p => p.topic === topic);
                  const solvedProblems = topicProblems.filter(p => p.solved).length;
                  const totalCount = topicProblems.length;
                  const percent = totalCount > 0 ? Math.round((solvedProblems / totalCount) * 100) : 0;
                  
                  const getEmoji = (t) => {
                    switch(t) {
                      case 'Arrays': return '📊';
                      case 'Strings': return '🔤';
                      case 'Linked Lists': return '🔗';
                      case 'Stacks & Queues': return '🥞';
                      case 'Binary Search': return '🔍';
                      case 'Dynamic Programming': return '🧠';
                      case 'Recursion & Backtracking': return '🔄';
                      case 'Trees': return '🌲';
                      case 'Graphs': return '🕸️';
                      case 'Heaps': return '⚡';
                      case 'Greedy': return '💸';
                      case 'Sliding Window': return '🪟';
                      default: return '🏷️';
                    }
                  };

                  return (
                    <div 
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className="glass-card gdb-btn-hover"
                      style={{
                        padding: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '16px',
                        border: '1px solid var(--border-glass)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        background: 'rgba(255, 255, 255, 0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '2rem' }}>{getEmoji(topic)}</span>
                          <h3 style={{ fontSize: '1.2rem', color: 'white', marginTop: '12px', fontWeight: 600 }}>{topic}</h3>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
                          {solvedProblems} / {totalCount} Solved
                        </span>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                          <span>Completion Progress</span>
                          <span>{percent}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--color-solved)' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Back Navigation Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => setSelectedTopic('All')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600
                  }}
                  className="gdb-btn-hover"
                >
                  ← Back to Topic Sections
                </button>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '1.6rem', color: 'white', fontWeight: 600 }}>{selectedTopic} Practice Plan</h2>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Category: handpicked coding challenges
                  </span>
                </div>
              </div>

              {/* Three Column Dynamic Difficulties */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '10px' }}>
                {/* Easy Column */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(46, 204, 113, 0.15)' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-easy)', borderBottom: '2px solid var(--color-easy)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>🟢 Easy Problems</span>
                    <span style={{ color: 'var(--text-muted)' }}>({problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Easy').length})</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Easy').length > 0 ? (
                      problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Easy').map(prob => {
                        const isBookmarked = bookmarkedIds.includes(prob._id);
                        return (
                          <div 
                            key={prob._id}
                            style={{
                              padding: '12px 16px',
                              background: prob.solved ? 'rgba(46, 204, 113, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: '1px solid var(--border-glass)',
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="checkbox"
                                checked={!!prob.solved}
                                onChange={() => handleToggleSolve(prob._id)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-solved)' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>{prob.title}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>XP Weight: {prob.xp}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span 
                                onClick={() => window.open(prob.videoUrl || `https://www.youtube.com/results?search_query=leetcode+${encodeURIComponent(prob.title)}`, '_blank')}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="yt-hover-icon"
                                title="Watch YouTube explanation"
                              >
                                🎥
                              </span>
                              <span 
                                onClick={() => handleStartPractice(prob)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="cube-hover-icon"
                                title="Open Workspace Sandbox"
                              >
                                🟨
                              </span>
                              <span 
                                onClick={() => handleToggleBookmark(prob._id)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)' }}
                                title="Add to favorites"
                              >
                                {isBookmarked ? '★' : '☆'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '16px 0' }}>No easy challenges in this section.</span>
                    )}
                  </div>
                </div>

                {/* Medium Column */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(241, 196, 15, 0.15)' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-medium)', borderBottom: '2px solid var(--color-medium)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>🟡 Medium Problems</span>
                    <span style={{ color: 'var(--text-muted)' }}>({problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Medium').length})</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Medium').length > 0 ? (
                      problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Medium').map(prob => {
                        const isBookmarked = bookmarkedIds.includes(prob._id);
                        return (
                          <div 
                            key={prob._id}
                            style={{
                              padding: '12px 16px',
                              background: prob.solved ? 'rgba(46, 204, 113, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: '1px solid var(--border-glass)',
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="checkbox"
                                checked={!!prob.solved}
                                onChange={() => handleToggleSolve(prob._id)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-solved)' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>{prob.title}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>XP Weight: {prob.xp}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span 
                                onClick={() => window.open(prob.videoUrl || `https://www.youtube.com/results?search_query=leetcode+${encodeURIComponent(prob.title)}`, '_blank')}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="yt-hover-icon"
                                title="Watch YouTube explanation"
                              >
                                🎥
                              </span>
                              <span 
                                onClick={() => handleStartPractice(prob)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="cube-hover-icon"
                                title="Open Workspace Sandbox"
                              >
                                🟨
                              </span>
                              <span 
                                onClick={() => handleToggleBookmark(prob._id)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)' }}
                                title="Add to favorites"
                              >
                                {isBookmarked ? '★' : '☆'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '16px 0' }}>No medium challenges in this section.</span>
                    )}
                  </div>
                </div>

                {/* Hard Column */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(231, 76, 60, 0.15)' }}>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--color-hard)', borderBottom: '2px solid var(--color-hard)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>🔴 Hard Problems</span>
                    <span style={{ color: 'var(--text-muted)' }}>({problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Hard').length})</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Hard').length > 0 ? (
                      problems.filter(p => p.topic === selectedTopic && p.difficulty === 'Hard').map(prob => {
                        const isBookmarked = bookmarkedIds.includes(prob._id);
                        return (
                          <div 
                            key={prob._id}
                            style={{
                              padding: '12px 16px',
                              background: prob.solved ? 'rgba(46, 204, 113, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: '1px solid var(--border-glass)',
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="checkbox"
                                checked={!!prob.solved}
                                onChange={() => handleToggleSolve(prob._id)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-solved)' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>{prob.title}</span>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>XP Weight: {prob.xp}</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span 
                                onClick={() => window.open(prob.videoUrl || `https://www.youtube.com/results?search_query=leetcode+${encodeURIComponent(prob.title)}`, '_blank')}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="yt-hover-icon"
                                title="Watch YouTube explanation"
                              >
                                🎥
                              </span>
                              <span 
                                onClick={() => handleStartPractice(prob)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer' }}
                                className="cube-hover-icon"
                                title="Open Workspace Sandbox"
                              >
                                🟨
                              </span>
                              <span 
                                onClick={() => handleToggleBookmark(prob._id)}
                                style={{ fontSize: '1.25rem', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)' }}
                                title="Add to favorites"
                              >
                                {isBookmarked ? '★' : '☆'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '16px 0' }}>No hard challenges in this section.</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUCCESS CONFIRMATION XP AWARD MODAL */}
      {showXPModal && activeProblem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 100000 }}>
          <div className="glass-card" style={{ maxWidth: '420px', width: '90%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', border: '2px solid var(--color-solved)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)' }}>
            <div>
              <span style={{ fontSize: '3rem' }}>🎉</span>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--color-solved)', marginTop: '12px' }}>Solution Accepted!</h2>
              <p style={{ color: 'white', fontSize: '0.9rem', marginTop: '8px' }}>
                You successfully solved <strong>{activeProblem.title}</strong>!
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points Rewarded</span>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-solved)', margin: '4px 0 0 0' }}>+{activeProblem.xp} XP</h3>
            </div>

            <button 
              onClick={() => setShowXPModal(false)}
              className="primary-btn"
              style={{ background: 'var(--color-solved)', borderColor: 'var(--color-solved)', color: 'black', padding: '10px 0', width: '100%', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}
            >
              Continue to Workspace
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gdb-btn-hover:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .yt-hover-icon:hover {
          transform: scale(1.2) translateY(-2px);
          filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5));
        }
        .cube-hover-icon:hover {
          transform: scale(1.2) translateY(-2px);
          filter: drop-shadow(0 0 5px rgba(255, 184, 0, 0.5));
        }
      `}</style>

    </div>
  );
};

export default DSAPractice;

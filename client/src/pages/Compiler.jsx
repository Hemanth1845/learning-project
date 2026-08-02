import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

// Basic inline syntax highlighter for general boilerplates
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
  } else if (lang === 'javascript') {
    const regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)|\b(function|const|let|var|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|new|class|import|export|from|true|false|null|undefined|console|log)\b|([()\[\]{}])|\b(\d+)\b/g;
    return escaped.replace(regex, (match, comment, string, keyword, bracket, number) => {
      if (comment) return `<span style="color: #6a9955; font-style: italic;">${comment}</span>`;
      if (string) return `<span style="color: #ce9178;">${string}</span>`;
      if (keyword) return `<span style="color: #569cd6; font-weight: bold;">${keyword}</span>`;
      if (bracket) return `<span style="color: #ffd700;">${bracket}</span>`;
      if (number) return `<span style="color: #b5cea8;">${number}</span>`;
      return match;
    });
  } else {
    const regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|\b(class|public|private|protected|static|void|int|double|float|char|boolean|string|vector|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|new|true|false|null|include|using|namespace|std|System|out|println)\b|([()\[\]{}])|\b(\d+)\b/g;
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

const boilerplates = {
  javascript: `// JavaScript (Node.js) Environment\nclass Solution {\n    solve(nums) {\n        // Write your code here\n        \n    }\n}\n\n// Usage example:\n// const sol = new Solution();\n// console.log(sol.solve([1,2,3]));`,
  python: `# Python 3 Environment\nclass Solution:\n    def solve(self, nums: List[int]) -> List[int]:\n        # Write your code here\n        pass\n`,
  java: `// Java 21 Environment\n// Keep class name as "Solution" for compilation\nimport java.util.*;\n\npublic class Solution {\n    public int[] solve(int[] nums) {\n        // Write your code here\n        return nums;\n    }\n    \n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(Arrays.toString(sol.solve(new int[]{1, 2, 3})));\n    }\n}`,
  cpp: `// C++ (GCC) Environment\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Write your code here\n        return nums;\n    }\n};\n\nint main() {\n    Solution sol;\n    vector<int> res = sol.solve({1, 2, 3});\n    for (int x : res) cout << x << " ";\n    cout << endl;\n    return 0;\n}`,
  c: `// C (GCC) Environment\n#include <stdio.h>\n#include <stdlib.h>\n\n// Solution structure style\nint* solve(int* nums, int numsSize, int* returnSize) {\n    *returnSize = numsSize;\n    int* res = (int*)malloc(numsSize * sizeof(int));\n    for (int i = 0; i < numsSize; i++) res[i] = nums[i];\n    return res;\n}\n\nint main() {\n    int nums[] = {1, 2, 3};\n    int returnSize;\n    int* res = solve(nums, 3, &returnSize);\n    for (int i = 0; i < returnSize; i++) printf("%d ", res[i]);\n    printf("\\n");\n    free(res);\n    return 0;\n}`
};

const themes = {
  vsdark: {
    name: 'VS Dark',
    bg: '#1e1e1e',
    text: '#d4d4d4',
    caret: '#ffffff',
    lineBg: '#181818',
    lineText: '#858585',
    border: 'rgba(255,255,255,0.08)'
  },
  onedark: {
    name: 'One Dark Pro',
    bg: '#282c34',
    text: '#abb2bf',
    caret: '#528bff',
    lineBg: '#21252b',
    lineText: '#4b5263',
    border: 'rgba(255,255,255,0.1)'
  },
  light: {
    name: 'Clean Light',
    bg: '#ffffff',
    text: '#383a42',
    caret: '#526fff',
    lineBg: '#f3f3f3',
    lineText: '#a0a1a7',
    border: 'rgba(0,0,0,0.1)'
  },
  monokai: {
    name: 'Monokai',
    bg: '#272822',
    text: '#f8f8f2',
    caret: '#f8f8f0',
    lineBg: '#1e1f1c',
    lineText: '#75715e',
    border: 'rgba(255,255,255,0.08)'
  },
  goldenamber: {
    name: 'Golden Amber',
    bg: '#120b00',
    text: '#ffb800',
    caret: '#ffa500',
    lineBg: '#090500',
    lineText: '#8b7d6b',
    border: 'rgba(255,184,0,0.15)'
  },
  deepocean: {
    name: 'Deep Ocean',
    bg: '#050c1e',
    text: '#38bdf8',
    caret: '#00f2fe',
    lineBg: '#03060f',
    lineText: '#475569',
    border: 'rgba(0,242,254,0.15)'
  }
};

const Compiler = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [lang, setLang] = useState(() => localStorage.getItem('compiler_lang') || 'javascript');
  const [themeKey, setThemeKey] = useState('vsdark');
  const [code, setCode] = useState(() => localStorage.getItem(`compiler_code_${localStorage.getItem('compiler_lang') || 'javascript'}`) || boilerplates[localStorage.getItem('compiler_lang') || 'javascript']);
  const [customInput, setCustomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const activeTheme = themes[themeKey];

  useEffect(() => {
    // Sync scroll between textarea and highlighted pre
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [code]);

  useEffect(() => {
    localStorage.setItem('compiler_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(`compiler_code_${lang}`, code);
  }, [code, lang]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    const stored = localStorage.getItem(`compiler_code_${newLang}`);
    setCode(stored || boilerplates[newLang]);
    setOutput('');
    setError('');
  };

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // set caret position after tab insertion
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/dsa/compiler/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          language: lang,
          code: code,
          customInput: customInput
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOutput(data.output || 'Execution complete. Exit code 0.');
        } else {
          setError(data.error || 'Execution Error.');
          setOutput(data.output || '');
        }
      } else {
        setError('Server error running code.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error compiling code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset code template to default? All changes will be lost.')) {
      setCode(boilerplates[lang]);
      localStorage.removeItem(`compiler_code_${lang}`);
      setOutput('');
      setError('');
    }
  };

  const lineCount = Math.max(15, code.split('\n').length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 120px)' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Interactive Code Compiler</h2>
          <p style={{ color: 'var(--text-muted)' }}>Write, test, and run code instantly across multiple programming languages</p>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', border: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Language selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>LANGUAGE</span>
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="form-input"
              style={{ background: 'rgba(0,0,0,0.3)', height: '36px', padding: '0 12px', fontSize: '0.85rem', width: '170px' }}
            >
              <option value="c">C (GCC)</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java 21</option>
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node)</option>
            </select>
          </div>

          {/* Theme selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>EDITOR THEME</span>
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              className="form-input"
              style={{ background: 'rgba(0,0,0,0.3)', height: '36px', padding: '0 12px', fontSize: '0.85rem', width: '150px' }}
            >
              {Object.keys(themes).map(key => (
                <option key={key} value={key}>{themes[key].name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            className="gdb-btn-hover"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="gdb-btn-hover"
          >
            {loading ? '⚙️ Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>

      {/* Editor & Console Split Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Code Editor block */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '8px', border: `1px solid ${activeTheme.border}`, background: activeTheme.bg }}>
          {/* Header status bar */}
          <div style={{ background: activeTheme.lineBg, padding: '8px 16px', borderBottom: `1px solid ${activeTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: activeTheme.lineText, fontWeight: 'bold' }}>
              main.{lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'java' ? 'java' : 'cpp'}
            </span>
            <span style={{ fontSize: '0.75rem', color: activeTheme.lineText }}>
              Theme: {activeTheme.name}
            </span>
          </div>

          <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Line numbers column */}
            <div style={{
              width: '45px',
              background: activeTheme.lineBg,
              borderRight: `1px solid ${activeTheme.border}`,
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: activeTheme.lineText,
              fontFamily: 'Consolas, Monaco, monospace',
              userSelect: 'none',
              lineHeight: '1.5',
              zIndex: 3
            }}>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Highlight shadow pre */}
            <pre
              ref={preRef}
              style={{
                position: 'absolute',
                top: 0,
                left: '45px',
                right: 0,
                bottom: 0,
                margin: 0,
                padding: '16px',
                background: 'transparent',
                color: activeTheme.text,
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.92rem',
                lineHeight: '1.5',
                overflow: 'hidden',
                whiteSpace: 'pre',
                wordWrap: 'normal',
                pointerEvents: 'none',
                zIndex: 1
              }}
              dangerouslySetInnerHTML={{ __html: highlightCode(code, lang) }}
            />

            {/* TextArea editor */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              style={{
                position: 'absolute',
                top: 0,
                left: '45px',
                right: 0,
                bottom: 0,
                background: 'transparent',
                border: 'none',
                color: themeKey === 'light' ? 'rgba(0,0,0,0.85)' : 'transparent',
                caretColor: themeKey === 'light' ? 'black' : '#ffffff',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.92rem',
                padding: '16px',
                resize: 'none',
                outline: 'none',
                lineHeight: '1.5',
                overflowY: 'auto',
                whiteSpace: 'pre',
                wordWrap: 'normal',
                zIndex: 2,
                opacity: themeKey === 'light' ? 1 : 0.88,
                textShadow: themeKey === 'light' ? 'none' : '0 0 0 ' + activeTheme.text
              }}
              placeholder="// Write your code here..."
            />
          </div>
        </div>

        {/* Right Side: Inputs and Console output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          
          {/* Custom Stdin card */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-glass)', flex: 0.4 }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Custom Input (stdin)</label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Provide inputs to read (e.g. inputs values on newlines)..."
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                color: 'white',
                fontFamily: 'monospace',
                padding: '8px 12px',
                outline: 'none',
                resize: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Console Terminal output block */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 0.6, background: '#000000', border: '2px solid #1a2530', borderRadius: '8px', padding: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', paddingBottom: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 'bold' }}>
                Console stdout / stderr
              </span>
              <button
                onClick={() => { setOutput(''); setError(''); }}
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
                Clear Console
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.85rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
              {loading && (
                <div style={{ color: 'var(--accent-secondary)' }}>⚙️ Running and executing source code...</div>
              )}

              {!loading && !output && !error && (
                <div style={{ color: '#444' }}>Terminal status: Idle. Click "Run Code" to compile and check output.</div>
              )}

              {output && (
                <div style={{ color: '#2ecc71' }}>{output}</div>
              )}

              {error && (
                <div style={{ color: '#e74c3c', marginTop: '4px' }}>{error}</div>
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .gdb-btn-hover:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .clear-btn-hover:hover {
          background: rgba(231, 76, 60, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Compiler;

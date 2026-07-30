import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Simple Markdown to HTML converter function
const parseMarkdown = (text) => {
  if (!text) return '';
  let html = text;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; color: white; margin: 18px 0 8px 0; border-left: 3px solid var(--accent-secondary); padding-left: 8px;">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size: 1.05rem; color: white; margin: 14px 0 6px 0;">$1</h4>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Bullet lists
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: square;">$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 6px; list-style-type: decimal;">$1</li>');

  // Paragraph splits
  html = html.replace(/\n\n/g, '<p style="margin-bottom: 12px; line-height: 1.6;"></p>');
  
  return html;
};

// High-Fidelity Placement Studio Style Textbook Content Parser
const TextbookContentParser = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentBlockType = null; // 'list', 'code', 'table', 'text'
  let currentBlockLines = [];
  let inCodeBlock = false;

  const flushBlock = (key) => {
    if (currentBlockLines.length === 0) return;

    const blockText = currentBlockLines.join('\n');
    const trimmedBlockText = blockText.trim();
    if (!trimmedBlockText) {
      currentBlockLines = [];
      return;
    }

    if (currentBlockType === 'list') {
      elements.push(
        <ul key={key} style={{ paddingLeft: '24px', listStyleType: 'none', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentBlockLines.map((line, lIdx) => {
            const content = line.replace(/^[\s-*•\d.]+\.?\s*/, '').trim();
            const parts = content.split('**');
            const formattedContent = parts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} style={{ color: '#111111', fontWeight: 700 }}>{part}</strong>;
              }
              return part;
            });
            return (
              <li key={lIdx} style={{ position: 'relative', color: '#333333', fontSize: '0.94rem', lineHeight: '1.65', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <span style={{ position: 'absolute', left: '-16px', color: '#e67e22', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: '1.2' }}>•</span>
                {formattedContent}
              </li>
            );
          })}
        </ul>
      );
    } else if (currentBlockType === 'code') {
      // Remove code fences
      const cleanedLines = currentBlockLines.filter(l => !l.trim().startsWith('```'));
      elements.push(
        <div key={key} style={{
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
          {cleanedLines.join('\n')}
        </div>
      );
    } else if (currentBlockType === 'table') {
      // Parse table rows
      const dataLines = currentBlockLines.filter(line => line.includes('|') && !line.includes('+--') && !line.includes('===') && !line.includes('---'));
      if (dataLines.length > 0) {
        const rows = dataLines.map(line => {
          return line.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        });
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);
        elements.push(
          <div key={key} style={{ overflowX: 'auto', margin: '24px 0', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fdf2f0', borderBottom: '2px solid #f8d7da' }}>
                  {headerRow.map((cell, idx) => (
                    <th key={idx} style={{ padding: '12px 16px', color: '#b02a37', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: rIdx === bodyRows.length - 1 ? 'none' : '1px solid #f1f5f9', background: rIdx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ padding: '12px 16px', color: '#334155', fontSize: '0.88rem', fontFamily: 'system-ui, sans-serif', lineHeight: '1.5' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } else {
      // Plain text block
      const parts = trimmedBlockText.split('**');
      const formatted = parts.map((part, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} style={{ color: '#111111', fontWeight: 700 }}>{part}</strong>;
        }
        return part;
      });

      // Check if it's a solved example style card
      const isExample = trimmedBlockText.includes('Q:') || trimmedBlockText.includes('Question:') || trimmedBlockText.includes('Solution:');
      if (isExample) {
        const titleLine = currentBlockLines[0].replace(/^###?\s+/, '').replace(/\*\*/g, '').replace(/^✨\s*/, '').trim();
        const restLines = currentBlockLines.slice(1).join('\n');
        elements.push(
          <div key={key} style={{
            background: '#edf2ff',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
          }}>
            <h5 style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.96rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'system-ui, sans-serif' }}>
              <span>✨</span> {titleLine || 'Key Insight'}
            </h5>
            <div style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.65', fontFamily: 'system-ui, sans-serif', whiteSpace: 'pre-wrap' }}>
              {restLines}
            </div>
          </div>
        );
      } else {
        elements.push(
          <p key={key} style={{ color: '#2d3748', fontSize: '0.96rem', lineHeight: '1.7', margin: '14px 0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {formatted}
          </p>
        );
      }
    }

    currentBlockLines = [];
    currentBlockType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // If inside a code fence, consume everything until closing fence
    if (inCodeBlock) {
      currentBlockLines.push(line);
      if (trimmed.startsWith('```')) {
        flushBlock(i);
        inCodeBlock = false;
      }
      continue;
    }

    // Check for code fence start
    if (trimmed.startsWith('```')) {
      flushBlock(i);
      currentBlockType = 'code';
      inCodeBlock = true;
      currentBlockLines.push(line);
      continue;
    }

    // 1. Check for headings (Starts with #)
    if (trimmed.startsWith('#')) {
      flushBlock(i);
      const headingText = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      const level = (trimmed.match(/^#+/) || ['#'])[0].length;
      const fontSize = level === 1 ? '2.1rem' : level === 2 ? '1.8rem' : level === 3 ? '1.5rem' : '1.25rem';
      elements.push(
        <div key={i} style={{ margin: '24px 0 10px 0', borderBottom: level <= 3 ? '1px solid #e2e8f0' : 'none', paddingBottom: '8px' }}>
          <h4 style={{ fontFamily: 'Georgia, serif', color: '#111111', fontSize: fontSize, fontWeight: 700 }}>
            {headingText}
          </h4>
        </div>
      );
      continue;
    }

    // 2. Check for empty line
    if (!trimmed) {
      flushBlock(i);
      continue;
    }

    // 3. Check for bullet lists
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      if (currentBlockType !== 'list') {
        flushBlock(i);
        currentBlockType = 'list';
      }
      currentBlockLines.push(line);
      continue;
    }

    // 4. Check for tables (starts with | or contains | but not code/diagram)
    if (trimmed.startsWith('|')) {
      if (currentBlockType !== 'table') {
        flushBlock(i);
        currentBlockType = 'table';
      }
      currentBlockLines.push(line);
      continue;
    }

    // 5. Otherwise, text
    if (currentBlockType === null) {
      currentBlockType = 'text';
    } else if (currentBlockType !== 'text') {
      flushBlock(i);
      currentBlockType = 'text';
    }
    currentBlockLines.push(line);
  }

  flushBlock(lines.length);

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{elements}</div>;
};

const getGoogleDriveEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const Courses = () => {
  const { token, reloadProfile, API_URL } = useContext(AuthContext);
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [selectedNoteLesson, setSelectedNoteLesson] = useState(null);
  const [selectedVideoLesson, setSelectedVideoLesson] = useState(null);
  
  // Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [expandedQAs, setExpandedQAs] = useState({});

  // Sub-tabs & Categories
  const [activeSubTab, setActiveSubTab] = useState('notes'); // 'notes', 'videos', 'interview', 'project'
  const [selectedFullStackCat, setSelectedFullStackCat] = useState(null); // 'Frontend', 'Backend', 'Database'
  const [projectFile, setProjectFile] = useState('');
  const [projectFileName, setProjectFileName] = useState('');
  const [projectSubmission, setProjectSubmission] = useState(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);

  const toggleQA = (idx) => {
    setExpandedQAs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectSubmission = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/submission`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjectSubmission(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProjectFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProjectFile(reader.result); // Base64 content
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectFile) {
      alert('Please select a project file to upload first.');
      return;
    }
    setProjectSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/courses/${activeCourse._id}/submit-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileUrl: projectFile,
          fileName: projectFileName
        })
      });
      if (res.ok) {
        alert('Project submitted successfully for admin review!');
        fetchProjectSubmission(activeCourse._id);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit project');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProjectSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchBookmarks();
    }
  }, [token]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data);
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
      setBookmarkedCourses(data.courses.map(c => c._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const autoCourseTitle = searchParams.get('course');
      if (autoCourseTitle) {
        const found = courses.find(c => 
          c.title.toLowerCase().includes('full-stack') || 
          c.title.toLowerCase().includes('fullstack') ||
          c.slug === autoCourseTitle ||
          c.title.toLowerCase().includes(autoCourseTitle.toLowerCase())
        );
        if (found) {
          handleSelectCourse(found);
        }
      }
    }
  }, [courses, location.search]);

  const handleSelectCourse = async (course) => {
    setActiveCourse(course);
    setLessons([]);
    setActiveLesson(null);
    setSelectedNoteLesson(null);
    setSelectedVideoLesson(null);
    setQuizResult(null);
    setSelectedAnswers({});
    setExpandedQAs({});
    setActiveSubTab('notes');
    fetchProjectSubmission(course._id);
    try {
      const res = await fetch(`${API_URL}/courses/${course._id}/lessons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLessons(data);
      if (course.pdfUrl) {
        setSelectedNoteLesson({ _id: 'course-main-pdf', title: 'Main Course Notes', pdfUrl: course.pdfUrl });
      } else if (data.length > 0) {
        const noteLes = data.find(l => l.pdfUrl);
        if (noteLes) setSelectedNoteLesson(noteLes);
      }
      if (data.length > 0) {
        handleSelectLesson(course._id, data[0]);
        const vidLes = data.find(l => l.videoUrl);
        if (vidLes) setSelectedVideoLesson(vidLes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLesson = async (courseId, lesson) => {
    setQuizResult(null);
    setSelectedAnswers({});
    setExpandedQAs({});
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/lessons/${lesson._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setActiveLesson(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionClick = (qIndex, oIndex) => {
    if (quizResult) return; // locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: oIndex
    }));
  };

  const handleQuizSubmit = async () => {
    if (!activeLesson || !activeLesson.lesson.quiz) return;
    const questions = activeLesson.lesson.quiz.questions;
    
    // Check that all questions are answered
    const answersArray = [];
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        alert('Please answer all questions before submitting.');
        return;
      }
      answersArray.push(selectedAnswers[i]);
    }

    try {
      const res = await fetch(`${API_URL}/courses/${activeCourse._id}/lessons/${activeLesson.lesson._id}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray })
      });
      const data = await res.json();
      setQuizResult(data);
      
      // Update local lesson state
      if (data.passed) {
        setActiveLesson(prev => ({ ...prev, quizCompleted: true, quizScore: data.score }));
        setLessons(prev => prev.map(l => l._id === activeLesson.lesson._id ? { ...l, quizCompleted: true } : l));
      }
      
      // Recalculate course list progress
      fetchCourses();
      reloadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteInterviewPrep = async () => {
    if (!activeLesson) return;
    try {
      const res = await fetch(`${API_URL}/courses/${activeCourse._id}/lessons/${activeLesson.lesson._id}/interview-prep/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setActiveLesson(prev => ({ ...prev, quizCompleted: true }));
        setLessons(prev => prev.map(l => l._id === activeLesson.lesson._id ? { ...l, quizCompleted: true } : l));
        fetchCourses();
        reloadProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/bookmarks/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType: 'course', itemId: courseId })
      });
      const data = await res.json();
      if (data.bookmarked) {
        setBookmarkedCourses(prev => [...prev, courseId]);
      } else {
        setBookmarkedCourses(prev => prev.filter(id => id !== courseId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Courses catalog...</div>;
  }

  // 1. If inside course, render Syllabus & Lesson Reader Panel
  if (activeCourse) {
    const isBookmarked = bookmarkedCourses.includes(activeCourse._id);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Course Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div>
            <button onClick={() => { setActiveCourse(null); fetchCourses(); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Back to Catalog
            </button>
            <h2 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeCourse.title}
              <button 
                onClick={() => handleToggleBookmark(activeCourse._id)} 
                style={{ background: 'transparent', border: 'none', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
                title="Bookmark Course"
              >
                {isBookmarked ? '★' : '☆'}
              </button>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Removed View Full PDF Notes button */}
            {activeCourse.externalLink && (
              <button 
                onClick={() => window.open(activeCourse.externalLink, '_blank')}
                className="primary-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--accent-secondary)',
                  borderColor: 'var(--accent-secondary)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                🔗 External Reference
              </button>
            )}
            {activeCourse.practicePageUrl && (
              <button 
                onClick={() => {
                  if (activeCourse.practicePageUrl.startsWith('/')) {
                    window.location.href = activeCourse.practicePageUrl;
                  } else {
                    window.open(activeCourse.practicePageUrl, '_blank');
                  }
                }}
                className="primary-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-solved)',
                  borderColor: 'var(--color-solved)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                💻 Practice Sandbox
              </button>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Course Progress</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${activeCourse.progress || 0}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{activeCourse.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {lessons.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          
          {/* Tab Navigation Menu */}
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveSubTab('notes')}
              className="warroom-btn"
              style={{
                background: activeSubTab === 'notes' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}
            >
              📄 Lecture Notes
            </button>
            <button
              onClick={() => setActiveSubTab('videos')}
              className="warroom-btn"
              style={{
                background: activeSubTab === 'videos' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}
            >
              🎥 Video Lectures
            </button>
            <button
              onClick={() => setActiveSubTab('interview')}
              className="warroom-btn"
              style={{
                background: activeSubTab === 'interview' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}
            >
              ❓ Interview Q&As
            </button>
            {(activeCourse.category === 'Web Development' || activeCourse.parentCategory) && (
              <button
                onClick={() => setActiveSubTab('project')}
                className="warroom-btn"
                style={{
                  background: activeSubTab === 'project' ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                💻 Project Submission
              </button>
            )}
          </div>

          {/* TAB CONTENT AREAS */}

          {/* 1. NOTES TAB */}
          {activeSubTab === 'notes' && (() => {
            const notesLessons = [];
            if (activeCourse.pdfUrl) {
              notesLessons.push({ _id: 'course-main-pdf', title: 'Main Course Notes', pdfUrl: activeCourse.pdfUrl });
            }
            lessons.forEach(l => {
              if (l.pdfUrl) {
                notesLessons.push(l);
              }
            });

            return (
              <div className="glass-card" style={{ padding: '32px 40px', background: '#ffffff', borderRadius: '12px', color: '#2d3748' }}>
                <h2 style={{ fontSize: '1.7rem', fontFamily: 'Georgia, serif', color: '#111111', borderBottom: '2px solid #e67e22', paddingBottom: '8px', marginBottom: '20px' }}>
                  📄 Lecture Notes
                </h2>
                
                {/* Notes List selector */}
                {notesLessons.length > 0 ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {notesLessons.map((les, index) => {
                      const isSelected = selectedNoteLesson?._id === les._id;
                      return (
                        <button
                          key={les._id}
                          onClick={() => setSelectedNoteLesson(les)}
                          style={{
                            padding: '8px 16px',
                            background: isSelected ? 'var(--accent-gradient)' : '#f3f4f6',
                            color: isSelected ? 'white' : '#4b5563',
                            border: '1px solid #e5e7eb',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          Notes {index + 1}: {les.title}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: '#718096', padding: '20px 0' }}>No notes available.</div>
                )}

                {/* PDF Viewer */}
                {(selectedNoteLesson?.pdfUrl || activeCourse.pdfUrl) ? (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e0', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '60px', zIndex: 10, background: 'transparent' }} />
                    <iframe
                      src={getGoogleDriveEmbedUrl(selectedNoteLesson?.pdfUrl || activeCourse.pdfUrl)}
                      width="100%"
                      height="650px"
                      style={{ border: 'none' }}
                      allow="autoplay"
                    ></iframe>
                  </div>
                ) : (
                  notesLessons.length > 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                      Please select a note file from the list above.
                    </div>
                  )
                )}
              </div>
            );
          })()}

          {/* 2. VIDEOS TAB */}
          {activeSubTab === 'videos' && (() => {
            const videoLessons = lessons.filter(l => l.videoUrl);
            return (
              <div className="glass-card" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '20px' }}>🎥 Embedded Explanation Videos</h2>
                
                {/* Video list selector */}
                {videoLessons.length > 0 ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {videoLessons.map((les, index) => {
                      const isSelected = selectedVideoLesson?._id === les._id;
                      return (
                        <button
                          key={les._id}
                          onClick={() => setSelectedVideoLesson(les)}
                          className="warroom-btn"
                          style={{
                            padding: '8px 16px',
                            background: isSelected ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                            color: 'white',
                            borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--border-glass)',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          Video {index + 1}: {les.title}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  !activeCourse.externalLink && <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>No video lectures available.</div>
                )}

                {(selectedVideoLesson?.videoUrl || activeCourse.externalLink) ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <iframe
                      src={selectedVideoLesson?.videoUrl || activeCourse.externalLink}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      title={selectedVideoLesson?.title || activeCourse.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  videoLessons.length > 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Please select a lecture video from the list above.
                    </div>
                  )
                )}
              </div>
            );
          })()}

          {/* 3. INTERVIEW QUESTIONS TAB */}
          {activeSubTab === 'interview' && (() => {
            const allQuestions = [];
            lessons.forEach(l => {
              if (l.interviewQuestions && l.interviewQuestions.length > 0) {
                l.interviewQuestions.forEach(q => {
                  allQuestions.push({
                    ...q,
                    lessonTitle: l.title
                  });
                });
              }
            });

            return (
              <div className="quiz-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '20px' }}>💬 Technical Interview Q&As</h2>
                {allQuestions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {allQuestions.map((q, idx) => {
                      const isOpen = !!expandedQAs[idx];
                      return (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', overflow: 'hidden' }}>
                          <button
                            onClick={() => toggleQA(idx)}
                            style={{ width: '100%', padding: '16px 20px', textAlign: 'left', background: 'transparent', border: 'none', color: 'white', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <span>Q{idx + 1}: {q.question} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({q.lessonTitle})</span></span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isOpen ? '▲ Hide Answer' : '▼ Reveal Answer'}</span>
                          </button>
                          {isOpen && (
                            <div style={{ padding: '16px 20px', background: 'rgba(59, 130, 246, 0.04)', borderTop: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                              {q.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No interview questions added to this course yet.
                  </div>
                )}
              </div>
            );
          })()}

          {/* 4. PROJECTS TAB */}
          {activeSubTab === 'project' && (
            <div className="glass-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '20px' }}>💻 Full-Stack Course Project Workshop</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Upload your completed source code, build scripts, or project archive. Our administrators will review the structure, run checks, and provide grades/comments.
              </p>

              <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'white' }}>Select Project File (.zip, .rar, .js, .html, .css)</label>
                  <input
                    type="file"
                    onChange={handleProjectFileUpload}
                    style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={projectSubmitting}
                  className="primary-btn"
                  style={{ alignSelf: 'flex-start', padding: '10px 24px' }}
                >
                  {projectSubmitting ? 'Uploading Submission...' : 'Submit Project Code'}
                </button>
              </form>

              {projectSubmission && (
                <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    Active Submission: <span style={{ color: 'var(--accent-secondary)' }}>{projectSubmission.fileName}</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '32px', marginTop: '14px', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        background: projectSubmission.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: projectSubmission.status === 'Approved' ? 'var(--color-solved)' : '#f59e0b'
                      }}>
                        {projectSubmission.status}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Submitted: </span>
                      <span style={{ color: 'white' }}>{new Date(projectSubmission.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {projectSubmission.remarks && (
                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid var(--accent-secondary)' }}>
                      <strong>Evaluator Remarks:</strong>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '6px', margin: 0 }}>{projectSubmission.remarks}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>No lessons found for this course.</div>
        )}
      </div>
    );
  }

  const isFullStackDev = location.search.includes('course=fullstack-web-dev');

  if (isFullStackDev && !activeCourse) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Full-Stack Development Track</h2>
          <p style={{ color: 'var(--text-muted)' }}>Select a development layer below to view specialised languages and frameworks.</p>
        </div>

        {selectedFullStackCat === null ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '16px' }}>
            
            {/* Frontend Box */}
            <div 
              onClick={() => setSelectedFullStackCat('Frontend')}
              className="company-card" 
              style={{ padding: '40px 24px', cursor: 'pointer', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold' }}>Frontend Track</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px' }}>Learn HTML, CSS, JavaScript, and React to build beautiful responsive user interfaces.</p>
            </div>

            {/* Backend Box */}
            <div 
              onClick={() => setSelectedFullStackCat('Backend')}
              className="company-card" 
              style={{ padding: '40px 24px', cursor: 'pointer', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚙️</div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold' }}>Backend Track</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px' }}>Master Node.js, Express.js, Spring Boot and modern server architectures.</p>
            </div>

            {/* Database Box */}
            <div 
              onClick={() => setSelectedFullStackCat('Database')}
              className="company-card" 
              style={{ padding: '40px 24px', cursor: 'pointer', textAlign: 'center', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💾</div>
              <h3 style={{ fontSize: '1.4rem', color: 'white', fontWeight: 'bold' }}>Database Track</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px' }}>Learn relational databases (MySQL) and NoSQL stores (MongoDB) for robust persistence.</p>
            </div>

          </div>
        ) : (
          <div>
            <button 
              onClick={() => setSelectedFullStackCat(null)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '20px' }}
            >
              ← Back to Tracks
            </button>
            <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '16px' }}>{selectedFullStackCat} Courses</h3>
            
            <div className="companies-grid">
              {courses
                .filter(c => c.parentCategory === selectedFullStackCat)
                .map((course) => {
                  const isBookmarked = bookmarkedCourses.includes(course._id);
                  return (
                    <div 
                      key={course._id} 
                      className="company-card" 
                      onClick={() => handleSelectCourse(course)}
                      style={{ minHeight: '220px', cursor: 'pointer' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <img src={course.thumbnail || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=100'} alt={course.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                          <span className={`difficulty-pill ${course.difficulty.toLowerCase()}`}>
                            {course.difficulty}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 className="company-title">{course.title}</h3>
                        </div>
                        <p className="company-desc" style={{ marginTop: '8px', height: '45px', overflow: 'hidden' }}>{course.description}</p>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          <span>{course.progress || 0}% Complete</span>
                          <span>📝 {course.totalLessonsCount || 0} Lessons</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {courses.filter(c => c.parentCategory === selectedFullStackCat).length === 0 && (
                <div style={{ color: 'var(--text-muted)', padding: '20px' }}>No courses added to this track yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Default Course Catalog Grid Layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Courses Catalog</h2>
          <p style={{ color: 'var(--text-muted)' }}>Complete syllabus for core CS subjects and modern programming languages</p>
        </div>
      </div>

      {/* Grid of Courses */}
      <section className="companies-grid">
        {courses
          .filter(c => !c.parentCategory && !c.title.toLowerCase().includes('fullstack') && !c.title.toLowerCase().includes('full-stack'))
          .map((course) => {
            const isBookmarked = bookmarkedCourses.includes(course._id);
            return (
              <div 
                key={course._id} 
                className="company-card" 
                onClick={() => handleSelectCourse(course)}
                style={{ minHeight: '260px', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=100'} alt={course.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span className={`difficulty-pill ${course.difficulty.toLowerCase()}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="company-title">{course.title}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleBookmark(course._id); }} 
                      style={{ background: 'transparent', border: 'none', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', marginTop: '6px' }}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="company-desc" style={{ marginTop: '8px', height: '60px', overflow: 'hidden' }}>{course.description}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>Category: {course.category}</span>
                    <span>{course.progress || 0}% Complete</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ width: `${course.progress || 0}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="resources-count">📝 {course.totalLessonsCount || 0} Lessons</span>
                  </div>
                </div>
              </div>
            );
          })}
      </section>

    </div>
  );
};

export default Courses;

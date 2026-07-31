import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const projectRoadmap = [
  { index: 1, title: 'Personal Portfolio', difficulty: 'Beginner', xp: 50, desc: 'Create a responsive, multi-page portfolio website presenting your skills, background, and projects using clean semantic HTML and CSS.' },
  { index: 2, title: 'Landing Page', difficulty: 'Beginner', xp: 50, desc: 'Build a premium product landing page with CSS grid, Flexbox, glassmorphism card layouts, and subtle animations.' },
  { index: 3, title: 'Restaurant Website', difficulty: 'Easy', xp: 75, desc: 'Develop a restaurant website incorporating menus, online reservation forms, interactive maps, and responsive CSS styling.' },
  { index: 4, title: 'Weather App', difficulty: 'Medium', xp: 100, desc: 'Program a dynamic React Weather forecast application connecting to OpenWeatherMap API with city search.' },
  { index: 5, title: 'Netflix Clone', difficulty: 'Medium', xp: 120, desc: 'Build a movie streaming homepage catalog using React, TMDB API, CSS transitions, and lazy-loading lists.' },
  { index: 6, title: 'Admin Dashboard', difficulty: 'Medium', xp: 150, desc: 'Design a professional SaaS admin dashboard featuring chart analytics, sidebar tabs, user tables, and dark mode toggles.' },
  { index: 7, title: 'E-Commerce Portal', difficulty: 'Hard', xp: 200, desc: 'Create a full-stack shopping portal with cart persistence, product listings, category filters, and simulated stripe checkout.' },
  { index: 8, title: 'Social Media App', difficulty: 'Hard', xp: 250, desc: 'Develop a social network timeline with post creation, likes count, real-time comments, and profile picture updates.' },
  { index: 9, title: 'Learning Management System', difficulty: 'Hard', xp: 300, desc: 'Build an LMS system where teachers upload courses/lessons, and students track progress and complete quizzes.' },
  { index: 10, title: 'Final Industry Project', difficulty: 'Expert', xp: 500, desc: 'Construct a secure production-grade enterprise application integrating microservices, REST APIs, JWT, and Docker setups.' }
];

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
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // 'dashboard', 'notes', 'videos', 'interview', 'project'
  const [selectedFullStackCat, setSelectedFullStackCat] = useState(null); // 'Frontend', 'Backend', 'Database'
  const [projectFile, setProjectFile] = useState('');
  const [projectFileName, setProjectFileName] = useState('');
  const [projectSubmission, setProjectSubmission] = useState(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(1);
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectReport, setProjectReport] = useState('');

  const toggleQA = (idx) => {
    setExpandedQAs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectSubmission = async (courseId, pIdx = 1) => {
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/submission?projectIndex=${pIdx}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjectSubmission(data);
      } else {
        setProjectSubmission(null);
      }
    } catch (err) {
      console.error(err);
      setProjectSubmission(null);
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
    if (!projectGithub.trim() && !projectDemo.trim() && !projectFile) {
      alert('Please provide at least a GitHub repository link, Live Demo link, or a ZIP file.');
      return;
    }
    setProjectSubmitting(true);
    
    const projectTitle = projectRoadmap.find(p => p.index === selectedProjectIndex)?.title || 'Project';

    try {
      const res = await fetch(`${API_URL}/courses/${activeCourse._id}/submit-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileUrl: projectFile,
          fileName: projectFileName,
          projectIndex: selectedProjectIndex,
          projectTitle,
          githubLink: projectGithub,
          liveDemoLink: projectDemo,
          reportText: projectReport
        })
      });
      if (res.ok) {
        alert('Project submitted successfully for admin review!');
        fetchProjectSubmission(activeCourse._id, selectedProjectIndex);
        // Clear input form
        setProjectGithub('');
        setProjectDemo('');
        setProjectReport('');
        setProjectFile('');
        setProjectFileName('');
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

  // 1. If inside course, render Course Dashboard / Sub-tab panels
  if (activeCourse) {
    const isBookmarked = bookmarkedCourses.includes(activeCourse._id);
    const completedLessonsCount = lessons.filter(l => l.quizCompleted).length;
    const progressPercent = lessons.length ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Breadcrumb path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => { setActiveCourse(null); setSelectedFullStackCat(null); }}>Full Stack Course</span>
          <span>&gt;</span>
          {activeCourse.parentCategory && (
            <>
              <span style={{ cursor: 'pointer' }} onClick={() => { setActiveCourse(null); setSelectedFullStackCat(activeCourse.parentCategory); }}>{activeCourse.parentCategory}</span>
              <span>&gt;</span>
            </>
          )}
          <span style={{ color: 'white', fontWeight: 600 }}>{activeCourse.title}</span>
        </div>

        {/* Course Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <button onClick={() => { 
              if (activeSubTab !== 'dashboard') {
                setActiveSubTab('dashboard');
              } else {
                setActiveCourse(null);
                fetchCourses();
              }
            }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← {activeSubTab !== 'dashboard' ? 'Back to Technology Dashboard' : 'Back to Layer Directory'}
            </button>
            <h2 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
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
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Technology Progress</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. TECH DASHBOARD LANDING */}
        {activeSubTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Time</div>
                <div style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700, marginTop: '4px' }}>24 Hours</div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Completed Lessons</div>
                <div style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700, marginTop: '4px' }}>{completedLessonsCount} / {lessons.length}</div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Difficulty Level</div>
                <div style={{ fontSize: '1.4rem', color: 'white', fontWeight: 700, marginTop: '4px' }}>{activeCourse.difficulty}</div>
              </div>
              <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>XP Reward</div>
                <div style={{ fontSize: '1.4rem', color: 'var(--accent-secondary)', fontWeight: 700, marginTop: '4px' }}>+150 XP</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '12px' }} className="scorecard-panel">
              <div 
                className="glass-card" 
                onClick={() => setActiveSubTab('notes')}
                style={{ padding: '30px', cursor: 'pointer', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📄</div>
                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>Lecture Notes</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Preview chapter notes, cheat sheets, quick revision summaries and ask AI assistants to clarify topics.</p>
              </div>

              <div 
                className="glass-card" 
                onClick={() => setActiveSubTab('videos')}
                style={{ padding: '30px', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎥</div>
                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>Video Lectures</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Watch embedded explanation walkthroughs and coding tutorials without leaving the portal page.</p>
              </div>

              <div 
                className="glass-card" 
                onClick={() => setActiveSubTab('interview')}
                style={{ padding: '30px', cursor: 'pointer', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>❓</div>
                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>Interview Q&As</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Master placement technical interview question rubrics, common mistakes, and ideal responses.</p>
              </div>

              <div 
                className="glass-card" 
                onClick={() => {
                  setActiveSubTab('project');
                  fetchProjectSubmission(activeCourse._id, selectedProjectIndex);
                }}
                style={{ padding: '30px', cursor: 'pointer', background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💻</div>
                <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>Projects Workshop</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Upload project submissions (Roadmap steps 1 to 10) to earn points and receive code feedback report.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. LECTURE NOTES SUB-TAB */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e67e22', paddingBottom: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.7rem', fontFamily: 'Georgia, serif', color: '#111111', margin: 0 }}>
                  📄 Lecture Notes
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => alert('Summary generated by AI!\n\nThis technology covers core client side scripting and modular layouts. Always keep styles separated from layout configurations.')} style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Summarize Chapter</button>
                  <button onClick={() => alert('Quick revision flashcards generated!\n\n1. Flexbox vs Grid\n2. Block vs Inline components\n3. Semantic structure')} style={{ background: '#10b981', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Flashcards</button>
                </div>
              </div>
              
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
                <div style={{ color: '#718096', padding: '20px 0' }}>No notes available. Use the interactive tools above or refer to core documentation.</div>
              )}

              {/* PDF Viewer */}
              {(selectedNoteLesson?.pdfUrl || activeCourse.pdfUrl) ? (
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e0', position: 'relative' }}>
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

        {/* 3. VIDEO LECTURES SUB-TAB */}
        {activeSubTab === 'videos' && (() => {
          const videoLessons = lessons.filter(l => l.videoUrl);
          return (
            <div className="glass-card" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '20px' }}>🎥 Embedded Explanation Videos</h2>
              
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

        {/* 4. INTERVIEW QUESTIONS SUB-TAB */}
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
                            <div style={{ marginBottom: '12px' }}><strong>Ideal Expected Response:</strong><p style={{ marginTop: '4px', color: '#e2e8f0' }}>{q.answer}</p></div>
                            <div style={{ borderTop: '1px dashed var(--border-glass)', paddingTop: '10px', marginTop: '10px' }}>
                              <strong style={{ color: 'var(--color-hard)' }}>⚠️ Common Interview Mistakes:</strong>
                              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Forgetting to explain time complexity, skipping concrete code examples, or using ambiguous terminology.</p>
                            </div>
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

        {/* 5. PROJECTS WORKSHOP SUB-TAB (10-STEP PROGRESSIVE ROADMAP) */}
        {activeSubTab === 'project' && (
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px' }}>💻 Full-Stack Course Project Workshop</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Select a project from the 10-step progressive path to view constraints and submit demo links.
            </p>

            {/* Slider track of 10 steps */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)' }}>
              {projectRoadmap.map((p) => {
                const isActive = p.index === selectedProjectIndex;
                return (
                  <button
                    key={p.index}
                    onClick={() => {
                      setSelectedProjectIndex(p.index);
                      fetchProjectSubmission(activeCourse._id, p.index);
                    }}
                    style={{
                      flex: '0 0 auto',
                      padding: '12px 18px',
                      background: isActive ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.02)',
                      color: 'white',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--accent-secondary)' : 'var(--border-glass)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minWidth: '150px'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Step {p.index}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.88rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', marginTop: '4px' }}>{p.difficulty}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Project Specs */}
            {(() => {
              const proj = projectRoadmap.find(p => p.index === selectedProjectIndex) || projectRoadmap[0];
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }} className="scorecard-panel">
                  
                  {/* Left Specs */}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚀</span> Project {proj.index}: {proj.title}
                    </h3>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginTop: '10px', lineHeight: '1.6' }}>
                      {proj.desc}
                    </p>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ color: 'white', fontSize: '0.95rem' }}>Submission Requirements:</h4>
                      <ul style={{ color: 'var(--text-muted)', fontSize: '0.88rem', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Provide clean GitHub repository link.</li>
                        <li>Include a hosted live website URL (Vercel/Render/Netlify).</li>
                        <li>Submit a short project description notes list.</li>
                      </ul>
                    </div>

                    <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label>GitHub Repository URL *</label>
                          <input 
                            type="url" 
                            className="form-input" 
                            placeholder="https://github.com/your-username/repo" 
                            value={projectGithub} 
                            onChange={(e) => setProjectGithub(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Live Demo Website URL</label>
                          <input 
                            type="url" 
                            className="form-input" 
                            placeholder="https://your-project.vercel.app" 
                            value={projectDemo} 
                            onChange={(e) => setProjectDemo(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Brief Project Architecture Notes / Report</label>
                        <textarea 
                          className="form-input" 
                          rows="3" 
                          placeholder="Explain state management, design decisions, database choice..."
                          value={projectReport} 
                          onChange={(e) => setProjectReport(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>ZIP File upload (Optional)</label>
                        <input 
                          type="file" 
                          onChange={handleProjectFileUpload}
                          style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}
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
                  </div>

                  {/* Right: Submission Status & Grade Card */}
                  <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '16px' }}>Evaluation Report</h3>
                    {projectSubmission ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            background: projectSubmission.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : projectSubmission.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: projectSubmission.status === 'Approved' ? 'var(--color-solved)' : projectSubmission.status === 'Rejected' ? 'var(--color-hard)' : '#f59e0b'
                          }}>
                            {projectSubmission.status}
                          </span>
                        </div>

                        {projectSubmission.scores && projectSubmission.scores.overall > 0 && (
                          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Overall Grade:</span>
                              <strong style={{ color: 'var(--color-points)' }}>{projectSubmission.scores.overall}%</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              <span>UI Design:</span>
                              <span>{projectSubmission.scores.ui}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              <span>Code Quality:</span>
                              <span>{projectSubmission.scores.codeQuality}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              <span>Logic / Flow:</span>
                              <span>{projectSubmission.scores.logic}%</span>
                            </div>
                          </div>
                        )}

                        {projectSubmission.remarks && (
                          <div style={{ borderTop: '1px dashed var(--border-glass)', paddingTop: '12px', fontSize: '0.88rem' }}>
                            <div style={{ fontWeight: 600, color: 'white', marginBottom: '4px' }}>Remarks:</div>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{projectSubmission.remarks}</p>
                          </div>
                        )}

                        {projectSubmission.aiSuggestions && projectSubmission.aiSuggestions.strengths && (
                          <div style={{ borderTop: '1px dashed var(--border-glass)', paddingTop: '12px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div>
                              <strong style={{ color: 'var(--color-solved)' }}>✔ Strengths:</strong>
                              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{projectSubmission.aiSuggestions.strengths}</div>
                            </div>
                            <div>
                              <strong style={{ color: 'var(--color-hard)' }}>✘ Weaknesses:</strong>
                              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{projectSubmission.aiSuggestions.weaknesses}</div>
                            </div>
                            <div>
                              <strong style={{ color: 'var(--accent-secondary)' }}>💡 Suggestions:</strong>
                              <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{projectSubmission.aiSuggestions.suggestions}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
                        No submissions uploaded yet for Step {proj.index}. Submit your links on the left to activate grading.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
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
              style={{ 
                padding: '40px 24px', 
                cursor: 'pointer', 
                textAlign: 'center', 
                background: 'rgba(59, 130, 246, 0.03)', 
                border: '1.5px solid transparent',
                borderImage: 'linear-gradient(135deg, #3b82f6, #00f2fe) 1',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3.5rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>Frontend Track</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>HTML • CSS • JavaScript • React • Next.js</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>Learn HTML, CSS, JavaScript, and React to build beautiful responsive user interfaces.</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                <span>📚 5 Courses</span>
                <span>⏱️ 45 Hours</span>
              </div>
            </div>

            {/* Backend Box */}
            <div 
              onClick={() => setSelectedFullStackCat('Backend')}
              className="company-card" 
              style={{ 
                padding: '40px 24px', 
                cursor: 'pointer', 
                textAlign: 'center', 
                background: 'rgba(16, 185, 129, 0.03)', 
                border: '1.5px solid transparent',
                borderImage: 'linear-gradient(135deg, #10b981, #059669) 1',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3.5rem' }}>⚙️</div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>Backend Track</h3>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Node.js • Express • Spring Boot • JWT • Docker</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>Master Node.js, Express.js, Spring Boot and modern server architectures.</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                <span>📚 8 Courses</span>
                <span>⏱️ 60 Hours</span>
              </div>
            </div>

            {/* Database Box */}
            <div 
              onClick={() => setSelectedFullStackCat('Database')}
              className="company-card" 
              style={{ 
                padding: '40px 24px', 
                cursor: 'pointer', 
                textAlign: 'center', 
                background: 'rgba(245, 158, 11, 0.03)', 
                border: '1.5px solid transparent',
                borderImage: 'linear-gradient(135deg, #f59e0b, #d97706) 1',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: '3.5rem' }}>💾</div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>Database Track</h3>
              <div style={{ fontSize: '#f59e0b', color: '#f59e0b', fontWeight: 600 }}>SQL • MySQL • PostgreSQL • MongoDB • Redis</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>Learn relational databases (MySQL) and NoSQL stores (MongoDB) for robust persistence.</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                <span>📚 6 Courses</span>
                <span>⏱️ 30 Hours</span>
              </div>
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

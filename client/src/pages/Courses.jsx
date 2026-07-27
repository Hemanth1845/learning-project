import React, { useState, useEffect, useContext } from 'react';
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

const Courses = () => {
  const { token, reloadProfile, API_URL } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  
  // Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [expandedQAs, setExpandedQAs] = useState({});

  const toggleQA = (idx) => {
    setExpandedQAs(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };
  
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSelectCourse = async (course) => {
    setActiveCourse(course);
    setLessons([]);
    setActiveLesson(null);
    setQuizResult(null);
    setSelectedAnswers({});
    setExpandedQAs({});
    try {
      const res = await fetch(`${API_URL}/courses/${course._id}/lessons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLessons(data);
      if (data.length > 0) {
        handleSelectLesson(course._id, data[0]);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {activeCourse.pdfUrl && (
              <button 
                onClick={() => window.open(activeCourse.pdfUrl, '_blank')}
                className="primary-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-easy)',
                  borderColor: 'var(--color-easy)',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                📖 View Full PDF Notes
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

        {/* Content Layout Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }} className="scorecard-panel">
          
          {/* Sidebar Lesson Tree */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Course Syllabus</h3>
            <div className="syllabus-list">
              {lessons.map((les) => {
                const isActive = activeLesson?.lesson?._id === les._id;
                const isCoreCsCourse = activeCourse.title === 'Operating Systems' || activeCourse.title === 'DBMS' || activeCourse.title === 'Computer Networks';
                return (
                  <div 
                    key={les._id} 
                    className={`syllabus-item ${isActive ? 'active' : ''} ${les.completed ? 'completed' : ''}`}
                    onClick={() => handleSelectLesson(activeCourse._id, les)}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lesson {les.order}</div>
                      <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem', marginTop: '2px' }}>{les.title}</div>
                    </div>
                    {les.quizCompleted && (
                      <span style={{ color: 'var(--color-solved)', fontSize: '0.8rem' }}>
                        {isCoreCsCourse ? '✓ Prep Done' : '🧠 quiz pass'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main Reading area */}
          {activeLesson ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Markdown notes panel */}
              <div className="glass-card" style={{ padding: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>{activeLesson.lesson.title}</h1>
                
                {/* Notes Container */}
                <div 
                  style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(activeLesson.lesson.content) }}
                />

                {/* Video Lesson (if provided) */}
                {activeLesson.lesson.videoUrl && (
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '12px' }}>📽️ Video Explanation</h3>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                      <iframe 
                        src={activeLesson.lesson.videoUrl} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        title={activeLesson.lesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              {/* Quiz section or Interview Prep block */}
              {(() => {
                const isCoreCsCourse = activeCourse.title === 'Operating Systems' || activeCourse.title === 'DBMS' || activeCourse.title === 'Computer Networks';
                
                if (isCoreCsCourse) {
                  return activeLesson.lesson.interviewQuestions && activeLesson.lesson.interviewQuestions.length > 0 ? (
                    <div className="quiz-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.3rem', color: 'white' }}>💬 Technical Interview Q&As</h2>
                        <span style={{ color: 'var(--color-points)', fontWeight: 600 }}>⚡ 50 XP Reward</span>
                      </div>

                      {activeLesson.quizCompleted && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-solved)', padding: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
                          🎉 You have already completed this lesson's interview preparation module!
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeLesson.lesson.interviewQuestions.map((q, idx) => {
                          const isOpen = !!expandedQAs[idx];
                          return (
                            <div 
                              key={idx} 
                              style={{ 
                                background: 'rgba(255,255,255,0.01)', 
                                border: '1px solid var(--border-glass)', 
                                borderRadius: '6px',
                                overflow: 'hidden'
                              }}
                            >
                              <button 
                                onClick={() => toggleQA(idx)}
                                style={{
                                  width: '100%',
                                  padding: '16px 20px',
                                  textAlign: 'left',
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'white',
                                  fontSize: '0.95rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span>Q{idx + 1}: {q.question}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isOpen ? '▲ Hide Answer' : '▼ Reveal Answer'}</span>
                              </button>
                              
                              {isOpen && (
                                <div style={{ 
                                  padding: '16px 20px', 
                                  background: 'rgba(59, 130, 246, 0.04)', 
                                  borderTop: '1px solid var(--border-glass)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.9rem',
                                  lineHeight: '1.6',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {q.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!activeLesson.quizCompleted && (
                        <button 
                          onClick={handleCompleteInterviewPrep} 
                          className="primary-btn" 
                          style={{ width: '100%', marginTop: '24px', padding: '12px' }}
                        >
                          Mark Interview Prep Complete & Claim +50 XP
                        </button>
                      )}
                    </div>
                  ) : null;
                }

                // Standard Quiz Rendering
                return activeLesson.lesson.quiz ? (
                  <div className="quiz-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ fontSize: '1.3rem' }}>📝 Lesson Assessment: {activeLesson.lesson.quiz.title}</h2>
                      <span style={{ color: 'var(--color-points)', fontWeight: 600 }}>⚡ {activeLesson.lesson.quiz.xpReward || 50} XP Reward</span>
                    </div>

                    {activeLesson.quizCompleted && !quizResult && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-solved)', padding: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
                        🎉 You have already passed this quiz with a score of {activeLesson.quizScore}%!
                      </div>
                    )}

                    {activeLesson.lesson.quiz.questions.map((q, qIdx) => {
                      const isSubmitted = !!quizResult;
                      const isCorrectOption = (oIdx) => oIdx === q.correctOptionIndex;
                      const isUserSelected = (oIdx) => selectedAnswers[qIdx] === oIdx;

                      return (
                        <div key={q._id} style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '20px' }}>
                          <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.98rem' }}>Q{qIdx + 1}: {q.questionText}</h4>
                          <div style={{ marginTop: '12px' }}>
                            {q.options.map((option, oIdx) => {
                              let optionClass = 'quiz-option';
                              if (isSubmitted) {
                                if (isCorrectOption(oIdx)) {
                                  optionClass += ' correct';
                                } else if (isUserSelected(oIdx) && !isCorrectOption(oIdx)) {
                                  optionClass += ' wrong';
                                }
                              } else if (isUserSelected(oIdx)) {
                                optionClass += ' selected';
                              }

                              return (
                                <div 
                                  key={oIdx} 
                                  className={optionClass}
                                  onClick={() => handleOptionClick(qIdx, oIdx)}
                                >
                                  {option}
                                </div>
                              );
                            })}
                          </div>
                          {isSubmitted && (
                            <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px' }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!quizResult ? (
                      <button onClick={handleQuizSubmit} className="primary-btn" style={{ width: '100%', marginTop: '16px' }}>
                        Submit Assessment Answers
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px', background: quizResult.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${quizResult.passed ? 'var(--color-solved)' : 'var(--color-hard)'}`, borderRadius: '8px' }}>
                        <h3 style={{ color: quizResult.passed ? 'var(--color-solved)' : 'var(--color-hard)', fontSize: '1.25rem' }}>
                          {quizResult.passed ? '🎉 Assessment Passed!' : '❌ Assessment Failed'}
                        </h3>
                        <p style={{ color: 'var(--text-main)', margin: '8px 0', fontSize: '0.95rem' }}>
                          You scored {quizResult.score}% ({quizResult.correctCount}/{quizResult.totalQuestions} correct)
                        </p>
                        {quizResult.xpEarned > 0 && (
                          <p style={{ color: 'var(--color-points)', fontWeight: 700, fontSize: '1rem' }}>
                            ⚡ +{quizResult.xpEarned} XP Earned!
                          </p>
                        )}
                        {!quizResult.passed && (
                          <button onClick={() => setQuizResult(null)} className="warroom-btn" style={{ marginTop: '12px' }}>
                            Retry Quiz
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ) : null;
              })()}

            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>No lessons found for this course.</div>
          )}

        </div>

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
        {courses.map((course) => {
          const isBookmarked = bookmarkedCourses.includes(course._id);
          return (
            <div key={course._id} className="company-card" style={{ minHeight: '260px' }}>
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
                    onClick={() => handleToggleBookmark(course._id)} 
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
                  <button onClick={() => handleSelectCourse(course)} className="warroom-btn">
                    Start Course →
                  </button>
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

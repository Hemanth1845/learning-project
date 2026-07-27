import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'users', 'dsa', or 'notes'
  
  // Courses states
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Users states
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // DSA states
  const [dsaProblems, setDsaProblems] = useState([]);
  const [dsaLoading, setDsaLoading] = useState(false);
  const [showDsaModal, setShowDsaModal] = useState(false);
  const [dsaForm, setDsaForm] = useState({
    id: null, title: '', topic: 'Arrays', difficulty: 'Easy', xp: 10, solveUrl: '', videoUrl: '',
    description: '', exampleInput: '', exampleOutput: '', exampleExplanation: '',
    example2Input: '', example2Output: '', example2Explanation: '',
    testCaseInput: '', testCaseExpectedOutput: ''
  });
  
  // Notes states
  const [notesList, setNotesList] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesForm, setNotesForm] = useState({ id: null, title: '', subject: 'Operating Systems', description: '', pdfUrl: '' });

  // Theory states
  const [theorySubjects, setTheorySubjects] = useState([]);
  const [selectedTheorySubjectId, setSelectedTheorySubjectId] = useState('dsa');
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [theoryForm, setTheoryForm] = useState({
    id: null, subjectId: 'dsa', title: '', order: 1, content: '',
    cppCode: '', javaCode: '', pythonCode: '',
    interviewTips: '', commonMistakes: '',
    questionText: '', answerText: '', pdfUrl: ''
  });

  // Aptitude states
  const [aptitudeData, setAptitudeData] = useState(null);
  const [selectedAptitudeCat, setSelectedAptitudeCat] = useState('quant');
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const [aptitudeForm, setAptitudeForm] = useState({
    id: null, category: 'quant', title: '', difficulty: 'Easy', desc: '', duration: '30 min',
    tags: '', shortcuts: '', xpReward: 50, order: 1,
    q1: '', q1_o1: '', q1_o2: '', q1_o3: '', q1_o4: '', q1_ans: 0, q1_exp: '',
    q2: '', q2_o1: '', q2_o2: '', q2_o3: '', q2_o4: '', q2_ans: 0, q2_exp: ''
  });

  // Modals visibility
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  
  // Course form states
  const [courseForm, setCourseForm] = useState({ id: null, title: '', description: '', category: 'Core CS', difficulty: 'Easy', thumbnail: '', pdfUrl: '' });
  
  // Lesson form states
  const [lessonForm, setLessonForm] = useState({
    id: null, title: '', content: '', videoUrl: '', order: 1,
    quizTitle: '', quizReward: 50,
    questions: []
  });

  // Question editing sub-state
  const [newQuestion, setNewQuestion] = useState({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });

  const topicsList = [
    'Arrays', 'Dynamic Programming', 'Binary Search', 'Stacks & Queues', 
    'Strings', 'Linked Lists', 'Recursion & Backtracking', 'Sliding Window', 
    'Heaps', 'Greedy', 'Trees', 'Graphs', 'Tries', 'Bit Manipulation'
  ];

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'dsa') {
        fetchDsaProblems();
      } else if (activeTab === 'notes') {
        fetchAdminNotes();
      } else if (activeTab === 'theory') {
        fetchTheoryData();
      } else if (activeTab === 'aptitude') {
        fetchAptitudeData();
      }
    }
  }, [token, activeTab]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsersList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDsaProblems = async () => {
    setDsaLoading(true);
    try {
      const res = await fetch(`${API_URL}/dsa`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDsaProblems(data.problems || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDsaLoading(false);
    }
  };

  const fetchAdminNotes = async () => {
    setNotesLoading(true);
    try {
      const res = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setNotesList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setNotesLoading(false);
    }
  };

  // THEORY CRUD
  const fetchTheoryData = async () => {
    try {
      const res = await fetch(`${API_URL}/theory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTheorySubjects(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddTheory = () => {
    setTheoryForm({
      id: null, subjectId: selectedTheorySubjectId, title: '', order: 1, content: '',
      cppCode: '', javaCode: '', pythonCode: '',
      interviewTips: '', commonMistakes: '',
      questionText: '', answerText: '', pdfUrl: ''
    });
    setShowTheoryModal(true);
  };

  const handleOpenEditTheory = (ch) => {
    setTheoryForm({
      id: ch._id,
      subjectId: ch.subjectId,
      title: ch.title,
      order: ch.order,
      content: ch.content || '',
      cppCode: ch.codeExamples?.find(e => e.language === 'cpp')?.code || '',
      javaCode: ch.codeExamples?.find(e => e.language === 'java')?.code || '',
      pythonCode: ch.codeExamples?.find(e => e.language === 'python')?.code || '',
      interviewTips: ch.interviewTips || '',
      commonMistakes: ch.commonMistakes || '',
      questionText: ch.realInterviewQuestions?.[0]?.question || '',
      answerText: ch.realInterviewQuestions?.[0]?.answer || '',
      pdfUrl: ch.notesUrl || ''
    });
    setShowTheoryModal(true);
  };

  const handleSaveTheoryChapter = async (e) => {
    e.preventDefault();
    const url = theoryForm.id ? `${API_URL}/theory/chapters/${theoryForm.id}` : `${API_URL}/theory/chapters`;
    const method = theoryForm.id ? 'PUT' : 'POST';

    const payload = {
      subjectId: theoryForm.subjectId,
      title: theoryForm.title,
      order: Number(theoryForm.order),
      content: theoryForm.content,
      codeExamples: [
        { language: 'cpp', code: theoryForm.cppCode },
        { language: 'java', code: theoryForm.javaCode },
        { language: 'python', code: theoryForm.pythonCode }
      ],
      interviewTips: theoryForm.interviewTips,
      commonMistakes: theoryForm.commonMistakes,
      realInterviewQuestions: theoryForm.questionText ? [{
        question: theoryForm.questionText,
        answer: theoryForm.answerText,
        difficulty: 'Medium'
      }] : [],
      companyFAQs: [
        { companyName: 'TCS', questionText: theoryForm.questionText }
      ],
      notesUrl: theoryForm.pdfUrl,
      xpReward: 20
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTheoryModal(false);
        fetchTheoryData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error saving chapter');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTheoryChapter = async (chId) => {
    if (!window.confirm('Delete this theory chapter?')) return;
    try {
      const res = await fetch(`${API_URL}/theory/chapters/${chId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTheoryData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // APTITUDE CRUD
  const fetchAptitudeData = async () => {
    try {
      const res = await fetch(`${API_URL}/aptitude`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAptitudeData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddAptitude = () => {
    setAptitudeForm({
      id: null, category: selectedAptitudeCat, title: '', difficulty: 'Easy', desc: '', duration: '30 min',
      tags: 'TCS, Infosys', shortcuts: '', xpReward: 50, order: 1,
      q1: '', q1_o1: '', q1_o2: '', q1_o3: '', q1_o4: '', q1_ans: 0, q1_exp: '',
      q2: '', q2_o1: '', q2_o2: '', q2_o3: '', q2_o4: '', q2_ans: 0, q2_exp: ''
    });
    setShowAptitudeModal(true);
  };

  const handleOpenEditAptitude = (topic) => {
    setAptitudeForm({
      id: topic._id,
      category: topic.category,
      title: topic.title,
      difficulty: topic.difficulty,
      desc: topic.desc || '',
      duration: topic.duration || '30 min',
      tags: topic.tags?.join(', ') || '',
      shortcuts: topic.shortcuts?.join('\n') || '',
      xpReward: topic.xpReward || 50,
      order: topic.order || 1,
      q1: topic.quizQuestions?.[0]?.q || '',
      q1_o1: topic.quizQuestions?.[0]?.options?.[0] || '',
      q1_o2: topic.quizQuestions?.[0]?.options?.[1] || '',
      q1_o3: topic.quizQuestions?.[0]?.options?.[2] || '',
      q1_o4: topic.quizQuestions?.[0]?.options?.[3] || '',
      q1_ans: topic.quizQuestions?.[0]?.correctIdx || 0,
      q1_exp: topic.quizQuestions?.[0]?.explanation || '',
      q2: topic.quizQuestions?.[1]?.q || '',
      q2_o1: topic.quizQuestions?.[1]?.options?.[0] || '',
      q2_o2: topic.quizQuestions?.[1]?.options?.[1] || '',
      q2_o3: topic.quizQuestions?.[1]?.options?.[2] || '',
      q2_o4: topic.quizQuestions?.[1]?.options?.[3] || '',
      q2_ans: topic.quizQuestions?.[1]?.correctIdx || 0,
      q2_exp: topic.quizQuestions?.[1]?.explanation || ''
    });
    setShowAptitudeModal(true);
  };

  const handleSaveAptitudeTopic = async (e) => {
    e.preventDefault();
    const url = aptitudeForm.id ? `${API_URL}/aptitude/topics/${aptitudeForm.id}` : `${API_URL}/aptitude/topics`;
    const method = aptitudeForm.id ? 'PUT' : 'POST';

    const quizQuestions = [];
    if (aptitudeForm.q1) {
      quizQuestions.push({
        q: aptitudeForm.q1,
        options: [aptitudeForm.q1_o1, aptitudeForm.q1_o2, aptitudeForm.q1_o3, aptitudeForm.q1_o4],
        correctIdx: Number(aptitudeForm.q1_ans),
        explanation: aptitudeForm.q1_exp
      });
    }
    if (aptitudeForm.q2) {
      quizQuestions.push({
        q: aptitudeForm.q2,
        options: [aptitudeForm.q2_o1, aptitudeForm.q2_o2, aptitudeForm.q2_o3, aptitudeForm.q2_o4],
        correctIdx: Number(aptitudeForm.q2_ans),
        explanation: aptitudeForm.q2_exp
      });
    }

    const payload = {
      category: aptitudeForm.category,
      title: aptitudeForm.title,
      difficulty: aptitudeForm.difficulty,
      desc: aptitudeForm.desc,
      duration: aptitudeForm.duration,
      tags: aptitudeForm.tags.split(',').map(t => t.trim()).filter(t => t),
      concepts: [
        { term: `${aptitudeForm.title} Basics`, definition: `Fundamental computational formulas for ${aptitudeForm.title}.` }
      ],
      shortcuts: aptitudeForm.shortcuts.split('\n').map(s => s.trim()).filter(s => s),
      quizQuestions,
      xpReward: Number(aptitudeForm.xpReward),
      order: Number(aptitudeForm.order)
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAptitudeModal(false);
        fetchAptitudeData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error saving topic');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAptitudeTopic = async (topicId) => {
    if (!window.confirm('Delete this aptitude topic?')) return;
    try {
      const res = await fetch(`${API_URL}/aptitude/topics/${topicId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAptitudeData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNotesForm(prev => ({ ...prev, pdfUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddNote = () => {
    setNotesForm({ id: null, title: '', subject: 'Operating Systems', description: '', pdfUrl: '' });
    setShowNotesModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!notesForm.title || !notesForm.pdfUrl) {
      alert('Title and PDF URL/File are required.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: notesForm.title,
          subject: notesForm.subject,
          description: notesForm.description,
          pdfUrl: notesForm.pdfUrl
        })
      });
      if (res.ok) {
        setShowNotesModal(false);
        fetchAdminNotes();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save note');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenNote = (note) => {
    if (note.pdfUrl.startsWith('data:') || note.pdfUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = note.pdfUrl;
      link.download = `${note.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(note.pdfUrl, '_blank');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'blocked' ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user and all of their progress data? This action cannot be undone.')) return;

    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/lessons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLessons(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    fetchLessons(course._id);
  };

  // COURSE CRUD
  const handleOpenAddCourse = () => {
    setCourseForm({ id: null, title: '', description: '', category: 'Core CS', difficulty: 'Easy', thumbnail: '', pdfUrl: '' });
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setCourseForm({
      id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      thumbnail: course.thumbnail || '',
      pdfUrl: course.pdfUrl || ''
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const url = courseForm.id ? `${API_URL}/courses/${courseForm.id}` : `${API_URL}/courses`;
    const method = courseForm.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });
      if (res.ok) {
        setShowCourseModal(false);
        fetchCourses();
        if (selectedCourse && selectedCourse._id === courseForm.id) {
          const updated = await res.json();
          setSelectedCourse(updated);
        }
      } else {
        const errData = await res.json();
        alert(errData.message || 'Course saving error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all of its lessons? This action is irreversible.')) return;
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourses();
        if (selectedCourse?._id === courseId) {
          setSelectedCourse(null);
          setLessons([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // LESSON CRUD
  const handleOpenAddLesson = () => {
    setLessonForm({
      id: null, title: '', content: '', videoUrl: '', order: lessons.length + 1,
      quizTitle: '', quizReward: 50,
      questions: []
    });
    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (lesson) => {
    setLessonForm({
      id: lesson._id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      order: lesson.order,
      quizTitle: lesson.quiz?.title || '',
      quizReward: lesson.quiz?.xpReward || 50,
      questions: lesson.quiz?.questions || []
    });
    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });
    setShowLessonModal(true);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.questionText.trim()) return alert('Question text required');
    if (newQuestion.options.some(o => !o.trim())) return alert('All 4 options must be filled');

    setLessonForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setNewQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });
  };

  const handleRemoveQuestion = (idx) => {
    setLessonForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    
    let quiz = null;
    if (lessonForm.quizTitle.trim() && lessonForm.questions.length > 0) {
      quiz = {
        title: lessonForm.quizTitle,
        xpReward: lessonForm.quizReward,
        questions: lessonForm.questions
      };
    }

    const payload = {
      title: lessonForm.title,
      content: lessonForm.content,
      videoUrl: lessonForm.videoUrl,
      order: lessonForm.order,
      quiz
    };

    const url = lessonForm.id 
      ? `${API_URL}/courses/${selectedCourse._id}/lessons/${lessonForm.id}`
      : `${API_URL}/courses/${selectedCourse._id}/lessons`;
    const method = lessonForm.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowLessonModal(false);
        fetchLessons(selectedCourse._id);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Lesson saving error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      const res = await fetch(`${API_URL}/courses/${selectedCourse._id}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchLessons(selectedCourse._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // DSA CRUD
  const handleOpenAddDsa = () => {
    setDsaForm({
      id: null, title: '', topic: 'Arrays', difficulty: 'Easy', xp: 10, solveUrl: '', videoUrl: '',
      description: '', exampleInput: '', exampleOutput: '', exampleExplanation: '',
      example2Input: '', example2Output: '', example2Explanation: '',
      testCaseInput: '', testCaseExpectedOutput: ''
    });
    setShowDsaModal(true);
  };

  const handleOpenEditDsa = (prob) => {
    setDsaForm({
      id: prob._id,
      title: prob.title,
      topic: prob.topic,
      difficulty: prob.difficulty,
      xp: prob.xp,
      solveUrl: prob.solveUrl || '',
      videoUrl: prob.videoUrl || '',
      description: prob.description || '',
      exampleInput: prob.examples?.[0]?.input || '',
      exampleOutput: prob.examples?.[0]?.output || '',
      exampleExplanation: prob.examples?.[0]?.explanation || '',
      example2Input: prob.examples?.[1]?.input || '',
      example2Output: prob.examples?.[1]?.output || '',
      example2Explanation: prob.examples?.[1]?.explanation || '',
      testCaseInput: prob.testCases?.[0]?.input || '',
      testCaseExpectedOutput: prob.testCases?.[0]?.expectedOutput || ''
    });
    setShowDsaModal(true);
  };

  const handleSaveDsa = async (e) => {
    e.preventDefault();
    const url = dsaForm.id ? `${API_URL}/dsa/${dsaForm.id}` : `${API_URL}/dsa`;
    const method = dsaForm.id ? 'PUT' : 'POST';

    const examples = [
      {
        input: dsaForm.exampleInput,
        output: dsaForm.exampleOutput,
        explanation: dsaForm.exampleExplanation
      }
    ];

    if (dsaForm.example2Input || dsaForm.example2Output) {
      examples.push({
        input: dsaForm.example2Input,
        output: dsaForm.example2Output,
        explanation: dsaForm.example2Explanation
      });
    }

    const testCases = [];
    if (dsaForm.testCaseInput || dsaForm.testCaseExpectedOutput) {
      testCases.push({
        input: dsaForm.testCaseInput,
        expectedOutput: dsaForm.testCaseExpectedOutput
      });
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: dsaForm.title,
          topic: dsaForm.topic,
          difficulty: dsaForm.difficulty,
          xp: dsaForm.xp,
          solveUrl: dsaForm.solveUrl,
          videoUrl: dsaForm.videoUrl,
          description: dsaForm.description,
          examples,
          testCases
        })
      });
      if (res.ok) {
        setShowDsaModal(false);
        fetchDsaProblems();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save DSA Problem');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDsa = async (id) => {
    if (!window.confirm('Are you sure you want to delete this DSA problem?')) return;
    try {
      const res = await fetch(`${API_URL}/dsa/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDsaProblems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Tab Switcher & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Admin Control Panel</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage courses, populate coding challenges, and regulate user accounts.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`filter-tag ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📚 Courses & Syllabus
          </button>
          <button 
            className={`filter-tag ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => setActiveTab('dsa')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            🧠 DSA Problems
          </button>
           <button 
            className={`filter-tag ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📝 Study Notes
          </button>
          <button 
            className={`filter-tag ${activeTab === 'theory' ? 'active' : ''}`}
            onClick={() => setActiveTab('theory')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📖 Theory Hub
          </button>
          <button 
            className={`filter-tag ${activeTab === 'aptitude' ? 'active' : ''}`}
            onClick={() => setActiveTab('aptitude')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📈 Aptitude
          </button>
          <button 
            className={`filter-tag ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            👥 User Management
          </button>
        </div>
      </div>

      {/* RENDER COURSES MANAGEMENT TAB */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleOpenAddCourse} className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              + Add New Course
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }} className="scorecard-panel">
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Course Inventory</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {courses.map((course) => {
                  const isSelected = selectedCourse?._id === course._id;
                  return (
                    <div 
                      key={course._id} 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(111, 66, 193, 0.1)' : 'rgba(255,255,255,0.01)',
                        border: `1px solid ${isSelected ? 'var(--accent-secondary)' : 'var(--border-glass)'}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{course.title}</span>
                        <span className={`difficulty-pill ${course.difficulty.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', height: '36px', overflow: 'hidden' }}>
                        {course.description}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cat: {course.category}</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={(e) => { e.stopPropagation(); handleOpenEditCourse(course); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course._id); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-hard)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card">
              {selectedCourse ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Managing Syllabus For</span>
                      <h3 style={{ fontSize: '1.3rem', color: 'white' }}>{selectedCourse.title}</h3>
                    </div>
                    <button onClick={handleOpenAddLesson} className="warroom-btn" style={{ background: 'rgba(0, 242, 254, 0.15)', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
                      + Add Lesson
                    </button>
                  </div>

                  <div className="syllabus-list">
                    {lessons.length > 0 ? (
                      lessons.map((les) => (
                        <div key={les._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lesson {les.order}</span>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginTop: '2px' }}>{les.title}</h4>
                            {les.quiz && <span style={{ fontSize: '0.7rem', color: 'var(--color-points)' }}>✏️ Quiz Included</span>}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleOpenEditLesson(les)} className="warroom-btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'white' }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteLesson(les._id)} className="warroom-btn" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-hard)' }}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', padding: '24px 0', textAlign: 'center', fontSize: '0.9rem' }}>
                        No lessons created for this course yet. Click "Add Lesson" to build the syllabus.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', padding: '48px 0', textAlign: 'center' }}>
                  Select a course from the left panel to manage its syllabus, lessons, and assessment quizzes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER DSA PROBLEMS MANAGEMENT TAB */}
      {activeTab === 'dsa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Coding Challenge Directory</h3>
            <button onClick={handleOpenAddDsa} className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              + Add New Problem
            </button>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {dsaLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Loading coding challenge inventory...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th>Title</th>
                      <th>Algorithm Topic</th>
                      <th>Difficulty</th>
                      <th>XP Weight</th>
                      <th>LeetCode URL</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsaProblems.map((prob) => (
                      <tr key={prob._id}>
                        <td style={{ color: 'var(--text-muted)' }}>{prob.problemId}</td>
                        <td style={{ fontWeight: 600, color: 'white' }}>{prob.title}</td>
                        <td>{prob.topic}</td>
                        <td>
                          <span className={`difficulty-pill ${prob.difficulty.toLowerCase()}`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--color-points)' }}>⚡ {prob.xp} XP</td>
                        <td>
                          <a href={prob.solveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem' }}>
                            Link ↗
                          </a>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleOpenEditDsa(prob)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white', padding: '4px 10px', fontSize: '0.8rem' }}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteDsa(prob._id)} className="warroom-btn" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-hard)', padding: '4px 10px', fontSize: '0.8rem' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* RENDER USERS REGULATION TAB */}
      {activeTab === 'users' && (
        <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Registered Users Regulation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Track student placement preparation progress and block/suspend inactive or abusive accounts.</p>
          </div>

          {usersLoading ? (
            <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Querying users databases...</div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>XP Points</th>
                    <th>Streak</th>
                    <th>DSA Progress</th>
                    <th>Course Syllabus Progress</th>
                    <th>Regulate Access</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.length > 0 ? (
                    usersList.map((usr) => (
                      <tr key={usr._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={usr.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-glass)' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'white' }}>{usr.username}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{usr.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                          ⚡ {usr.xp} XP
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--color-points)' }}>
                          🔥 {usr.streak} days
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'white' }}>
                            ✅ {usr.dsaSolvedCount} Solved
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '240px' }}>
                            {usr.courseProgressList && usr.courseProgressList.length > 0 ? (
                              usr.courseProgressList.slice(0, 3).map((progress, pIdx) => (
                                <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', gap: '8px' }}>
                                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{progress.courseTitle}</span>
                                  <span style={{ color: progress.progress === 100 ? 'var(--color-solved)' : 'white', fontWeight: 600 }}>{progress.progress}%</span>
                                </div>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No courses started</span>
                            )}
                            {usr.courseProgressList && usr.courseProgressList.length > 3 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)' }}>+{usr.courseProgressList.length - 3} more subjects</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span 
                              className="difficulty-pill"
                              style={{
                                background: usr.status === 'blocked' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: usr.status === 'blocked' ? 'var(--color-hard)' : 'var(--color-solved)',
                                border: `1px solid ${usr.status === 'blocked' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                              }}
                            >
                              {usr.status === 'blocked' ? 'Suspended' : 'Active'}
                            </span>
                            <button 
                              onClick={() => handleToggleUserStatus(usr._id, usr.status)}
                              className="warroom-btn"
                              style={{
                                background: usr.status === 'blocked' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                borderColor: usr.status === 'blocked' ? 'var(--color-solved)' : 'var(--color-hard)',
                                color: usr.status === 'blocked' ? 'var(--color-solved)' : 'var(--color-hard)',
                                fontSize: '0.8rem',
                                padding: '4px 10px'
                              }}
                            >
                              {usr.status === 'blocked' ? 'Revoke Suspension' : 'Block Student'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(usr._id)}
                              className="warroom-btn"
                              style={{
                                background: 'rgba(239, 68, 68, 0.08)',
                                borderColor: 'var(--color-hard)',
                                color: 'var(--color-hard)',
                                fontSize: '0.8rem',
                                padding: '4px 10px'
                              }}
                            >
                              Delete User
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                        No registered students found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* COURSE CREATION/EDIT MODAL */}
      {showCourseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>{courseForm.id ? 'Edit Course Settings' : 'Create New Course'}</h2>
            <form onSubmit={handleSaveCourse} className="auth-form">
              <div className="form-group">
                <label>Course Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-input"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  >
                    <option value="Core CS">Core CS</option>
                    <option value="Programming">Programming</option>
                    <option value="AI">AI</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    className="form-input"
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Thumbnail Image URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Curriculum/Notes PDF Link</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. https://example.com/syllabus.pdf or Base64 data"
                  value={courseForm.pdfUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, pdfUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCourseModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  Save Course Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LESSON CREATION/EDIT MODAL */}
      {showLessonModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto' }}>
          <div className="glass-card" style={{ maxWidth: '700px', width: '90%', margin: '40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>{lessonForm.id ? 'Edit Lesson Syllabus' : 'Add Syllabus Lesson'}</h2>
            
            <form onSubmit={handleSaveLesson} className="auth-form">
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Lesson Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Syllabus Order</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Lesson Content (Supports Markdown)</label>
                <textarea 
                  className="form-input" 
                  rows="8"
                  style={{ fontFamily: 'monospace' }}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Embedded Video Explanation URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://www.youtube.com/embed/..."
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                />
              </div>

              <div style={{ border: '1px dashed var(--border-glass)', padding: '20px', borderRadius: '8px', marginTop: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'white', marginBottom: '12px' }}>✏️ Assessment Quiz Configuration</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label>Quiz Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Memory Management Quiz"
                      value={lessonForm.quizTitle}
                      onChange={(e) => setLessonForm({ ...lessonForm, quizTitle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>XP Reward Points</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={lessonForm.quizReward}
                      onChange={(e) => setLessonForm({ ...lessonForm, quizReward: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                </div>

                {lessonForm.questions.length > 0 && (
                  <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created Questions</label>
                    {lessonForm.questions.map((q, qIdx) => (
                      <div key={qIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', border: '1px solid var(--border-glass)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'white' }}>Q{qIdx + 1}: {q.questionText}</span>
                        <button type="button" onClick={() => handleRemoveQuestion(qIdx)} style={{ background: 'transparent', border: 'none', color: 'var(--color-hard)', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {lessonForm.quizTitle.trim() && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '10px' }}>Append Question</h4>
                    <div className="form-group">
                      <label>Question Text</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={newQuestion.questionText}
                        onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      {newQuestion.options.map((opt, oIdx) => (
                        <div key={oIdx} className="form-group">
                          <label>Option {oIdx + 1}</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={opt}
                            onChange={(e) => {
                              const updatedOptions = [...newQuestion.options];
                              updatedOptions[oIdx] = e.target.value;
                              setNewQuestion({ ...newQuestion, options: updatedOptions });
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      <div className="form-group">
                        <label>Correct Option Index (0 to 3)</label>
                        <select 
                          className="form-input"
                          value={newQuestion.correctOptionIndex}
                          onChange={(e) => setNewQuestion({ ...newQuestion, correctOptionIndex: parseInt(e.target.value) || 0 })}
                        >
                          <option value="0">Option 1</option>
                          <option value="1">Option 2</option>
                          <option value="2">Option 3</option>
                          <option value="3">Option 4</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Explanation Notes</label>
                        <input 
                          type="text" 
                          className="form-input"
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="button" onClick={handleAddQuestion} className="warroom-btn" style={{ width: '100%', marginTop: '14px', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--color-solved)', color: 'var(--color-solved)' }}>
                      + Append Question to List
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowLessonModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  Save Lesson Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DSA PROBLEM MODAL */}
      {showDsaModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifycontent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ maxWidth: '650px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2>{dsaForm.id ? 'Edit DSA Problem' : 'Add DSA Problem'}</h2>
            <form onSubmit={handleSaveDsa} className="auth-form">
              <div className="form-group">
                <label>Problem Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={dsaForm.title}
                  onChange={(e) => setDsaForm({ ...dsaForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Algorithm Topic *</label>
                  <select 
                    className="form-input"
                    value={dsaForm.topic}
                    onChange={(e) => setDsaForm({ ...dsaForm, topic: e.target.value })}
                  >
                    {topicsList.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty *</label>
                  <select 
                    className="form-input"
                    value={dsaForm.difficulty}
                    onChange={(e) => setDsaForm({ ...dsaForm, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>XP Points Weight *</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={dsaForm.xp}
                    onChange={(e) => setDsaForm({ ...dsaForm, xp: parseInt(e.target.value) || 10 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>LeetCode Solve URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="https://leetcode.com/problems/..."
                    value={dsaForm.solveUrl}
                    onChange={(e) => setDsaForm({ ...dsaForm, solveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>YouTube Explainer Video Link (Optional)</label>
                <input 
                  type="url" 
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={dsaForm.videoUrl}
                  onChange={(e) => setDsaForm({ ...dsaForm, videoUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Problem Description (Markdown / Text) (Optional)</label>
                <textarea 
                  className="form-input"
                  rows="3"
                  value={dsaForm.description}
                  onChange={(e) => setDsaForm({ ...dsaForm, description: e.target.value })}
                  placeholder="Describe the problem, constraints, etc..."
                />
              </div>

              {/* EXAMPLE 1 SECTION (REQUIRED) */}
              <div style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'white', marginBottom: '8px' }}>Example 1 (Required)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Input *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.exampleInput}
                      onChange={(e) => setDsaForm({ ...dsaForm, exampleInput: e.target.value })}
                      placeholder="e.g. nums = [0,1,0,3,12]"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Output *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.exampleOutput}
                      onChange={(e) => setDsaForm({ ...dsaForm, exampleOutput: e.target.value })}
                      placeholder="e.g. [1,3,12,0,0]"
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '8px' }}>
                  <label>Explanation (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={dsaForm.exampleExplanation}
                    onChange={(e) => setDsaForm({ ...dsaForm, exampleExplanation: e.target.value })}
                    placeholder="Why is this correct..."
                  />
                </div>
              </div>

              {/* EXAMPLE 2 SECTION (OPTIONAL) */}
              <div style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'white', marginBottom: '8px' }}>Example 2 (Optional)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Input</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.example2Input}
                      onChange={(e) => setDsaForm({ ...dsaForm, example2Input: e.target.value })}
                      placeholder="e.g. nums = [0]"
                    />
                  </div>
                  <div className="form-group">
                    <label>Output</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.example2Output}
                      onChange={(e) => setDsaForm({ ...dsaForm, example2Output: e.target.value })}
                      placeholder="e.g. [0]"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '8px' }}>
                  <label>Explanation</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={dsaForm.example2Explanation}
                    onChange={(e) => setDsaForm({ ...dsaForm, example2Explanation: e.target.value })}
                    placeholder="Why is this correct..."
                  />
                </div>
              </div>

              {/* TEST CASE (OPTIONAL) */}
              <div style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'white', marginBottom: '8px' }}>Hidden Test Case (Optional)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Stdin Input</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.testCaseInput}
                      onChange={(e) => setDsaForm({ ...dsaForm, testCaseInput: e.target.value })}
                      placeholder="e.g. [0,1,0,3,12]"
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected Output</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={dsaForm.testCaseExpectedOutput}
                      onChange={(e) => setDsaForm({ ...dsaForm, testCaseExpectedOutput: e.target.value })}
                      placeholder="e.g. [1,3,12,0,0]"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowDsaModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  Save Problem Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER STUDY NOTES MANAGEMENT TAB */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Study Notes & PDF Repositories</h3>
            <button onClick={handleOpenAddNote} className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              + Add New Note
            </button>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {notesLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Loading study notes inventory...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject Category</th>
                      <th>Description</th>
                      <th>Resource Link / Upload</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notesList.length > 0 ? (
                      notesList.map((note) => (
                        <tr key={note._id}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{note.title}</td>
                          <td>
                            <span className="difficulty-pill medium" style={{ fontSize: '0.72rem' }}>
                              {note.subject}
                            </span>
                          </td>
                          <td>{note.description || 'No description provided.'}</td>
                          <td>
                            <span 
                              onClick={() => handleOpenNote(note)}
                              style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              {note.pdfUrl.startsWith('data:') ? '📄 Uploaded Document (Base64)' : '🔗 External Link'}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleDeleteNote(note._id)} 
                              className="warroom-btn" 
                              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-hard)', padding: '4px 10px', fontSize: '0.8rem' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                          No study notes found in database. Click "+ Add New Note" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {/* STUDY NOTE CREATION MODAL */}
      {showNotesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Create New Study Note</h2>
            <form onSubmit={handleSaveNote} className="auth-form">
              <div className="form-group">
                <label>Note Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={notesForm.title}
                  onChange={(e) => setNotesForm({ ...notesForm, title: e.target.value })}
                  placeholder="e.g. TCS Technical Interview Questions"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Classification *</label>
                <select 
                  className="form-input"
                  value={notesForm.subject}
                  onChange={(e) => setNotesForm({ ...notesForm, subject: e.target.value })}
                >
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="General Prep">General Prep</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input" 
                  rows="2"
                  value={notesForm.description}
                  onChange={(e) => setNotesForm({ ...notesForm, description: e.target.value })}
                  placeholder="Summarize what this study sheet covers..."
                />
              </div>

              {/* Resource inputs: PDF Upload OR Direct URL Link */}
              <div className="form-group">
                <label>Choose Upload Method</label>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'white', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="upload-type" defaultChecked onClick={() => setNotesForm(prev => ({ ...prev, pdfUrl: '' }))} />
                    Upload PDF File
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="upload-type" onClick={() => setNotesForm(prev => ({ ...prev, pdfUrl: 'https://' }))} />
                    Enter External URL Link
                  </label>
                </div>
                
                {notesForm.pdfUrl.startsWith('http') ? (
                  <input 
                    type="url" 
                    className="form-input" 
                    value={notesForm.pdfUrl}
                    onChange={(e) => setNotesForm({ ...notesForm, pdfUrl: e.target.value })}
                    placeholder="Enter PDF Link (Google Drive, Dropbox, etc.)"
                    required
                  />
                ) : (
                  <div>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      className="form-input" 
                      onChange={handlePdfUpload}
                      style={{ padding: '8px 12px' }}
                    />
                    {notesForm.pdfUrl && (
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--color-solved)', marginTop: '6px', fontWeight: 600 }}>
                        ✓ PDF file successfully loaded (Ready to Save)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowNotesModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER THEORY MANAGEMENT TAB */}
      {activeTab === 'theory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Placement Encyclopedia Chapters</h3>
              <select
                value={selectedTheorySubjectId}
                onChange={(e) => setSelectedTheorySubjectId(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              >
                <option value="dsa">DSA Theory</option>
                <option value="oops">OOPS</option>
                <option value="os">Operating Systems</option>
                <option value="dbms">DBMS</option>
                <option value="cn">Computer Networks</option>
                <option value="ml">Machine Learning</option>
                <option value="maths">Mathematics</option>
              </select>
            </div>
            <button onClick={handleOpenAddTheory} className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              + Add New Chapter
            </button>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Chapter Title</th>
                    <th>XP Reward</th>
                    <th>Code Examples</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {theorySubjects.find(s => s.id === selectedTheorySubjectId)?.chapters?.map((ch) => (
                    <tr key={ch._id}>
                      <td style={{ fontWeight: 600, color: 'white' }}>{ch.order}</td>
                      <td style={{ fontWeight: 600, color: 'white' }}>{ch.title}</td>
                      <td>⚡ {ch.xpReward} XP</td>
                      <td>
                        <span style={{ fontSize: '0.78rem', background: 'rgba(124, 58, 237, 0.1)', padding: '4px 8px', borderRadius: '4px', color: '#a78bfa' }}>
                          {ch.codeExamples?.map(ex => ex.language.toUpperCase()).join(', ') || 'None'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenEditTheory(ch)} className="warroom-btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'white', padding: '4px 10px', fontSize: '0.8rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTheoryChapter(ch._id)} className="warroom-btn" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-hard)', padding: '4px 10px', fontSize: '0.8rem' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!theorySubjects.find(s => s.id === selectedTheorySubjectId)?.chapters || theorySubjects.find(s => s.id === selectedTheorySubjectId)?.chapters.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No chapters found for this subject. Create one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* RENDER APTITUDE MANAGEMENT TAB */}
      {activeTab === 'aptitude' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Aptitude Platform Topics</h3>
              <select
                value={selectedAptitudeCat}
                onChange={(e) => setSelectedAptitudeCat(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              >
                <option value="quant">Quantitative Aptitude</option>
                <option value="logical">Logical Reasoning</option>
                <option value="verbal">Verbal Ability</option>
              </select>
            </div>
            <button onClick={handleOpenAddAptitude} className="primary-btn" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              + Add New Topic
            </button>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Topic Title</th>
                    <th>Difficulty</th>
                    <th>Questions</th>
                    <th>XP Reward</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aptitudeData?.[selectedAptitudeCat]?.topics?.map((topic) => (
                    <tr key={topic._id}>
                      <td style={{ fontWeight: 600, color: 'white' }}>{topic.order}</td>
                      <td style={{ fontWeight: 600, color: 'white' }}>{topic.title}</td>
                      <td>
                        <span className={`difficulty-pill ${topic.difficulty?.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                      </td>
                      <td>📝 {topic.quizQuestions?.length || 0} Quiz Qs</td>
                      <td>⚡ {topic.xpReward} XP</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenEditAptitude(topic)} className="warroom-btn" style={{ background: 'transparent', border: '1px solid var(--border-glass)', color: 'white', padding: '4px 10px', fontSize: '0.8rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteAptitudeTopic(topic._id)} className="warroom-btn" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-hard)', padding: '4px 10px', fontSize: '0.8rem' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!aptitudeData?.[selectedAptitudeCat]?.topics || aptitudeData?.[selectedAptitudeCat]?.topics.length === 0) && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No topics found for this category. Create one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* THEORY MODAL */}
      {showTheoryModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>
                {theoryForm.id ? 'Edit Theory Chapter' : 'Add New Theory Chapter'}
              </h3>
              <button onClick={() => setShowTheoryModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTheoryChapter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Subject ID</label>
                  <select
                    className="form-input"
                    value={theoryForm.subjectId}
                    onChange={(e) => setTheoryForm({ ...theoryForm, subjectId: e.target.value })}
                  >
                    <option value="dsa">DSA Theory</option>
                    <option value="oops">OOPS</option>
                    <option value="os">Operating Systems</option>
                    <option value="dbms">DBMS</option>
                    <option value="cn">Computer Networks</option>
                    <option value="ml">Machine Learning</option>
                    <option value="maths">Mathematics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={theoryForm.order}
                    onChange={(e) => setTheoryForm({ ...theoryForm, order: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Chapter Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={theoryForm.title}
                  onChange={(e) => setTheoryForm({ ...theoryForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Markdown Content</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '150px', fontFamily: 'monospace' }}
                  value={theoryForm.content}
                  onChange={(e) => setTheoryForm({ ...theoryForm, content: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>C++ Example Code</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', fontFamily: 'monospace' }}
                  value={theoryForm.cppCode}
                  onChange={(e) => setTheoryForm({ ...theoryForm, cppCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Java Example Code</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', fontFamily: 'monospace' }}
                  value={theoryForm.javaCode}
                  onChange={(e) => setTheoryForm({ ...theoryForm, javaCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Python Example Code</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', fontFamily: 'monospace' }}
                  value={theoryForm.pythonCode}
                  onChange={(e) => setTheoryForm({ ...theoryForm, pythonCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>High-Yield Interview Tips</label>
                <textarea
                  className="form-input"
                  value={theoryForm.interviewTips}
                  onChange={(e) => setTheoryForm({ ...theoryForm, interviewTips: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Common Mistakes</label>
                <textarea
                  className="form-input"
                  value={theoryForm.commonMistakes}
                  onChange={(e) => setTheoryForm({ ...theoryForm, commonMistakes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sample Interview Question</label>
                <input
                  type="text"
                  className="form-input"
                  value={theoryForm.questionText}
                  onChange={(e) => setTheoryForm({ ...theoryForm, questionText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Sample Answer</label>
                <textarea
                  className="form-input"
                  value={theoryForm.answerText}
                  onChange={(e) => setTheoryForm({ ...theoryForm, answerText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>PDF Notes URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={theoryForm.pdfUrl}
                  onChange={(e) => setTheoryForm({ ...theoryForm, pdfUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowTheoryModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  {theoryForm.id ? 'Save Changes' : 'Create Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APTITUDE MODAL */}
      {showAptitudeModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>
                {aptitudeForm.id ? 'Edit Aptitude Topic' : 'Add New Aptitude Topic'}
              </h3>
              <button onClick={() => setShowAptitudeModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAptitudeTopic} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-input"
                    value={aptitudeForm.category}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, category: e.target.value })}
                  >
                    <option value="quant">Quantitative Aptitude</option>
                    <option value="logical">Logical Reasoning</option>
                    <option value="verbal">Verbal Ability</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    className="form-input"
                    value={aptitudeForm.difficulty}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={aptitudeForm.order}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, order: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration (e.g. 30 min)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aptitudeForm.duration}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Topic Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={aptitudeForm.title}
                  onChange={(e) => setAptitudeForm({ ...aptitudeForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={aptitudeForm.desc}
                  onChange={(e) => setAptitudeForm({ ...aptitudeForm, desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Company Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TCS, Infosys, Wipro"
                  value={aptitudeForm.tags}
                  onChange={(e) => setAptitudeForm({ ...aptitudeForm, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Shortcut Tricks (one per line)</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px' }}
                  placeholder="Shortcut 1&#10;Shortcut 2"
                  value={aptitudeForm.shortcuts}
                  onChange={(e) => setAptitudeForm({ ...aptitudeForm, shortcuts: e.target.value })}
                />
              </div>

              {/* Quiz Q1 */}
              <div style={{ border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '6px', marginTop: '10px' }}>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>Quiz Question 1</h4>
                <div className="form-group">
                  <label>Question Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aptitudeForm.q1}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <input type="text" className="form-input" placeholder="Option 1" value={aptitudeForm.q1_o1} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_o1: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 2" value={aptitudeForm.q1_o2} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_o2: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 3" value={aptitudeForm.q1_o3} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_o3: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 4" value={aptitudeForm.q1_o4} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_o4: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div className="form-group">
                    <label>Correct Option Index (0-3)</label>
                    <input type="number" min="0" max="3" className="form-input" value={aptitudeForm.q1_ans} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_ans: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Explanation</label>
                    <input type="text" className="form-input" value={aptitudeForm.q1_exp} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q1_exp: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Quiz Q2 */}
              <div style={{ border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '6px', marginTop: '10px' }}>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>Quiz Question 2</h4>
                <div className="form-group">
                  <label>Question Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aptitudeForm.q2}
                    onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <input type="text" className="form-input" placeholder="Option 1" value={aptitudeForm.q2_o1} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_o1: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 2" value={aptitudeForm.q2_o2} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_o2: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 3" value={aptitudeForm.q2_o3} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_o3: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Option 4" value={aptitudeForm.q2_o4} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_o4: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div className="form-group">
                    <label>Correct Option Index (0-3)</label>
                    <input type="number" min="0" max="3" className="form-input" value={aptitudeForm.q2_ans} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_ans: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Explanation</label>
                    <input type="text" className="form-input" value={aptitudeForm.q2_exp} onChange={(e) => setAptitudeForm({ ...aptitudeForm, q2_exp: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAptitudeModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  {aptitudeForm.id ? 'Save Changes' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

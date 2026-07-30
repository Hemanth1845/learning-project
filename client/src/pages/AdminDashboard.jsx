import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'users', 'dsa', 'notes', 'theory', 'aptitude', 'requests'
  
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
    testCaseInput: '', testCaseExpectedOutput: '', isDaily: false
  });
  
  // Notes states
  const [notesList, setNotesList] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesForm, setNotesForm] = useState({ id: null, title: '', subject: 'Operating Systems', description: '', pdfUrl: '' });

  // Theory states
  const [theorySubjects, setTheorySubjects] = useState([]);
  const [selectedTheorySubjectId, setSelectedTheorySubjectId] = useState('');
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [theoryForm, setTheoryForm] = useState({
    id: null, subjectId: '', title: '', order: 1, content: '',
    cppCode: '', javaCode: '', pythonCode: '',
    interviewTips: '', commonMistakes: '',
    questionText: '', answerText: '', pdfUrl: '',
    diagramUrl: ''
  });

  // Theory Subject creation states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ id: '', title: '', icon: '📖', order: 1, description: '', mode: 'create' });

  // Aptitude states
  const [aptitudeData, setAptitudeData] = useState(null);
  const [selectedAptitudeCat, setSelectedAptitudeCat] = useState('quant');
  const [showAptitudeModal, setShowAptitudeModal] = useState(false);
  const [aptitudeForm, setAptitudeForm] = useState({
    id: null, category: 'quant', title: '', difficulty: 'Easy', desc: '', duration: '30 min',
    tags: '', shortcuts: '', xpReward: 50, order: 1,
    quizQuestions: []
  });

  const [newAptitudeQuestion, setNewAptitudeQuestion] = useState({
    q: '', options: ['', '', '', ''], correctIdx: 0, explanation: '', difficulty: 'Easy-Medium'
  });

  // Course requests states
  const [courseRequests, setCourseRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // User doubts states
  const [doubtsList, setDoubtsList] = useState([]);
  const [doubtsLoading, setDoubtsLoading] = useState(false);
  const [selectedDoubtDetail, setSelectedDoubtDetail] = useState(null);

  // Live Activity Feed states
  const [activitiesList, setActivitiesList] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  // Card FX Settings
  const [cssSettings, setCssSettings] = useState(() => {
    const saved = localStorage.getItem('app-css-settings');
    return saved ? JSON.parse(saved) : {
      hoverFx: '3d-tilt',
      borderRadius: '16px',
      glassBlur: '8px',
      globalScale: '1.0'
    };
  });

  // Project submissions states
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Modals visibility
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  
  // Course form states
  const [courseForm, setCourseForm] = useState({ id: null, title: '', description: '', category: 'Core CS', parentCategory: '', difficulty: 'Easy', thumbnail: '', pdfUrl: '', externalLink: '', practicePageUrl: '' });
  
  // Lesson form states
  const [lessonForm, setLessonForm] = useState({
    id: null, title: '', content: '', videoUrl: '', pdfUrl: '', order: 1,
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
      } else if (activeTab === 'requests') {
        fetchCourseRequests();
      } else if (activeTab === 'projects') {
        fetchSubmissions();
      } else if (activeTab === 'doubts') {
        fetchDoubts();
      } else if (activeTab === 'live-feed') {
        fetchActivities();
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

  const applyGlobalCssSettings = (settings) => {
    const root = document.documentElement;
    root.style.setProperty('--card-border-radius', settings.borderRadius);
    root.style.setProperty('--card-glass-blur', settings.glassBlur);
    root.style.setProperty('--global-text-scale', settings.globalScale);
    
    document.body.classList.remove('fx-glow', 'fx-3d-tilt', 'fx-float', 'fx-none');
    document.body.classList.add(`fx-${settings.hoverFx}`);

    if (settings.bgEffect === 'birds') {
      document.body.classList.add('bg-birds');
    } else {
      document.body.classList.remove('bg-birds');
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/activities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setActivitiesList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setActivitiesLoading(false);
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
      if (data && data.length > 0 && !selectedTheorySubjectId) {
        setSelectedTheorySubjectId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddTheory = () => {
    setTheoryForm({
      id: null, subjectId: selectedTheorySubjectId || (theorySubjects[0]?.id || ''), title: '', order: 1, content: '',
      cppCode: '', javaCode: '', pythonCode: '',
      interviewTips: '', commonMistakes: '',
      questionText: '', answerText: '', pdfUrl: '',
      diagramUrl: ''
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
      pdfUrl: ch.notesUrl || '',
      diagramUrl: ch.diagramUrl || ''
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
      diagramUrl: theoryForm.diagramUrl,
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

  const handleExportUsersCSV = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/admin/users/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'placement_prep_users.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Export failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error exporting users.');
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

  const handleSaveTheorySubject = async (e) => {
    e.preventDefault();
    const isEdit = subjectForm.mode === 'edit';
    const url = isEdit ? `${API_URL}/theory/subjects/${subjectForm.id}` : `${API_URL}/theory/subjects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: subjectForm.id,
          title: subjectForm.title,
          icon: subjectForm.icon,
          order: subjectForm.order,
          description: subjectForm.description
        })
      });
      if (res.ok) {
        setShowSubjectModal(false);
        setSubjectForm({ id: '', title: '', icon: '📖', order: 1, description: '', mode: 'create' });
        fetchTheoryData();
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving subject');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTheorySubject = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this theory subject and ALL of its chapters? This is irreversible.')) return;
    try {
      const res = await fetch(`${API_URL}/theory/subjects/${subId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTheoryData();
        setSelectedTheorySubjectId('');
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
      quizQuestions: []
    });
    setNewAptitudeQuestion({ q: '', options: ['', '', '', ''], correctIdx: 0, explanation: '', difficulty: 'Easy-Medium' });
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
      quizQuestions: topic.quizQuestions || []
    });
    setNewAptitudeQuestion({ q: '', options: ['', '', '', ''], correctIdx: 0, explanation: '', difficulty: 'Easy-Medium' });
    setShowAptitudeModal(true);
  };

  const handleSaveAptitudeTopic = async (e) => {
    e.preventDefault();
    const url = aptitudeForm.id ? `${API_URL}/aptitude/topics/${aptitudeForm.id}` : `${API_URL}/aptitude/topics`;
    const method = aptitudeForm.id ? 'PUT' : 'POST';

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
      quizQuestions: aptitudeForm.quizQuestions,
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

  // PROJECT SUBMISSIONS CRUD
  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/submissions/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSubmissions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleEvaluateSubmission = async (subId, status, remarks) => {
    try {
      const res = await fetch(`${API_URL}/courses/submissions/${subId}/evaluate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, remarks })
      });
      if (res.ok) {
        alert('Evaluation saved successfully!');
        fetchSubmissions();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to evaluate project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // COURSE REQUESTS CRUD
  const fetchCourseRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/requests/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourseRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleUpdateReqStatus = async (reqId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/courses/requests/${reqId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCourseRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReq = async (reqId) => {
    if (!window.confirm('Are you sure you want to delete this course request?')) return;
    try {
      const res = await fetch(`${API_URL}/courses/requests/${reqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourseRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoubts = async () => {
    setDoubtsLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/doubts/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoubtsList(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDoubtsLoading(false);
    }
  };

  const handleResolveDoubt = async (doubtId, replyText) => {
    if (!replyText.trim()) return alert('Please enter a response reply.');
    try {
      const res = await fetch(`${API_URL}/courses/doubts/${doubtId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        alert('Reply posted and doubt resolved!');
        fetchDoubts();
      } else {
        alert('Failed to submit reply.');
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
    setCourseForm({ id: null, title: '', description: '', category: 'Core CS', difficulty: 'Easy', thumbnail: '', pdfUrl: '', externalLink: '', practicePageUrl: '' });
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setCourseForm({
      id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      parentCategory: course.parentCategory || '',
      difficulty: course.difficulty,
      thumbnail: course.thumbnail || '',
      pdfUrl: course.pdfUrl || '',
      externalLink: course.externalLink || '',
      practicePageUrl: course.practicePageUrl || ''
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
      pdfUrl: lesson.pdfUrl || '',
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
      pdfUrl: lessonForm.pdfUrl,
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
      testCaseInput: '', testCaseExpectedOutput: '', isDaily: false
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
      testCaseExpectedOutput: prob.testCases?.[0]?.expectedOutput || '',
      isDaily: prob.isDaily || false
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
          testCases,
          isDaily: dsaForm.isDaily
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
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
            className={`filter-tag ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📋 Course Requests
          </button>
          <button 
            className={`filter-tag ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            💻 Project Submissions
          </button>
          <button 
            className={`filter-tag ${activeTab === 'doubts' ? 'active' : ''}`}
            onClick={() => setActiveTab('doubts')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            ❓ User Doubts
          </button>
          <button 
            className={`filter-tag ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            👥 User Management
          </button>
          <button 
            className={`filter-tag ${activeTab === 'css-fx' ? 'active' : ''}`}
            onClick={() => setActiveTab('css-fx')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            🎨 Card FX Controller
          </button>
          <button 
            className={`filter-tag ${activeTab === 'live-feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('live-feed')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📊 Live Activity Feed
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
                      <th>Daily Challenge</th>
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
                          {prob.isDaily ? (
                            <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 8px', borderRadius: '4px', color: 'var(--color-solved)', fontWeight: 600 }}>
                              📆 Active Daily
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No</span>
                          )}
                        </td>
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
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Registered Users Regulation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Track student placement preparation progress and block/suspend inactive or abusive accounts.</p>
            </div>
            <button 
              onClick={handleExportUsersCSV} 
              className="primary-btn" 
              style={{ padding: '10px 20px', fontSize: '0.88rem', background: 'var(--accent-gradient)' }}
            >
              📥 Export to Excel/CSV
            </button>
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
      {/* RENDER COURSE REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }} className="glass-card">
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Course Requests Backlog</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Review custom curriculum requests submitted by students. Adjust their state to communicate update statuses.</p>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {requestsLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Loading course requests...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Requested Course</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Upvotes</th>
                      <th>Update Status</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseRequests.length > 0 ? (
                      courseRequests.map((req) => (
                        <tr key={req._id}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{req.username}</td>
                          <td>
                            <div>
                              <div style={{ color: 'white', fontWeight: 600 }}>{req.courseName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{req.reason || req.description || 'No description'}</div>
                            </div>
                          </td>
                          <td>{req.category}</td>
                          <td>
                            <span 
                              className="difficulty-pill"
                              style={{
                                background: req.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.15)' : req.priority === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                color: req.priority === 'Urgent' ? 'var(--color-hard)' : req.priority === 'Medium' ? 'var(--color-medium)' : 'var(--accent-secondary)'
                              }}
                            >
                              {req.priority}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--color-points)' }}>👍 {req.votes?.length || 1} votes</td>
                          <td>
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateReqStatus(req._id, e.target.value)}
                              style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '4px',
                                padding: '6px 10px',
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleDeleteReq(req._id)} 
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
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                          No course requests submitted yet.
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

      {/* RENDER PROJECT SUBMISSIONS TAB */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }} className="glass-card">
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Full-Stack Project Evaluations</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Inspect files uploaded by students, test code structure/run status, and assign remarks.
            </p>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {submissionsLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Querying project database...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Filename</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length > 0 ? (
                      submissions.map((sub) => (
                        <tr key={sub._id}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{sub.username}</td>
                          <td>
                            {courses.find(c => c._id === sub.courseId)?.title || 'Full Stack Sub-Course'}
                          </td>
                          <td>
                            <a
                              href={sub.fileUrl}
                              download={sub.fileName}
                              style={{ color: 'var(--accent-secondary)', textDecoration: 'underline' }}
                            >
                              📁 {sub.fileName}
                            </a>
                          </td>
                          <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '0.78rem',
                              background: sub.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : sub.status === 'Rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: sub.status === 'Approved' ? 'var(--color-solved)' : sub.status === 'Rejected' ? 'var(--color-hard)' : '#f59e0b'
                            }}>
                              {sub.status}
                            </span>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Add feedback remarks..."
                              defaultValue={sub.remarks}
                              onBlur={(e) => handleEvaluateSubmission(sub._id, sub.status, e.target.value)}
                              style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '4px',
                                padding: '6px 10px',
                                color: 'white',
                                fontSize: '0.82rem'
                              }}
                            />
                          </td>
                          <td>
                            <select
                              value={sub.status}
                              onChange={(e) => handleEvaluateSubmission(sub._id, e.target.value, sub.remarks)}
                              style={{
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: '4px',
                                padding: '6px 10px',
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Needs Improvement">Needs Improvement</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                          No project files uploaded yet.
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

      {/* RENDER USER DOUBTS TAB */}
      {activeTab === 'doubts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }} className="glass-card">
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>User Technical Doubts Resolution</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Address questions submitted by students regarding courses, chapters, or practice problems.
            </p>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {doubtsLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Querying doubts database...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Subject / Topic</th>
                      <th>Doubt Details</th>
                      <th>Status</th>
                      <th>Instructor Reply</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doubtsList.length > 0 ? (
                      doubtsList.map((d) => (
                        <tr key={d._id}>
                          <td style={{ fontWeight: 600, color: 'white' }}>{d.username}</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{d.subject}</td>
                          <td 
                            style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setSelectedDoubtDetail(d)}
                            title="Click to view full details"
                          >
                            {d.doubtText.substring(0, 80)}{d.doubtText.length > 80 ? '...' : ''}
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '0.78rem',
                              background: d.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: d.status === 'Resolved' ? 'var(--color-solved)' : '#f59e0b'
                            }}>
                              {d.status}
                            </span>
                          </td>
                          <td>
                            {d.status === 'Resolved' ? (
                              <span style={{ color: 'white' }}>{d.reply}</span>
                            ) : (
                              <input
                                type="text"
                                placeholder="Type instructor response..."
                                id={`reply-input-${d._id}`}
                                style={{
                                  width: '100%',
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid var(--border-glass)',
                                  borderRadius: '4px',
                                  padding: '6px 10px',
                                  color: 'white',
                                  fontSize: '0.82rem'
                                }}
                              />
                            )}
                          </td>
                          <td>
                            {d.status !== 'Resolved' && (
                              <button
                                onClick={() => {
                                  const val = document.getElementById(`reply-input-${d._id}`).value;
                                  handleResolveDoubt(d._id, val);
                                }}
                                className="primary-btn"
                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                              >
                                Send Reply
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                          No technical doubts submitted yet.
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
      {activeTab === 'css-fx' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)' }} className="glass-card">
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>🎨 Card FX & CSS Box Controller</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Regulate box glow effects, 3D tilt behaviors, border styling, and global reading typography.
            </p>
          </div>

          <div className="glass-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Select Card Hover Animation</label>
              <select 
                className="form-input"
                value={cssSettings.hoverFx}
                onChange={(e) => setCssSettings({ ...cssSettings, hoverFx: e.target.value })}
              >
                <option value="3d-tilt">🔄 3D Perspective Tilt Rotation</option>
                <option value="glow">✨ Pulsing Neon Hover Glow</option>
                <option value="float">🚀 Translate Upward Floating</option>
                <option value="none">⏹ Static (No Animation)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Card Corner Border Radius</label>
              <select 
                className="form-input"
                value={cssSettings.borderRadius}
                onChange={(e) => setCssSettings({ ...cssSettings, borderRadius: e.target.value })}
              >
                <option value="0px">Sharp Edges (0px)</option>
                <option value="8px">Subtle Rounded (8px)</option>
                <option value="16px">Premium Curved (16px)</option>
                <option value="24px">Double Curved (24px)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Backdrop Blur Glassmorphism Intensity</label>
              <select 
                className="form-input"
                value={cssSettings.glassBlur}
                onChange={(e) => setCssSettings({ ...cssSettings, glassBlur: e.target.value })}
              >
                <option value="0px">None (Solid background)</option>
                <option value="4px">Light Blur (4px)</option>
                <option value="8px">Standard Glass Blur (8px)</option>
                <option value="16px">Heavy Glass Blur (16px)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Global Reading Text Size Scale</label>
              <select 
                className="form-input"
                value={cssSettings.globalScale}
                onChange={(e) => setCssSettings({ ...cssSettings, globalScale: e.target.value })}
              >
                <option value="0.9">Compact (90%)</option>
                <option value="1.0">Standard Regular (100%)</option>
                <option value="1.15">Comfortable Reading (+15%)</option>
                <option value="1.3">Highly Visible Reading (+30%)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Background Animation Effect</label>
              <select 
                className="form-input"
                value={cssSettings.bgEffect || 'none'}
                onChange={(e) => setCssSettings({ ...cssSettings, bgEffect: e.target.value })}
              >
                <option value="none">⏹ None (Solid Clean Background)</option>
                <option value="birds">🦅 Animated Wing-Flapping Birds Flight</option>
              </select>
            </div>

            <button 
              onClick={() => {
                localStorage.setItem('app-css-settings', JSON.stringify(cssSettings));
                applyGlobalCssSettings(cssSettings);
                alert('CSS Card styles and text size configurations successfully updated!');
              }} 
              className="primary-btn"
              style={{ padding: '10px 24px', alignSelf: 'flex-start' }}
            >
              Apply Settings Globally
            </button>
          </div>
        </div>
      )}

      {activeTab === 'live-feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>📊 Live Activity Feed & Notifications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Monitor latest placements preparations, doubt uploads, and syllabus completions of students in real-time.
              </p>
            </div>
            <button onClick={fetchActivities} className="warroom-btn" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              🔄 Refresh Feed
            </button>
          </div>

          <section className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
            {activitiesLoading ? (
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Synchronizing user activities stream...</div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Student</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activitiesList.length > 0 ? (
                      activitiesList.map((act) => (
                        <tr key={act._id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            {new Date(act.createdAt).toLocaleString()}
                          </td>
                          <td style={{ fontWeight: 600, color: 'white' }}>{act.username}</td>
                          <td>
                            <span 
                              className="difficulty-pill"
                              style={{
                                background: act.action.includes('Doubt') ? 'rgba(239, 68, 68, 0.15)' : act.action.includes('Upgrade') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                color: act.action.includes('Doubt') ? 'var(--color-hard)' : act.action.includes('Upgrade') ? 'var(--color-solved)' : 'var(--accent-secondary)'
                              }}
                            >
                              {act.action}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{act.details}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                          No student activity logs recorded yet.
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

      {/* DOUBT DETAILS DIALOG MODAL */}
      {selectedDoubtDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000 }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>❓ Student Doubt Details</h3>
              <button 
                onClick={() => setSelectedDoubtDetail(null)} 
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student Username</span>
                  <strong style={{ display: 'block', color: 'white', marginTop: '4px' }}>{selectedDoubtDetail.username}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject Class</span>
                  <strong style={{ display: 'block', color: 'var(--accent-secondary)', marginTop: '4px' }}>{selectedDoubtDetail.subject}</strong>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Question Content</label>
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'white', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedDoubtDetail.doubtText}
                </div>
              </div>

              {selectedDoubtDetail.status === 'Resolved' ? (
                <div className="form-group">
                  <label style={{ color: 'var(--color-solved)' }}>✓ Posted Reply Response</label>
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {selectedDoubtDetail.reply}
                  </div>
                </div>
              ) : (
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label>Type Resolve Response</label>
                  <textarea
                    id="modal-reply-input"
                    className="form-input"
                    rows="4"
                    placeholder="Enter technical explanation response..."
                  />
                  <button 
                    onClick={() => {
                      const val = document.getElementById('modal-reply-input').value;
                      handleResolveDoubt(selectedDoubtDetail._id, val);
                      setSelectedDoubtDetail(null);
                    }}
                    className="primary-btn" 
                    style={{ padding: '10px 24px', alignSelf: 'flex-end' }}
                  >
                    Post Response & Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub-Category</label>
                  <select 
                    className="form-input"
                    value={courseForm.parentCategory || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, parentCategory: e.target.value })}
                  >
                    <option value="">None</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
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

              <div className="form-group">
                <label>External Resource Link (e.g. YouTube Playlist, Documentation)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://example.com/resource"
                  value={courseForm.externalLink}
                  onChange={(e) => setCourseForm({ ...courseForm, externalLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Practice Page URL Link</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="/compiler or external practice sandbox URL"
                  value={courseForm.practicePageUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, practicePageUrl: e.target.value })}
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

              <div className="form-group">
                <label>Curriculum/Notes PDF Link</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Google Drive PDF preview link"
                  value={lessonForm.pdfUrl || ''}
                  onChange={(e) => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
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
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white', fontWeight: 600, marginTop: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={dsaForm.isDaily} 
                      onChange={(e) => setDsaForm({ ...dsaForm, isDaily: e.target.checked })} 
                    />
                    Mark as Daily Challenge
                  </label>
                </div>
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
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                {theorySubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.title}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  setSubjectForm({ id: '', title: '', icon: '📖', order: theorySubjects.length + 1, description: '', mode: 'create' });
                  setShowSubjectModal(true);
                }} 
                className="warroom-btn" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}
              >
                + Add Subject
              </button>
              {selectedTheorySubjectId && (() => {
                const currentSub = theorySubjects.find(s => s.id === selectedTheorySubjectId);
                return (
                  <>
                    <button
                      onClick={() => {
                        if (currentSub) {
                          setSubjectForm({
                            id: currentSub.id,
                            title: currentSub.title,
                            icon: currentSub.icon,
                            order: currentSub.order,
                            description: currentSub.description || '',
                            mode: 'edit'
                          });
                          setShowSubjectModal(true);
                        }
                      }}
                      className="warroom-btn"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--color-points)', borderColor: 'rgba(245,158,11,0.2)' }}
                    >
                      Edit Subject
                    </button>
                    <button 
                      onClick={() => handleDeleteTheorySubject(selectedTheorySubjectId)} 
                      className="warroom-btn" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--color-hard)', borderColor: 'rgba(239,68,68,0.2)' }}
                    >
                      Delete Subject
                    </button>
                  </>
                );
              })()}
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
                    {theorySubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.title}</option>
                    ))}
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
                <label>Lessons Paragraph / Markdown Content</label>
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

              <div className="form-group">
                <label>Block Diagram Image URL / Asset Link</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. https://images.unsplash.com/photo-... or custom image path"
                  value={theoryForm.diagramUrl}
                  onChange={(e) => setTheoryForm({ ...theoryForm, diagramUrl: e.target.value })}
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

              {/* Dynamic Quiz Questions Manager */}
              <div style={{ border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '6px', marginTop: '10px' }}>
                <h4 style={{ color: 'white', marginBottom: '12px' }}>Manage Quiz Questions ({aptitudeForm.quizQuestions?.length || 0})</h4>
                
                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                  {aptitudeForm.quizQuestions && aptitudeForm.quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Q{qIdx + 1}:</span> {q.q} 
                        <span style={{ marginLeft: '10px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>({q.difficulty || 'Easy-Medium'})</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setAptitudeForm(prev => ({ ...prev, quizQuestions: prev.quizQuestions.filter((_, i) => i !== qIdx) }))}
                        className="warroom-btn" 
                        style={{ padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-hard)', borderColor: 'var(--color-hard)' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(!aptitudeForm.quizQuestions || aptitudeForm.quizQuestions.length === 0) && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No questions added to this topic yet. Add questions below.</span>
                  )}
                </div>

                {/* Add New Question Section */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <h5 style={{ color: 'white', marginBottom: '8px', fontSize: '0.88rem' }}>Add a Question</h5>
                  <div className="form-group">
                    <label>Question Scenario</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newAptitudeQuestion.q}
                      onChange={(e) => setNewAptitudeQuestion({ ...newAptitudeQuestion, q: e.target.value })}
                      placeholder="Enter question scenario..."
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                    <input type="text" className="form-input" placeholder="Option A" value={newAptitudeQuestion.options[0]} onChange={(e) => {
                      const opts = [...newAptitudeQuestion.options];
                      opts[0] = e.target.value;
                      setNewAptitudeQuestion({ ...newAptitudeQuestion, options: opts });
                    }} />
                    <input type="text" className="form-input" placeholder="Option B" value={newAptitudeQuestion.options[1]} onChange={(e) => {
                      const opts = [...newAptitudeQuestion.options];
                      opts[1] = e.target.value;
                      setNewAptitudeQuestion({ ...newAptitudeQuestion, options: opts });
                    }} />
                    <input type="text" className="form-input" placeholder="Option C" value={newAptitudeQuestion.options[2]} onChange={(e) => {
                      const opts = [...newAptitudeQuestion.options];
                      opts[2] = e.target.value;
                      setNewAptitudeQuestion({ ...newAptitudeQuestion, options: opts });
                    }} />
                    <input type="text" className="form-input" placeholder="Option D" value={newAptitudeQuestion.options[3]} onChange={(e) => {
                      const opts = [...newAptitudeQuestion.options];
                      opts[3] = e.target.value;
                      setNewAptitudeQuestion({ ...newAptitudeQuestion, options: opts });
                    }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div className="form-group">
                      <label>Correct Index (0-3)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="3" 
                        className="form-input" 
                        value={newAptitudeQuestion.correctIdx} 
                        onChange={(e) => setNewAptitudeQuestion({ ...newAptitudeQuestion, correctIdx: Number(e.target.value) })} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Difficulty Tier</label>
                      <select 
                        className="form-input"
                        value={newAptitudeQuestion.difficulty}
                        onChange={(e) => setNewAptitudeQuestion({ ...newAptitudeQuestion, difficulty: e.target.value })}
                      >
                        <option value="Easy-Medium">Easy-Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Explanation</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={newAptitudeQuestion.explanation} 
                        onChange={(e) => setNewAptitudeQuestion({ ...newAptitudeQuestion, explanation: e.target.value })} 
                        placeholder="Detailed steps..."
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAptitudeQuestion.q.trim()) return alert('Question Scenario text required');
                      if (newAptitudeQuestion.options.some(o => !o.trim())) return alert('All 4 options must be filled');
                      setAptitudeForm(prev => ({
                        ...prev,
                        quizQuestions: [...(prev.quizQuestions || []), newAptitudeQuestion]
                      }));
                      setNewAptitudeQuestion({ q: '', options: ['', '', '', ''], correctIdx: 0, explanation: '', difficulty: 'Easy-Medium' });
                    }}
                    className="warroom-btn"
                    style={{ width: '100%', marginTop: '14px', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'var(--color-solved)', color: 'var(--color-solved)' }}
                  >
                    + Append Question to Topic Quiz
                  </button>
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
      {/* THEORY SUBJECT CREATION MODAL */}
      {showSubjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>{subjectForm.mode === 'edit' ? 'Edit Theory Course/Subject' : 'Create New Theory Course/Subject'}</h2>
            <form onSubmit={handleSaveTheorySubject} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Subject ID * (e.g. system-design, dbms)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={subjectForm.id}
                  onChange={(e) => setSubjectForm({ ...subjectForm, id: e.target.value })}
                  placeholder="e.g. system-design"
                  disabled={subjectForm.mode === 'edit'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={subjectForm.title}
                  onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })}
                  placeholder="e.g. System Design"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="Describe what this theory course covers..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Icon Emoji *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={subjectForm.icon}
                    onChange={(e) => setSubjectForm({ ...subjectForm, icon: e.target.value })}
                    placeholder="e.g. 🌐"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Order Number *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={subjectForm.order}
                    onChange={(e) => setSubjectForm({ ...subjectForm, order: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowSubjectModal(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  {subjectForm.mode === 'edit' ? 'Save Changes' : 'Create Subject'}
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

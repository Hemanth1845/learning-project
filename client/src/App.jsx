import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import DSAPractice from './pages/DSAPractice';
import Courses from './pages/Courses';
import AptitudeMastery from './pages/AptitudeMastery';
import TheoryHub from './pages/TheoryHub';
import JobUpdates from './pages/JobUpdates';
import Notes from './pages/Notes';
import AIChat from './pages/AIChat';
import MockInterviews from './pages/MockInterviews';
import InterviewSession from './pages/InterviewSession';
import MockInterviewSetup from './pages/MockInterviewSetup';
import VideoCallSimulator from './pages/VideoCallSimulator';
import ResumeATS from './pages/ResumeATS';
import AdminDashboard from './pages/AdminDashboard';
import DailyProblems from './pages/DailyProblems';
import RequestCourse from './pages/RequestCourse';
import Compiler from './pages/Compiler';
import FurtherDoubts from './pages/FurtherDoubts';
import CommunicationCoach from './pages/CommunicationCoach';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import SplashIntro from './components/SplashIntro';

// Protected Route Guard for normal users (Students)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ color: 'white', padding: '32px' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  return children;
};

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ color: 'white', padding: '32px' }}>Loading...</div>;
  if (!user) return <Navigate to="/admin-login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Layout component wrapping pages with Navbar and Sidebar
const MainLayout = ({ children }) => {
  const { user, logout, token, API_URL } = useContext(AuthContext);
  const location = useLocation();

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [hoveredSearchIdx, setHoveredSearchIdx] = useState(null);

  const handleGlobalSearch = async (val) => {
    setGlobalSearchQuery(val);
    if (!val.trim()) {
      setGlobalSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/dashboard/search?q=${val}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGlobalSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSearchResult = (res) => {
    setGlobalSearchQuery('');
    setGlobalSearchResults([]);
    window.location.href = res.targetUrl;
  };

  // Load and apply persistent theme and CSS Card FX settings from local storage
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme') || 'light';
    const fxSaved = localStorage.getItem('app-css-settings');
    const fx = fxSaved ? JSON.parse(fxSaved) : { hoverFx: '3d-tilt', borderRadius: '16px', glassBlur: '8px', globalScale: '1.0', bgEffect: 'birds' };
    
    const root = document.documentElement;
    root.style.setProperty('--card-border-radius', fx.borderRadius);
    root.style.setProperty('--card-glass-blur', fx.glassBlur);
    root.style.setProperty('--global-text-scale', fx.globalScale);

    document.body.className = `theme-${saved} fx-${fx.hoverFx} ${fx.bgEffect === 'birds' ? 'bg-birds' : ''}`;
    return saved;
  });

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('app-theme', themeName);
    
    const fxSaved = localStorage.getItem('app-css-settings');
    const fx = fxSaved ? JSON.parse(fxSaved) : { hoverFx: '3d-tilt', borderRadius: '16px', glassBlur: '8px', globalScale: '1.0', bgEffect: 'birds' };
    document.body.className = `theme-${themeName} fx-${fx.hoverFx} ${fx.bgEffect === 'birds' ? 'bg-birds' : ''}`;
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user && user.role === 'admin';
  
  // Theme options are only visible on the Dashboard page
  const isDashboard = location.pathname === '/';

  return (
    <div className="app-container">
      {/* Animated Birds Stage */}
      <div className="birds-stage">
        <div className="flapping-bird flapping-bird-1"></div>
        <div className="flapping-bird flapping-bird-2"></div>
        <div className="flapping-bird flapping-bird-3"></div>
      </div>
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">{isAdmin ? '⚙️' : '⚡'}</div>
          <span className="logo-text">{isAdmin ? 'ADMIN PANEL' : 'PREPPORTAL'}</span>
        </div>
        <nav className="nav-list">
          {!isAdmin ? (
            <>
              <Link to="/" className={`nav-item ${isActive('/')}`}>
                <span>📊</span> Dashboard
              </Link>
              <Link to="/dsa" className={`nav-item ${isActive('/dsa')}`}>
                <span>💡</span> DSA Practice
              </Link>
              <Link to="/daily-problems" className={`nav-item ${isActive('/daily-problems')}`}>
                <span>📆</span> Daily Problems
              </Link>
              <Link to="/courses" className={`nav-item ${isActive('/courses') && !location.search.includes('course=') ? 'active' : ''}`}>
                <span>📚</span> Courses
              </Link>
              <Link to="/courses?course=fullstack-web-dev" className={`nav-item ${location.pathname === '/courses' && location.search.includes('course=fullstack-web-dev') ? 'active' : ''}`}>
                <span>🌐</span> Full Stack Course
              </Link>
              <Link to="/compiler" className={`nav-item ${isActive('/compiler')}`}>
                <span>💻</span> Compiler
              </Link>
              <Link to="/theory" className={`nav-item ${isActive('/theory')}`}>
                <span>📖</span> Theory Hub
              </Link>
              <Link to="/aptitude" className={`nav-item ${isActive('/aptitude')}`}>
                <span>📈</span> Aptitude
              </Link>
              <Link to="/jobs" className={`nav-item ${isActive('/jobs')}`}>
                <span>💼</span> Job Updates
              </Link>
              <Link to="/notes" className={`nav-item ${isActive('/notes')}`}>
                <span>📝</span> Notes
              </Link>
              <Link to="/ai-chat" className={`nav-item ${isActive('/ai-chat')}`}>
                <span>💬</span> AI Chat
              </Link>
              <Link to="/mock-interview" className={`nav-item ${isActive('/mock-interview')}`}>
                <span>🎥</span> Mock Interview
              </Link>
              <Link to="/communication-coach" className={`nav-item ${isActive('/communication-coach')}`}>
                <span>🎤</span> Communication Coach
              </Link>
              <Link to="/resume-ats" className={`nav-item ${isActive('/resume-ats')}`}>
                <span>📄</span> Resume & ATS
              </Link>
              <Link to="/request-course" className={`nav-item ${isActive('/request-course')}`}>
                <span>💡</span> Request Course
              </Link>
              <Link to="/further-doubts" className={`nav-item ${isActive('/further-doubts')}`}>
                <span>❓</span> Further Doubts
              </Link>

              <div style={{ margin: '16px 0 8px 12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Account
              </div>
              <Link to="/profile" className={`nav-item ${isActive('/profile')}`}>
                <span>👤</span> Profile
              </Link>
              <Link to="/pricing" className={`nav-item ${isActive('/pricing')}`}>
                <span>💳</span> Pricing
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin-dashboard" className={`nav-item ${isActive('/admin-dashboard')}`}>
                <span>⚙️</span> Management Hub
              </Link>
            </>
          )}
          <div className="nav-item logout-btn" onClick={logout} style={{ marginTop: 'auto' }}>
            <span>🚪</span> Sign Out
          </div>
        </nav>
      </aside>

      {/* Main Panel Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title-section">
            <h1>
              {isAdmin 
                ? 'Administrator Console' 
                : location.pathname === '/notes' 
                  ? 'Placement Prep Sheets' 
                  : 'Placement Preparation Hub'}
            </h1>
            <p>{isAdmin ? 'Control system courses, syllabi, assessments and users' : 'Master technical exams and ace interviews'}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Global Search Input */}
            {!isAdmin && (
              <div className="global-search-container" style={{ position: 'relative', width: '280px' }}>
                <input
                  type="text"
                  placeholder="🔍 Global Search (e.g. Normalization)..."
                  value={globalSearchQuery}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 16px 8px 36px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
                
                {/* Search Results Dropdown */}
                {globalSearchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '320px',
                    background: '#0d0d15',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 999,
                    maxHeight: '360px',
                    overflowY: 'auto',
                    padding: '8px 0'
                  }}>
                    {globalSearchResults.map((res, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSearchResult(res)}
                        onMouseEnter={() => setHoveredSearchIdx(idx)}
                        onMouseLeave={() => setHoveredSearchIdx(null)}
                        style={{
                          padding: '10px 16px',
                          borderBottom: idx === globalSearchResults.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          background: hoveredSearchIdx === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'white', fontSize: '0.82rem' }}>{res.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{res.type}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{res.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Show Theme Switcher Dropdown on all pages */}
            <div className="theme-dropdown-container">
              <button className="theme-dropdown-btn">
                🎨 Theme Options ▾
              </button>
              <div className="theme-dropdown-menu">
                <div className="theme-dropdown-item" onClick={() => changeTheme('aurora')}>
                  🌌 Aurora Theme
                </div>
                <div className="theme-dropdown-item" onClick={() => changeTheme('red-black')}>
                  🔴 Red & Black
                </div>
                <div className="theme-dropdown-item" onClick={() => changeTheme('golden-amber')}>
                  🟡 Golden Amber
                </div>
                <div className="theme-dropdown-item" onClick={() => changeTheme('deep-ocean')}>
                  🔵 Deep Ocean
                </div>
                <div className="theme-dropdown-item" onClick={() => changeTheme('rgb')}>
                  🌈 RGB Gaming
                </div>
                <div className="theme-dropdown-item" onClick={() => changeTheme('light')}>
                  ☀️ Clean Light
                </div>
              </div>
            </div>

            {user && (
              <div className="user-profile-badge">
                <img src={user.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" className="user-profile-pic" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-bright)', fontSize: '0.9rem' }}>{user.username}</div>
                  {!isAdmin ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-points)', fontWeight: 600 }}>🔥 {user.streak} Days | {user.xp} XP</div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Role: System Admin</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      {showSplash && <SplashIntro onComplete={handleSplashComplete} />}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Routes inside Main Layout */}
          <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/dsa" element={<ProtectedRoute><MainLayout><DSAPractice /></MainLayout></ProtectedRoute>} />
          <Route path="/daily-problems" element={<ProtectedRoute><MainLayout><DailyProblems /></MainLayout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><MainLayout><Courses /></MainLayout></ProtectedRoute>} />
          <Route path="/compiler" element={<ProtectedRoute><MainLayout><Compiler /></MainLayout></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><MainLayout><Notes /></MainLayout></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><MainLayout><AIChat /></MainLayout></ProtectedRoute>} />
          <Route path="/aptitude" element={<ProtectedRoute><MainLayout><AptitudeMastery /></MainLayout></ProtectedRoute>} />
          <Route path="/theory" element={<ProtectedRoute><MainLayout><TheoryHub /></MainLayout></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><MainLayout><JobUpdates /></MainLayout></ProtectedRoute>} />
          <Route path="/interviews" element={<ProtectedRoute><MainLayout><MockInterviews /></MainLayout></ProtectedRoute>} />
          <Route path="/interviews/:id" element={<ProtectedRoute><MainLayout><InterviewSession /></MainLayout></ProtectedRoute>} />
          
          {/* New Interactive Mock Call and Resume Builder Routes */}
          <Route path="/mock-interview" element={<ProtectedRoute><MainLayout><MockInterviewSetup /></MainLayout></ProtectedRoute>} />
          <Route path="/mock-interview/call" element={<ProtectedRoute><MainLayout><VideoCallSimulator /></MainLayout></ProtectedRoute>} />
          <Route path="/resume-ats" element={<ProtectedRoute><MainLayout><ResumeATS /></MainLayout></ProtectedRoute>} />
          <Route path="/request-course" element={<ProtectedRoute><MainLayout><RequestCourse /></MainLayout></ProtectedRoute>} />
          <Route path="/further-doubts" element={<ProtectedRoute><MainLayout><FurtherDoubts /></MainLayout></ProtectedRoute>} />
          <Route path="/communication-coach" element={<ProtectedRoute><MainLayout><CommunicationCoach /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><MainLayout><Pricing /></MainLayout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminRoute><MainLayout><AdminDashboard /></MainLayout></AdminRoute>} />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

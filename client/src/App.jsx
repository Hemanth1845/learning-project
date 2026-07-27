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
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Load and apply persistent theme from local storage
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme') || 'aurora';
    document.body.className = `theme-${saved}`;
    return saved;
  });

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('app-theme', themeName);
    document.body.className = `theme-${themeName}`;
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const isAdmin = user && user.role === 'admin';
  
  // Theme options are only visible on the Dashboard page
  const isDashboard = location.pathname === '/';

  return (
    <div className="app-container">
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
              <Link to="/courses" className={`nav-item ${isActive('/courses')}`}>
                <span>📚</span> Courses
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
              <Link to="/interviews" className={`nav-item ${isActive('/interviews')}`}>
                <span>🤖</span> Interviews
              </Link>
              <Link to="/mock-interview" className={`nav-item ${isActive('/mock-interview')}`}>
                <span>🎥</span> Mock Interview
              </Link>
              <Link to="/resume-ats" className={`nav-item ${isActive('/resume-ats')}`}>
                <span>📄</span> Resume & ATS
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
            <h1>{isAdmin ? 'Administrator Console' : 'Placement Preparation Hub'}</h1>
            <p>{isAdmin ? 'Control system courses, syllabi, assessments and users' : 'Master technical exams and ace interviews'}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Show Theme Switcher Dropdown ONLY on Dashboard page */}
            {isDashboard && (
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
            )}

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
  return (
    <AuthProvider>
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

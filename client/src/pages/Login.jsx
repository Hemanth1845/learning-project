import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError('All fields are required');
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      if (loggedUser.role === 'admin') {
        logout();
        setError('Access denied: Admin accounts must use the Admin Sign-In portal.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Simulated Google Sign-In for demo ease
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const demoProfiles = [
        { email: 'alex.doe@gmail.com', name: 'Alex Doe', googleId: '123456789', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
        { email: 'emma.watson@gmail.com', name: 'Emma Watson', googleId: '987654321', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }
      ];
      // Randomly select a demo user profile
      const picked = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];
      await googleLogin(picked);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">⚡ PREPPORTAL</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Log in to resume your learning</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-hard)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>


        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
        <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Are you an Admin?{' '}
          <Link to="/admin-login" style={{ color: 'var(--color-points)', fontWeight: 600 }}>
            Admin Portal Sign-In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

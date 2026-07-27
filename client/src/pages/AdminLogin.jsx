import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError('All fields are required');
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      if (loggedUser.role !== 'admin') {
        logout();
        setError('Access denied: Student accounts are restricted from the Admin panel.');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ background: 'radial-gradient(circle at center, #11141a 0%, #030406 80%)' }}>
      <div className="auth-card glass-card" style={{ border: '1px solid rgba(111, 66, 193, 0.25)', boxShadow: '0 0 30px rgba(111, 66, 193, 0.15)' }}>
        <div className="auth-header">
          <div className="auth-logo" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #6f42c1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ⚙️ ADMIN PORTAL
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'white' }}>System Sign-In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authenticate to access management dashboards</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-hard)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Admin Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Master Password</label>
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
          <button type="submit" className="primary-btn" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Are you a student?{' '}
          <Link to="/login" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
            Go to Student Portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

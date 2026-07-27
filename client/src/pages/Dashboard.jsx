import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, user, reloadProfile, API_URL } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [bookmarks, setBookmarks] = useState({ courses: [], dsa: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Dashboard Stats
      const statsRes = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Fetch Leaderboard
      const leadRes = await fetch(`${API_URL}/dashboard/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const leadData = await leadRes.json();
      setLeaderboard(leadData);

      // 3. Fetch Bookmarks
      const bookRes = await fetch(`${API_URL}/dashboard/bookmarks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookData = await bookRes.json();
      setBookmarks(bookData);

      // Sync user profile state
      await reloadProfile();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      const res = await fetch(`${API_URL}/dashboard/notifications/${notifId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStats(prev => ({
          ...prev,
          notifications: prev.notifications.map(n => n._id === notifId ? { ...n, isRead: true } : n)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Stats Row */}
      <section className="dashboard-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--color-points)' }}>🔥</div>
          <div className="metric-info">
            <h3>Login Streak</h3>
            <div className="value">{stats?.streak || 0} Days</div>
          </div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--accent-secondary)' }}>⚡</div>
          <div className="metric-info">
            <h3>Total Points (XP)</h3>
            <div className="value">{stats?.xp || 0} XP</div>
          </div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: 'var(--color-solved)' }}>✅</div>
          <div className="metric-info">
            <h3>DSA Solved</h3>
            <div className="value">{stats?.problemsSolved || 0}</div>
          </div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon-wrapper" style={{ color: '#a78bfa' }}>🏆</div>
          <div className="metric-info">
            <h3>Global Rank</h3>
            <div className="value">#{stats?.rank || 999}</div>
          </div>
        </div>
      </section>

      {/* 2. Leaderboard & Notifications Row */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }} className="scorecard-panel">
        
        {/* Leaderboard */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏆</span> Top Performers Leaderboard
          </h2>
          <div className="leaderboard-list">
            {leaderboard.slice(0, 5).map((u) => {
              const isCurrentUser = u.username === user?.username;
              const isTopThree = u.rank <= 3;
              return (
                <div key={u._id} className={`leaderboard-row ${isCurrentUser ? 'active' : ''} ${isTopThree ? 'top-three' : ''}`} style={isCurrentUser ? { border: '1.5px solid var(--accent-secondary)' } : {}}>
                  <div className="leaderboard-user">
                    <span className={`rank-number rank-${u.rank}`}>{u.rank}</span>
                    <img src={u.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 600, color: isCurrentUser ? 'var(--accent-secondary)' : 'white' }}>
                      {u.username} {isCurrentUser && '(You)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>🔥 {u.streak}</span>
                    <span style={{ color: 'var(--accent-secondary)' }}>{u.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔔</span> System Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats?.notifications && stats.notifications.length > 0 ? (
              stats.notifications.map((notif) => (
                <div key={notif._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', border: '1px solid var(--border-glass)', borderRadius: '8px', opacity: notif.isRead ? 0.6 : 1 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{notif.message}</div>
                  </div>
                  {!notif.isRead && (
                    <button onClick={() => markAsRead(notif._id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>No new notifications.</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Bookmarks Section (Full Width) */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Bookmarked items */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔖</span> Bookmarked Topics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {bookmarks.courses.map((course) => (
              <Link to="/courses" key={course._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(111, 66, 193, 0.05)', border: '1px solid rgba(111, 66, 193, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>📚 {course.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Course →</span>
              </Link>
            ))}
            {bookmarks.dsa.map((prob) => (
              <Link to="/dsa" key={prob._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>🧠 {prob.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>DSA ({prob.difficulty}) →</span>
              </Link>
            ))}
            {bookmarks.courses.length === 0 && bookmarks.dsa.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0', gridColumn: '1 / -1' }}>
                Bookmark courses or DSA problems to see them here.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;

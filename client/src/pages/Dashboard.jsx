import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, user, reloadProfile, updateProfile, API_URL } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [bookmarks, setBookmarks] = useState({ courses: [], dsa: [], theory: [], aptitude: [] });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  const [yearOfStudy, setYearOfStudy] = useState(user?.yearOfStudy || '3rd Year');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science & Engineering');
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    if (user) {
      setYearOfStudy(user.yearOfStudy || '3rd Year');
      setBranch(user.branch || 'Computer Science & Engineering');
    }
  }, [user]);

  const handleProfileUpdate = async (newYear, newBranch) => {
    try {
      await updateProfile(newYear, newBranch);
      setProfileMessage('Academic profile synced with AI Advisor! ⚡');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

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

      // 4. Fetch Recommendations & predictions
      const recRes = await fetch(`${API_URL}/dashboard/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData);
      }

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

      {/* Personalized AI Placement Advisor Banner */}
      {recommendations && (
        <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', background: 'var(--accent-gradient-subtle, rgba(0, 242, 254, 0.03))', border: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              <span>🧠</span> AI Career Mentor Recommendation
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'white', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
              {recommendations.welcomeMessage}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="scorecard-panel">
            {/* Today's Action Plan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>📅 Today's Action Roadmap</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {recommendations.dailyRoadmap.map((task, idx) => (
                  <li key={idx} style={{ listStyle: 'none', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)', fontSize: '0.88rem', color: 'white' }}>
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement Readiness Prediction */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 600 }}>📊 Placement Readiness Score</h4>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{recommendations.placementReadinessScore}%</span>
              </div>
              
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                <div style={{ width: `${recommendations.placementReadinessScore}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '4px' }} />
              </div>

              {/* Company Readiness breakdown */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>TARGET COMPANY READINESS:</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                  {Object.entries(recommendations.companyReadiness).map(([company, score]) => (
                    <div key={company} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-main)' }}>{company}</span>
                      <span style={{ fontWeight: 700, color: score > 75 ? 'var(--color-solved)' : score > 50 ? 'var(--accent-secondary)' : '#f43f5e' }}>{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
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

      {/* Skill Tree & Leveling */}
      <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🌳</span> Placement Skill Tree & Branches
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Unlock branches of your placement readiness journey by gaining XP points.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }} className="scorecard-panel">
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '12px' }}>
            <strong style={{ color: 'white', display: 'block', fontSize: '0.95rem', marginBottom: '12px' }}>💻 DSA Branch</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-solved)' }}>
                <span>Arrays & Strings</span> <span>✓ Unlocked</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-solved)' }}>
                <span>Linked Lists & Stacks</span> <span>✓ Unlocked</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: (stats?.xp || 0) >= 300 ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                <span>Dynamic Programming</span> <span>{(stats?.xp || 0) >= 300 ? '✓ Unlocked' : '🔒 Requires 300 XP'}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '12px' }}>
            <strong style={{ color: 'white', display: 'block', fontSize: '0.95rem', marginBottom: '12px' }}>🎤 Communication Branch</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-solved)' }}>
                <span>Self Introduction</span> <span>✓ Unlocked</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: (stats?.xp || 0) >= 200 ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                <span>STAR Method Pitching</span> <span>{(stats?.xp || 0) >= 200 ? '✓ Unlocked' : '🔒 Requires 200 XP'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: (stats?.xp || 0) >= 400 ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                <span>Group Discussions</span> <span>{(stats?.xp || 0) >= 400 ? '✓ Unlocked' : '🔒 Requires 400 XP'}</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '12px' }}>
            <strong style={{ color: 'white', display: 'block', fontSize: '0.95rem', marginBottom: '12px' }}>📈 Aptitude Branch</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-solved)' }}>
                <span>Quantitative basics</span> <span>✓ Unlocked</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: (stats?.xp || 0) >= 250 ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                <span>Logical reasoning</span> <span>{(stats?.xp || 0) >= 250 ? '✓ Unlocked' : '🔒 Requires 250 XP'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: (stats?.xp || 0) >= 500 ? 'var(--color-solved)' : 'var(--text-muted)' }}>
                <span>Data Interpretation</span> <span>{(stats?.xp || 0) >= 500 ? '✓ Unlocked' : '🔒 Requires 500 XP'}</span>
              </div>
            </div>
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
            {bookmarks.courses && bookmarks.courses.map((course) => (
              <Link to="/courses" key={course._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(111, 66, 193, 0.05)', border: '1px solid rgba(111, 66, 193, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>📚 {course.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Course →</span>
              </Link>
            ))}
            {bookmarks.dsa && bookmarks.dsa.map((prob) => (
              <Link to="/dsa" key={prob._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>🧠 {prob.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>DSA ({prob.difficulty}) →</span>
              </Link>
            ))}
            {bookmarks.theory && bookmarks.theory.map((ch) => (
              <Link to="/theory" key={ch._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>📖 {ch.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Theory →</span>
              </Link>
            ))}
            {bookmarks.aptitude && bookmarks.aptitude.map((topic) => (
              <Link to="/aptitude" key={topic._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, color: 'white' }}>🧮 {topic.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>Aptitude →</span>
              </Link>
            ))}
            {(!bookmarks.courses?.length && !bookmarks.dsa?.length && !bookmarks.theory?.length && !bookmarks.aptitude?.length) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0', gridColumn: '1 / -1' }}>
                Bookmark courses, DSA problems, theory chapters, or aptitude topics to see them here.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DailyProblems = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [dailyList, setDailyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchDailyProblems();
    }
  }, [token]);

  const fetchDailyProblems = async () => {
    try {
      const res = await fetch(`${API_URL}/dsa/daily`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDailyList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = (prob) => {
    navigate(`/dsa?problemId=${prob._id || prob.problemId}`);
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Daily Challenges...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>📆 Daily Coding Challenges</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Based on your career roadmap, you have completed Arrays! Today's recommended target is Strings.
        </p>
      </div>

      {/* Target Info banner */}
      <section className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--accent-secondary)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎯 Daily Goal: Solve 2 String Challenges
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          Strings form a foundational pillar in interview preparations. Consistently practicing daily coding routines preserves streaks and increases problem-solving velocity. Target completion adds <strong>+20 XP</strong> total!
        </p>
      </section>

      {/* Problems Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {dailyList.map((prob, index) => (
          <div 
            key={prob._id} 
            className="glass-card" 
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
              background: prob.solved ? 'rgba(46, 204, 113, 0.04)' : 'rgba(255,255,255,0.01)',
              borderColor: prob.solved ? 'var(--color-solved)' : 'var(--border-glass)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="difficulty-pill easy" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                  {prob.difficulty}
                </span>
                <span style={{ fontSize: '0.78rem', color: prob.solved ? 'var(--color-solved)' : '#f1c40f', fontWeight: 600 }}>
                  {prob.solved ? '✓ Solved' : '⏳ Incomplete'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.25rem', color: 'white', marginTop: '16px', fontWeight: 700 }}>
                {index + 1}. {prob.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5', minHeight: '60px' }}>
                {prob.description ? prob.description.substring(0, 140) + '...' : 'Practice standard input-output functions and solve logic test cases.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                ⚡ +{prob.xp} XP
              </span>
              <button 
                onClick={() => handleStartPractice(prob)}
                className="primary-btn" 
                style={{ padding: '8px 20px', fontSize: '0.85rem', background: prob.solved ? 'rgba(46, 204, 113, 0.15)' : 'var(--accent-gradient)', borderColor: prob.solved ? 'var(--color-solved)' : 'transparent', color: prob.solved ? '#2ecc71' : 'white' }}
              >
                {prob.solved ? 'Re-Practice 💻' : 'Start Challenge 💻'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyProblems;

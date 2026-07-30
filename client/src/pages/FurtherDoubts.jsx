import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FurtherDoubts = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [doubtText, setDoubtText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doubts, setDoubts] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchMyDoubts();
    }
  }, [token]);

  const fetchMyDoubts = async () => {
    setListLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/doubts/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoubts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !doubtText.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/courses/doubts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, doubtText })
      });
      if (res.ok) {
        const newDoubt = await res.json();
        setDoubts(prev => [newDoubt, ...prev]);
        setSubject('');
        setDoubtText('');
        setMessage('Your doubt has been submitted successfully to the instructors!');
        setTimeout(() => setMessage(''), 4000);
      } else {
        alert('Failed to submit doubt.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Further Doubts Helpdesk</h2>
        <p style={{ color: 'var(--text-muted)' }}>Submit any conceptual or implementation queries. Instructors will respond shortly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }} className="scorecard-panel">
        {/* Submit form */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Ask a New Doubt</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Subject / Topic</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. DBMS Normalization, React Side Effects"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Explain Your Doubt</label>
              <textarea
                className="form-input"
                rows="5"
                placeholder="Detail the problem you are facing or concept you want clarified..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                required
              />
            </div>
            {message && <div style={{ color: 'var(--color-solved)', fontSize: '0.85rem', fontWeight: 600 }}>{message}</div>}
            <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '10px 24px', alignSelf: 'flex-start' }}>
              {loading ? 'Submitting...' : 'Submit Doubt'}
            </button>
          </form>
        </div>

        {/* Previous Doubts List */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'white' }}>My Doubts History</h3>
          {listLoading ? (
            <div style={{ color: 'var(--text-muted)' }}>Loading history...</div>
          ) : doubts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {doubts.map((d) => (
                <div key={d._id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 600, color: 'white' }}>{d.subject}</h4>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      background: d.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: d.status === 'Resolved' ? 'var(--color-solved)' : '#f59e0b'
                    }}>
                      {d.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{d.doubtText}</p>
                  
                  {d.reply && (
                    <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.04)', borderRadius: '6px', borderLeft: '3px solid var(--accent-secondary)' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'white' }}>Instructor Response:</strong>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>{d.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>You have not submitted any doubts yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FurtherDoubts;

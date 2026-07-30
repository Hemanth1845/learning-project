import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RequestCourse = () => {
  const { token, user, API_URL } = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';

  // Form states
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [priority, setPriority] = useState('Medium');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Request list state
  const [requests, setRequests] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const fetchRequests = async () => {
    setListLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/requests/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setListLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) {
      alert('Please specify the course name.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/courses/requests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseName,
          category,
          priority,
          reason,
          description,
          referenceLinks
        })
      });

      if (res.ok) {
        const newReq = await res.json();
        setRequests(prev => [newReq, ...prev]);
        setCourseName('');
        setReason('');
        setDescription('');
        setReferenceLinks('');
        setMessage('Your course request has been submitted successfully and received your automatic vote! ⚡');
        setTimeout(() => setMessage(''), 4000);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to submit course request.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/courses/requests/${requestId}/vote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updatedReq = await res.json();
        setRequests(prev => prev.map(r => r._id === requestId ? updatedReq : r));
      }
    } catch (err) {
      console.error('Error casting vote:', err);
    }
  };

  const handleAdminUpdateStatus = async (requestId, status) => {
    try {
      const res = await fetch(`${API_URL}/courses/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedReq = await res.json();
        setRequests(prev => prev.map(r => r._id === requestId ? updatedReq : r));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAdminDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this course request?')) return;
    try {
      const res = await fetch(`${API_URL}/courses/requests/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== requestId));
      }
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'white' }}>
          💡 Course Request & Upvote Hub
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Help us build the curriculum! Request new subjects or vote on what courses the platform should create next.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '32px' }} className="scorecard-panel">
        {/* Left Side: Submit Request */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Submit Request</h3>
          <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Course Name *
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Next.js & Server Components"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Category
                </label>
                <select 
                  className="form-input" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }}
                >
                  <option value="Programming">Programming</option>
                  <option value="AI">AI / Machine Learning</option>
                  <option value="DSA">DSA Practice</option>
                  <option value="Aptitude">Aptitude Prep</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud Architecture</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Priority Level
                </label>
                <select 
                  className="form-input" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', color: 'white' }}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Urgent">Urgent Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Reason for Requesting
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Preparing for TCS interview in 2 weeks"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Course Syllabus / Description Details
              </label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Describe what subtopics you want included..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Reference Link / Resource Links (Optional)
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. GitHub repos, documentation sites"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading} style={{ background: 'var(--accent-gradient)' }}>
              {loading ? 'Submitting...' : 'Submit Course Need 🚀'}
            </button>

            {message && (
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', padding: '10px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--accent-secondary)', textAlign: 'center' }}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Requests Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Current Requests ({requests.length})</h3>
            <button onClick={fetchRequests} className="warroom-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              🔄 Refresh
            </button>
          </div>

          {listLoading ? (
            <div style={{ color: 'var(--text-muted)', padding: '32px', textAlign: 'center' }}>Loading course requests...</div>
          ) : requests.length === 0 ? (
            <div className="glass-card" style={{ color: 'var(--text-muted)', padding: '48px', textAlign: 'center' }}>
              No course requests found. Be the first to suggest one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '600px', paddingRight: '6px' }}>
              {requests.map((reqItem) => {
                const hasVoted = reqItem.votes.includes(user?._id);
                return (
                  <div key={reqItem._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: reqItem.priority === 'Urgent' ? '4px solid #ef4444' : reqItem.priority === 'Medium' ? '4px solid #3b82f6' : '4px solid #10b981' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-main)', marginRight: '8px' }}>
                          {reqItem.category}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          borderRadius: '4px',
                          fontWeight: 600,
                          color: '#fff',
                          background: reqItem.status === 'Completed' ? '#10b981' : reqItem.status === 'In Progress' ? '#3b82f6' : reqItem.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                        }}>
                          {reqItem.status}
                        </span>
                      </div>
                      
                      {/* Vote Button */}
                      <button 
                        onClick={() => handleVote(reqItem._id)}
                        className="warroom-btn"
                        style={{
                          background: hasVoted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                          borderColor: hasVoted ? '#10b981' : 'var(--border-glass)',
                          color: hasVoted ? '#10b981' : 'white',
                          padding: '6px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                      >
                        <span>▲</span> {reqItem.votes.length} Votes
                      </button>
                    </div>

                    <div>
                      <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>{reqItem.courseName}</h4>
                      {reqItem.reason && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', marginTop: '4px', fontWeight: 500 }}>
                          💡 {reqItem.reason}
                        </p>
                      )}
                      {reqItem.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                          {reqItem.description}
                        </p>
                      )}
                      {reqItem.referenceLinks && (
                        <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Resource: </span>
                          <a href={reqItem.referenceLinks} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)', textDecoration: 'underline' }}>
                            {reqItem.referenceLinks}
                          </a>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>Suggested by: <strong style={{ color: 'var(--text-main)' }}>{reqItem.username}</strong></span>
                      <span>{new Date(reqItem.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '8px' }}>
                        <span style={{ alignSelf: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'white', marginRight: '6px' }}>ADMIN CONTROL:</span>
                        <button 
                          onClick={() => handleAdminUpdateStatus(reqItem._id, 'Pending')} 
                          className="warroom-btn" 
                          style={{ padding: '4px 10px', fontSize: '0.7rem', background: reqItem.status === 'Pending' ? '#f59e0b' : 'transparent', color: reqItem.status === 'Pending' ? 'black' : 'white' }}
                        >
                          Pending
                        </button>
                        <button 
                          onClick={() => handleAdminUpdateStatus(reqItem._id, 'In Progress')} 
                          className="warroom-btn" 
                          style={{ padding: '4px 10px', fontSize: '0.7rem', background: reqItem.status === 'In Progress' ? '#3b82f6' : 'transparent', color: reqItem.status === 'In Progress' ? 'white' : 'white' }}
                        >
                          In Progress
                        </button>
                        <button 
                          onClick={() => handleAdminUpdateStatus(reqItem._id, 'Completed')} 
                          className="warroom-btn" 
                          style={{ padding: '4px 10px', fontSize: '0.7rem', background: reqItem.status === 'Completed' ? '#10b981' : 'transparent', color: reqItem.status === 'Completed' ? 'white' : 'white' }}
                        >
                          Approve/Complete
                        </button>
                        <button 
                          onClick={() => handleAdminUpdateStatus(reqItem._id, 'Rejected')} 
                          className="warroom-btn" 
                          style={{ padding: '4px 10px', fontSize: '0.7rem', background: reqItem.status === 'Rejected' ? '#ef4444' : 'transparent', color: reqItem.status === 'Rejected' ? 'white' : 'white' }}
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAdminDelete(reqItem._id)} 
                          className="warroom-btn" 
                          style={{ padding: '4px 10px', fontSize: '0.7rem', marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', color: '#ff7272' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCourse;

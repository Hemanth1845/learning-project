import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MockInterviews = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  // Companies details matching the 2nd photo mockup
  const companies = [
    { name: 'CES', full: 'Consultancy Engineering Systems (TCS)', desc: 'Enterprise software architecture pipelines, SQL optimizations, and database scaling algorithms.', role: 'Associate Systems Engineer', packageRange: '₹3.6 - 9 LPA', difficulty: 'Easy', color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
    { name: 'IDS', full: 'Infosys Digital Specialization (Infosys)', desc: 'Algorithmic efficiency audits, design patterns validation, and modular software refactoring.', role: 'Specialist Software Engineer', packageRange: '₹3.6 - 9.5 LPA', difficulty: 'Easy', color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    { name: 'AMZ', full: 'Amazon SDE-1 Core (Amazon)', desc: 'High-concurrency caching frameworks, distributed queues, and algorithmic complexity optimization.', role: 'SDE-1 / Tech Intern', packageRange: '₹19 - 32 LPA', difficulty: 'Hard', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { name: 'JPM', full: 'JPMorgan Chase Quantitative Tech', desc: 'Financial transaction integrity systems, high-frequency algorithms, and secure API gateways.', role: 'Software Technology Associate', packageRange: '₹15 - 25 LPA', difficulty: 'Hard', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { name: 'GTS', full: 'Accenture Tech Solutions', desc: 'SaaS integration strategies, agile code testing patterns, and infrastructure scalability testing.', role: 'Associate Software Developer', packageRange: '₹4.5 - 11 LPA', difficulty: 'Easy', color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
    { name: 'VSA', full: 'Visa Concurrency Systems', desc: 'Real-time payment transaction protocols, distributed consensus loops, and microservices.', role: 'Software Engineering Associate', packageRange: '₹18 - 28 LPA', difficulty: 'Hard', color: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
    { name: 'DEL', full: 'Deloitte Software Advisory', desc: 'Enterprise security audits, cloud deployment pipelines, and risk-compliant software architecture.', role: 'Advisory Tech Developer', packageRange: '₹6.5 - 9.5 LPA', difficulty: 'Medium', color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    { name: 'WIP', full: 'Wipro Advanced Systems', desc: 'Automated test suite suites, object-oriented system refactoring, and quality assurance.', role: 'Systems Project Developer', packageRange: '₹3.5 - 6.5 LPA', difficulty: 'Medium', color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
  ];

  useEffect(() => {
    if (token) {
      fetchInterviews();
    }
  }, [token]);

  const fetchInterviews = async () => {
    try {
      const res = await fetch(`${API_URL}/interviews`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setInterviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWarRoom = (company) => {
    setSelectedCompany(company);
    // Pre-fill with a mock resume to save user time during evaluations, but let them customize it!
    setResumeText(`OBJECTIVE: Software Development Engineer
SKILLS: React, Javascript, Node.js, Express, MongoDB, Python, DSA (C++), SQL.
EXPERIENCE: Web developer intern at TechCorp. Built scaleable interfaces and designed relational schemas.
EDUCATION: B.Tech in Computer Science (GPA: 8.8/10).`);
    setShowResumeModal(true);
  };

  const handleStartInterview = async () => {
    if (!resumeText.trim()) {
      alert('Please enter or paste your resume details first.');
      return;
    }
    setStarting(true);
    try {
      const res = await fetch(`${API_URL}/interviews/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: selectedCompany.full,
          difficulty,
          resumeText
        })
      });
      const data = await res.json();
      navigate(`/interviews/${data._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start mock interview. Check server connection.');
    } finally {
      setStarting(false);
      setShowResumeModal(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading Interview Hub...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>AI Interviews</h2>
        <p style={{ color: 'var(--text-muted)' }}>Practice realistic technical interview rounds modeled around target companies and your actual resume stack.</p>
      </div>

      {/* Companies Grid */}
      <section className="companies-grid">
        {companies.map((comp) => (
          <div key={comp.name} className="company-card">
            <div>
              <div className="company-card-header">
                <div className="company-logo-badge" style={{ background: comp.color }}>
                  {comp.name}
                </div>
                <span className={`difficulty-pill ${comp.difficulty.toLowerCase()}`}>
                  {comp.difficulty}
                </span>
              </div>
              <h3 className="company-title" style={{ fontSize: '1.15rem' }}>{comp.full}</h3>
              <p className="company-desc">{comp.desc}</p>
              
              <div className="company-details">
                <div className="detail-item">
                  <span style={{ fontSize: '0.9rem' }}>💼</span>
                  <span style={{ color: 'white', fontWeight: 500 }}>{comp.role}</span>
                </div>
                <div className="detail-item">
                  <span style={{ fontSize: '0.9rem' }}>💵</span>
                  <span>{comp.packageRange}</span>
                </div>
              </div>
            </div>

            <div className="company-card-footer">
              <span className="resources-count">📖 3 resources</span>
              <button onClick={() => handleOpenWarRoom(comp)} className="warroom-btn">
                War Room →
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* History of sessions */}
      {interviews.length > 0 && (
        <section className="glass-card">
          <h3 style={{ fontSize: '1.3rem', marginBottom: '18px' }}>Previous Interview Sessions</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Difficulty</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((int) => (
                  <tr key={int._id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{int.companyName}</td>
                    <td>
                      <span className={`difficulty-pill ${int.difficulty.toLowerCase()}`}>
                        {int.difficulty}
                      </span>
                    </td>
                    <td>{new Date(int.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{ 
                        color: int.status === 'completed' ? 'var(--color-solved)' : 'var(--accent-secondary)',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {int.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-points)' }}>
                      {int.feedback ? `${int.feedback.overallScore}/100` : '—'}
                    </td>
                    <td>
                      <button 
                        onClick={() => navigate(`/interviews/${int._id}`)} 
                        className="warroom-btn"
                        style={{
                          background: int.status === 'completed' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                          borderColor: int.status === 'completed' ? 'var(--accent-secondary)' : '#ff5f5f',
                          color: int.status === 'completed' ? 'var(--accent-secondary)' : '#ff5f5f'
                        }}
                      >
                        {int.status === 'completed' ? 'View Report Card' : 'Resume Interview'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ maxWidth: '560px', width: '90%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Configure AI Interview: {selectedCompany?.full}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Provide your resume content to tailor specific technical interview questions.</p>
            </div>

            <div className="form-group">
              <label>Select Round Difficulty</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <button 
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className="filter-tag"
                    style={{ 
                      flex: 1, 
                      borderColor: difficulty === d ? 'var(--accent-secondary)' : 'var(--border-glass)',
                      background: difficulty === d ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                      color: difficulty === d ? 'white' : 'var(--text-main)',
                      fontWeight: 600
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Copy & Paste Resume Text</label>
              <textarea 
                className="form-input" 
                rows="8"
                style={{ fontFamily: 'var(--font-body)', resize: 'vertical', width: '100%', marginTop: '6px' }}
                placeholder="Paste your resume details here (Skills, Experience, Projects...)"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={starting}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button 
                onClick={() => setShowResumeModal(false)} 
                className="warroom-btn" 
                style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}
                disabled={starting}
              >
                Cancel
              </button>
              <button 
                onClick={handleStartInterview} 
                className="primary-btn"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                disabled={starting}
              >
                {starting ? 'Generating Room...' : 'Enter War Room'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MockInterviews;

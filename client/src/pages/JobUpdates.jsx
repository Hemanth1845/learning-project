import React, { useState } from 'react';

const JobUpdates = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Internship', 'Full-time', 'Remote'

  // Pre-seeded job and free internship listings
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Engineering Virtual Internship',
      company: 'Infosys Springboard',
      type: 'Free Online Internship',
      location: 'Remote (Self-Paced)',
      stipend: 'Certificate + Placement Assistance',
      eligibility: 'Open to all college students (CS/IT/ECE)',
      posted: '2 hours ago',
      applyUrl: 'https://infyspringboard.onwingspan.com/',
      tags: ['Python', 'Web Dev', 'Java'],
      logo: 'IDS'
    },
    {
      id: 2,
      title: 'STEP (Student Training in Engineering Program) Intern',
      company: 'Google India',
      type: 'Internship',
      location: 'Bangalore / Pune',
      stipend: '₹80,000 / month',
      eligibility: '2nd year Bachelor\'s students (CS/EE)',
      posted: 'Just Now',
      applyUrl: 'https://careers.google.com/jobs/results/',
      tags: ['Data Structures', 'C++', 'Java'],
      logo: 'G'
    },
    {
      id: 3,
      title: 'Software Development Engineer (SDE) Intern',
      company: 'Amazon Web Scale',
      type: 'Internship',
      location: 'Remote / Bangalore',
      stipend: '₹75,000 / month',
      eligibility: 'Pre-final year Bachelor\'s/Master\'s students',
      posted: '1 day ago',
      applyUrl: 'https://www.amazon.jobs/',
      tags: ['Algorithms', 'Systems', 'AWS'],
      logo: 'A'
    },
    {
      id: 4,
      title: 'Research & Software Engineering Intern',
      company: 'Microsoft Enterprise',
      type: 'Internship',
      location: 'Hyderabad / Noida',
      stipend: '₹90,000 / month',
      eligibility: '3rd year B.Tech / M.Tech students',
      posted: '3 days ago',
      applyUrl: 'https://careers.microsoft.com/',
      tags: ['Algorithms', 'Python', 'C#'],
      logo: 'MS'
    },
    {
      id: 5,
      title: 'Free Web Development Online Intern',
      company: 'Internshala Remote Programs',
      type: 'Free Online Internship',
      location: 'Remote (Flexible)',
      stipend: '₹5,000 - 15,000 / month',
      eligibility: 'Students looking for flexible learning slots',
      posted: '5 hours ago',
      applyUrl: 'https://internshala.com/',
      tags: ['React', 'Node.js', 'CSS'],
      logo: 'IS'
    },
    {
      id: 6,
      title: 'Associate Software Developer (Full-Time)',
      company: 'Accenture Tech Solutions',
      type: 'Full-time',
      location: 'PAN India Locations',
      stipend: '₹4.5 - 11 LPA',
      eligibility: '2025/2026 Batch Graduates',
      posted: '1 day ago',
      applyUrl: 'https://www.accenture.com/in-en/careers',
      tags: ['Agile', 'Java', 'SQL'],
      logo: 'GTS'
    }
  ]);

  // Form state to add new internship links dynamically
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobType, setNewJobType] = useState('Free Online Internship');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobStipend, setNewJobStipend] = useState('');
  const [newJobEligibility, setNewJobEligibility] = useState('');
  const [newJobApplyUrl, setNewJobApplyUrl] = useState('');
  const [newJobTags, setNewJobTags] = useState('');

  const handleAddNewJob = (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany || !newJobApplyUrl) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: newJobTitle,
      company: newJobCompany,
      type: newJobType,
      location: newJobLocation,
      stipend: newJobStipend || 'Unpaid / Training credits',
      eligibility: newJobEligibility || 'Open to all student batches',
      posted: 'Just Now',
      applyUrl: newJobApplyUrl,
      tags: newJobTags ? newJobTags.split(',').map(t => t.trim()) : ['General'],
      logo: newJobCompany.substring(0, 3).toUpperCase()
    };

    setJobs([newEntry, ...jobs]);
    setShowAddForm(false);
    
    // Clear fields
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobStipend('');
    setNewJobEligibility('');
    setNewJobApplyUrl('');
    setNewJobTags('');
  };

  // Filtering criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'All') return matchesSearch;
    if (filterType === 'Internship') return matchesSearch && (job.type === 'Internship' || job.type === 'Free Online Internship');
    if (filterType === 'Free Online Internship') return matchesSearch && job.type === 'Free Online Internship';
    if (filterType === 'Full-time') return matchesSearch && job.type === 'Full-time';
    if (filterType === 'Remote') return matchesSearch && job.location.toLowerCase().includes('remote');
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="scorecard-panel">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dashboard &gt; Job Updates</span>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 800, marginTop: '4px' }}>
            Job & Internship Feed
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '600px', fontSize: '1.02rem', lineHeight: '1.5' }}>
            Explore verified free online virtual internships, summer training positions, and entry-level developer roles. Click "Apply Now" to go directly to application pages.
          </p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="primary-btn"
          style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ➕ {showAddForm ? 'Close Form' : 'Submit Internship Link'}
        </button>
      </div>

      {/* Dynamic Internship Submission Form */}
      {showAddForm && (
        <div className="glass-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-primary)', padding: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '1.15rem', marginBottom: '16px' }}>Submit Internship Opportunity</h3>
          <form onSubmit={handleAddNewJob} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Role / Position Title *</label>
              <input type="text" className="form-input" value={newJobTitle} onChange={(e) => setNewJobTitle(e.target.value)} placeholder="e.g. Software Developer Intern" required />
            </div>
            <div className="form-group">
              <label>Company / Organization Name *</label>
              <input type="text" className="form-input" value={newJobCompany} onChange={(e) => setNewJobCompany(e.target.value)} placeholder="e.g. Google India" required />
            </div>
            <div className="form-group">
              <label>Opportunity Type</label>
              <select className="form-input" value={newJobType} onChange={(e) => setNewJobType(e.target.value)} style={{ background: '#11141a', color: 'white' }}>
                <option value="Free Online Internship">Free Online Internship</option>
                <option value="Internship">Standard Internship</option>
                <option value="Full-time">Full-Time Career Job</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" className="form-input" value={newJobLocation} onChange={(e) => setNewJobLocation(e.target.value)} placeholder="e.g. Remote / Bangalore" />
            </div>
            <div className="form-group">
              <label>Stipend / Compensation</label>
              <input type="text" className="form-input" value={newJobStipend} onChange={(e) => setNewJobStipend(e.target.value)} placeholder="e.g. ₹20,000 / month or Certificate" />
            </div>
            <div className="form-group">
              <label>Eligibility Criteria</label>
              <input type="text" className="form-input" value={newJobEligibility} onChange={(e) => setNewJobEligibility(e.target.value)} placeholder="e.g. CS students of 3rd/4th year" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Official Application Link *</label>
              <input type="url" className="form-input" value={newJobApplyUrl} onChange={(e) => setNewJobApplyUrl(e.target.value)} placeholder="e.g. https://careers.company.com/job/123" required />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Skills / Tags (comma separated)</label>
              <input type="text" className="form-input" value={newJobTags} onChange={(e) => setNewJobTags(e.target.value)} placeholder="e.g. React, Node.js, Python" />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="warroom-btn" style={{ background: 'transparent', borderColor: 'var(--border-glass)', color: 'white' }}>
                Cancel
              </button>
              <button type="submit" className="primary-btn" style={{ padding: '8px 24px' }}>
                Post Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 Search by company, role, or skills..." 
          className="form-input" 
          style={{ flex: 1, minWidth: '260px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Free Online Internship', 'Internship', 'Full-time', 'Remote'].map(type => (
            <button 
              key={type}
              className={`filter-tag ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Internship Cards Feed Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="glass-card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                borderColor: job.type === 'Free Online Internship' ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-glass)',
                background: job.type === 'Free Online Internship' ? 'rgba(16, 185, 129, 0.01)' : 'var(--bg-glass)'
              }}
            >
              <div>
                {/* Header card details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
                      {job.logo}
                    </div>
                    <div>
                      <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{job.company}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{job.posted}</span>
                    </div>
                  </div>
                  <span className={`difficulty-pill ${job.type === 'Full-time' ? 'hard' : 'easy'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {job.type}
                  </span>
                </div>

                {/* Body details */}
                <h3 style={{ fontSize: '1.15rem', color: 'white', marginTop: '16px' }}>{job.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '12px' }}>
                  <div>📍 <strong>Location:</strong> {job.location}</div>
                  <div>💰 <strong>Compensation:</strong> {job.stipend}</div>
                  <div>🎓 <strong>Eligibility:</strong> {job.eligibility}</div>
                </div>

                {/* Skill tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
                  {job.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-main)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>* Opens official portal</span>
                <a 
                  href={job.applyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="primary-btn" 
                  style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.82rem', textAlign: 'center' }}
                >
                  Apply Now &rarr;
                </a>
              </div>

            </div>
          ))
        ) : (
          <div className="glass-card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '48px' }}>
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <h4 style={{ color: 'white', marginTop: '16px' }}>No matches found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>Try modifying your filter categories or check spelling.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default JobUpdates;

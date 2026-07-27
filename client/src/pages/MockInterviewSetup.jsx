import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MockInterviewSetup = () => {
  const navigate = useNavigate();

  // Mode state
  const [selectedMode, setSelectedMode] = useState('DSA'); // 'DSA', 'Behavioral', 'Resume', 'ML', 'SystemDesign'
  // Company state
  const [selectedCompany, setSelectedCompany] = useState('General'); // 'Google', 'Microsoft', 'Amazon', 'Meta', 'TCS', 'Infosys', 'Wipro', 'General'
  // Interviewer state
  const [selectedInterviewer, setSelectedInterviewer] = useState('Priya'); // 'Priya', 'Arjun'

  const modes = [
    { id: 'DSA', title: 'DSA Technical Round', desc: 'Data Structures & Algorithms coding interview with live problem-solving.', icon: '💻' },
    { id: 'Behavioral', title: 'HR & Behavioral', desc: 'Culture fit & soft skill assessment using STAR method.', icon: '💬' },
    { id: 'Resume', title: 'Resume-Based Interview', desc: 'Deep dive into YOUR projects, experience & skills from your resume.', icon: '💼' },
    { id: 'ML', title: 'ML / AI Engineer', desc: 'Machine Learning, Deep Learning, NLP & Computer Vision concepts.', icon: '✨' },
    { id: 'SystemDesign', title: 'System Design', desc: 'High-level architecture & scalability for senior roles.', icon: '🧱' }
  ];

  const companies = [
    { id: 'Google', name: 'Alphabet / Google', logo: 'G' },
    { id: 'Microsoft', name: 'Microsoft Enterprise', logo: 'MS' },
    { id: 'Amazon', name: 'Amazon Web Scale', logo: 'A' },
    { id: 'Meta', name: 'Meta Systems', logo: 'M' },
    { id: 'TCS', name: 'CES / TCS', logo: 'CES' },
    { id: 'Infosys', name: 'IDS / Infosys', logo: 'IDS' },
    { id: 'Wipro', name: 'WAS / Wipro', logo: 'WAS' },
    { id: 'General', name: 'Custom General Target', logo: '★' }
  ];

  const interviewers = [
    {
      id: 'Priya',
      name: 'Priya',
      role: 'SENIOR TECH LEAD',
      tags: ['Empathetic', 'Detail-Oriented', 'Patient'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      description: 'Priya focuses on analytical approaches and offers guided nudges if you get stuck.'
    },
    {
      id: 'Arjun',
      name: 'Arjun',
      role: 'STAFF ENGINEER',
      tags: ['Direct', 'System Focused', 'Technical'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      description: 'Arjun has a fast-paced coding evaluation style, targeting optimal complexity and scaling bottlenecks.'
    }
  ];

  const handleStartSession = () => {
    navigate(`/mock-interview/call?mode=${selectedMode}&company=${selectedCompany}&interviewer=${selectedInterviewer}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="scorecard-panel">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'white', fontWeight: 800 }}>
            Master Your <span style={{ background: 'linear-gradient(135deg, #c084fc 0%, #db2777 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interview Skills</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '600px', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Practice with realistic AI interviewers tailored to your target company. Get instant feedback on code, communication, and confidence.
          </p>
        </div>

        {/* Free Credits Badge */}
        <div className="glass-card" style={{ padding: '16px 20px', minWidth: '220px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span>Monthly Limit</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginTop: '6px' }}>
            2 <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>/ 2 free left</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '8px', cursor: 'pointer' }}>
            Upgrade for unlimited ›
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="scorecard-panel">
        
        {/* Left Side: Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 1. Choose Interview Mode */}
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ background: 'var(--accent-gradient)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
              Choose Interview Mode
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modes.map((m) => {
                const isSelected = selectedMode === m.id;
                return (
                  <div 
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(111, 66, 193, 0.08)' : 'var(--bg-glass)',
                      borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--border-glass)',
                      boxShadow: isSelected ? '0 0 15px rgba(0, 242, 254, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {m.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.98rem' }}>{m.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>{m.desc}</p>
                    </div>
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      borderRadius: '50%', 
                      border: `2px solid ${isSelected ? 'var(--accent-secondary)' : 'var(--text-muted)'}`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Target Company */}
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ background: 'var(--accent-gradient)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>2</span>
              Target Company
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="dashboard-grid">
              {companies.map((c) => {
                const isSelected = selectedCompany === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCompany(c.id)}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'var(--bg-glass)',
                      borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: isSelected ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.05)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      {c.logo}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: isSelected ? 'white' : 'var(--text-main)', fontWeight: 600 }}>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Interviewer selection & Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* 3. Select Interviewer */}
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ background: 'var(--accent-gradient)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>3</span>
              Select Interviewer
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {interviewers.map((i) => {
                const isSelected = selectedInterviewer === i.id;
                return (
                  <div
                    key={i.id}
                    onClick={() => setSelectedInterviewer(i.id)}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(111, 66, 193, 0.08)' : 'var(--bg-glass)',
                      borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--border-glass)',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={i.avatar} alt={i.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isSelected ? 'var(--accent-secondary)' : 'transparent'}` }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ color: 'white', fontWeight: 700 }}>{i.name}</h4>
                          {isSelected && <span style={{ color: 'var(--color-solved)', fontSize: '0.9rem' }}>✓ Selected</span>}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{i.role}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {i.tags.map(t => (
                        <span key={t} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: '1.4' }}>{i.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session Summary Panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(111, 66, 193, 0.3)', background: 'linear-gradient(180deg, rgba(31,40,51,0.8) 0%, rgba(11,12,16,0.95) 100%)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Session Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode</span>
                <span style={{ color: 'white', fontWeight: 600 }}>
                  🔹 {modes.find(m => m.id === selectedMode)?.title.split(' ')[0]}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Company</span>
                <span style={{ color: 'white', fontWeight: 600 }}>
                  🔸 {selectedCompany}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Interviewer</span>
                <span style={{ color: 'white', fontWeight: 600 }}>
                  👩‍💼 {selectedInterviewer}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>15 Minutes</span>
              </div>
            </div>

            <button 
              onClick={handleStartSession} 
              className="primary-btn" 
              style={{ 
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                padding: '14px',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
              }}
            >
              Start Session 🚀
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.3' }}>
              By starting, you agree to being recorded for AI analysis. Feedback will be generated immediately after.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MockInterviewSetup;

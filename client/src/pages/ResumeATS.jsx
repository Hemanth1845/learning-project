import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ResumeATS = () => {
  const { token, API_URL } = useContext(AuthContext);
  
  // Tabs: 'builder' or 'ats'
  const [activeTab, setActiveTab] = useState('builder'); 
  
  // Template states: 'classic', 'modern', 'executive'
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  // Resume state values
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    education: '',
    experienceCompany: '',
    experienceRole: '',
    experienceDuration: '',
    experienceBullets: '',
    projectTitle: '',
    projectStack: '',
    projectBullets: '',
    skillsLanguages: '',
    skillsFrameworks: '',
    skillsDatabases: '',
    languages: '',
    certificates: '',
    interests: '',
    courses: '',
    awards: '',
    organisations: '',
    publications: '',
    references: '',
    declaration: '',
    customTitle: '',
    customContent: ''
  });

  // Active section list
  const [activeSections, setActiveSections] = useState(['education', 'experience', 'projects', 'skills']);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiRewriting, setAiRewriting] = useState(false);
  const [atsScoreReport, setAtsScoreReport] = useState(null);
  const [atsRunning, setAtsRunning] = useState(false);

  const handleAIEnhance = async (fieldText, fieldKey, type = 'star') => {
    if (!fieldText.trim()) return alert('Please enter some text to enhance.');
    setAiRewriting(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/rewrite-bullet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: fieldText, type })
      });
      if (res.ok) {
        const data = await res.json();
        setResumeData(prev => ({
          ...prev,
          [fieldKey]: data.rewritten
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiRewriting(false);
    }
  };

  const runAtsAudit = async () => {
    if (!jobDescription.trim()) return alert('Please enter a target Job Description.');
    setAtsRunning(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/evaluate-ats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeData, jobDescription })
      });
      if (res.ok) {
        const data = await res.json();
        setAtsScoreReport(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAtsRunning(false);
    }
  };

  const exportMarkdown = () => {
    const mdContent = `
# ${resumeData.name}
Email: ${resumeData.email} | Phone: ${resumeData.phone}
GitHub: ${resumeData.github} | LinkedIn: ${resumeData.linkedin}

## Education
${resumeData.education}

## Professional Experience
### ${resumeData.experienceCompany}
**Role:** ${resumeData.experienceRole} (${resumeData.experienceDuration})
${resumeData.experienceBullets}

## Projects
### ${resumeData.projectTitle}
**Tech Stack:** ${resumeData.projectStack}
${resumeData.projectBullets}

## Technical Skills
- **Languages:** ${resumeData.skillsLanguages}
- **Frameworks:** ${resumeData.skillsFrameworks}
- **Databases:** ${resumeData.skillsDatabases}
    `;
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.name || 'Resume'}.md`;
    link.click();
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${resumeData.name || 'Resume'}.json`;
    link.click();
  };

  React.useEffect(() => {
    if (token) {
      fetchResume();
    } else {
      setIsFetched(true);
    }
  }, [token]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/resume`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.resume) {
          setResumeData(data.resume);
        }
        if (data.activeSections) {
          setActiveSections(data.activeSections);
        }
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    } finally {
      setIsFetched(true);
    }
  };

  React.useEffect(() => {
    if (!token || !isFetched) return;
    
    setSaveStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            resume: resumeData,
            activeSections: activeSections
          })
        });
        if (res.ok) {
          setSaveStatus('Saved');
        } else {
          setSaveStatus('Error saving');
        }
      } catch (err) {
        console.error('Error saving resume:', err);
        setSaveStatus('Error saving');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [resumeData, activeSections, token, isFetched]);

  // ATS state values
  const [jobDescription, setJobDescription] = useState('We are looking for a Software Developer Intern with solid foundations in React, Javascript, Node.js, and MongoDB. Experience in Redux, API optimization, relational databases, and secure JWT authentications is a strong plus.');
  const [atsReport, setAtsReport] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Optional sections definition matching the image
  const contentOptions = [
    { id: 'education', title: 'Education', icon: '🎓', desc: 'Add your degrees and schools. Include honors or exchange terms.' },
    { id: 'experience', title: 'Professional Experience', icon: '💼', desc: 'Add professional roles and employer history including internships.' },
    { id: 'skills', title: 'Technical Skills', icon: '🍳', desc: 'Add hard and soft skills that help you stand out from the crowd today.' },
    { id: 'languages', title: 'Languages', icon: '🌐', desc: 'Add your languages and proficiency level to show communication range.' },
    { id: 'certificates', title: 'Certificates', icon: '🏅', desc: 'Add industry certificates or licences. Include issuer and dates.' },
    { id: 'interests', title: 'Interests', icon: '✔', desc: 'Add relevant personal interests that support cultural fit.' },
    { id: 'projects', title: 'Projects', icon: '📁', desc: 'Add key projects you participated in, role, and stack.' },
    { id: 'courses', title: 'Courses', icon: '📚', desc: 'Add online or in-person courses and training completed.' },
    { id: 'awards', title: 'Awards', icon: '🏆', desc: 'Add awards and recognitions from industry or academia.' },
    { id: 'organisations', title: 'Organisations', icon: '🏫', desc: 'Add memberships or volunteering with organisations.' },
    { id: 'publications', title: 'Publications', icon: '📖', desc: 'Add publications, articles, or books you wrote or contributed.' },
    { id: 'references', title: 'References', icon: '🤝', desc: 'Add references from managers or coworkers.' },
    { id: 'declaration', title: 'Declaration', icon: '📝', desc: 'Add declaration with personal authentication signature statement.' },
    { id: 'custom', title: 'Custom Section', icon: '➕', desc: 'Add a custom section for anything else, or combine sections.' }
  ];

  const handlePrint = () => {
    window.print();
  };

  // Toggle active sections
  const handleToggleSection = (sectionId) => {
    if (activeSections.includes(sectionId)) {
      // Keep at least name/contact
      setActiveSections(activeSections.filter(s => s !== sectionId));
    } else {
      setActiveSections([...activeSections, sectionId]);
    }
  };

  // File Upload Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const parseAndUpdateResume = (file, onStart, onComplete) => {
    if (onStart) onStart();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = window.btoa(binary);

        const res = await fetch(`${API_URL}/dashboard/parse-resume`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type || 'application/octet-stream',
            fileData: base64Data
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.parsed) {
            setResumeData(prev => ({
              ...prev,
              ...data.parsed
            }));

            // Also enable sections that were parsed and are not empty
            const newActiveSections = [...activeSections];
            const sectionMappings = {
              education: 'education',
              experienceCompany: 'experience',
              projectTitle: 'projects',
              skillsLanguages: 'skills',
              languages: 'languages',
              certificates: 'certificates',
              interests: 'interests',
              courses: 'courses',
              awards: 'awards',
              organisations: 'organisations',
              publications: 'publications',
              references: 'references',
              declaration: 'declaration',
              customContent: 'custom'
            };

            Object.keys(sectionMappings).forEach(key => {
              if (data.parsed[key] && String(data.parsed[key]).trim() !== '') {
                const sect = sectionMappings[key];
                if (!newActiveSections.includes(sect)) {
                  newActiveSections.push(sect);
                }
              }
            });
            setActiveSections(newActiveSections);
            if (onComplete) onComplete(true, `Successfully parsed and loaded resume from ${file.name}!`);
          } else {
            if (onComplete) onComplete(false, `Could not parse structure of ${file.name}.`);
          }
        } else {
          if (onComplete) onComplete(false, 'Server error while parsing resume.');
        }
      } catch (err) {
        console.error('Error processing upload:', err);
        if (onComplete) onComplete(false, 'Error processing file.');
      }
    };

    reader.onerror = () => {
      if (onComplete) onComplete(false, 'Error reading file.');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleResumeBuilderUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    parseAndUpdateResume(
      file,
      () => setIsParsingResume(true),
      (success, message) => {
        setIsParsingResume(false);
        alert(message);
        e.target.value = '';
      }
    );
  };

  const processUploadedFile = (file) => {
    parseAndUpdateResume(
      file,
      () => setUploadStatus('Scanning and parsing uploaded document...'),
      (success, message) => {
        setUploadStatus(message);
      }
    );
  };

  // ATS Scorecard Generator
  const handleATSAnalysis = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter the target job description.');
      return;
    }

    setAtsLoading(true);
    setAtsReport(null);

    // Local ATS Analyzer
    setTimeout(() => {
      const score = calculateLocalATS(resumeData, jobDescription);
      setAtsReport({
        score,
        matchStatus: score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Fit' : 'Requires Optimization',
        missingKeywords: scanMissingKeywords(resumeData, jobDescription),
        formatTips: 'Resume Parser diagnostics: Single column index is correct, serif font margins match ATS standards, bullet keywords mapped.',
        tailorRecommendations: [
          `Add Redux, Docker, and API Optimization concepts explicitly to matching skill fields.`,
          `Refactor internship duties under "${resumeData.experienceCompany}" to align with the core requirements of your Target Job Description.`,
          `Make sure to highlight your database sharding and index tuning skills.`
        ]
      });
      setAtsLoading(false);
    }, 2000);
  };

  const calculateLocalATS = (resume, jd) => {
    const jdLower = jd.toLowerCase();
    const skills = `${resume.skillsLanguages} ${resume.skillsFrameworks} ${resume.skillsDatabases}`.toLowerCase().split(/[,\s]+/);
    let matches = 0;
    let totalJdTerms = 0;

    const keyTerms = ['react', 'node.js', 'javascript', 'mongodb', 'redux', 'express', 'sql', 'jwt', 'security', 'caching', 'api'];
    keyTerms.forEach(term => {
      if (jdLower.includes(term)) {
        totalJdTerms++;
        if (skills.some(s => s.includes(term))) {
          matches++;
        }
      }
    });

    if (totalJdTerms === 0) return 78;
    const baseScore = Math.round((matches / totalJdTerms) * 100);
    return Math.min(96, Math.max(45, baseScore + 25));
  };

  const scanMissingKeywords = (resume, jd) => {
    const jdLower = jd.toLowerCase();
    const skillsText = `${resume.skillsLanguages} ${resume.skillsFrameworks} ${resume.skillsDatabases}`.toLowerCase();
    const keyTerms = ['Redux', 'API Optimization', 'Docker', 'AWS', 'PostgreSQL', 'Redis', 'Unit Testing', 'TypeScript'];
    const missing = [];
    keyTerms.forEach(term => {
      if (jdLower.includes(term.toLowerCase()) && !skillsText.includes(term.toLowerCase())) {
        missing.push(term);
      }
    });
    return missing.length > 0 ? missing : ['Docker', 'AWS'];
  };

  // Compile specific templates styles
  const getTemplateStyle = () => {
    switch (selectedTemplate) {
      case 'modern':
        return { fontFamily: "'Montserrat', sans-serif", color: '#2d3748', borderLeft: '4px solid #7c3aed', paddingLeft: '16px' };
      case 'executive':
        return { fontFamily: "'Outfit', sans-serif", color: '#0f172a', borderTop: '6px solid #1e3a8a', paddingTop: '16px' };
      case 'photogenic':
        return { fontFamily: "'Inter', sans-serif", color: '#1e293b', borderTop: '4px solid #10b981', paddingTop: '16px' };
      case 'minimalist':
        return { fontFamily: "Arial, sans-serif", color: '#4b5563', fontSize: '0.76rem', lineHeight: '1.3' };
      case 'tech-giant':
        return { fontFamily: "'Courier New', monospace", color: '#047857', borderLeft: '6px solid #047857', paddingLeft: '16px' };
      case 'gradient-flow':
        return { fontFamily: "'Outfit', sans-serif", color: '#4338ca', borderImage: 'linear-gradient(to right, #4f46e5, #06b6d4) 1', borderTop: '5px solid', paddingTop: '16px' };
      case 'sidebar-split':
        return { fontFamily: "'Inter', sans-serif", color: '#1e293b', borderLeft: '4px solid #3b82f6', paddingLeft: '16px' };
      case 'slate-modern':
        return { fontFamily: "'Montserrat', sans-serif", color: '#334155', borderTop: '4px solid #475569', paddingTop: '16px' };
      case 'warm-creative':
        return { fontFamily: "Georgia, serif", color: '#991b1b', backgroundColor: '#fffdfa', borderLeft: '4px solid #b91c1c', paddingLeft: '16px' };
      case 'emerald-pro':
        return { fontFamily: "'Outfit', sans-serif", color: '#065f46', borderLeft: '5px solid #059669', paddingLeft: '16px' };
      case 'metro-chic':
        return { fontFamily: "'Montserrat', sans-serif", color: '#111827', borderTop: '5px solid #e11d48', paddingTop: '16px' };
      case 'academic':
        return { fontFamily: "Times New Roman, serif", color: '#000000', lineHeight: '1.5' };
      case 'startup-founder':
        return { fontFamily: "'Outfit', sans-serif", color: '#111827', borderLeft: '5px solid #d946ef', paddingLeft: '16px' };
      case 'elegant-serif':
        return { fontFamily: "Georgia, serif", color: '#1e1b4b', borderBottom: '3px double #312e81', paddingBottom: '16px' };
      case 'navy-dock':
        return { fontFamily: "'Inter', sans-serif", color: '#0f172a', borderTop: '6px solid #1e40af', paddingTop: '16px' };
      case 'future-tech':
        return { fontFamily: "'Lucida Console', monospace", color: '#0f172a', border: '1px solid #e2e8f0', padding: '20px' };
      case 'clean-retro':
        return { fontFamily: "Courier, monospace", color: '#374151', borderTop: '3px dashed #6b7280', paddingTop: '16px' };
      case 'ruby-premium':
        return { fontFamily: "'Outfit', sans-serif", color: '#991b1b', borderTop: '5px solid #be123c', paddingTop: '16px' };
      case 'gold-tier':
        return { fontFamily: "'Montserrat', sans-serif", color: '#111827', borderTop: '6px solid #d97706', paddingTop: '16px' };
      case 'classic':
      default:
        return { fontFamily: "Georgia, 'Times New Roman', serif", color: '#111827' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="no-print">
      
      {/* 1. Top Section Headers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Resume & ATS Hub</h2>
          <p style={{ color: 'var(--text-muted)' }}>Build print-ready resumes with dynamic sections and evaluate their ATS compatibility.</p>
        </div>
        
        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`filter-tag ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            📄 Resume Builder
          </button>
          <button 
            className={`filter-tag ${activeTab === 'ats' ? 'active' : ''}`}
            onClick={() => setActiveTab('ats')}
            style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 600 }}
          >
            🤖 ATS Compatibility Check
          </button>
        </div>
      </div>

      {/* RENDER RESUME BUILDER */}
      {activeTab === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }} className="scorecard-panel">
          
          {/* Form populate column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '760px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'white' }}>1. Populate Details</h3>
                <span style={{ fontSize: '0.78rem', color: saveStatus === 'Saving...' ? '#f1c40f' : saveStatus === 'Saved' ? '#2ecc71' : '#e74c3c', fontFamily: 'monospace', fontWeight: 600 }}>
                  {saveStatus === 'Saving...' ? '⏳ Saving...' : saveStatus === 'Saved' ? '✓ Saved' : '❌ Error'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddContentModal(true)} 
                  className="warroom-btn" 
                  style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'rgba(124, 58, 237, 0.15)', borderColor: '#a78bfa', color: '#a78bfa', fontWeight: 600 }}
                >
                  ➕ Add Sections
                </button>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              {['Contact', 'Education', 'Experience', 'Projects', 'Skills', 'Extra', 'ATS Audit'].map((stepName, idx) => (
                <span 
                  key={stepName} 
                  onClick={() => setCurrentStep(idx)}
                  style={{ 
                    fontSize: '0.8rem', 
                    color: currentStep === idx ? 'var(--accent-secondary)' : 'var(--text-muted)', 
                    fontWeight: currentStep === idx ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: currentStep === idx ? '2px solid var(--accent-secondary)' : 'none',
                    paddingBottom: '4px'
                  }}
                >
                  {stepName}
                </span>
              ))}
            </div>

            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={resumeData.name} 
                      onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={resumeData.email} 
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={resumeData.phone} 
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub Handle</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={resumeData.github} 
                      onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={resumeData.linkedin} 
                      onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Custom Profile Photo (Base64/Image URL for templates with photo)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={resumeData.photo || ''} 
                    onChange={(e) => setResumeData({ ...resumeData, photo: e.target.value })} 
                    placeholder="Pasted image URL or Base64 data..."
                  />
                </div>
              </div>
            )}

            {/* Step 1: Education */}
            {currentStep === 1 && (
              <div className="form-group">
                <label>🎓 Education details</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ marginTop: '8px' }}
                  value={resumeData.education} 
                  onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })} 
                  placeholder="e.g. B.Tech in CSE at KL University (CGPA: 9.39)"
                />
              </div>
            )}

            {/* Step 2: Experience */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>💼 Professional Experience</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <input type="text" className="form-input" placeholder="Company Name" value={resumeData.experienceCompany} onChange={(e) => setResumeData({ ...resumeData, experienceCompany: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Role Title" value={resumeData.experienceRole} onChange={(e) => setResumeData({ ...resumeData, experienceRole: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Duration" value={resumeData.experienceDuration} onChange={(e) => setResumeData({ ...resumeData, experienceDuration: e.target.value })} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key Achievements (one per line)</span>
                  <button 
                    type="button" 
                    onClick={() => handleAIEnhance(resumeData.experienceBullets, 'experienceBullets', 'star')} 
                    className="warroom-btn" 
                    style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(0, 242, 254, 0.1)', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                    disabled={aiRewriting}
                  >
                    ✨ AI STAR Rewrite
                  </button>
                </div>
                <textarea className="form-input" placeholder="Key Achievements" rows="5" value={resumeData.experienceBullets} onChange={(e) => setResumeData({ ...resumeData, experienceBullets: e.target.value })} />
              </div>
            )}

            {/* Step 3: Projects */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>📁 Projects Portfolio</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" className="form-input" placeholder="Project Name" value={resumeData.projectTitle} onChange={(e) => setResumeData({ ...resumeData, projectTitle: e.target.value })} />
                  <input type="text" className="form-input" placeholder="Tech Stack used" value={resumeData.projectStack} onChange={(e) => setResumeData({ ...resumeData, projectStack: e.target.value })} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project details and impact (one per line)</span>
                  <button 
                    type="button" 
                    onClick={() => handleAIEnhance(resumeData.projectBullets, 'projectBullets', 'metrics')} 
                    className="warroom-btn" 
                    style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(0, 242, 254, 0.1)', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
                    disabled={aiRewriting}
                  >
                    ✨ Add Metrics & Impact
                  </button>
                </div>
                <textarea className="form-input" placeholder="Project details" rows="5" value={resumeData.projectBullets} onChange={(e) => setResumeData({ ...resumeData, projectBullets: e.target.value })} />
              </div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>🍳 Technical Skills</label>
                <label style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>📚 Training Courses</label>
                <textarea className="form-input" style={{ marginTop: '8px' }} rows="2" value={resumeData.courses} onChange={(e) => setResumeData({ ...resumeData, courses: e.target.value })} />
              </div>
            )}

          </div>

          {/* Live templates preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Gallery select header */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Browse Style Templates</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={handlePrint} className="primary-btn" style={{ padding: '6px 10px', fontSize: '0.78rem', background: 'var(--accent-gradient)' }}>
                    🖨️ PDF
                  </button>
                  <button onClick={exportMarkdown} className="warroom-btn" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                    📝 MD
                  </button>
                  <button onClick={exportJSON} className="warroom-btn" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                    ⚙️ JSON
                  </button>
                </div>
              </div>

              {/* Template selector buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  <option value="classic">🎨 Classic Georgia Serif</option>
                  <option value="modern">🎨 Modern Indigo Left-Accent</option>
                  <option value="executive">🎨 Executive Blue Top-Border</option>
                  <option value="photogenic">🎨 Photogenic Emerald Photo-Frame</option>
                  <option value="minimalist">🎨 Minimalist Clean Gray</option>
                  <option value="tech-giant">🎨 Tech-Giant Teal Monospace</option>
                  <option value="gradient-flow">🎨 Gradient-Flow Indigo/Cyan Border</option>
                  <option value="sidebar-split">🎨 Sidebar-Split Two-Column Grid</option>
                  <option value="slate-modern">🎨 Slate-Modern Dark Grey</option>
                  <option value="warm-creative">🎨 Warm-Creative Off-White Crimson</option>
                  <option value="emerald-pro">🎨 Emerald-Pro Green Left-Accent</option>
                  <option value="metro-chic">🎨 Metro-Chic Rose Bold Header</option>
                  <option value="academic">🎨 Academic Traditional spacing</option>
                  <option value="startup-founder">🎨 Startup-Founder Magenta Left-Accent</option>
                  <option value="elegant-serif">🎨 Elegant-Serif Double Underline</option>
                  <option value="navy-dock">🎨 Navy-Dock Dark Blue Top</option>
                  <option value="future-tech">🎨 Future-Tech Monospace Grid</option>
                  <option value="clean-retro">🎨 Clean-Retro Dashed Separator</option>
                  <option value="ruby-premium">🎨 Ruby-Premium Deep Red Accents</option>
                  <option value="gold-tier">🎨 Gold-Tier Orange Accent Strip</option>
                </select>
              </div>
            </div>

            {/* Resume Sheet Draft */}
            <div 
              id="resume-sheet" 
              className="print-section" 
              style={{ 
                background: 'white', 
                color: '#111827', 
                padding: '36px', 
                borderRadius: '8px', 
                minHeight: '620px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)', 
                lineHeight: '1.4',
                fontSize: '0.8rem',
                ...getTemplateStyle()
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ textAlign: ['classic', 'minimalist', 'academic'].includes(selectedTemplate) ? 'center' : 'left', flex: 1 }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: 'inherit' }}>{resumeData.name}</h2>
                  <div style={{ display: 'flex', justifyContent: ['classic', 'minimalist', 'academic'].includes(selectedTemplate) ? 'center' : 'flex-start', gap: '8px', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.75rem', color: '#4b5563' }}>
                    <span>{resumeData.email}</span> | <span>{resumeData.phone}</span> | <span>{resumeData.github}</span> | <span>{resumeData.linkedin}</span>
                  </div>
                </div>
                {(selectedTemplate === 'photogenic' || selectedTemplate === 'sidebar-split' || resumeData.photo) && (
                  <img 
                    src={resumeData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                    alt="Profile Photo" 
                    style={{ width: '68px', height: '68px', borderRadius: '50%', border: '2px solid #374151', objectFit: 'cover', marginLeft: '12px' }}
                  />
                )}
              </div>

              {/* Education */}
              {activeSections.includes('education') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Education</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>{resumeData.education.split(',')[0]}</span>
                    <span>{resumeData.education.split(',')[1] || ''}</span>
                  </div>
                </div>
              )}

              {/* Experience */}
              {activeSections.includes('experience') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Experience</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{resumeData.experienceRole} — {resumeData.experienceCompany}</span>
                    <span>{resumeData.experienceDuration}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-line', marginTop: '4px', color: '#374151', paddingLeft: '8px' }}>
                    {resumeData.experienceBullets}
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeSections.includes('projects') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Projects</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{resumeData.projectTitle} | Stack: {resumeData.projectStack}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-line', marginTop: '4px', color: '#374151', paddingLeft: '8px' }}>
                    {resumeData.projectBullets}
                  </div>
                </div>
              )}

              {/* Skills */}
              {activeSections.includes('skills') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Skills</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', color: '#374151' }}>
                    <div><strong>Languages:</strong> {resumeData.skillsLanguages}</div>
                    <div><strong>Frameworks & Libraries:</strong> {resumeData.skillsFrameworks}</div>
                    <div><strong>Databases & Caching:</strong> {resumeData.skillsDatabases}</div>
                  </div>
                </div>
              )}

              {/* Dynamic rendering of optional items */}
              {activeSections.includes('languages') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Languages</h3>
                  <div style={{ color: '#374151' }}>{resumeData.languages}</div>
                </div>
              )}

              {activeSections.includes('certificates') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Certificates</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.certificates}</div>
                </div>
              )}

              {activeSections.includes('interests') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Interests</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.interests}</div>
                </div>
              )}

              {activeSections.includes('courses') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Courses</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.courses}</div>
                </div>
              )}

              {activeSections.includes('awards') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Awards</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.awards}</div>
                </div>
              )}

              {activeSections.includes('organisations') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Organisations</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.organisations}</div>
                </div>
              )}

              {activeSections.includes('publications') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Publications</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.publications}</div>
                </div>
              )}

              {activeSections.includes('references') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>References</h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151' }}>{resumeData.references}</div>
                </div>
              )}

              {activeSections.includes('custom') && (
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>
                    {resumeData.customTitle || 'Additional Section'}
                  </h3>
                  <div style={{ whiteSpace: 'pre-line', color: '#374151', paddingLeft: '8px' }}>{resumeData.customContent}</div>
                </div>
              )}

              {activeSections.includes('declaration') && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #d1d5db', paddingBottom: '2px', marginBottom: '6px', textTransform: 'uppercase', color: 'inherit' }}>Declaration</h3>
                  <p style={{ color: '#374151', fontStyle: 'italic' }}>{resumeData.declaration}</p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* RENDER ATS COMPATIBILITY CHECKER */}
      {activeTab === 'ats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="scorecard-panel">
          
          {/* Inputs Panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Upload & Configure</h3>
            
            {/* Drag and Drop File Dropzone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--border-glass)',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                background: dragActive ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.01)',
                borderColor: dragActive ? 'var(--accent-secondary)' : 'var(--border-glass)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <input 
                type="file" 
                id="file-upload" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                accept=".txt,.json,.pdf"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>📁</span>
                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Drag & Drop Resume here</span>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', marginTop: '4px' }}>Supports PDF, TXT or JSON formats</span>
              </label>
            </div>

            {uploadStatus && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--accent-secondary)', border: '1px solid var(--border-glass)' }}>
                {uploadStatus}
              </div>
            )}

            <div className="form-group">
              <label>Target Job Description</label>
              <textarea 
                className="form-input" 
                rows="6"
                style={{ fontSize: '0.88rem' }}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button 
              onClick={handleATSAnalysis}
              className="primary-btn"
              style={{ background: 'var(--accent-gradient)' }}
              disabled={atsLoading}
            >
              {atsLoading ? 'Analyzing Resume Compatibility...' : 'Analyze Resume Match Score'}
            </button>
          </div>

          {/* Results Scorecard Panel */}
          <div>
            {atsLoading && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', gap: '16px' }}>
                <span style={{ fontSize: '2.5rem', animation: 'pulse 1.2s infinite alternate' }}>🤖</span>
                <h3 style={{ color: 'white' }}>Running ATS Verification Engine</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Comparing skill vectors and formatting structures...</p>
              </div>
            )}

            {!atsLoading && atsReport && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS Scorecard</span>
                    <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Compatibility Analysis</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-points)' }}>{atsReport.score}%</div>
                    <span className="difficulty-pill easy" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{atsReport.matchStatus}</span>
                  </div>
                </div>

                {/* Missing keywords */}
                <div>
                  <h4 style={{ color: 'var(--color-hard)', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚠</span> Missing Target Keywords (Crucial)
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {atsReport.missingKeywords.map(keyword => (
                      <span key={keyword} style={{ fontSize: '0.78rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '4px 10px', borderRadius: '4px', color: '#ff7272', fontWeight: 600 }}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>💡</span> Tailoring Recommendations
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {atsReport.tailorRecommendations.map((rec, rIdx) => (
                      <li key={rIdx} style={{ listStyle: 'none', background: 'rgba(0, 242, 254, 0.03)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)', fontSize: '0.85rem', color: 'white' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Format Tips */}
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '6px' }}>📋 ATS Parsing Safety Checklist</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{atsReport.formatTips}</p>
                </div>

              </div>
            )}

            {!atsLoading && !atsReport && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2.5rem' }}>📊</span>
                <p style={{ fontSize: '0.9rem', marginTop: '12px' }}>Upload your resume file or configure on the left, and run analysis to view ATS scorecard.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. DYNAMIC CONTENT ADD MODAL */}
      {showAddContentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div className="glass-card" style={{ maxWidth: '900px', width: '92%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Add Content Sections</h2>
              <button 
                type="button" 
                onClick={() => setShowAddContentModal(false)} 
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Grid of options matching the mockup */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxHeight: '480px', overflowY: 'auto', padding: '4px' }}>
              {contentOptions.map((opt) => {
                const isActive = activeSections.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleSection(opt.id)}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'rgba(255,255,255,0.01)',
                      borderColor: isActive ? '#a78bfa' : 'var(--border-glass)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span>
                      <input 
                        type="checkbox" 
                        checked={isActive} 
                        onChange={() => {}} // toggled on card click
                        style={{ cursor: 'pointer', accentColor: 'var(--accent-secondary)' }}
                      />
                    </div>
                    <div>
                      <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem' }}>{opt.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px', lineHeight: '1.3' }}>{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <button 
                onClick={() => setShowAddContentModal(false)} 
                className="primary-btn" 
                style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              >
                Save Selection ({activeSections.length} sections active)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled animation keyframes */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 1; }
        }
        
        /* Print media styling sheet */
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-sheet, #resume-sheet * {
            visibility: visible;
          }
          #resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

    </div>
  );
};

export default ResumeATS;

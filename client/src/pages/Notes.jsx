import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Notes = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all notes from API
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  // Open note URL or download Base64 document
  const handleOpenNote = (note) => {
    if (note.pdfUrl.startsWith('data:') || note.pdfUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = note.pdfUrl;
      link.download = `${note.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(note.pdfUrl, '_blank');
    }
  };

  // Group notes by subject
  const osNotes = notes.filter(n => n.subject === 'Operating Systems');
  const dbmsNotes = notes.filter(n => n.subject === 'DBMS');
  const cnNotes = notes.filter(n => n.subject === 'Computer Networks');
  const generalNotes = notes.filter(n => n.subject === 'General Prep');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'white' }}>Study Notes & PDF Resources</h2>
        <p style={{ color: 'var(--text-muted)' }}>Quick access revision sheets, interview questions, and study drive resources loaded dynamically.</p>
      </div>

      {loading ? (
        <div style={{ color: 'white' }}>Loading study sheets...</div>
      ) : (
        /* 4-Column Resource Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }} className="scorecard-panel">
          
          {/* OS Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>💻</span>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Operating Systems (OS)</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quick cheat sheets and summary notes for core OS modules.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {osNotes.length > 0 ? osNotes.map((note) => (
                <div 
                  key={note._id} 
                  onClick={() => handleOpenNote(note)}
                  style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                  className="note-interactive-card"
                >
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>📄 {note.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>{note.description}</p>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No OS notes found.</div>
              )}
            </div>
          </div>

          {/* DBMS Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🗄️</span>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Database Systems (DBMS)</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quick cheat sheets and normalizations keys for databases.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {dbmsNotes.length > 0 ? dbmsNotes.map((note) => (
                <div 
                  key={note._id} 
                  onClick={() => handleOpenNote(note)}
                  style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                  className="note-interactive-card"
                >
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>📄 {note.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>{note.description}</p>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No DBMS notes found.</div>
              )}
            </div>
          </div>

          {/* CN Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🌐</span>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Computer Networks (CN)</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cheat sheets for protocols and OSI network systems.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {cnNotes.length > 0 ? cnNotes.map((note) => (
                <div 
                  key={note._id} 
                  onClick={() => handleOpenNote(note)}
                  style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '8px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                  className="note-interactive-card"
                >
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>📄 {note.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>{note.description}</p>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No CN notes found.</div>
              )}
            </div>
          </div>

          {/* General Placement Column */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>🏢</span>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Placement Prep Sheets</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Drive notes containing actual company technical interview questions.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {generalNotes.length > 0 ? generalNotes.map((note) => (
                <div 
                  key={note._id} 
                  onClick={() => handleOpenNote(note)}
                  style={{ 
                    display: 'block', 
                    padding: '12px', 
                    background: 'rgba(255, 184, 0, 0.03)', 
                    border: '1px solid rgba(255, 184, 0, 0.15)', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="company-card-link"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.88rem', color: 'var(--color-points)', fontWeight: 600 }}>📄 {note.title}</h4>
                    <span style={{ color: 'var(--color-points)', fontSize: '0.75rem' }}>View ↗</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{note.description}</p>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No Placement notes found.</div>
              )}
            </div>
          </div>

        </div>
      )}

      <style>{`
        .note-interactive-card:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--accent-secondary) !important;
          transform: translateY(-2px);
        }
        .company-card-link:hover {
          background: rgba(255, 184, 0, 0.08) !important;
          border-color: rgba(255, 184, 0, 0.35) !important;
          transform: translateY(-2px);
        }
      `}</style>

    </div>
  );
};

export default Notes;

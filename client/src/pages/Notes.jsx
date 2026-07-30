import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const noteContents = {
  'TCS Generative Interview Questions': `### TCS Generative AI Interview Q&As
  
  **Q1: What is Generative AI?**
  Generative AI refers to a subset of artificial intelligence models that can generate new content, including text, images, code, or audio. Unlike traditional AI models that classify or predict, generative models learn the underlying patterns of training data to produce original, synthetic samples.
  
  **Q2: Explain the Transformer Architecture.**
  The Transformer architecture, introduced by Vaswani et al. in 2017, relies on self-attention mechanisms to process input sequences in parallel. Unlike RNNs, it does not process tokens sequentially, which allows for highly scaleable training on massive clusters. It consists of an Encoder that processes input and a Decoder that generates output.
  
  **Q3: What is RAG (Retrieval-Augmented Generation)?**
  RAG is an architectural pattern that improves LLM responses by querying an external knowledge base or vector store for relevant context before sending the prompt to the language model. This mitigates hallucinations and allows the model to reference proprietary or real-time data without retraining.`,
  
  'TCS LLM Interview Questions': `### TCS LLM Developer Prep Sheets
  
  **Q1: What are Embeddings?**
  Embeddings are vector representations of text where semantically similar words or phrases are mapped to adjacent points in a high-dimensional vector space. They are typically generated using embedding models like Word2Vec or OpenAI text-embedding.
  
  **Q2: How do Vector Databases work?**
  Vector databases (like Pinecone, FAISS, ChromaDB) index and store high-dimensional vector embeddings. They execute rapid nearest-neighbor searches (like Cosine Similarity or Euclidean Distance) to retrieve documents that are semantically closest to a query.
  
  **Q3: What is Temperature in LLMs?**
  Temperature is a hyperparameter that controls the randomness of an LLM's next-token selection. A lower temperature (e.g. 0.2) makes responses highly deterministic and focused, suitable for code generation or factual lookups. A higher temperature (e.g. 0.8) encourages creativity and variation.`,
  
  'TCS Technical Interview Questions': `### TCS Technical Interview Round Prep Sheet
  
  **Q1: What is Normalization in DBMS?**
  Normalization is the systematic process of organizing data in a relational database to minimize redundancy and eliminate anomalies (insertion, update, deletion). It involves splitting large tables into smaller, linked tables.
  
  **Q2: Explain the OSI model layers.**
  The OSI model consists of 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. It standardizes communication protocols across diverse networking systems.
  
  **Q3: What is Virtual Memory?**
  Virtual Memory is a memory management technique that allows execution of processes that may not be completely in physical RAM by swapping unused memory pages to secondary storage (paging file/swap space).`,
  
  'TCS College Drive Interview Questions': `### TCS Placement Aptitude & DSA Questions
  
  **Problem 1: Two Sum**
  Given an array of integers, find two indices that sum up to a target value.
  - *Approach*: Use a HashMap to store values as we iterate. For each element x, check if (target - x) exists in the map. Complexity is O(N) time and O(N) space.
  
  **Problem 2: Reverse Linked List**
  Given the head of a singly linked list, reverse it and return the new head.
  - *Approach*: Maintain three pointers: prev (null), curr (head), and next. Iterate and set curr.next = prev, then slide pointers forward. Complexity is O(N) time and O(1) space.`,
  
  'Operating Systems (OS) Cheatsheet': `### Operating Systems Core Cheatsheet
  
  **Process States**:
  - New: Process is being created.
  - Ready: Waiting to be assigned to a CPU.
  - Running: Instructions are being executed.
  - Waiting: Blocked on an I/O event.
  - Terminated: Execution finished.
  
  **CPU Scheduling Algorithms**:
  - First-Come, First-Served (FCFS)
  - Shortest Job First (SJF)
  - Round Robin (RR): Uses time slices or quantums.
  - Priority Scheduling: Starvation can be resolved using Aging.
  
  **Deadlock Conditions**:
  1. Mutual Exclusion
  2. Hold and Wait
  3. No Preemption
  4. Circular Wait`,
  
  'Database Management Systems (DBMS) Cheatsheet': `### DBMS & Normalization Cheatsheet
  
  **Normal Forms**:
  - **1NF (First Normal Form)**: Atomic values, no repeating groups.
  - **2NF (Second Normal Form)**: Must be in 1NF and have no partial dependencies (every non-prime attribute is fully functionally dependent on primary key).
  - **3NF (Third Normal Form)**: Must be in 2NF and have no transitive dependencies (non-prime attributes cannot determine other non-prime attributes).
  - **BCNF (Boyce-Codd Normal Form)**: For any functional dependency X -> Y, X must be a superkey.
  
  **ACID Transactions**:
  - Atomicity: All or nothing.
  - Consistency: Valid database states.
  - Isolation: Concurrent runs do not interfere.
  - Durability: Saved updates are permanent.`
};

const Notes = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'bookmarks', 'recent'

  // PDF Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfRotate, setPdfRotate] = useState(0);
  const [pdfDarkMode, setPdfDarkMode] = useState(true);
  const [pdfBookmarks, setPdfBookmarks] = useState([]);
  const [pdfHighlights, setPdfHighlights] = useState([]);
  const [pdfSearchTerm, setPdfSearchTerm] = useState('');
  const [pdfPageInput, setPdfPageInput] = useState('1');
  const [recentPages, setRecentPages] = useState([1]);

  // AI assistant drawer state
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
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

  useEffect(() => {
    if (notes.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const openNoteId = params.get('openNoteId');
      if (openNoteId) {
        const found = notes.find(n => n._id.toString() === openNoteId);
        if (found) {
          handleOpenViewer(found);
        }
      }
    }
  }, [notes]);

  // Toggle favorite status
  const handleToggleFavorite = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/notes/${noteId}/favorite`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle bookmark status
  const handleToggleBookmark = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/notes/${noteId}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Open PDF viewer modal
  const handleOpenViewer = (note) => {
    setActiveNote(note);
    setPdfZoom(100);
    setPdfRotate(0);
    setPdfBookmarks([]);
    setPdfHighlights([]);
    setPdfSearchTerm('');
    setPdfPageInput(String(note.lastReadPage || 1));
    setRecentPages([note.lastReadPage || 1]);
    setViewerOpen(true);
    
    // Log recently viewed timestamp
    fetch(`${API_URL}/notes/${note._id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lastReadPage: note.lastReadPage || 1 })
    }).then(() => fetchNotes());
  };

  // Save progress page and percentage
  const handleUpdatePageProgress = (pageVal) => {
    const pageNum = parseInt(pageVal) || 1;
    setPdfPageInput(String(pageNum));
    if (!recentPages.includes(pageNum)) {
      setRecentPages(prev => [...prev, pageNum]);
    }

    const totalPages = 5; // simulated total pages
    const pct = Math.min(100, Math.round((pageNum / totalPages) * 100));

    fetch(`${API_URL}/notes/${activeNote._id}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lastReadPage: pageNum, readingPercentage: pct })
    }).then(() => fetchNotes());
  };

  // AI actions
  const handleAIAction = async (action, textOverride = '') => {
    if (!activeNote) return;
    setAiLoading(true);
    setAiDrawerOpen(true);
    setAiResponse('');

    const targetText = textOverride || noteContents[activeNote.title] || activeNote.description;

    try {
      const res = await fetch(`${API_URL}/notes/${activeNote._id}/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          text: targetText,
          prompt: aiPrompt
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      }
    } catch (err) {
      console.error(err);
      setAiResponse('Error communicating with AI assistant.');
    } finally {
      setAiLoading(false);
    }
  };

  // Copy text simulation
  const handleCopyTextSimulated = () => {
    const text = noteContents[activeNote?.title] || '';
    navigator.clipboard.writeText(text);
    alert('Document content copied to clipboard successfully!');
  };

  // Print simulation
  const handlePrintSimulated = () => {
    window.print();
  };

  // Download base64 or link
  const handleDownloadNote = (e, note) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = note.pdfUrl;
    link.target = '_blank';
    link.download = `${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter notes logic
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    
    let matchesTab = true;
    if (activeTab === 'favorites') matchesTab = n.isFavorite;
    else if (activeTab === 'bookmarks') matchesTab = n.isBookmarked;
    else if (activeTab === 'recent') matchesTab = n.lastViewedAt !== null;

    return matchesSearch && matchesSubject && matchesTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="notes-page-workspace">
      
      {/* Search & Filter Header Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '4px', borderRadius: '8px' }}>
          {['all', 'favorites', 'bookmarks', 'recent'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: activeTab === tab ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.8rem',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'all' ? '📁 All Sheets' : tab === 'favorites' ? '★ Favorites' : tab === 'bookmarks' ? '🔖 Bookmarks' : '⏳ Recently Viewed'}
            </button>
          ))}
        </div>

        {/* Search & Subject select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search notes, normalizations, protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              fontSize: '0.85rem'
            }}
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <option value="All" style={{ background: '#111' }}>All Categories</option>
            <option value="Operating Systems" style={{ background: '#111' }}>Operating Systems</option>
            <option value="DBMS" style={{ background: '#111' }}>DBMS</option>
            <option value="Computer Networks" style={{ background: '#111' }}>Computer Networks</option>
            <option value="General Prep" style={{ background: '#111' }}>General Prep</option>
          </select>
        </div>
      </div>

      {/* Grid of sheets */}
      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading Placement Prep Sheets...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredNotes.length > 0 ? filteredNotes.map((note) => (
            <div
              key={note._id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                transition: 'var(--transition-smooth)',
                position: 'relative',
                border: note.subject === 'General Prep' ? '1px solid rgba(255, 184, 0, 0.15)' : '1px solid var(--border-glass)'
              }}
            >
              <div>
                {/* Top badges & action buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: note.subject === 'General Prep' ? 'rgba(255, 184, 0, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                    color: note.subject === 'General Prep' ? '#ffb800' : '#a78bfa'
                  }}>
                    {note.subject}
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={(e) => handleToggleFavorite(e, note._id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: note.isFavorite ? '#f1c40f' : 'var(--text-muted)' }}
                      title="Add to Favorites"
                    >
                      {note.isFavorite ? '★' : '☆'}
                    </button>
                    <button
                      onClick={(e) => handleToggleBookmark(e, note._id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: note.isBookmarked ? '#a78bfa' : 'var(--text-muted)' }}
                      title="Bookmark Sheet"
                    >
                      {note.isBookmarked ? '🔖' : '📑'}
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'white', marginTop: '16px', fontWeight: 700 }}>
                  {note.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '8px', lineHeight: '1.4' }}>
                  {note.description}
                </p>

                {/* Progress bar */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress: {note.readingPercentage || 0}%</span>
                    <span style={{ color: 'var(--accent-secondary)' }}>Page {note.lastReadPage || 1}</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${note.readingPercentage || 0}%`, background: 'var(--accent-gradient)' }} />
                  </div>
                </div>
              </div>

              {/* Card CTA Buttons */}
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <button
                  onClick={() => handleOpenViewer(note)}
                  className="primary-btn"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', background: 'rgba(124, 58, 237, 0.15)', borderColor: '#a78bfa', color: '#a78bfa' }}
                >
                  📖 Preview PDF
                </button>
                <button
                  onClick={(e) => handleDownloadNote(e, note)}
                  className="secondary-btn"
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  📥 Download
                </button>
              </div>
            </div>
          )) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>No study notes match your filters.</div>
          )}
        </div>
      )}

      {/* ADVANCED FULL SCREEN PDF READER OVERLAY MODAL */}
      {viewerOpen && activeNote && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 10, 0.95)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          fontFamily: 'system-ui, sans-serif'
        }}>
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-glass)',
            background: 'rgba(13, 13, 23, 0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>📄</span>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'white', fontWeight: 600 }}>{activeNote.title}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Placement Prep Sheets Reader v2.0</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
                className="primary-btn"
                style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ✨ Ask AI Assistant
              </button>
              <button
                onClick={() => setViewerOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Reader Work Area (Toolbar + Document split pane) */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* LEFT PANE: ADVANCED PDF VIEW CONTROLLER TOOLBAR */}
            <div style={{
              width: '240px',
              borderRight: '1px solid var(--border-glass)',
              background: 'rgba(10, 10, 20, 0.8)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto'
            }}>
              {/* Zoom & Rotation */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>View Settings</strong>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <button onClick={() => setPdfZoom(prev => Math.max(50, prev - 10))} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>A-</button>
                  <span style={{ fontSize: '0.75rem', alignSelf: 'center', width: '40px', textAlign: 'center' }}>{pdfZoom}%</span>
                  <button onClick={() => setPdfZoom(prev => Math.min(200, prev + 10))} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>A+</button>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <button onClick={() => setPdfRotate(prev => (prev + 90) % 360)} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>🔄 Rotate 90°</button>
                  <button onClick={() => setPdfDarkMode(!pdfDarkMode)} style={{ flex: 1, padding: '6px', background: pdfDarkMode ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>🌙 Dark Mode</button>
                </div>
              </div>

              {/* Navigation & Jump to page */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Navigation</strong>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={pdfPageInput}
                    onChange={(e) => handleUpdatePageProgress(e.target.value)}
                    style={{
                      width: '60px',
                      padding: '6px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-glass)',
                      color: 'white',
                      fontSize: '0.75rem',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', alignSelf: 'center' }}>of 5 pages</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <button disabled={parseInt(pdfPageInput) <= 1} onClick={() => handleUpdatePageProgress(parseInt(pdfPageInput) - 1)} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>◀ Prev</button>
                  <button disabled={parseInt(pdfPageInput) >= 5} onClick={() => handleUpdatePageProgress(parseInt(pdfPageInput) + 1)} style={{ flex: 1, padding: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>Next ▶</button>
                </div>
              </div>

              {/* Search Inside Document */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Search Text</strong>
                <input
                  type="text"
                  placeholder="Find in text..."
                  value={pdfSearchTerm}
                  onChange={(e) => setPdfSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-glass)',
                    color: 'white',
                    fontSize: '0.75rem',
                    marginTop: '10px'
                  }}
                />
              </div>

              {/* Page Bookmarks */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Page Bookmarks</strong>
                <button
                  onClick={() => {
                    const p = parseInt(pdfPageInput);
                    if (pdfBookmarks.includes(p)) {
                      setPdfBookmarks(prev => prev.filter(x => x !== p));
                    } else {
                      setPdfBookmarks(prev => [...prev, p].sort());
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    marginTop: '10px',
                    textAlign: 'left'
                  }}
                >
                  {pdfBookmarks.includes(parseInt(pdfPageInput)) ? '★ Unbookmark Page' : '☆ Bookmark Page ' + pdfPageInput}
                </button>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {pdfBookmarks.map(p => (
                    <span
                      key={p}
                      onClick={() => handleUpdatePageProgress(p)}
                      style={{ fontSize: '0.65rem', background: '#8b5cf6', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      P. {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document actions */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Actions</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  <button onClick={handleCopyTextSimulated} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left' }}>📋 Copy Page Text</button>
                  <button onClick={handlePrintSimulated} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left' }}>🖨️ Print Sheet</button>
                  <button onClick={(e) => handleDownloadNote(e, activeNote)} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left' }}>📥 Download PDF</button>
                </div>
              </div>

              {/* Recent Pages */}
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: true }}>Recent Pages</strong>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {recentPages.map(p => (
                    <span
                      key={p}
                      onClick={() => handleUpdatePageProgress(p)}
                      style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Page {p}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* CENTER PANE: DOCUMENT PREVIEW CONTAINER */}
            <div style={{
              flex: 1,
              background: '#0d0d15',
              padding: '30px',
              display: 'flex',
              justifyContent: 'center',
              overflowY: 'auto'
            }}>
              
              {/* Simulated Paper Sheets */}
              <div style={{
                width: '100%',
                maxWidth: '800px',
                background: pdfDarkMode ? '#1e1e2f' : '#ffffff',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '48px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                color: pdfDarkMode ? '#e2e8f0' : '#1e293b',
                transform: `scale(${pdfZoom / 100}) rotate(${pdfRotate}deg)`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease, background 0.3s ease',
                minHeight: '800px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(124,58,237,0.2)', paddingBottom: '12px', marginBottom: '24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Subject: {activeNote.subject}</span>
                  <span>Page {pdfPageInput} of 5</span>
                </div>

                {/* Highlight/Search highlighting decorator */}
                <div style={{ fontSize: '1rem', lineHeight: '1.8', fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>
                  {/* We map search terms to highlighted span nodes */}
                  {(() => {
                    const textContent = noteContents[activeNote.title] || `Document notes for ${activeNote.title} are currently being populated. Check back in a few seconds.`;
                    
                    if (pdfSearchTerm) {
                      const regex = new RegExp(`(${pdfSearchTerm})`, 'gi');
                      const parts = textContent.split(regex);
                      return parts.map((part, idx) => {
                        const isMatch = part.toLowerCase() === pdfSearchTerm.toLowerCase();
                        return isMatch 
                          ? <mark key={idx} style={{ background: '#f59e0b', color: 'black', borderRadius: '2px', padding: '1px 3px' }}>{part}</mark>
                          : part;
                      });
                    }
                    return textContent;
                  })()}
                </div>
              </div>

            </div>

            {/* RIGHT PANE: DOCKED AI ASSISTANT DRAWER */}
            {aiDrawerOpen && (
              <div style={{
                width: '320px',
                borderLeft: '1px solid var(--border-glass)',
                background: 'rgba(10, 10, 20, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Drawer Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>✨ AI Study Assistant</h4>
                  <button onClick={() => setAiDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Hide ➔</button>
                </div>

                {/* AI Work Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px', overflowY: 'auto' }}>
                  
                  {/* Ask custom queries */}
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ask AI specific questions:</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="text"
                        placeholder="Ask anything about this page..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-glass)',
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                      <button
                        onClick={() => handleAIAction('ask')}
                        className="primary-btn"
                        style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                      >
                        Ask
                      </button>
                    </div>
                  </div>

                  {/* Quick AI triggers */}
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Actions:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                      <button onClick={() => handleAIAction('summarize')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Summarize</button>
                      <button onClick={() => handleAIAction('quiz')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Generate Quiz</button>
                      <button onClick={() => handleAIAction('flashcards')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Flashcards</button>
                      <button onClick={() => handleAIAction('interviews')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Q&As</button>
                      <button onClick={() => handleAIAction('explain')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Explain</button>
                      <button onClick={() => handleAIAction('revision')} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.7rem' }}>Revision Notes</button>
                    </div>
                  </div>

                  {/* AI Output Window */}
                  <div style={{ flex: 1, border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '16px', background: 'rgba(0,0,0,0.2)', overflowY: 'auto', minHeight: '240px' }}>
                    {aiLoading ? (
                      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.8rem' }}>
                        ⚡ AI is generating study insights...
                      </div>
                    ) : aiResponse ? (
                      <div style={{ fontSize: '0.82rem', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                        {aiResponse}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px', fontSize: '0.78rem' }}>
                        Select a quick action above or enter a query to query the AI assistant.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      <style>{`
        .quiz-option-btn:hover {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>

    </div>
  );
};

export default Notes;

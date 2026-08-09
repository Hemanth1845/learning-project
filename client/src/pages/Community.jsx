import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('gd'); // 'gd', 'p2p', 'forum'
  
  // GD States
  const [gdRoomJoined, setGdRoomJoined] = useState(false);
  const [gdLogs, setGdLogs] = useState([
    { user: 'AI Moderator', text: 'Welcome to the Live GD Round! Today’s topic is: "Is remote work more productive than in-office work?" Let’s start. Dev, what are your thoughts?', time: '12:00 PM' }
  ]);
  const [userSpeech, setUserSpeech] = useState('');
  
  // P2P Matchmaking States
  const [p2pStatus, setP2pStatus] = useState('idle'); // 'idle', 'matching', 'paired'
  const [p2pRole, setP2pRole] = useState('Candidate');
  const [p2pPartner, setP2pPartner] = useState('');
  
  // Forums States
  const [forumPosts, setForumPosts] = useState([
    { id: 1, author: 'Hemanth', title: 'Google SDE-1 Interview Experience 2026', body: 'Focussed heavily on graph traversals (BFS/DFS) and system design of distributed lock managers. Remember to vocalize your logic!', likes: 24, replies: 6 },
    { id: 2, author: 'Gowtham', title: 'STAR Method tips for Amazon behavioral questions', body: 'Make sure your result section has clear metrics (e.g. "improved throughput by 20%" instead of just "made it faster").', likes: 18, replies: 3 }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  // Handle Moderator Nudges
  const handleSendGd = (e) => {
    e.preventDefault();
    if (!userSpeech.trim()) return;
    
    const newLog = { user: 'Me (You)', text: userSpeech, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setGdLogs(prev => [...prev, newLog]);
    setUserSpeech('');
    
    setTimeout(() => {
      const moderatorNudges = [
        "AI Moderator: Excellent point about productivity! Sarah, do you agree with this statement, or do you have a counter-perspective?",
        "AI Moderator: Interesting stance. Let's make sure we address the collaboration bottlenecks of remote work. Rohan, what is your view?"
      ];
      const botReplies = [
        { user: 'Sarah (AI Peer)', text: 'I agree! Commute time savings directly convert into longer focused coding sessions.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { user: 'Dev (AI Peer)', text: 'True, but whiteboard discussions and system design brainstorms are far superior in front of a real office whiteboard.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
      
      setGdLogs(prev => [...prev, botReplies[Math.floor(Math.random() * botReplies.length)], { user: 'AI Moderator', text: moderatorNudges[Math.floor(Math.random() * moderatorNudges.length)].replace('AI Moderator: ', ''), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  // Start P2P Matchmaking
  const handleP2pMatch = () => {
    setP2pStatus('matching');
    setTimeout(() => {
      const partners = ['Rahul (IIT Kharagpur)', 'Ananya (BITS Pilani)', 'Vikram (NIT Trichy)', 'Deepika (Vellore Institute)'];
      const chosen = partners[Math.floor(Math.random() * partners.length)];
      setP2pPartner(chosen);
      setP2pRole(Math.random() > 0.5 ? 'Interviewer' : 'Candidate');
      setP2pStatus('paired');
    }, 3000);
  };

  // Create Forum Post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    const newPost = {
      id: Date.now(),
      author: 'Me (You)',
      title: newTitle,
      body: newBody,
      likes: 0,
      replies: 0
    };
    setForumPosts(prev => [newPost, ...prev]);
    setNewTitle('');
    setNewBody('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 'calc(100vh - 120px)' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>👥 Community, Group Discussions & Peer Hub</h2>
        <p style={{ color: 'var(--text-muted)' }}>Collaborate with peers, practice group discussions, and share placement experiences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button className={`filter-tag ${activeTab === 'gd' ? 'active' : ''}`} onClick={() => setActiveTab('gd')}>
          🔊 Live Group Discussion Rooms
        </button>
        <button className={`filter-tag ${activeTab === 'p2p' ? 'active' : ''}`} onClick={() => setActiveTab('p2p')}>
          🤝 Peer-to-Peer Mock Interviews
        </button>
        <button className={`filter-tag ${activeTab === 'forum' ? 'active' : ''}`} onClick={() => setActiveTab('forum')}>
          💬 Community Forums & Q&A
        </button>
      </div>

      {/* GD Room Tab */}
      {activeTab === 'gd' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Live GD Practice Room #4</h3>
            
            {!gdRoomJoined ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🎙️</span>
                <p style={{ color: 'var(--text-muted)' }}>Join a live group discussion room with 3 other active candidates and an AI Moderator.</p>
                <button className="primary-btn" style={{ padding: '10px 30px' }} onClick={() => setGdRoomJoined(true)}>
                  Join Discussion Room
                </button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                  {gdLogs.map((log, idx) => (
                    <div key={idx} style={{ alignSelf: log.user === 'Me (You)' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <span style={{ fontSize: '0.72rem', color: log.user === 'AI Moderator' ? '#c084fc' : '#3b82f6', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                        {log.user} ({log.time})
                      </span>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}>
                        {log.text}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendGd} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type or speak your thoughts in the GD..."
                    value={userSpeech}
                    onChange={(e) => setUserSpeech(e.target.value)}
                  />
                  <button type="submit" className="primary-btn">
                    Speak 🚀
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white' }}>Room Participants</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'white' }}>
                <span>🤖 AI Moderator</span> <span style={{ color: 'var(--color-solved)' }}>Moderating</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'white' }}>
                <span>👩‍💻 Sarah (AI Peer)</span> <span style={{ color: 'var(--accent-secondary)' }}>Speaking</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'white' }}>
                <span>👨‍💻 Dev (AI Peer)</span> <span style={{ color: 'var(--text-muted)' }}>Muted</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'white' }}>
                <span>👨‍💻 Rohan (AI Peer)</span> <span style={{ color: 'var(--text-muted)' }}>Muted</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* P2P Matchmaking Tab */}
      {activeTab === 'p2p' && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🤝</span>
          <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px' }}>Peer-to-Peer Interview Matching</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
            Get matched with another student preparing for interviews. Practice your skills by taking turns as interviewer and candidate.
          </p>

          {p2pStatus === 'idle' && (
            <button className="primary-btn" style={{ padding: '12px 36px' }} onClick={handleP2pMatch}>
              Find Mock Interview Partner
            </button>
          )}

          {p2pStatus === 'matching' && (
            <div>
              <span style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>⚡ Searching for active placement aspirants...</span>
              <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '12px auto', overflow: 'hidden' }}>
                <div style={{ width: '50%', height: '100%', background: 'var(--accent-secondary)', animation: 'wave 1s infinite alternate' }} />
              </div>
            </div>
          )}

          {p2pStatus === 'paired' && (
            <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid var(--accent-secondary)', padding: '24px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
              <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.15rem' }}>✓ Match Found!</h4>
              <p style={{ color: 'var(--text-main)', marginTop: '8px', fontSize: '0.92rem' }}>
                You are paired with: <strong>{p2pPartner}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '16px 0', fontSize: '0.88rem' }}>
                <span>Your Role: <strong style={{ color: 'var(--accent-secondary)' }}>{p2pRole}</strong></span>
                <span>Topic: <strong>System Design & Core Java</strong></span>
              </div>
              <button className="primary-btn" style={{ width: '100%' }} onClick={() => alert('Launching P2P Audio Interview Room...')}>
                Start Call Room
              </button>
            </div>
          )}
        </div>
      )}

      {/* Forums Tab */}
      {activeTab === 'forum' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* Post lists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {forumPosts.map(post => (
              <div key={post.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 700 }}>{post.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>posted by {post.author}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.5' }}>{post.body}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>👍 {post.likes} Likes</span>
                  <span>💬 {post.replies} Replies</span>
                </div>
              </div>
            ))}
          </div>

          {/* Create Post Form */}
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '14px' }}>Create Discussion Thread</h3>
            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label>Thread Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TCS Technical Round Experience..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Post Body</label>
                <textarea
                  className="form-input"
                  rows="4"
                  placeholder="Share details, questions asked, or tips..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
              </div>
              <button type="submit" className="primary-btn" style={{ width: '100%' }}>
                Post Thread
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

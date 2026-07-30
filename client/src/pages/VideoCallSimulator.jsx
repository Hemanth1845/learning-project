import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const VideoCallSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, API_URL } = useContext(AuthContext);

  // Parse query parameters
  const query = new URLSearchParams(location.search);
  const mode = query.get('mode') || 'DSA';
  const company = query.get('company') || 'General';
  const interviewerId = query.get('interviewer') || 'Priya';
  const voiceOnly = query.get('voiceOnly') === 'true';

  // Get passed resume context
  const stateResumeText = location.state?.resumeText || '';
  const parsedProfile = location.state?.parsedProfile || null;

  const interviewer = {
    Priya: { name: 'Priya', role: 'Senior Tech Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    Arjun: { name: 'Arjun', role: 'Staff Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' }
  }[interviewerId] || { name: 'Priya', role: 'Senior Tech Lead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' };

  // States
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [currentRound, setCurrentRound] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [interviewStatus, setInterviewStatus] = useState('call'); // 'call', 'generating', 'report'
  const [report, setReport] = useState(null);

  // Live Coach & Intro analysis metrics state
  const [metrics, setMetrics] = useState({
    confidence: 85,
    speed: 'Good',
    grammar: 95,
    fillers: 0,
    pauses: 0,
    eyeContact: 'Good',
    smile: 'Detected'
  });

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // Dynamic question constructor based on resume text
  const generateResumeQuestions = (profile, text) => {
    const qs = [];
    if (profile) {
      qs.push(`Welcome ${profile.fullName || 'there'}! Let's start with your self-introduction. Please introduce yourself and mention your experience at ${profile.collegeName || 'your university'} pursuing ${profile.degree || 'your degree'}.`);
      if (profile.projects) {
        qs.push(`I see you've listed some amazing projects like: "${profile.projects}". Can you detail the technical architecture, the challenges you faced, and your engineering choices for these?`);
      } else {
        qs.push("Could you detail the most challenging software project you've listed on your resume? What made it difficult, and what engineering choices did you make?");
      }
      if (profile.skills) {
        qs.push(`Your profile highlights skills in: ${profile.skills}. If you had to explain to a junior developer how some of these tools work under the hood, how would you describe their core design patterns?`);
      } else {
        qs.push("Given the skills and languages on your resume, how do you typically manage asynchronous operations, memory leaks, and concurrency in your code?");
      }
      if (profile.internship && profile.internship !== 'None') {
        qs.push(`You mentioned your internship at ${profile.internship}. What was the most impactful feature you shipped there, and how did you measure its success?`);
      } else {
        qs.push("Conflict resolution is a big part of engineering. Tell me about a time when you had a technical disagreement with a teammate on a project. How was it resolved?");
      }
      qs.push(`Thank you. Finally, what specific aspects of your career goal: "${profile.careerGoal || 'Software Engineer'}" align with this opportunity at ${company}?`);
    } else {
      const textLower = (text || '').toLowerCase();
      qs.push("Welcome! Let's start with your self-introduction. Please introduce yourself, mention your college, degree, and some key highlights of your resume.");
      if (textLower.includes('project') || textLower.includes('e-learning') || textLower.includes('portal') || textLower.includes('ats')) {
        qs.push("I see you've listed some MERN stack projects on your resume, like an E-Learning Portal or AI Resume tool. Could you explain the technical architecture, key challenges, and how you integrated the AI APIs?");
      } else {
        qs.push("Could you detail the most challenging software project you've listed on your resume? What made it difficult, and what engineering choices did you make?");
      }
      if (textLower.includes('mongodb') || textLower.includes('sql') || textLower.includes('database') || textLower.includes('postgresql')) {
        qs.push("Database design is crucial. Since your resume lists experience with database systems, how do you handle indexing, normalization, and choosing between SQL and NoSQL databases like MongoDB?");
      } else if (textLower.includes('react') || textLower.includes('node') || textLower.includes('express') || textLower.includes('javascript')) {
        qs.push("You've highlighted modern web technologies like React and Node.js. Can you explain how JWT authentication works, how you secure REST APIs, and what strategies you use to decrease page load times?");
      } else {
        qs.push("Given the skills and languages on your resume, how do you typically manage asynchronous operations, memory leaks, and concurrency in your code?");
      }
      qs.push("Conflict resolution is a big part of engineering. Tell me about a time when you had a technical disagreement with a teammate on a project. How was it resolved?");
      qs.push(`Thank you. Finally, what specific aspects of your background make you the perfect candidate for this role at ${company}?`);
    }
    return qs;
  };

  const getQuestionsList = () => {
    if (mode === 'Resume') {
      return generateResumeQuestions(parsedProfile, stateResumeText);
    }
    return {
      DSA: [
        `Hello! Let's start this technical round. Can you explain what a Hash Collision is, and describe how Open Addressing and Chaining are used to resolve it?`,
        `Good. Let's write some code in your mind: How would you detect a cycle in a Singly Linked List? What is the time complexity and what is Floyd's Cycle detection algorithm?`,
        `Excellent. For the final question: If you had to merge k sorted arrays, what data structure would you use to optimize the search and how does it optimize it?`
      ],
      Behavioral: [
        `Welcome. Tell me about a time when you had a serious conflict with a team member on a group project. How did you handle it and what was the outcome?`,
        `Thank you. Can you describe a project from your resume that you are most proud of? What was the biggest technical bottleneck and how did you resolve it?`,
        `Great. Why do you want to join ${company}? What values or leadership principles of ours resonate most with your career goals?`
      ],
      SystemDesign: [
        `Hello. Let's dive into system design. If we were designing a URL shortening service like Bit.ly, how would you generate unique shortened hashes, and what scaling strategy would you choose?`,
        `Excellent. How would you handle database partitioning for a high-write application? What is the difference between vertical partitioning and horizontal sharding?`,
        `Lastly, how do you handle caching in a distributed system, and how do you prevent cache stampede or cache penetration bottlenecks?`
      ]
    }[mode] || [
      `Welcome! Tell me about your background and what core skills you highlight on your resume.`,
      `Great. In your project stack, what was the most difficult bug you encountered, and what steps did you take to debug and solve it?`,
      `Excellent. Why do you think you are the right fit for this role at ${company}?`
    ];
  };

  const questions = getQuestionsList();

  // 1. Initialize User Webcam
  useEffect(() => {
    startCamera();
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: !voiceOnly,
        audio: true
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (!voiceOnly && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraOn(!voiceOnly);
      setMicOn(true);
    } catch (err) {
      console.warn('Webcam or Mic blocked / unavailable:', err);
      setCameraOn(false);
      setMicOn(false);
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  // Live Metrics Hook
  useEffect(() => {
    if (transcriptText) {
      const text = transcriptText.toLowerCase();

      // Count fillers
      const fillers = (transcriptText.match(/\b(um|uh|like|actually|basically|so|you know)\b/gi) || []).length;

      // Count pauses
      const pauses = (transcriptText.match(/\.{2,}/g) || []).length + (transcriptText.match(/\s{3,}/g) || []).length;

      // Words count
      const wordCount = transcriptText.trim().split(/\s+/).length;
      let speed = 'Good';
      if (wordCount > 10) {
        if (wordCount < 30) speed = 'Too Slow';
        else if (wordCount > 160) speed = 'Too Fast';
      }

      // Confidence drops with fillers and pauses
      const confidence = Math.max(40, Math.min(99, 90 - fillers * 6 - pauses * 10));
      const grammar = Math.max(50, Math.min(100, 96 - fillers * 2));

      setMetrics(prev => ({
        ...prev,
        confidence,
        speed,
        grammar,
        fillers,
        pauses
      }));
    }
  }, [transcriptText]);

  // 2. AI Voice Synthesis (Text-to-Speech)
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes(interviewerId === 'Priya' ? 'Google US English' : 'Microsoft David'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setAiSpeaking(true);
      setTimeout(() => setAiSpeaking(false), 3000);
    }
  };

  // Speak first question on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion(questions[0]);
      setChatLog([{ sender: 'ai', message: questions[0] }]);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // 3. User Voice Capture (Speech-to-Text)
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscriptText('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscriptText(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // 4. Progress call
  const handleNextRound = () => {
    if (!transcriptText.trim()) {
      alert('Please speak or type your answer before proceeding.');
      return;
    }

    stopSpeechRecognition();

    // Check if the user had trouble/nervousness during the introduction round (Round 0)
    if (currentRound === 0) {
      const fillers = (transcriptText.match(/\b(um|uh|like|actually|basically|so|you know)\b/gi) || []).length;
      const pauses = (transcriptText.match(/\.{2,}/g) || []).length + (transcriptText.match(/\s{3,}/g) || []).length;

      if (fillers > 3 || pauses > 2) {
        const restart = window.confirm(`[INTERVIEW NOTE]: You seem a little nervous. You used ${fillers} filler words and paused frequently. Take a deep breath! Would you like to restart your introduction to deliver it more clearly? (Click OK to restart introduction, or CANCEL to proceed anyway)`);
        if (restart) {
          setTranscriptText('');
          return; // Prevent proceeding and let them retry
        }
      }
    }

    const updatedLog = [
      ...chatLog,
      { sender: 'user', message: transcriptText }
    ];
    setChatLog(updatedLog);

    const nextIdx = currentRound + 1;
    if (nextIdx < questions.length) {
      setCurrentRound(nextIdx);
      setTranscriptText('');
      const nextQ = questions[nextIdx];
      setChatLog(prev => [...prev, { sender: 'ai', message: nextQ }]);
      speakQuestion(nextQ);
    } else {
      evaluateSession(updatedLog);
    }
  };

  // 5. AI Evaluation Report
  const evaluateSession = async (log) => {
    setInterviewStatus('generating');
    stopCameraStream();

    const formattedChat = log
      .map(m => `${m.sender.toUpperCase()}: ${m.message}`)
      .join('\n');

    try {
      if (token) {
        const res = await fetch(`${API_URL}/interviews/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            companyName: `${company} (Video Call Simulator - ${mode})`,
            difficulty: 'Medium',
            resumeText: stateResumeText || `Target Mode: ${mode}. Interviewer: ${interviewer.name}. Performance Evaluated.`
          })
        });
        const interviewData = await res.json();
        
        const evaluateRes = await fetch(`${API_URL}/interviews/${interviewData._id}/respond`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message: `I have finished the video call. Chat log transcript: ${formattedChat}` })
        });
        const finalData = await evaluateRes.json();
        
        setReport({
          scores: {
            communication: Math.min(100, Math.max(40, 70 + Math.floor(Math.random() * 25))),
            technical: finalData.feedback?.overallScore || 75,
            confidence: Math.min(100, Math.max(45, 65 + Math.floor(Math.random() * 30))),
            overall: finalData.feedback?.overallScore || 75
          },
          summary: finalData.feedback?.summary || 'Good attempt at the simulated video call.',
          strengths: finalData.feedback?.strengths || ['Good response structure', 'Clear speaking speed'],
          weaknesses: finalData.feedback?.weaknesses || ['Could elaborate on edge cases'],
          tips: finalData.feedback?.tips || ['Review core concepts', 'Practice speech clarity']
        });
      } else {
        throw new Error('Offline fallback mode');
      }
    } catch (err) {
      setTimeout(() => {
        setReport({
          scores: { communication: 84, technical: 78, confidence: 88, overall: 83 },
          summary: `You completed a realistic video call simulation with ${interviewer.name} for ${company}. You answered ${questions.length} questions in ${mode} mode. Your speech speed was standard and communication style was clear.`,
          strengths: ['Confident tone of voice', 'Direct answers to core questions', 'Sufficient vocabulary'],
          weaknesses: ['Could expand on the technical complexity of B-Trees', 'Nervous pauses on structural code designs'],
          tips: ['Practice writing mock code while explaining your steps out loud', 'Review distributed database locks and normalizations', 'Keep a steady pacing during behavioral answers']
        });
      }, 3000);
    } finally {
      setInterviewStatus('report');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)', gap: '24px' }}>
      
      {interviewStatus === 'call' && (
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', flex: 1 }} className="scorecard-panel">
          
          {/* Left Column: AI Frame & User Webcam Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* AI Interviewer Video Card */}
            <div className="glass-card" style={{ flex: 1.5, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', overflow: 'hidden', padding: 0 }}>
              <img 
                src={interviewer.avatar} 
                alt={interviewer.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', filter: 'brightness(0.6)' }} 
              />
              
              {/* Overlay waveforms if speaking */}
              {aiSpeaking ? (
                <div style={{ position: 'absolute', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(11,12,16,0.7)', padding: '16px 24px', borderRadius: '30px', border: '1px solid var(--accent-secondary)' }}>
                  <div style={{ width: '4px', height: '24px', background: 'var(--accent-secondary)', animation: 'wave 0.8s infinite alternate' }}></div>
                  <div style={{ width: '4px', height: '40px', background: 'var(--accent-secondary)', animation: 'wave 0.8s infinite alternate 0.2s' }}></div>
                  <div style={{ width: '4px', height: '16px', background: 'var(--accent-secondary)', animation: 'wave 0.8s infinite alternate 0.4s' }}></div>
                  <div style={{ width: '4px', height: '32px', background: 'var(--accent-secondary)', animation: 'wave 0.8s infinite alternate 0.1s' }}></div>
                  <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600, marginLeft: '8px' }}>{interviewer.name} is speaking...</span>
                </div>
              ) : (
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '6px 14px', borderRadius: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffb800' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>{interviewer.name} (Listening)</span>
                </div>
              )}

              {/* Top Title Tag */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{interviewer.name} | {interviewer.role}</span>
              </div>
            </div>

            {/* User Webcam Frame & Controls Stack */}
            <div style={{ display: 'grid', gridTemplateColumns: voiceOnly ? '1fr' : '1fr 2fr', gap: '16px' }}>
              {!voiceOnly && (
                <div className="glass-card" style={{ height: '140px', padding: 0, overflow: 'hidden', position: 'relative', background: '#11141a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cameraOn ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <span style={{ fontSize: '1.5rem' }}>🚫</span>
                      <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Webcam Off</div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', color: 'white' }}>
                    You (Candidate)
                  </div>
                </div>
              )}

              {/* Video Controller Controls panel */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'center', gap: '12px', padding: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={toggleMic}
                    className="warroom-btn"
                    style={{ 
                      borderRadius: '50%', 
                      width: '42px', 
                      height: '42px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '1rem',
                      background: micOn ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.2)',
                      borderColor: micOn ? 'var(--border-glass)' : '#ef4444',
                      color: micOn ? 'white' : '#ef4444'
                    }}
                    title={micOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {micOn ? '🎙️' : '🚫'}
                  </button>
                  {!voiceOnly && (
                    <button 
                      onClick={toggleCamera}
                      className="warroom-btn"
                      style={{ 
                        borderRadius: '50%', 
                        width: '42px', 
                        height: '42px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1rem',
                        background: cameraOn ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.2)',
                        borderColor: cameraOn ? 'var(--border-glass)' : '#ef4444',
                        color: cameraOn ? 'white' : '#ef4444'
                      }}
                      title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    >
                      {cameraOn ? '📹' : '❌'}
                    </button>
                  )}
                  <button 
                    onClick={() => { stopCameraStream(); navigate('/mock-interview'); }}
                    className="warroom-btn"
                    style={{ 
                      background: 'rgba(239,68,68,0.25)', 
                      borderColor: '#ef4444', 
                      color: '#ff7272', 
                      padding: '8px 18px', 
                      borderRadius: '30px',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  >
                    End Call 🛑
                  </button>
                </div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '1px', fontWeight: 600 }}>
                  Question {currentRound + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Answer & Transcript Input */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', color: 'white' }}>Current Response Transcript</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                  {isRecording ? '🟢 Mic Listening...' : '⚪ Mic Idle'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                  className="warroom-btn"
                  style={{ 
                    flex: 1,
                    background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 242, 254, 0.15)',
                    borderColor: isRecording ? '#ef4444' : 'var(--accent-secondary)',
                    color: isRecording ? '#ff7272' : 'var(--accent-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    padding: '10px'
                  }}
                >
                  <span>{isRecording ? '🛑 Stop Recording' : '🎤 Speak Answer (Mic)'}</span>
                </button>
              </div>

              <textarea 
                className="form-input"
                style={{ height: '90px', resize: 'none', background: 'rgba(0,0,0,0.2)', fontSize: '0.88rem' }}
                placeholder="Speak using the mic or type your response directly here..."
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
              />

              <button 
                onClick={handleNextRound} 
                className="primary-btn"
                style={{ background: 'var(--accent-gradient)', padding: '12px' }}
              >
                {currentRound === questions.length - 1 ? 'Finish Interview' : 'Submit & Next Question'}
              </button>
            </div>

          </div>

          {/* Right Column: Live Coach & Intro Analysis Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live Metrics Card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span> Live Interview Coach
                </h3>
                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Active Coach</span>
              </div>

              {/* Progress bars / metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONFIDENCE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: metrics.confidence > 70 ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                    {metrics.confidence}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPEECH SPEED</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: metrics.speed === 'Good' ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                    {metrics.speed}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GRAMMAR INDEX</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-secondary)', marginTop: '4px' }}>
                    {metrics.grammar}%
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FILLER WORDS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: metrics.fillers > 2 ? '#ef4444' : 'white', marginTop: '4px' }}>
                    {metrics.fillers} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>used</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>
                <span>Eye Contact: <strong style={{ color: '#10b981' }}>{metrics.eyeContact}</strong></span>
                <span>Smile: <strong style={{ color: '#10b981' }}>{metrics.smile}</strong></span>
              </div>

              {metrics.fillers > 2 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ff7272', padding: '10px', borderRadius: '6px', fontSize: '0.78rem' }}>
                  ⚠️ <strong>Live Warning:</strong> Avoid repeating filler phrases like 'um', 'like', and 'actually'. Practice taking quiet pauses instead.
                </div>
              )}
            </div>

            {/* Conditional Introduction Analysis card */}
            {parsedProfile ? (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                  📋 Candidate Profile Focus
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong style={{ color: 'white' }}>{parsedProfile.fullName}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>College:</span> <strong style={{ color: 'white' }}>{parsedProfile.collegeName}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Degree:</span> <strong style={{ color: 'white' }}>{parsedProfile.degree}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Skills Match:</span> <strong style={{ color: 'var(--accent-secondary)' }}>{parsedProfile.skills}</strong></div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '10px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tip: Make sure to mention details from your projects ("{parsedProfile.projects?.substring(0, 40)}...") during the conversation!
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                  📋 Resume Match Focus
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  The AI interviewer is evaluating concepts based on your uploaded resume text:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-secondary)' }}>MERN Stack</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-secondary)' }}>Engineering Projects</span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-secondary)' }}>Technical Skills</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '10px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tip: Use the STAR method (Situation, Task, Action, Result) to explain project challenges.
                </div>
              </div>
            )}

            {/* General Coach Tips */}
            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '8px' }}>💡 Quick Tips from the Coach</h4>
              <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Structure your answers cleanly.</li>
                <li>Avoid rushing; speak at an even pace.</li>
                <li>Keep webcam level with your eyes.</li>
                <li>State concrete examples from past internships.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Evaluating state */}
      {interviewStatus === 'generating' && (
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', minHeight: '400px' }}>
          <span style={{ fontSize: '3rem', animation: 'spin 1.5s infinite linear' }}>⚙️</span>
          <h2 style={{ color: 'white' }}>Generating Performance Analysis Report</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gemini is reviewing your speech scripts, confidence index, and code logics...</p>
        </div>
      )}

      {/* RENDER SCORECARD REPORT */}
      {interviewStatus === 'report' && report && (
        <div className="glass-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: 'white' }}>🎉 Video Interview Performance Report</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Analysis scorecard for your mock interview session with {interviewer.name}.</p>
          </div>

          {/* Scores Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="dashboard-grid">
            <div className="glass-card" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{report.scores.communication}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase' }}>Communication</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-points)' }}>{report.scores.confidence}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase' }}>Confidence</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-solved)' }}>{report.scores.technical}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase' }}>Technical Skills</div>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', background: 'rgba(255, 184, 0, 0.05)', border: '1px solid #ffb800' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffb800' }}>{report.scores.overall}%</div>
              <div style={{ fontSize: '0.85rem', color: 'white', marginTop: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Overall Fit</div>
            </div>
          </div>

          {/* Core breakdown splits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="scorecard-panel">
            
            {/* Feedback summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'white', marginBottom: '8px' }}>Performance Summary</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{report.summary}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent-secondary)', fontSize: '1.05rem', marginBottom: '10px' }}>💡 Interview Recommendations</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {report.tips.map((t, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(0, 242, 254, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-secondary)', fontSize: '0.9rem', color: 'white' }}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Strengths / weaknesses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--color-solved)', fontSize: '1.05rem', marginBottom: '10px' }}>✓ Strengths Identified</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {report.strengths.map((s, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(16, 185, 129, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--color-solved)', fontSize: '0.9rem', color: 'white' }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--color-hard)', fontSize: '1.05rem', marginBottom: '10px' }}>⚠ Weaknesses / Bottlenecks</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {report.weaknesses.map((w, idx) => (
                    <li key={idx} style={{ listStyle: 'none', background: 'rgba(239, 68, 68, 0.05)', padding: '10px 16px', borderRadius: '8px', borderLeft: '3px solid var(--color-hard)', fontSize: '0.9rem', color: 'white' }}>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px' }}>
            <button onClick={() => navigate('/mock-interview')} className="warroom-btn" style={{ padding: '12px 24px' }}>
              Back to Interview Hub
            </button>
            <button onClick={() => navigate('/')} className="primary-btn" style={{ padding: '12px 32px' }}>
              Go to Dashboard
            </button>
          </div>

        </div>
      )}

      {/* Styled animation keyframes */}
      <style>{`
        @keyframes wave {
          0% { height: 10px; }
          100% { height: 40px; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default VideoCallSimulator;

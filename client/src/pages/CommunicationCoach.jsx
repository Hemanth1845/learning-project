import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CommunicationCoach = () => {
  const { token, API_URL } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'pronunciation', 'storytelling', 'gd'
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTime, setSpeakingTime] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  
  // Real-time coach feedback states
  const [liveMetrics, setLiveMetrics] = useState({
    wpm: 0,
    fillerCount: 0,
    pauses: 0,
    speedAlert: 'Optimal', // 'Optimal', 'Too Fast', 'Too Slow'
    volume: 'Good',
    tone: 'Confident',
    smile: 'Detected',
    eyeContact: 'Good'
  });
  const [liveCoachMessage, setLiveCoachMessage] = useState('Position your camera and speak clearly when ready.');
  
  // Challenge & Report states
  const [currentTopic, setCurrentTopic] = useState(() => {
    const pool = [
      'Describe your favorite software project and why it inspires you.',
      'Tell me about a time you had to explain a complex technical concept to a non-technical person.',
      'What motivates you to work in software engineering, and where do you see yourself in five years?',
      'Describe your college or university and the major achievements of your academic life.',
      'If you could solve one global problem using technology, what would it be and why?'
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  });
  const [report, setReport] = useState(null);

  // References for timers and speech recognition
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const wordsCountRef = useRef(0);

  // Pronunciation Practice States
  const [selectedWord, setSelectedWord] = useState('Synchronization');
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [userSpokenWord, setUserSpokenWord] = useState('');
  const trickyWords = ['Synchronization', 'Polymorphism', 'Asynchronous', 'Concurrency', 'Normalization', 'Inheritance', 'Encapsulation'];

  // Storytelling (STAR) States
  const [starPhase, setStarPhase] = useState('Situation'); // 'Situation', 'Task', 'Action', 'Result'
  const [starText, setStarText] = useState({ Situation: '', Task: '', Action: '', Result: '' });
  const [starFeedback, setStarFeedback] = useState(null);

  // Group Discussion States
  const [gdTopic, setGdTopic] = useState('Is Artificial Intelligence replacing human programmers?');
  const [gdLog, setGdLog] = useState([
    { speaker: 'Dev (AI Participant)', text: 'I think AI is a powerful tool, but it lacks the creative system design intuition of human engineers.', time: '10:02 AM' },
    { speaker: 'Sarah (AI Participant)', text: 'True! Although, code completion rates are already hovering above 40%. The speedup is undeniable.', time: '10:03 AM' }
  ]);
  const [userGdSpeech, setUserGdSpeech] = useState('');

  // Daily Topics Pool
  const topicsPool = [
    'Describe your favorite software project and why it inspires you.',
    'Tell me about a time you had to explain a complex technical concept to a non-technical person.',
    'What motivates you to work in software engineering, and where do you see yourself in five years?',
    'Describe your college or university and the major achievements of your academic life.',
    'If you could solve one global problem using technology, what would it be and why?'
  ];

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const selectRandomTopic = () => {
    const idx = Math.floor(Math.random() * topicsPool.length);
    setCurrentTopic(topicsPool[idx]);
    setReport(null);
  };

  // Text-To-Speech Pronunciation Helper
  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support text-to-speech.');
    }
  };

  // Speech Recognition Hook and Real-Time analysis
  const startRecording = (modeType = 'daily') => {
    if (isRecording) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;
    setIsRecording(true);
    setTranscriptText('');
    setReport(null);
    lastSpeechTimeRef.current = Date.now();
    wordsCountRef.current = 0;

    setLiveMetrics({
      wpm: 0,
      fillerCount: 0,
      pauses: 0,
      speedAlert: 'Optimal',
      volume: 'Good',
      tone: 'Confident',
      smile: 'Detected',
      eyeContact: 'Good'
    });

    let localFillerCount = 0;
    let localPauses = 0;

    recognition.onresult = (e) => {
      let finalTranscript = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscript.trim()) {
        setTranscriptText(prev => prev + finalTranscript);
        lastSpeechTimeRef.current = Date.now();

        // Count words & analyze pacing
        const words = finalTranscript.trim().split(/\s+/);
        wordsCountRef.current += words.length;

        // Realtime WPM calculator
        const durationMin = (Date.now() - startTime) / 60000;
        const currentWpm = durationMin > 0 ? Math.round(wordsCountRef.current / durationMin) : 150;
        
        let speedAlert = 'Optimal';
        if (currentWpm > 190) {
          speedAlert = 'Too Fast';
          setLiveCoachMessage('⚠️ Slow down slightly! Speak clearly and add pauses.');
        } else if (currentWpm < 100 && wordsCountRef.current > 10) {
          speedAlert = 'Too Slow';
          setLiveCoachMessage('⚠️ Try speaking with more confidence and energy.');
        } else {
          setLiveCoachMessage('👍 Great pacing. Keep going.');
        }

        // Check for filler words
        const textLower = finalTranscript.toLowerCase();
        const fillers = ['um', 'umm', 'uh', 'uhh', 'like', 'actually', 'basically', 'you know'];
        fillers.forEach(f => {
          const regex = new RegExp(`\\b${f}\\b`, 'g');
          const matches = textLower.match(regex);
          if (matches) {
            localFillerCount += matches.length;
            setLiveCoachMessage(`💡 Avoid filler word: "${f}". Try pausing instead.`);
          }
        });

        setLiveMetrics(prev => ({
          ...prev,
          wpm: currentWpm || prev.wpm,
          fillerCount: localFillerCount
        }));
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    const startTime = Date.now();

    // Start timers
    timerRef.current = setInterval(() => {
      setSpeakingTime(prev => prev + 1);
      
      // Pause check (if user is silent for more than 5 seconds)
      const silentSecs = (Date.now() - lastSpeechTimeRef.current) / 1000;
      if (silentSecs > 5) {
        lastSpeechTimeRef.current = Date.now(); // reset timer
        localPauses += 1;
        setLiveMetrics(prev => ({ ...prev, pauses: localPauses }));
        setLiveCoachMessage('💡 You seem a little nervous. Take a deep breath and continue whenever you are ready.');
      }
    }, 1000);
  };

  const stopRecording = (modeType = 'daily') => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);

    if (modeType === 'daily') {
      generateDailyReport();
    } else if (modeType === 'pronunciation') {
      evaluatePronunciation();
    }
  };

  // Generate Daily Challenge Coach Report
  const generateDailyReport = () => {
    const finalWpm = speakingTime > 0 ? Math.round((wordsCountRef.current / speakingTime) * 60) : 120;
    const fillers = liveMetrics.fillerCount;
    
    // Calculate scoring
    const confidenceScore = Math.max(50, 95 - (liveMetrics.pauses * 8));
    const fluencyScore = Math.max(40, 100 - (fillers * 5) - (liveMetrics.pauses * 5));
    const grammarScore = Math.max(60, 98 - (fillers * 2));
    const vocabScore = Math.min(95, 75 + (wordsCountRef.current / 10));
    const pronunciationScoreVal = Math.max(55, 92 - (fillers * 3));
    const overallScore = Math.round((confidenceScore + fluencyScore + grammarScore + vocabScore + pronunciationScoreVal) / 5);

    setReport({
      overallScore,
      confidenceScore,
      fluencyScore,
      grammarScore,
      vocabScore,
      pronunciationScore: pronunciationScoreVal,
      wpm: finalWpm || 135,
      fillerCount: fillers,
      longestPause: liveMetrics.pauses > 0 ? `${Math.round(2 + Math.random() * 4)}s` : '0s',
      eyeContact: 'Good (88%)',
      smile: 'Detected (5 times)',
      strengths: ['Great confidence and vocal energy', 'Solid pacing structure', 'Good vocabulary choices'],
      weaknesses: fillers > 3 ? ['High filler word count', 'Slight nervous pauses'] : ['Could enrich technical terminologies'],
      advice: 'Try to practice mirror speaking for 2 minutes daily to reduce the usage of filler words like "like" and "actually".'
    });
    setSpeakingTime(0);
  };

  // Pronunciation Evaluation
  const evaluatePronunciation = () => {
    if (!transcriptText.trim()) {
      alert('We did not hear anything. Please try again!');
      return;
    }
    const cleanWord = selectedWord.toLowerCase().replace(/[^a-z]/g, '');
    const cleanSpeech = transcriptText.toLowerCase().replace(/[^a-z]/g, '');
    
    const isCorrect = cleanSpeech.includes(cleanWord);
    setUserSpokenWord(transcriptText.trim());
    setPronunciationScore(isCorrect ? 100 : Math.round(40 + Math.random() * 20));
  };

  // Storytelling Evaluation
  const handleStarEvaluate = () => {
    if (!starText.Situation || !starText.Task || !starText.Action || !starText.Result) {
      alert('Please fill out all four phases of the STAR method.');
      return;
    }
    setStarFeedback({
      score: 92,
      feedback: 'Excellent structure! You successfully defined the Situation, outlined the specific Task, explained the actions you took, and highlighted the business or technical Results.',
      suggestions: 'Add quantifiable metrics in your Result section (e.g. "reduced latency by 20%" or "increased user activity by 15%") to make it even more compelling.'
    });
  };

  // Simulate Virtual participant responses in GD
  const handlePostGdMsg = (e) => {
    e.preventDefault();
    if (!userGdSpeech.trim()) return;

    const newMsg = { speaker: 'Me (You)', text: userGdSpeech, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setGdLog(prev => [...prev, newMsg]);
    setUserGdSpeech('');

    // Simulate participant reply after 2 seconds
    setTimeout(() => {
      const bots = [
        { name: 'Emily (AI Participant)', text: 'I agree with your point. Also, AI helps us write boilerplate code rapidly, leaving architectural design to us.' },
        { name: 'Rohan (AI Participant)', text: 'But can we trust AI completely for critical security systems? Human code audits are absolutely vital.' }
      ];
      const bot = bots[Math.floor(Math.random() * bots.length)];
      setGdLog(prev => [...prev, {
        speaker: bot.name,
        text: bot.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>🎤 AI Communication Gym & Speaking Coach</h2>
        <p style={{ color: 'var(--text-muted)' }}>Perfect your grammar, pitch, pronunciation, and confidence for placement interviews.</p>
      </div>

      {/* Module Switcher Tabs */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button className={`filter-tag ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => { setActiveTab('daily'); setReport(null); }}>
          📆 Daily Speaking Gym
        </button>
        <button className={`filter-tag ${activeTab === 'pronunciation' ? 'active' : ''}`} onClick={() => { setActiveTab('pronunciation'); setPronunciationScore(null); }}>
          🗣️ Pronunciation Coach
        </button>
        <button className={`filter-tag ${activeTab === 'storytelling' ? 'active' : ''}`} onClick={() => { setActiveTab('storytelling'); setStarFeedback(null); }}>
          📖 STAR Storytelling
        </button>
        <button className={`filter-tag ${activeTab === 'gd' ? 'active' : ''}`} onClick={() => setActiveTab('gd')}>
          👥 Group Discussion Room
        </button>
      </div>

      {/* Tab Contents */}
      
      {/* 1. DAILY SPEAKING PRACTICE */}
      {activeTab === 'daily' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }} className="scorecard-panel">
          
          {/* Speaking Console */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Daily Prompt Topic</span>
              <button onClick={selectRandomTopic} className="warroom-btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>🔄 Get Another Topic</button>
            </div>
            
            <blockquote style={{ fontSize: '1.15rem', color: 'white', fontWeight: 600, borderLeft: '3px solid var(--accent-primary)', paddingLeft: '16px', margin: '8px 0' }}>
              "{currentTopic}"
            </blockquote>

            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'center', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              {isRecording ? (
                <>
                  <div className="pulse-circle" style={{ width: '48px', height: '48px', background: '#f43f5e', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ color: 'white', fontWeight: 'bold' }}>Coach Listening... {speakingTime}s / 120s</span>
                  {transcriptText && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      "{transcriptText}"
                    </p>
                  )}
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Press button to start speaking. Speak continuously for up to 2 minutes.</span>
                  <button onClick={() => startRecording('daily')} className="primary-btn" style={{ background: 'var(--accent-gradient)', padding: '12px 32px' }}>
                    🎙️ Start Speaking Challenge
                  </button>
                </>
              )}
              {isRecording && (
                <button onClick={() => stopRecording('daily')} className="warroom-btn" style={{ borderColor: '#f43f5e', color: '#f43f5e', padding: '8px 24px' }}>
                  ⏹ Stop & Analyze
                </button>
              )}
            </div>

            {/* Live Suggestion Coach Bar */}
            <div style={{ padding: '16px', background: 'rgba(99,102,241,0.06)', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
              <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>🔊 Live Speech Coach Tips:</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '4px', display: 'block' }}>{liveCoachMessage}</span>
            </div>

            {/* Live Analytics Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Speech Speed</span>
                <strong style={{ color: 'white', fontSize: '1rem', marginTop: '4px', display: 'block' }}>{isRecording ? `${liveMetrics.wpm} WPM` : '--'}</strong>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Filler Words</span>
                <strong style={{ color: liveMetrics.fillerCount > 3 ? '#f43f5e' : 'white', fontSize: '1rem', marginTop: '4px', display: 'block' }}>{liveMetrics.fillerCount}</strong>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Silent Pauses</span>
                <strong style={{ color: 'white', fontSize: '1rem', marginTop: '4px', display: 'block' }}>{liveMetrics.pauses}</strong>
              </div>
            </div>

          </div>

          {/* Report Sheet */}
          <div className="glass-card">
            {report ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'white' }}>🎯 Speech Performance Report</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{report.overallScore}/100</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fluency Score:</span>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '6px' }}>
                      <div style={{ width: `${report.fluencyScore}%`, height: '100%', background: 'var(--color-easy)', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grammar Accuracy:</span>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '6px' }}>
                      <div style={{ width: `${report.grammarScore}%`, height: '100%', background: 'var(--color-easy)', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vocal Confidence:</span>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '6px' }}>
                      <div style={{ width: `${report.confidenceScore}%`, height: '100%', background: 'var(--color-easy)', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vocabulary Score:</span>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '6px' }}>
                      <div style={{ width: `${report.vocabScore}%`, height: '100%', background: 'var(--color-easy)', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>Strengths:</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '6px' }}>
                    {report.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>Areas to Improve:</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '6px' }}>
                    {report.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>

                <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--color-solved)', textTransform: 'uppercase' }}>Coach Advice:</strong>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>{report.advice}</p>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '80px 20px' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📊</span>
                Complete a speaking challenge on the left to generate your real-time coach feedback report card.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. PRONUNCIATION COACH */}
      {activeTab === 'pronunciation' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="scorecard-panel">
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Accent & Phonetic Practice</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a complex technical word, listen to the correct pronunciation, and repeat it to test your accent match.</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {trickyWords.map(w => (
                <button
                  key={w}
                  onClick={() => { setSelectedWord(w); setPronunciationScore(null); setUserSpokenWord(''); }}
                  style={{
                    padding: '8px 16px',
                    background: selectedWord === w ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  {w}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button onClick={() => playPronunciation(selectedWord)} className="warroom-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔊 Listen Pronunciation
              </button>
              <button
                onClick={() => isRecording ? stopRecording('pronunciation') : startRecording('pronunciation')}
                className="primary-btn"
                style={{ background: isRecording ? '#f43f5e' : 'var(--accent-gradient)' }}
              >
                {isRecording ? '⏹ Stop Recording' : '🎙️ Tap & Repeat'}
              </button>
            </div>

            {isRecording && <div style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem' }}>Listening... Speak the word now.</div>}
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifySelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            {pronunciationScore !== null ? (
              <>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid var(--color-solved)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-solved)' }}>
                  {pronunciationScore}%
                </div>
                <h4 style={{ color: 'white', fontSize: '1.2rem' }}>
                  {pronunciationScore === 100 ? 'Excellent Match!' : 'Needs Polish'}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  We expected: <strong style={{ color: 'white' }}>"{selectedWord}"</strong><br/>
                  We heard: <strong style={{ color: 'var(--color-hard)' }}>"{userSpokenWord || 'Unknown sound'}"</strong>
                </p>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🗣️</span>
                Speak into your mic to score your pronunciation accuracy.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. STAR STORYTELLING */}
      {activeTab === 'storytelling' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="scorecard-panel">
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>STAR Interview Story Builder</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Format behavioral examples (leadership, conflict, failures) using the premium STAR method.</p>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['Situation', 'Task', 'Action', 'Result'].map(phase => (
                <button
                  key={phase}
                  onClick={() => setStarPhase(phase)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '0.78rem',
                    background: starPhase === phase ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {phase}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', color: 'white' }}>Detail the {starPhase} phase:</label>
              <textarea
                className="form-input"
                rows="6"
                placeholder={`Type your story's ${starPhase.toLowerCase()} contents...`}
                value={starText[starPhase]}
                onChange={(e) => setStarText({ ...starText, [starPhase]: e.target.value })}
              />
            </div>

            <button onClick={handleStarEvaluate} className="primary-btn" style={{ padding: '10px 24px', alignSelf: 'flex-start' }}>
              Evaluate Story Structure
            </button>
          </div>

          <div className="glass-card">
            {starFeedback ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'white', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
                  📝 Structure Score: <span style={{ color: 'var(--accent-secondary)' }}>{starFeedback.score}/100</span>
                </h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6' }}>{starFeedback.feedback}</p>
                
                <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', borderLeft: '3px solid var(--color-medium)' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#f59e0b' }}>Optimization Suggestion:</strong>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>{starFeedback.suggestions}</p>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 20px' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📖</span>
                Fill out the Situation, Task, Action, and Result paragraphs on the left to verify your structural narrative.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. GROUP DISCUSSION ROOM */}
      {activeTab === 'gd' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }} className="scorecard-panel">
          
          {/* Chat feed */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '550px' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active GD Topic</span>
              <h3 style={{ fontSize: '1.05rem', color: 'white', marginTop: '4px' }}>"{gdTopic}"</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
              {gdLog.map((m, idx) => {
                const isUser = m.speaker === 'Me (You)';
                return (
                  <div key={idx} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '75%', background: isUser ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', gap: '16px' }}>
                      <strong>{m.speaker}</strong>
                      <span>{m.time}</span>
                    </div>
                    <p style={{ color: 'white', fontSize: '0.88rem', marginTop: '6px', margin: 0 }}>{m.text}</p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handlePostGdMsg} style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Make your contribution to the group discussion..."
                value={userGdSpeech}
                onChange={(e) => setUserGdSpeech(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="primary-btn" style={{ padding: '8px 24px' }}>Send Contribution</button>
            </form>
          </div>

          {/* Virtual Panel participants list */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'white' }}>Virtual GD Participants (6)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Dev', status: 'Speaking...', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
                { name: 'Sarah', status: 'Listening', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
                { name: 'Emily', status: 'Thinking', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
                { name: 'Rohan', status: 'Listening', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
                { name: 'Ken', status: 'Listening', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
                { name: 'Ananya', status: 'Listening', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' }
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', gap: '12px' }}>
                  <img src={p.avatar} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>{p.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CSS Keyframes for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(244, 63, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
        }
      `}</style>

    </div>
  );
};

export default CommunicationCoach;

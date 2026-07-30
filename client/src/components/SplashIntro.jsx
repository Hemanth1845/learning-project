import React, { useState, useEffect } from 'react';
import './SplashIntro.css';

const SplashIntro = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Automatically transition after 4.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      const completeTimer = setTimeout(onComplete, 800);
      return () => clearTimeout(completeTimer);
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(onComplete, 800);
  };

  return (
    <div className={`splash-overlay ${fadeOut ? 'fade-out' : ''}`}>
      {/* Dynamic Animated Particles: Flowers, Fireflies, Sparkles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 4}`} />
        ))}
      </div>
      
      <div className="splash-content">
        <div className="splash-logo">⚡</div>
        <h1 className="splash-title">
          <span>Knowledge</span> <span>Begins</span> <span>Here.</span>
        </h1>
        <p className="splash-subtitle">Step into the future of learning and placement success</p>
        
        <button className="splash-enter-btn" onClick={handleSkip}>
          Enter Portal ➔
        </button>
      </div>
    </div>
  );
};

export default SplashIntro;

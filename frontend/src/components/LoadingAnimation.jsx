import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      {/* Main loading spinner */}
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      
      {/* Floating dots */}
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      
      {/* Background particles */}
      <div className="loading-particles">
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
      </div>
      
      {/* Loading text */}
      <div className="loading-text">
        <span className="loading-char">L</span>
        <span className="loading-char">O</span>
        <span className="loading-char">A</span>
        <span className="loading-char">D</span>
        <span className="loading-char">I</span>
        <span className="loading-char">N</span>
        <span className="loading-char">G</span>
      </div>
    </div>
  );
};

export default LoadingAnimation;

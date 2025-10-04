import React, { useState } from 'react';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fab-container">
      {/* Main FAB */}
      <button 
        className={`fab-main ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleExpanded}
        aria-label="Quick actions"
      >
        <div className="fab-icon">
          <svg 
            className={`fab-svg ${isExpanded ? 'rotated' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isExpanded ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} 
            />
          </svg>
        </div>
        
        {/* Glow effect */}
        <div className="fab-glow"></div>
        
        {/* Ripple effect */}
        <div className="fab-ripple"></div>
      </button>

      {/* FAB Actions */}
      <div className={`fab-actions ${isExpanded ? 'visible' : ''}`}>
        <button className="fab-action" aria-label="Contact support">
          <div className="fab-action-icon">💬</div>
          <span className="fab-action-label">Support</span>
        </button>
        
        <button className="fab-action" aria-label="Start practice test">
          <div className="fab-action-icon">📝</div>
          <span className="fab-action-label">Practice</span>
        </button>
        
        <button className="fab-action" aria-label="View progress">
          <div className="fab-action-icon">📊</div>
          <span className="fab-action-label">Progress</span>
        </button>
        
        <button className="fab-action" aria-label="Settings">
          <div className="fab-action-icon">⚙️</div>
          <span className="fab-action-label">Settings</span>
        </button>
      </div>

      {/* Background overlay */}
      <div 
        className={`fab-overlay ${isExpanded ? 'visible' : ''}`}
        onClick={toggleExpanded}
      ></div>
    </div>
  );
};

export default FloatingActionButton;

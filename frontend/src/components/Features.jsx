import React from 'react';

const Features = () => {
  const features = [
    {
      icon: "🖥️",
      title: "Take recent actual IELTS Tests",
      description: "Real IELTS Listening and IELTS Reading tests... following the Cambridge IELTS book format.",
      color: "blue"
    },
    {
      icon: "👥",
      title: "Community-driven",
      description: "Created by our community of IELTS teachers, previous IELTS examiners and IELTS exam takers.",
      color: "green"
    },
    {
      icon: "📊",
      title: "Comprehensive analytics tool",
      description: "Allows you to set a target IELTS band score, analyse your progress and find how to improve.",
      color: "purple"
    },
    {
      icon: "📋",
      title: "View IELTS Score and Answer Explanations",
      description: "After taking our IELTS mock tests with real audio, you can check your Listening or Reading band score and view your answer sheets.",
      color: "orange"
    },
    {
      icon: "✅",
      title: "FREE to use",
      description: "Our online IELTS tests are always free. We are here to help users for study abroad, immigration and finding jobs.",
      color: "emerald"
    },
    {
      icon: "💬",
      title: "Increase your IELTS band score",
      description: "Using our online tests for IELTS preparation is proven to help students improve by 0.5 - 1.5.",
      color: "red"
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why use IELTS Online Tests?</h2>
          <p className="features-subtitle">Discover the advantages that make our platform the preferred choice for IELTS preparation</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card feature-card-${feature.color} hover-lift`}
            >
              <div className="feature-icon-container">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-icon-glow"></div>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

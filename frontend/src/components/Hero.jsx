import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Hero = ({ activeSlide }) => {
    const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const slideRefs = useRef([]);

  const contactRedirect = () => navigate('/contact');

  useEffect(() => {
    if (activeSlide !== null) {
      const slideMap = {
        'library': 0,
        'prep': 1
      };
      setCurrentSlide(slideMap[activeSlide] || 0);
    }
  }, [activeSlide]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const slides = [
    // Slide 0: IELTS Exam Library
    {
      leftContent: (
        
        <div className="hero-left animate-slide-in">
          <div className="title-container">
            <h1 className="hero-title">
              <span className="title-line">WE TAKE YOUR</span>
              <span className="title-line highlight gradient-text neon-glow">IELTS SCORE HIGHER</span>
            </h1>
          </div>
          <p className="hero-subtitle animate-fade-in-up">
            Get ready for your 2025 IELTS exam by practicing our 100+ IELTS mock tests for <span className="highlight">FREE</span>.
          </p>
          <div className="social-proof animate-fade-in-up shimmer">
            <div className="people-icons">
              <div className="person-icon blue floating magnetic"></div>
              <div className="person-icon green floating magnetic"></div>
            </div>
            <span className="social-text">28,000,000 students are using our free services.</span>
          </div>
          <button className="cta-button orange pulse-animation enhanced-button ripple"onClick={contactRedirect}>
            <span className="button-text">Contact us</span>
            <div className="button-glow"></div>
          </button>
        </div>
      ),
      rightContent: (
        <div className="hero-right animate-slide-in-right">
          <div className="student-illustration">
            <div className="student-figure floating">
              <div className="student-head"></div>
              <div className="student-body"></div>
              <div className="student-arms"></div>
              <div className="student-legs"></div>
              <div className="student-backpack"></div>
              <div className="student-book"></div>
            </div>
            <div className="main-arrow pulse-arrow"></div>
            <div className="background-arrows">
              <div className="arrow arrow1 floating-slow"></div>
              <div className="arrow arrow2 floating-slow"></div>
              <div className="arrow arrow3 floating-slow"></div>
            </div>
            <div className="floating-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 1: IELTS Prep
    {
      leftContent: (
        <div className="hero-left animate-slide-in">
          <div className="title-container">
            <h1 className="hero-title">
              <span className="title-line">MASTER</span>
              <span className="title-line highlight gradient-text neon-glow">IELTS PREP</span>
            </h1>
          </div>
          <p className="hero-subtitle animate-fade-in-up">
            Comprehensive preparation materials and strategies to help you achieve your target band score.
          </p>
          <div className="features-list">
            <div className="feature-item animate-feature-item glass hover-lift" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon magnetic">📚</div>
              <span>Study Materials</span>
            </div>
            <div className="feature-item animate-feature-item glass hover-lift" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon magnetic">🎯</div>
              <span>Practice Tests</span>
            </div>
            <div className="feature-item animate-feature-item glass hover-lift" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon magnetic">📊</div>
              <span>Progress Tracking</span>
            </div>
          </div>
          <button className="cta-button orange pulse-animation enhanced-button ripple"onClick={contactRedirect}>
            <span className="button-text">Contact us</span>
            <div className="button-glow"></div>
          </button>
        </div>
      ),
      rightContent: (
        <div className="hero-right animate-slide-in-right">
          <div className="prep-illustration">
            <div className="books-stack floating"></div>
            <div className="target-circle pulse-target"></div>
            <div className="progress-chart rotating"></div>
            <div className="floating-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
  <section
  className="hero relative mt-12 w-full min-h-screen md:min-h-[80vh] flex items-center justify-center overflow-hidden"
  ref={heroRef}
>
  {/* Background */}
  <div className="hero-background absolute inset-0">
    <div className="planet planet-1 floating-slow"></div>
    <div className="planet planet-2 floating"></div>
    <div className="stars twinkling"></div>
    <div className="dashed-lines moving"></div>
    <div className="gradient-overlay"></div>
    <div className="morphing-shape absolute top-[15%] left-[5%] opacity-30"></div>
    <div className="morphing-shape absolute top-[70%] right-[8%] opacity-20"></div>
  </div>

  {/* Main Content */}
  <div className="hero-container relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-12">
    <div
      className={`slide-content grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
        isAnimating ? "animating" : ""
      }`}
      key={currentSlide}
    >
      {/* Left Side */}
      <div className="hero-left text-center md:text-left space-y-6">
        {slides[currentSlide].leftContent}
      </div>

      {/* Right Side */}
      <div className="hero-right flex justify-center md:justify-end">
        {slides[currentSlide].rightContent}
      </div>
    </div>
  </div>

  {/* Navigation Arrows */}
  <button
    className="nav-arrow nav-arrow-left absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 sm:p-3 rounded-full"
    onClick={prevSlide}
  >
    <svg
      className="arrow-icon w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
  <button
    className="nav-arrow nav-arrow-right absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 sm:p-3 rounded-full"
    onClick={nextSlide}
  >
    <svg
      className="arrow-icon w-5 h-5 sm:w-6 sm:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>

  {/* Pagination Dots */}
  <div className="pagination-dots flex justify-center mt-6 absolute bottom-6 left-1/2 transform -translate-x-1/2 gap-2">
    {slides.map((_, index) => (
      <button
        key={index}
        className={`w-3 h-3 rounded-full ${
          index === currentSlide ? "bg-yellow-400" : "bg-white/40"
        }`}
        onClick={() => goToSlide(index)}
      />
    ))}
  </div>

  {/* Mouse Follow */}
  <div
    className="mouse-follow hidden md:block absolute w-16 h-16 rounded-full border border-white/20 pointer-events-none"
    style={{
      left: mousePosition.x,
      top: mousePosition.y,
    }}
  ></div>
</section>


  );
};

export default Hero;

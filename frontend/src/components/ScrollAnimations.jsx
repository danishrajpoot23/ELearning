import React, { useEffect, useRef, useState } from 'react';

const ScrollAnimations = ({ children, animation = 'fadeInUp', delay = 0, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasAnimated]);

  const getAnimationClass = () => {
    if (!isVisible) return '';
    
    const baseClass = `scroll-animate scroll-${animation}`;
    return delay > 0 ? `${baseClass} scroll-delay-${delay}` : baseClass;
  };

  return (
    <div ref={ref} className={getAnimationClass()}>
      {children}
    </div>
  );
};

export default ScrollAnimations;

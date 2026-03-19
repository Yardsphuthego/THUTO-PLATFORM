import { useEffect, useState } from 'react';
import '../styles/ScrollProgress.css';

export const ScrollProgress = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercentage(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  return (
    <div className="scroll-progress-container">
      <svg
        className="scroll-progress-wheel"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066cc" />
            <stop offset="50%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#4a3520" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="scroll-progress-bg"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="scroll-progress-fill"
          style={{
            strokeDashoffset: strokeDashoffset,
            strokeDasharray: circumference,
          }}
          stroke="url(#scrollGradient)"
        />
      </svg>
      
      {/* Percentage text */}
      <div className="scroll-progress-text">
        {Math.round(scrollPercentage)}%
      </div>
    </div>
  );
};

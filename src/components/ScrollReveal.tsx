'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  threshold?: number;
  duration?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  threshold = 0.1,
  duration = 1000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip client-side animation if prefers-reduced-motion is set
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only animate if it hasn't animated yet
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
          
          // Stop observing after animation
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, hasAnimated, threshold]);

  const getDirectionClass = () => {
    switch (direction) {
      case 'up':
        return styles.fromBottom;
      case 'down':
        return styles.fromTop;
      case 'left':
        return styles.fromRight;
      case 'right':
        return styles.fromLeft;
      case 'none':
        return styles.noTranslate;
      default:
        return styles.fromBottom;
    }
  };

  const animationStyle = {
    '--duration': `${duration}ms`,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      className={`
        ${styles.scrollReveal} 
        ${getDirectionClass()} 
        ${isVisible ? styles.visible : styles.hidden}
        ${className}
      `}
      style={animationStyle}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
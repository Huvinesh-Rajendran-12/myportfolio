'use client';

import React, { useEffect, useState } from 'react';
import styles from './VisitorCounter.module.css';
import { updateVisits, portfolioVisits } from './portfolioData';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  // Use state to ensure the component re-renders when the count changes
  const [visitorCount, setVisitorCount] = useState<number>(portfolioVisits || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track if component is mounted to avoid state updates after unmount
    let isMounted = true;
    
    const fetchAndUpdateVisits = async () => {
      try {
        setIsLoading(true);
        
        // First try to get count from API
        try {
          const response = await fetch('/api/visitors', {
            method: 'POST', // Use POST to increment
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (isMounted) {
              setVisitorCount(data.count);
              setIsLoading(false);
              setError(null);
              
              // Update local storage for fallback
              localStorage.setItem('portfolioVisits', data.count.toString());
              return; // Exit if API call succeeds
            }
          }
        } catch (apiError) {
          // API error - fall back to local storage
          console.warn('API error, falling back to local storage:', apiError);
        }
        
        // Fallback: Use localStorage via portfolioData if API fails
        if (isMounted) {
          updateVisits(); // This updates localStorage and portfolioVisits
          setVisitorCount(portfolioVisits);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error updating visitor count:', err);
          setError('Error updating count');
          setIsLoading(false);
        }
      }
    };

    // Call the function
    fetchAndUpdateVisits();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Format the visitor count with leading zeros
  const formattedCount = visitorCount.toString().padStart(6, '0');

  return (
    <div 
      className={`${styles.visitorCounter} ${className || ''} ${isLoading ? styles.loading : ''}`}
      aria-live="polite" 
      role="status"
    >
      <div className={styles.counterLabel}>
        {error ? 'CONNECTION ERROR' : 'ROBOT ONLINE!'}
      </div>
      <div className={styles.counterValue}>
        VISITORS: {isLoading ? '------' : formattedCount}
        {isLoading && <span className={styles.loadingDots}>.</span>}
      </div>
    </div>
  );
};

export default VisitorCounter;

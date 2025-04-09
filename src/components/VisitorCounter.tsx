'use client';

import React, { useEffect, useState } from 'react';
import styles from './VisitorCounter.module.css';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to increment visitor count
    const incrementVisitorCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        } else {
          console.error('Failed to increment visitor count');
          // Fallback to GET if POST fails
          await fetchVisitorCount();
        }
      } catch (error) {
        console.error('Error incrementing visitor count:', error);
        // Fallback to GET if POST fails
        await fetchVisitorCount();
      } finally {
        setIsLoading(false);
      }
    };

    // Function to fetch visitor count without incrementing
    const fetchVisitorCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/visitors');
        
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count);
        } else {
          console.error('Failed to fetch visitor count');
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only increment count once when component mounts
    // This ensures we don't count the same visitor multiple times during a session
    incrementVisitorCount();

    // No cleanup needed
  }, []);

  // Format the visitor count with leading zeros
  const formattedCount = visitorCount.toString().padStart(6, '0');

  return (
    <div className={`${styles.visitorCounter} ${className || ''}`}>
      <div className={styles.counterLabel}>ROBOT ONLINE!</div>
      <div className={styles.counterValue}>
        VISITORS: {isLoading ? '------' : formattedCount}
      </div>
    </div>
  );
};

export default VisitorCounter;

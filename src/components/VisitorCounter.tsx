'use client';

import React, { useEffect } from 'react';
import styles from './VisitorCounter.module.css';
import { updateVisits, portfolioVisits } from './portfolioData';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  useEffect(() => {
    // Only increment count once when component mounts
    // This ensures we don't count the same visitor multiple times during a session
    updateVisits();

    // No cleanup needed
  }, []);

  // Format the visitor count with leading zeros
  const formattedCount = portfolioVisits?.toString().padStart(6, '0') || '------';

  return (
    <div className={`${styles.visitorCounter} ${className || ''}`}>
      <div className={styles.counterLabel}>ROBOT ONLINE!</div>
      <div className={styles.counterValue}>
        VISITORS: {formattedCount}
      </div>
    </div>
  );
};

export default VisitorCounter;

'use client';

import React from 'react';
import styles from './VisitorCounter.module.css';
import { useVisitorCount } from '@/hooks/useVisitorCount';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  // Use our custom hook to handle visitor counting logic
  const { count, isLoading, error, hasInitialized } = useVisitorCount();
  
  // Format the visitor count with leading zeros
  const formattedCount = count.toString().padStart(6, '0');
  
  // Determine connection status text
  const connectionStatus = error 
    ? 'CONNECTION ERROR' 
    : hasInitialized 
      ? 'ROBOT ONLINE!' 
      : 'CONNECTING...';

  return (
    <div 
      className={`${styles.visitorCounter} ${className || ''} ${isLoading ? styles.loading : ''}`}
      aria-live="polite" 
      role="status"
    >
      <div className={styles.counterLabel}>
        {connectionStatus}
      </div>
      <div className={styles.counterValue}>
        VISITORS: {isLoading ? '------' : formattedCount}
        {isLoading && <span className={styles.loadingDots}>.</span>}
      </div>
    </div>
  );
};

export default VisitorCounter;
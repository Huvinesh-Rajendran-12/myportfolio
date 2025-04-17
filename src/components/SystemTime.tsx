'use client';

import React, { useState, useEffect } from 'react';
import styles from './SystemTime.module.css';

const SystemTime: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Initial check
    checkMobile();
    
    // Function to update the time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };
    
    // Update time immediately
    updateTime();
    
    // Set up interval to update time every second
    const interval = setInterval(updateTime, 1000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const toggleVisibility = () => {
    if (isMobile) {
      setIsVisible(!isVisible);
    }
  };
  
  return (
    <div 
      className={`${styles.systemTime} ${!isVisible ? styles.hidden : ''} ${isMobile ? styles.mobileTime : ''}`}
      onClick={toggleVisibility}
      aria-label="System time"
      role="status"
    >
      <span className={styles.timeDisplay}>{time}</span>
    </div>
  );
};

export default SystemTime;
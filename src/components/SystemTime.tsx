import React, { useState, useEffect } from 'react';
import styles from './SystemTime.module.css';

const SystemTime: React.FC = () => {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
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
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={styles.systemTime}>
      <span className={styles.timeDisplay}>{time}</span>
    </div>
  );
};

export default SystemTime;

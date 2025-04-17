'use client';

import React, { useState, useEffect } from 'react';
import { soundEffects } from '@/utils/SoundEffects';
import styles from './SoundToggle.module.css';

interface SoundToggleProps {
  className?: string;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ className }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Initialize state from the sound effects utility
    setSoundEnabled(soundEffects.isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const newState = soundEffects.toggleSound();
    setSoundEnabled(newState);
    
    // Play a sound if we're enabling sounds
    if (newState) {
      soundEffects.play('click', 0.3);
    }
  };

  return (
    <button 
      className={`${styles.soundToggle} ${className || ''}`} 
      onClick={toggleSound}
      aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
      aria-pressed={soundEnabled}
    >
      {soundEnabled ? (
        <div className={styles.soundOn}>
          <span className={styles.soundIcon} aria-hidden="true">🔊</span>
          <span className={styles.soundLabel}>SOUND ON</span>
        </div>
      ) : (
        <div className={styles.soundOff}>
          <span className={styles.soundIcon} aria-hidden="true">🔇</span>
          <span className={styles.soundLabel}>SOUND OFF</span>
        </div>
      )}
    </button>
  );
};

export default SoundToggle;

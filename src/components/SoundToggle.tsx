'use client';

import React, { useState, useEffect } from 'react';
import { soundEffects } from '@/utils/SoundEffects';
import styles from './SoundToggle.module.css';

const SoundToggle: React.FC = () => {
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
    <div className={styles.soundToggle} onClick={toggleSound}>
      {soundEnabled ? (
        <div className={styles.soundOn} title="Sound On">
          <span className={styles.soundIcon}>🔊</span>
        </div>
      ) : (
        <div className={styles.soundOff} title="Sound Off">
          <span className={styles.soundIcon}>🔇</span>
        </div>
      )}
    </div>
  );
};

export default SoundToggle;

'use client';

import React, { useState, useEffect } from 'react';
import styles from './IntroScreen.module.css';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "The Computer of Huvinesh Rajendran";
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  
  // Type out the text one character at a time
  useEffect(() => {
    if (text.length < fullText.length) {
      const timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, 100); // Typing speed
      return () => clearTimeout(timer);
    } else {
      // Show the "Press ENTER" prompt after the text is fully typed
      const timer = setTimeout(() => {
        setShowEnterPrompt(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [text]);
  
  // Listen for the Enter key press to continue
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showEnterPrompt) {
        onComplete();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showEnterPrompt, onComplete]);

  return (
    <div className={styles.introScreen}>
      <div className={styles.introContent}>
        <div className={styles.introText}>{text}<span className={styles.cursorBlink}>|</span></div>
        {showEnterPrompt && (
          <div className={styles.enterPrompt}>
            Press <kbd>ENTER</kbd> to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroScreen;

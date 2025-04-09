'use client';

import React, { useState, useEffect } from 'react';
import styles from './IntroScreen.module.css';
import { soundEffects } from '@/utils/SoundEffects';
import PixelRobot from './PixelRobot';
import VisitorCounter from './VisitorCounter';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "The Computer of Huvinesh Rajendran";
  const [showEnterPrompt, setShowEnterPrompt] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  
  // Set up continuous typing sound effect
  useEffect(() => {
    let typingSoundInterval: NodeJS.Timeout | null = null;
    
    // Start typing sound if text is still being typed
    if (text.length < fullText.length) {
      // Play initial sound
      soundEffects.play('keypress', 0.15);
      
      // Set up interval for continuous typing sound
      typingSoundInterval = setInterval(() => {
        if (text.length < fullText.length) {
          soundEffects.play('keypress', 0.15);
        }
      }, 150); // Slightly faster than typing speed for a continuous effect
    }
    
    // Clean up interval when component unmounts or text is fully typed
    return () => {
      if (typingSoundInterval) {
        clearInterval(typingSoundInterval);
      }
    };
  }, [text.length, fullText.length]);

  // Type out the text one character at a time
  useEffect(() => {
    if (text.length < fullText.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, 100); // Typing speed
      return () => clearTimeout(timer);
    } else {
      // Text is fully typed, stop the typing animation
      setIsTyping(false);
      
      // Show the "Press ENTER" prompt after the text is fully typed
      const timer = setTimeout(() => {
        setShowEnterPrompt(true);
        // Play a sound when the prompt appears
        soundEffects.play('enter', 0.4);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [text]);
  
  // Listen for the Enter key press to continue
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && showEnterPrompt) {
        soundEffects.play('startup', 0.5);
        onComplete();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showEnterPrompt, onComplete]);

  return (
    <div className={styles.introScreen} onClick={() => {
      if (showEnterPrompt) {
        soundEffects.play('startup', 0.5);
        onComplete();
      }
    }}>
      {/* Visitor counter in the top right corner */}
      <VisitorCounter className={styles.introVisitorCounter} />
      
      <div className={styles.introContent}>
        {/* Robot walk area positioned above the text */}
        <div className={styles.robotWalkArea}>
          <PixelRobot pose="idle" isTyping={isTyping} />
        </div>
        
        <div className={styles.introText}>{text}<span className={styles.cursorBlink}>|</span></div>
        {showEnterPrompt && (
          <div className={styles.enterPrompt}>
            Press <kbd>ENTER</kbd> or <kbd>TAP SCREEN</kbd> to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroScreen;

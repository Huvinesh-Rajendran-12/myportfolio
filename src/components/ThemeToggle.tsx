'use client';

import React, { useEffect } from 'react';
import { useTheme, ThemeMode } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  // Theme icons and labels
  const themeData: Record<ThemeMode, { icon: string; label: string }> = {
    synthwave: { icon: '🌆', label: 'SYNTHWAVE' },
    cyberpunk: { icon: '🌐', label: 'CYBERPUNK' },
    terminal: { icon: '💻', label: 'TERMINAL' },
  };

  // Listen for keyboard shortcut 'T' to toggle theme
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only proceed if the user isn't typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check if 'T' is pressed
      if (event.key.toLowerCase() === 't') {
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme]);

  // Get current theme data
  const currentTheme = themeData[theme];

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${className || ''}`}
      aria-label={`Switch theme, currently ${currentTheme.label}`}
    >
      <span className={styles.themeIcon} aria-hidden="true">
        {currentTheme.icon}
      </span>
      <span className={styles.themeLabel}>{currentTheme.label}</span>
    </button>
  );
};

export default ThemeToggle;
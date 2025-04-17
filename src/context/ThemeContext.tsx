'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { soundEffects } from '@/utils/SoundEffects';

// Theme options
export type ThemeMode = 'synthwave' | 'cyberpunk' | 'terminal';

// Theme context props
interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Create theme context with default values
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'synthwave',
  setTheme: () => {},
  toggleTheme: () => {},
});

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use localStorage to persist theme preference (default to synthwave)
  const [theme, setTheme] = useState<ThemeMode>('synthwave');

  // Initialize theme from localStorage on client-side only
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolioTheme') as ThemeMode | null;
    if (savedTheme && ['synthwave', 'cyberpunk', 'terminal'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Update localStorage and apply CSS class when theme changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem('portfolioTheme', theme);
      
      // Remove existing theme classes
      document.documentElement.classList.remove('theme-synthwave', 'theme-cyberpunk', 'theme-terminal');
      
      // Add new theme class
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => {
    soundEffects.play('click', 0.3);
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case 'synthwave':
          return 'cyberpunk';
        case 'cyberpunk':
          return 'terminal';
        case 'terminal':
          return 'synthwave';
        default:
          return 'synthwave';
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
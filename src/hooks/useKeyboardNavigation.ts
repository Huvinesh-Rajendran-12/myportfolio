'use client';

import { useEffect } from 'react';
import { soundEffects } from '@/utils/SoundEffects';

interface UseKeyboardNavigationProps {
  sectionShortcuts: Record<string, string>;
  activeSection: string;
  setActiveSection: (section: string) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  setIsContentLoading: (isLoading: boolean) => void;
}

/**
 * Custom hook to handle keyboard navigation for portfolio sections
 */
export const useKeyboardNavigation = ({
  sectionShortcuts,
  activeSection,
  setActiveSection,
  showHelp,
  setShowHelp,
  setIsContentLoading,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if user is typing in an input field or text area
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't intercept typing in form elements
      }

      const key = event.key.toLowerCase();

      // Handle F1 key for help panel
      if (key === 'f1') {
        // Prevent default browser behavior for F1
        event.preventDefault();
        soundEffects.play('click', 0.3);
        setShowHelp((prev) => !prev);
        return;
      }

      // Handle ESC key to close help panel
      if (key === 'escape' && showHelp) {
        setShowHelp(false);
        soundEffects.play('click', 0.3);
        return;
      }

      // Check if the pressed key matches any of our shortcuts
      if (sectionShortcuts[key]) {
        // Don't navigate if we're already on this section
        if (sectionShortcuts[key] === activeSection) return;

        // Play navigation sound
        soundEffects.play('click', 0.3);

        // Set loading state to true to trigger robot walking animation
        setIsContentLoading(true);

        // Change section after a short delay to show the loading animation
        setTimeout(() => {
          setActiveSection(sectionShortcuts[key]);

          // After a delay, set loading to false
          setTimeout(() => {
            setIsContentLoading(false);
          }, 800);
        }, 200);

        // If help panel is open, close it
        if (showHelp) {
          setShowHelp(false);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    sectionShortcuts,
    activeSection,
    setActiveSection,
    showHelp,
    setShowHelp,
    setIsContentLoading,
  ]);

  // No return value needed as this is a side-effect hook
};
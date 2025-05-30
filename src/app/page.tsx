'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PixelRobot from '@/components/PixelRobot';
import ContentDisplay from '@/components/ContentDisplay';
import Navigation from '@/components/Navigation';
import IntroScreen from '@/components/IntroScreen';
import SoundToggle from '@/components/SoundToggle';
import SystemTime from '@/components/SystemTime';
import ThemeToggle from '@/components/ThemeToggle';
import VisitorAdminTool from '@/components/VisitorAdminTool';
import { portfolioData, sectionKeys } from '@/components/portfolioData'; // Import data and keys
import { soundEffects } from '@/utils/SoundEffects'; // Import sound effects
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'; // Import custom hook

export default function Home() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('about'); // Default section
  // State for showing/hiding keyboard shortcut help
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);
  // State to track when content is loading/changing
  const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
  // State to track when text is being typed
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  // Preload all sounds when the component mounts
  useEffect(() => {
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      soundEffects.preloadAllSounds();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to handle completion of intro screen
  const handleIntroComplete = () => {
    setShowIntro(false);
    // Play startup sound when entering the main interface
    soundEffects.play('startup', 0.4);
  };

  const handleNavigate = (sectionId: string) => {
    // Set loading state to true to trigger robot walking animation
    setIsContentLoading(true);
    
    // Play navigation sound when changing sections
    soundEffects.play('click', 0.3);
    
    // Change section after a short delay to show the loading animation
    setTimeout(() => {
      setActiveSection(sectionId);
      
      // After a delay, set loading to false
      setTimeout(() => {
        setIsContentLoading(false);
      }, 800);
    }, 200);
  };
  
  // Toggle keyboard help panel
  const toggleKeyboardHelp = () => {
    setShowKeyboardHelp(prev => !prev);
    // Play sound when toggling help panel
    soundEffects.play('click', 0.3);
  };

  // Get current section data based on activeSection
  const currentSectionData = useMemo(() => {
    return portfolioData[activeSection] || portfolioData['about']; // Fallback to about
  }, [activeSection]);

  // Determine robot pose based on active section
  const robotPose = useMemo(() => {
    switch(activeSection) {
        case 'skills': return 'think';
        case 'projects': return 'present';
        case 'contact': return 'wave';
        case 'experience': return 'present';
        case 'education': return 'think';
        default: return 'idle';
    }
  }, [activeSection]);

  // Define keyboard shortcuts
  const keyboardShortcuts: Record<string, string> = {
    'a': 'about',
    's': 'skills',
    'p': 'projects',
    'c': 'contact',
    'e': 'experience',
    'd': 'education'
  };
  
  // Use our custom keyboard navigation hook
  useKeyboardNavigation({
    sectionShortcuts: keyboardShortcuts,
    activeSection,
    setActiveSection,
    showHelp: showKeyboardHelp,
    setShowHelp: setShowKeyboardHelp,
    setIsContentLoading,
  });



  return (
    <>
      {/* Admin Tool for Visitor Count (only shown in development or with ?admin=true) */}
      <VisitorAdminTool />
      
      {/* Show intro screen if in intro state */}
      {showIntro ? (
        <IntroScreen onComplete={handleIntroComplete} />
      ) : (
        <>
          {/* Circuit glow effect for background */}
          <div className="circuit-glow"></div>
          <div className="vintage-monitor-container">
            
            {/* Monitor bezel with old-school design */}
            <div className="monitor-bezel">
              {/* Monitor brand label */}
              <div className="monitor-brand">PIXELTRON 2000</div>
              
              {/* Power section */}
              <div className="power-section">
                <div className="power-button">
                  <div className="power-indicator"></div>
                </div>
                <div className="power-label">POWER</div>
              </div>
              
              {/* Monitor controls */}
              <div className="monitor-controls">
                <div className="control-knob brightness"></div>
                <div className="control-knob contrast"></div>
                <div className="control-labels">
                  <div>BRIGHT</div>
                  <div>CNTRST</div>
                </div>
              </div>
              
              {/* The actual screen */}
              <div className="crt-screen">
                <div className="scanline"></div>
                <div className="glare"></div>
                {/* System time display in the top right corner */}
                <SystemTime />
                <div className="screen">
                  <ContentDisplay 
                    content={currentSectionData.content}
                    onTypingStateChange={setIsTyping} 
                  />
                </div>
                {/* Render Pixel Robot with the determined pose */}
                <PixelRobot pose={robotPose} isTyping={isContentLoading || isTyping} />
              </div>
            </div>
            
            {/* Navigation panel below the monitor */}
            <div className="monitor-panel">
              <Navigation
                activeSection={activeSection}
                onNavigate={handleNavigate}
                sections={sectionKeys} // Pass section keys to generate buttons
              />
              
              {/* Keyboard shortcuts button and panel */}
              <div className="controls-container">
                <button 
                  onClick={toggleKeyboardHelp}
                  className="keyboard-help-button"
                  aria-expanded={showKeyboardHelp}
                >
                  [F1] Help
                </button>
                
                {/* Add theme toggle button */}
                <ThemeToggle />
                
                {showKeyboardHelp && (
                  <div className="keyboard-help-panel" role="dialog" aria-label="Keyboard shortcuts">
                    <div className="help-panel-header">
                      <h3>Keyboard Shortcuts</h3>
                      <button 
                        onClick={toggleKeyboardHelp} 
                        className="close-help-btn"
                        aria-label="Close keyboard shortcuts panel"
                      >
                        X
                      </button>
                    </div>
                    <div className="help-panel-content">
                      <table className="shortcuts-table">
                        <tbody>
                          <tr>
                            <td className="key">A</td>
                            <td className="desc">About section</td>
                          </tr>
                          <tr>
                            <td className="key">S</td>
                            <td className="desc">Skills section</td>
                          </tr>
                          <tr>
                            <td className="key">P</td>
                            <td className="desc">Projects section</td>
                          </tr>
                          <tr>
                            <td className="key">C</td>
                            <td className="desc">Contact section</td>
                          </tr>
                          <tr>
                            <td className="key">E</td>
                            <td className="desc">Experience section</td>
                          </tr>
                          <tr>
                            <td className="key">D</td>
                            <td className="desc">Education section</td>
                          </tr>
                          <tr>
                            <td className="key">F1</td>
                            <td className="desc">Toggle this help panel</td>
                          </tr>
                          <tr>
                            <td className="key">T</td>
                            <td className="desc">Toggle theme</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="help-panel-footer">
                      Press any key to navigate. Press ESC to close this panel.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

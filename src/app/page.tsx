'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PixelRobot from '@/components/PixelRobot';
import ContentDisplay from '@/components/ContentDisplay';
import Navigation from '@/components/Navigation';
import IntroScreen from '@/components/IntroScreen';
import { portfolioData, sectionKeys } from '@/components/portfolioData'; // Import data and keys

export default function Home() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('about'); // Default section
  // State for showing/hiding keyboard shortcut help
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);
  
  // Function to handle completion of intro screen
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
  };
  
  // Toggle keyboard help panel
  const toggleKeyboardHelp = () => {
    setShowKeyboardHelp(prev => !prev);
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

  // Keyboard shortcut handler
  useEffect(() => {
    // Map section keys to their keyboard shortcuts
    const keyboardShortcuts: Record<string, string> = {
      'a': 'about',
      's': 'skills',
      'p': 'projects',
      'c': 'contact',
      'e': 'experience',
      'd': 'education'
    };
    
    // Handle keyboard shortcuts
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if user is typing in an input field or text area
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't intercept typing in form elements
      }
      
      const key = event.key.toLowerCase();
      
      // Handle F1 key for help panel
      if (key === 'f1' || key === 'escape') {
        // Prevent default browser behavior for F1
        event.preventDefault();
        
        if (key === 'f1') {
          // Toggle help panel
          setShowKeyboardHelp(prev => !prev);
        } else if (key === 'escape' && showKeyboardHelp) {
          // Close help panel on ESC
          setShowKeyboardHelp(false);
        }
        return;
      }
      
      // Check if the pressed key matches any of our shortcuts
      if (keyboardShortcuts[key]) {
        setActiveSection(keyboardShortcuts[key]);
        // If help panel is open, close it
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        }
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showKeyboardHelp]); // Add showKeyboardHelp to the dependency array



  return (
    <>
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
                <div className="screen">
                  <ContentDisplay content={currentSectionData.content} />
                </div>
                {/* Render Pixel Robot with the determined pose */}
                <PixelRobot pose={robotPose} />
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
              <div className="keyboard-shortcuts-container">
                <button 
                  onClick={toggleKeyboardHelp}
                  className="keyboard-help-button"
                >
                  [F1] Help
                </button>
                
                {showKeyboardHelp && (
                  <div className="keyboard-help-panel">
                    <div className="help-panel-header">
                      <h3>Keyboard Shortcuts</h3>
                      <button onClick={toggleKeyboardHelp} className="close-help-btn">X</button>
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

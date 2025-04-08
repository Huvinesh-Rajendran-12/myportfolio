'use client';

import React, { useState, useMemo } from 'react';
import PixelRobot from '@/components/PixelRobot';
import ContentDisplay from '@/components/ContentDisplay';
import Navigation from '@/components/Navigation';
import { portfolioData, sectionKeys } from '@/components/portfolioData'; // Import data and keys

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>('about'); // Default section

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
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
        default: return 'idle';
    }
  }, [activeSection]);

  return (
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
      </div>
    </div>
  );
}

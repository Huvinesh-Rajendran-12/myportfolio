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
    // Use Tailwind classes for layout if preferred, or rely on globals.css
    <div className="crt-monitor">
      <div className="screen">
        <ContentDisplay content={currentSectionData.content} />
      </div>
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        sections={sectionKeys} // Pass section keys to generate buttons
      />
      <PixelRobot pose={robotPose} />
    </div>
  );
}

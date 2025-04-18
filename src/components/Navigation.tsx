'use client';

import React from 'react';
import { soundEffects } from '@/utils/SoundEffects';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  sections: string[]; // Pass section keys for button generation
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate, sections }) => {
  // Map section names to their 90s button icons
  const getButtonIcon = (section: string) => {
    switch(section) {
      case 'about': return '📋';
      case 'skills': return '💾';
      case 'projects': return '🔬';
      case 'contact': return '📨';
      case 'experience': return '💼';
      case 'education': return '🎓';
      default: return '📎';
    }
  };
  
  return (
    <div className="retro-navigation">
      {/* Responsive navigation grid for better mobile experience */}
      <div className="nav-grid">
        {sections.map((sectionId) => (
          <div 
            key={sectionId}
            className={`nav-button ${activeSection === sectionId ? 'active-nav' : ''}`}
            onClick={() => {
              // Play sound but don't let errors block navigation
              soundEffects.play('navigate');
              // Always navigate regardless of sound playback
              onNavigate(sectionId);
            }}
          >
            <div className="nav-icon">{getButtonIcon(sectionId)}</div>
            <div className="nav-text">
              {/* Classic 90s text-based navigation with hotkey markers */}
              [<span className="hotkey">{sectionId.charAt(0).toUpperCase()}</span>]
              {sectionId.slice(1).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Classic 90s rings/bullets navigation */}
      {/* <div className="text-navigation">
        {sections.map((sectionId, index) => (
          <React.Fragment key={sectionId}>
            <span 
              className={`text-nav-item ${activeSection === sectionId ? 'active-text-nav' : ''}`}
              onClick={() => onNavigate(sectionId)}
            >
              {sectionId.toUpperCase()}
            </span>
            {index < sections.length - 1 && <span className="nav-separator"> :: </span>}
          </React.Fragment>
        ))}
      </div> */}
    </div>
  );
};

export default Navigation;

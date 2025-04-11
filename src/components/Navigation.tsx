'use client';

import React from 'react';
import { soundEffects } from '@/utils/SoundEffects';
import portfolioJSON from '../data/portfolio.json';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  sections: string[]; // Pass section keys for button generation
}

// Helper function to get section display order from portfolio.json
const getSectionDisplayOrder = (sectionId: string): number => {
  // Define the type for sections in portfolio.json
  interface PortfolioSection {
    title: string;
    displayOrder: number;
    icon: string;
    content: unknown;
  }

  // For sections defined in portfolio.json sections object
  const sections = portfolioJSON.sections as Record<string, PortfolioSection>;
  if (sections[sectionId]?.displayOrder !== undefined) {
    return sections[sectionId].displayOrder;
  }
  
  // For sections defined at the root level (experience, education)
  switch(sectionId) {
    case 'experience': return 4;
    case 'education': return 5;
    default: return 999; // Default high number for unknown sections
  }
};

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
        {/* Sort sections based on displayOrder in portfolio.json */}
        {[...sections].sort((a, b) => {
          // Strictly use displayOrder from portfolio.json
          return getSectionDisplayOrder(a) - getSectionDisplayOrder(b);
        }).map((sectionId) => (
          <div 
            key={sectionId}
            className={`nav-button ${activeSection === sectionId ? 'active-nav' : ''}`}
            onClick={() => {
              // Play sound but don't let errors block navigation
              soundEffects.play('navigate', 0.3);
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
    </div>
  );
};

export default Navigation;

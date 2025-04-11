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
    <nav className="retro-navigation" role="navigation" aria-label="Main Navigation">
      <div className="nav-grid">
        {[...sections].sort((a, b) => {
          return getSectionDisplayOrder(a) - getSectionDisplayOrder(b);
        }).map((sectionId) => (
          <div 
            key={sectionId}
            className={`nav-button ${activeSection === sectionId ? 'active-nav' : ''}`}
            onClick={() => {
              soundEffects.play('navigate', 0.3);
              onNavigate(sectionId);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                soundEffects.play('navigate', 0.3);
                onNavigate(sectionId);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={activeSection === sectionId}
            aria-label={`${sectionId.charAt(0).toUpperCase()}${sectionId.slice(1)} section`}
          >
            <div className="nav-icon" aria-hidden="true">{getButtonIcon(sectionId)}</div>
            <div className="nav-text">
              [<span className="hotkey">{sectionId.charAt(0).toUpperCase()}</span>]
              {sectionId.slice(1).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

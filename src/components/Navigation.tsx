'use client';

import React from 'react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  sections: string[]; // Pass section keys for button generation
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate, sections }) => {
  return (
    <nav className="navigation-container">
      {sections.map((sectionId) => (
        <button
          key={sectionId}
          className={`nav-button ${activeSection === sectionId ? 'active' : ''}`}
          onClick={() => onNavigate(sectionId)}
        >
          {/* Capitalize first letter for display */}
          {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;

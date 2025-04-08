'use client';

import React from 'react';

interface UIButtonsProps {
  onNavigate: (sectionId: string) => void;
}

const UIButtons: React.FC<UIButtonsProps> = ({ onNavigate }) => {
  return (
    <div id="ui-buttons" className="absolute bottom-[25px] left-1/2 -translate-x-1/2 z-10 flex gap-3 bg-black/70 p-[10px_20px] rounded-[5px] border border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.5)]">
      <button className="ui-button" onClick={() => onNavigate('about')}>About</button>
      <button className="ui-button" onClick={() => onNavigate('chest')}>Skills</button> {/* Trigger chest/skills */}
      <button className="ui-button" onClick={() => onNavigate('projects')}>Projects</button>
      <button className="ui-button" onClick={() => onNavigate('contact')}>Contact</button>
    </div>
  );
};

// Inline styles for .ui-button (since globals.css might not cover everything in components)
// Or ideally, define these in globals.css if possible
const buttonStyle = `
  .ui-button {
    padding: 8px 16px;
    border-radius: 3px;
    background-color: #333;
    color: #00ffff; /* Neon Cyan text */
    font-weight: normal;
    font-size: 13px;
    font-family: var(--font-press-start-2p); /* Use CSS variable */
    border: 1px solid #555;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    text-transform: uppercase;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
  }
  .ui-button:hover {
    background-color: #555;
    color: #ff00ff; /* Neon Pink hover text */
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.6);
  }
  .ui-button:active {
    transform: scale(0.95);
  }
`;

// Inject styles - This is a simple way, consider CSS Modules or Tailwind plugins for better scoping
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = buttonStyle;
    document.head.appendChild(styleSheet);
}


export default UIButtons;


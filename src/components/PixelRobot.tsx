'use client';

import React, { useEffect, useState } from 'react';

interface PixelRobotProps {
  pose: string; // e.g., 'idle', 'think', 'wave', 'present'
}

const PixelRobot: React.FC<PixelRobotProps> = ({ pose }) => {
  // Retro 90s style: Add blinking text effect
  const [blink, setBlink] = useState<boolean>(true);
  const [visitorCount] = useState<number>(Math.floor(Math.random() * 12345) + 1000);

  // Classic blinking text effect from the 90s
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Determine the full class name based on the pose prop
  const robotClassName = `robot-container pose-${pose}`;

  return (
    <div className="retro-robot-wrapper">
      {/* Classic 90s "under construction" and visitor counter */}
      <div className="retro-elements">
        <div className="construction-sign">
          <span className={blink ? 'blink-text' : ''}>ROBOT ONLINE!</span>
        </div>
        <div className="visitor-counter">
          <span>VISITORS: {visitorCount.toString().padStart(6, '0')}</span>
        </div>
      </div>

      {/* The pixel robot */}
      <div className={robotClassName}>
         <div className="robot-part robot-antenna-base"></div>
         <div className="robot-part robot-antenna-tip"></div>
         <div className="robot-part robot-head">
             <div className="robot-part robot-eye"></div>
         </div>
         <div className="robot-part robot-torso">
             <div className="robot-part robot-chest-light"></div>
         </div>
         <div className="robot-part robot-leg-left"></div>
         <div className="robot-part robot-leg-right"></div>
         {/* Simple arm for pointing/waving - controlled by pose class */}
         <div className="robot-part robot-arm-right"></div>
      </div>
    </div>
  );
};

export default PixelRobot;

'use client';

import React from 'react';

interface PixelRobotProps {
  pose: string; // e.g., 'idle', 'think', 'wave', 'present'
}

const PixelRobot: React.FC<PixelRobotProps> = ({ pose }) => {
  // Determine the full class name based on the pose prop
  const robotClassName = `robot-container pose-${pose}`;

  return (
    <div id="robot-container" className={robotClassName}> {/* Use className from prop */}
         <div id="robot-antenna-base" className="robot-part"></div>
         <div id="robot-antenna-tip" className="robot-part"></div>
         <div id="robot-head" className="robot-part">
             <div id="robot-eye" className="robot-part"></div>
         </div>
         <div id="robot-torso" className="robot-part">
             <div id="robot-chest-light" className="robot-part"></div>
         </div>
         <div id="robot-leg-left" className="robot-part"></div>
         <div id="robot-leg-right" className="robot-part"></div>
         {/* Simple arm for pointing/waving - controlled by pose class */}
         <div id="robot-arm-right" className="robot-part"></div>
    </div>
  );
};

export default PixelRobot;

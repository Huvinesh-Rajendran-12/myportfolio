'use client';

import React, { useEffect, useState } from 'react';

interface PixelRobotProps {
  pose: string; // e.g., 'idle', 'think', 'wave', 'present'
  isTyping?: boolean; // Whether text is currently being generated
}

const PixelRobot: React.FC<PixelRobotProps> = ({ pose, isTyping = false }) => {
  // State for robot walking animation
  const [walkPosition, setWalkPosition] = useState<number>(0);
  const [walkDirection, setWalkDirection] = useState<number>(1); // 1 for right, -1 for left
  
  // Walking animation when text is being generated
  useEffect(() => {
    if (!isTyping) {
      // Reset position when not typing
      setWalkPosition(0);
      return;
    }
    
    const walkInterval = setInterval(() => {
      setWalkPosition(prevPos => {
        // Calculate new position
        const newPos = prevPos + (walkDirection * 5);
        
        // Change direction if reaching screen edges
        if (newPos > 70) {
          setWalkDirection(-1);
          return 70;
        } else if (newPos < 0) {
          setWalkDirection(1);
          return 0;
        }
        
        return newPos;
      });
    }, 200); // Update position every 200ms for smooth walking
    
    return () => clearInterval(walkInterval);
  }, [isTyping, walkDirection]);

  // Determine the full class name based on the pose prop and typing state
  const robotClassName = `robot-container pose-${pose} ${isTyping ? 'walking' : ''}`;
  
  // Calculate the style for positioning during walking
  const robotStyle = {
    transform: isTyping ? `translateX(${walkPosition}%)` : 'none'
  };

  return (
    <div className="retro-robot-wrapper">
      {/* Robot container */}

      {/* The pixel robot */}
      <div className={robotClassName} style={robotStyle}>
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

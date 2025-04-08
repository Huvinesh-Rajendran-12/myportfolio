'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ContentDisplayProps {
  content: string; // HTML content string
  speed?: number;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, speed = 5 }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isNewContent, setIsNewContent] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null); // Ref to scroll parent
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for timeout
  
  // Last updated date - classic 90s element
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Clear previous animation on content change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayedContent(''); // Clear immediately
    setShowCursor(true); // Show cursor at start

    let i = 0;
    let currentHtml = '';
    let tagBuffer = '';
    let isTag = false;

    function type() {
      if (i < content.length) {
        const char = content.charAt(i);

        if (char === '<') {
          isTag = true;
          tagBuffer += char;
        } else if (char === '>') {
          isTag = false;
          tagBuffer += char;
          currentHtml += tagBuffer; // Append whole tag
          setDisplayedContent(currentHtml);
          tagBuffer = '';
        } else if (isTag) {
          tagBuffer += char;
        } else {
          currentHtml += char; // Append character
          setDisplayedContent(currentHtml);
        }

        i++;
        // Scroll to bottom logic
        if (contentRef.current) {
            const screenElement = contentRef.current.parentElement; // Assuming parent is .screen
            if (screenElement) {
                screenElement.scrollTop = screenElement.scrollHeight;
            }
        }

        timeoutRef.current = setTimeout(type, speed);
      } else {
        // Typing finished
        setShowCursor(true); // Keep cursor visible
        console.log("Typing finished.");
      }
    }

    // Start typing after a brief delay
    timeoutRef.current = setTimeout(type, 50);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed]); // Rerun effect when content or speed changes

  // Use isNewContent to show loading message
  useEffect(() => {
    setIsNewContent(true);
    const timer = setTimeout(() => {
      setIsNewContent(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [content]);
  
  return (
    <div ref={contentRef} className="content-area retro-content">
      {/* Classic 90s marquee and divider */}
      {/* <div className="retro-header">
        <div className="retro-marquee">
          ★ WELCOME TO MY WEB ZONE ★ BEST VIEWED WITH NETSCAPE NAVIGATOR 3.0 ★
        </div>
        <div className="retro-divider">===================================</div>
      </div> */}
      
      {/* Loading message - classic 90s element */}
      {isNewContent && (
        <div className="loading-message">Loading... please wait...</div>
      )}
      
      {/* Main content area with typewriter effect */}
      <div dangerouslySetInnerHTML={{ __html: displayedContent }} />
      {showCursor && <span className="cursor"></span>}
      
      {/* Classic 90s footer with counter and last updated */}
      <div className="retro-footer">
        <div className="last-updated">Page Last Updated: {lastUpdated}</div>
      </div>
    </div>
  );
};

export default ContentDisplay;

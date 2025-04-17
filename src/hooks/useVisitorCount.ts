'use client';

import { useState, useEffect } from 'react';

interface UseVisitorCountReturn {
  count: number;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

/**
 * Custom hook to handle visitor count functionality
 * - Fetches count from API
 * - Falls back to localStorage if API fails
 * - Updates localStorage with newest count
 */
export function useVisitorCount(): UseVisitorCountReturn {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    // Get cached count first for immediate display
    const cachedCount = localStorage.getItem('visitorCount');
    if (cachedCount && isMounted) {
      setCount(parseInt(cachedCount, 10));
    }
    
    const fetchVisitorCount = async () => {
      try {
        setIsLoading(true);
        
        // Try to increment with POST first
        try {
          const response = await fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            cache: 'no-store'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (isMounted) {
              setCount(data.count);
              setError(null);
              
              // Update localStorage with latest count from server
              localStorage.setItem('visitorCount', data.count.toString());
              
              // Show loading indicator for at least 800ms for visual feedback
              setTimeout(() => {
                if (isMounted) {
                  setIsLoading(false);
                  setHasInitialized(true);
                }
              }, 800);
              return;
            }
          } else {
            throw new Error(`API returned status: ${response.status}`);
          }
        } catch (apiError) {
          // Only log the error if it's not due to aborting the request
          if (!(apiError instanceof DOMException && apiError.name === 'AbortError')) {
            console.warn('API error, using cached count:', apiError);
          }
          
          // If we have a cached count, use it
          if (cachedCount && isMounted) {
            setIsLoading(false);
            setHasInitialized(true);
          } else {
            // If no cached count, try the GET endpoint as fallback
            try {
              const getResponse = await fetch('/api/visitors', {
                method: 'GET',
                signal: controller.signal,
                cache: 'no-store'
              });
              
              if (getResponse.ok) {
                const data = await getResponse.json();
                if (isMounted) {
                  setCount(data.count);
                  localStorage.setItem('visitorCount', data.count.toString());
                  setIsLoading(false);
                  setHasInitialized(true);
                }
              } else {
                throw new Error(`GET API returned status: ${getResponse.status}`);
              }
            } catch (getError) {
              // Only log if not aborted
              if (!(getError instanceof DOMException && getError.name === 'AbortError')) {
                // Both API calls failed
                console.error('Failed to retrieve visitor count:', getError);
                setError('CONNECTION ERROR');
                setIsLoading(false);
                setHasInitialized(true);
              }
            }
          }
        }
      } catch (err) {
        if (isMounted && !(err instanceof DOMException && err.name === 'AbortError')) {
          console.error('Error handling visitor count:', err);
          setError('CONNECTION ERROR');
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    // Call the function
    fetchVisitorCount();
    
    // Cleanup function to abort fetch and prevent memory leaks
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { count, isLoading, error, hasInitialized };
}
'use client';

import React, { useState, useEffect } from 'react';

// Styles for the admin tool
const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(20, 30, 40, 0.9)',
    border: '1px solid #00ffff',
    borderRadius: '8px',
    padding: '15px',
    color: '#7fdbca',
    fontFamily: 'monospace',
    zIndex: 9999,
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
    maxWidth: '350px',
    backdropFilter: 'blur(4px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #00ffff',
    paddingBottom: '8px',
  },
  title: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00ffff',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#ff00ff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '12px',
  },
  label: {
    flexBasis: '130px',
    fontWeight: 'bold',
  },
  value: {
    flexGrow: 1,
    padding: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid #1c3144',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#2c3e50',
    color: '#7fdbca',
    border: '1px solid #34495e',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    margin: '5px',
    transition: 'all 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#3d556c',
    color: '#a3c8c4',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #1c3144',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#7fdbca',
    border: '1px solid #1c3144',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    width: '60px',
  },
  message: {
    fontSize: '11px',
    color: '#bada55',
    marginTop: '10px',
    padding: '5px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    minHeight: '20px',
  },
  error: {
    color: '#ff00ff',
  },
  toggleButton: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(20, 30, 40, 0.7)',
    color: '#00ffff',
    border: '1px solid #00ffff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 9998,
    fontSize: '14px',
    boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
  },
};

// The main admin tool component
const VisitorAdminTool: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCount, setLocalCount] = useState<number | null>(null);
  const [serverCount, setServerCount] = useState<number | null>(null);
  const [manualCount, setManualCount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Admin key - in a real app, this would be more secure
  const adminKey = 'synthwave-portfolio-admin';
  
  // Check if this should be shown - only in development or with admin query param
  useEffect(() => {
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      window.location.search.includes('admin=true');
    if (!shouldShow) {
      setIsOpen(false);
    }
  }, []);
  
  // Fetch counts when opened
  useEffect(() => {
    if (isOpen) {
      refreshCounts();
    }
  }, [isOpen]);
  
  // Refresh both local and server counts
  const refreshCounts = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    
    // Get local count
    const storedCount = localStorage.getItem('visitorCount');
    setLocalCount(storedCount ? parseInt(storedCount, 10) : null);
    
    // Get server count
    try {
      const response = await fetch('/api/visitors', { 
        method: 'GET',
        cache: 'no-store' 
      });
      if (response.ok) {
        const data = await response.json();
        setServerCount(data.count);
      } else {
        setError('Failed to fetch server count');
      }
    } catch (err) {
      setError('Network error fetching server count');
      console.error(err);
    }
    
    setIsLoading(false);
  };
  
  // Update local storage count
  const updateLocalCount = (newCount: number) => {
    localStorage.setItem('visitorCount', newCount.toString());
    setLocalCount(newCount);
    setMessage(`Local count updated to ${newCount}`);
  };
  
  // Sync local count to server (if local is higher)
  const syncToServer = async () => {
    if (localCount === null) {
      setError('No local count to sync');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/visitors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clientCount: localCount,
          adminKey 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        // Refresh the counts
        await refreshCounts();
      } else {
        setError(data.error || 'Failed to sync with server');
      }
    } catch (err) {
      setError('Network error during sync');
      console.error(err);
    }
    setIsLoading(false);
  };
  
  // Set a manual count
  const setManualVisitorCount = async () => {
    const count = parseInt(manualCount, 10);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid positive number');
      return;
    }
    
    // Update local storage
    updateLocalCount(count);
    
    // Try to update server
    setIsLoading(true);
    try {
      const response = await fetch('/api/visitors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clientCount: count,
          adminKey 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(`${data.message}. Manual count set to ${count}`);
        // Refresh to get latest server count
        await refreshCounts();
      } else {
        setError(data.error || 'Server rejected the manual count');
      }
    } catch (err) {
      setError('Network error setting manual count');
      console.error(err);
    }
    setIsLoading(false);
  };
  
  // Reset local storage count
  const resetLocalCount = () => {
    localStorage.removeItem('visitorCount');
    setLocalCount(null);
    setMessage('Local count reset');
  };
  
  // Match local to server
  const matchLocalToServer = () => {
    if (serverCount === null) {
      setError('No server count available');
      return;
    }
    
    updateLocalCount(serverCount);
  };
  
  // Toggle the panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Don't render anything if not in development and no admin param
  if (typeof window !== 'undefined' && 
      process.env.NODE_ENV !== 'development' && 
      !window.location.search.includes('admin=true')) {
    return null;
  }
  
  return (
    <>
      {!isOpen && (
        <button 
          onClick={togglePanel}
          style={styles.toggleButton}
          title="Visitor Count Admin"
          aria-label="Open visitor count admin panel"
        >
          #
        </button>
      )}
      
      {isOpen && (
        <div style={styles.container}>
          <div style={styles.header}>
            <h3 style={styles.title}>Visitor Count Admin</h3>
            <button 
              onClick={togglePanel}
              style={styles.closeButton}
              title="Close panel"
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Local Count:</span>
            <span style={styles.value}>{localCount === null ? 'Not set' : localCount}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Server Count:</span>
            <span style={styles.value}>{serverCount === null ? 'Unknown' : serverCount}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Manual Count:</span>
            <input
              type="number"
              value={manualCount}
              onChange={(e) => setManualCount(e.target.value)}
              style={styles.input}
              min="0"
              placeholder="Count"
            />
            <button 
              onClick={setManualVisitorCount}
              style={styles.button}
              disabled={isLoading}
            >
              Set
            </button>
          </div>
          
          <div style={styles.actions}>
            <button 
              onClick={refreshCounts}
              style={styles.button}
              disabled={isLoading}
            >
              Refresh
            </button>
            <button 
              onClick={syncToServer}
              style={styles.button}
              disabled={isLoading || localCount === null}
            >
              Sync to Server
            </button>
            <button 
              onClick={matchLocalToServer}
              style={styles.button}
              disabled={isLoading || serverCount === null}
            >
              Match Local
            </button>
            <button 
              onClick={resetLocalCount}
              style={styles.button}
              disabled={isLoading}
            >
              Reset Local
            </button>
          </div>
          
          {(message || error) && (
            <div style={{...styles.message, ...(error ? styles.error : {})}}>
              {message || error}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VisitorAdminTool;
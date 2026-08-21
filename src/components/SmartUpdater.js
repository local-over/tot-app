'use client';

import { useEffect, useState } from 'react';

export default function SmartUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        
        if (!currentVersion) {
          // First load, just record the version
          setCurrentVersion(data.version);
        } else if (currentVersion !== data.version) {
          // Version changed!
          setUpdateAvailable(true);
        }
      } catch (e) {
        // Ignore network errors
      }
    };

    // Check on mount
    checkVersion();

    // Check every 5 minutes
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    // Also check when window regains focus (user switches back to the app)
    const onFocus = () => checkVersion();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [currentVersion]);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach(registration => registration.update());
      });
    }
    // Hard refresh to clear client-side routing cache
    window.location.reload(true);
  };

  if (!updateAvailable) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--accent)',
      color: 'var(--white)',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Update available</span>
      <button 
        onClick={handleUpdate}
        style={{
          background: 'var(--white)',
          color: 'var(--accent)',
          border: 'none',
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Refresh
      </button>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

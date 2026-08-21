'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import Logo from '@/components/Logo';

export default function DeviceGuard({ children }) {
  const router = useRouter();
  const [deviceState, setDeviceState] = useState('loading'); // 'loading', 'desktop', 'mobile-browser', 'standalone'
  const [os, setOs] = useState('');

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    
    // Detect OS for instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs('ios');
    } else if (/android/.test(userAgent)) {
      setOs('android');
    } else {
      setOs('other');
    }

    if (!isMobile) {
      setDeviceState('desktop');
    } else if (!isStandalone) {
      setDeviceState('mobile-browser');
    } else {
      setDeviceState('standalone');
    }

    // Optional: listen for standalone mode change
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => {
      if (e.matches) {
        setDeviceState('standalone');
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  if (deviceState === 'loading') {
    return <div style={{ height: '100vh', background: 'var(--black)' }} />;
  }

  if (deviceState === 'desktop') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <Logo size={64} style={{ marginBottom: '2rem' }} />
        <h1 className="t-heading-2" style={{ marginBottom: '1rem' }}>TOT is a mobile app.</h1>
        <p className="t-body" style={{ color: 'var(--white-70)', marginBottom: '2rem', maxWidth: '400px' }}>
          Please scan this QR code with your phone camera to install the app and continue.
        </p>
        <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '2rem' }}>
          <QRCode value={`${window.location.origin}/auth?mode=signup`} size={200} level="H" />
        </div>
        <button className="btn btn-secondary" onClick={() => router.push('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  if (deviceState === 'mobile-browser') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <Logo size={64} style={{ marginBottom: '2rem' }} />
        <h1 className="t-heading-2" style={{ marginBottom: '1rem' }}>Install to continue</h1>
        <p className="t-body" style={{ color: 'var(--white-70)', marginBottom: '2rem', maxWidth: '300px' }}>
          TOT is designed to be a focused daily habit. You must add it to your home screen to use it.
        </p>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '340px' }}>
          {os === 'ios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="t-body"><strong>1.</strong> Tap the Share button <br/><span style={{opacity: 0.5}}>(the square with an arrow at the bottom)</span></p>
              <p className="t-body"><strong>2.</strong> Scroll down and tap<br/><strong>"Add to Home Screen"</strong> ➕</p>
            </div>
          )}
          
          {os === 'android' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="t-body"><strong>1.</strong> Tap the Menu button <br/><span style={{opacity: 0.5}}>(the 3 dots at the top right)</span></p>
              <p className="t-body"><strong>2.</strong> Tap<br/><strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> ➕</p>
            </div>
          )}

          {os === 'other' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="t-body">Open your browser menu and look for <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></p>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <p className="t-caption" style={{ color: 'var(--white-30)' }}>Already installed?</p>
          <p className="t-caption" style={{ color: 'var(--white-50)', marginTop: '0.5rem' }}>Close your browser and open the TOT app.</p>
        </div>
      </div>
    );
  }

  // Standalone mode: Render the protected page
  return <>{children}</>;
}

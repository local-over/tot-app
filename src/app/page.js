'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import Logo from '@/components/Logo';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(null); // null means hydrating
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    // Check if mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setAppUrl(`${window.location.origin}/auth?mode=signup`);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const universities = [
    "MIT", "Stanford", "Oxford", "Cambridge", "Harvard", "ETH Zürich", 
    "Berkeley", "Yale", "Princeton", "UCL", "Imperial", "Chicago",
    "Penn", "Columbia", "Cornell", "Toronto", "Michigan", "Duke",
    "NYU", "UCLA", "Brown", "Dartmouth", "Northwestern", "Johns Hopkins"
  ];
  
  // Double the list for seamless infinite scrolling
  const marqueeList = [...universities, ...universities];

  return (
    <div className={styles.page}>
      
      {/* ── HERO SECTION ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Logo size={96} glow className="animate-float" />
          <h1 className={styles.title}>One topic.<br/>Every day.</h1>
          <p className={styles.subtitle}>
            Read it. Rate it. Come back tomorrow. A daily habit designed to replace doomscrolling with intention.
          </p>

          {isMobile !== null && (
            <div className={styles.ctaContainer}>
              {isMobile ? (
                <>
                  <button 
                    className="btn btn-primary btn-large" 
                    onClick={() => router.push('/auth?mode=signup')}
                    style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
                  >
                    Get the App
                  </button>
                  <p className={styles.fallbackLink} style={{ margin: 0 }}>
                    Works on iOS and Android
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.qrInstruction}>Scan to get the app on your phone</p>
                  <div className={styles.qrWrapper}>
                    <QRCode value={appUrl} size={160} level="H" />
                  </div>
                  <Link href="/auth?mode=signup" className={styles.fallbackLink}>
                    or continue in browser
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── MOOD & RESEARCH SECTION ── */}
      <section className={styles.section}>
        <h2 className="t-heading-1" style={{ textAlign: 'center' }}>The Science of Scrolling</h2>
        <p className="t-body" style={{ textAlign: 'center', color: 'var(--white-70)', maxWidth: '600px', margin: '0 auto' }}>
          Countless research papers link endless feeds to anxiety, reduced attention spans, and poor morning moods. 
          We built the exact opposite.
        </p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>82%</div>
            <div className={styles.statDesc}>
              Reported a significantly better mood in the morning after using TOT for one week instead of social media.
            </div>
            <div className={styles.statSource}>*Internal user survey, 2026</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statDesc}>
              Topic per day. That's it. Artificial limits create focus, intention, and make reading a reward rather than a chore.
            </div>
            <div className={styles.statSource}>Based on cognitive load theory</div>
          </div>
        </div>
      </section>

      {/* ── THE $1 PHILOSOPHY ── */}
      <section className={styles.section}>
        <div className={styles.philosophy}>
          <h2 className="t-heading-1" style={{ marginBottom: '1.5rem' }}>Why $1?</h2>
          <p className="t-body" style={{ color: 'var(--white-70)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            People don't value what they get for free. The internet is flooded with free content that you never read.
          </p>
          <p className="t-body" style={{ color: 'var(--white-70)', maxWidth: '500px', margin: '0 auto' }}>
            When you pay $1, it's not just to keep our servers running. It's a psychological commitment. 
            You are making a promise to yourself to show up, read, and grow. Every single day.
          </p>
        </div>
      </section>

      {/* ── UNIVERSITIES MARQUEE ── */}
      <div className={styles.marqueeSection}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 className="t-heading-2">Supporting 7000+ unis</h3>
          <p className="t-caption" style={{ color: 'var(--amber)' }}>Students read free for 1 year</p>
        </div>
        
        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeTrack}>
            {marqueeList.map((uni, idx) => (
              <span key={idx} className={styles.uniLogo}>{uni}</span>
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <Logo size={32} />
        <p className="t-caption">TOT — The Only Topic</p>
        <p className="t-caption" style={{ color: 'var(--white-30)' }}>Designed for focus.</p>
      </footer>

    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useUser } from '@/context/UserContext';

export default function WelcomePage() {
  const { user, profile, isLoading, hasCompletedGate } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && profile?.readingTime && hasCompletedGate) {
      router.replace('/app');
    }
  }, [isLoading, user, profile, hasCompletedGate, router]);

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '2rem',
          textAlign: 'center',
          gap: '0',
          minHeight: '100dvh',
        }}>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <Logo size={96} glow className="animate-float" />

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 6vw, 2.75rem)',
              fontWeight: 700,
              color: 'var(--white)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginTop: '0.5rem',
            }}>
              TOT
            </h1>

            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'var(--white-50)',
              lineHeight: 1.6,
              maxWidth: '280px',
            }}>
              One topic. Every day.<br />Picked just for you.
            </p>
          </div>

          <div style={{
            width: '100%',
            maxWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingBottom: '3rem',
          }}>
            <button
              className="btn btn-primary btn-large btn-full"
              onClick={() => router.push('/auth?mode=signup')}
            >
              Get Started
            </button>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => router.push('/auth?mode=login')}
              style={{ padding: 'var(--sp-4) var(--sp-8)' }}
            >
              I already have an account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

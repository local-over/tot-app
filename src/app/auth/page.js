'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import DeviceGuard from '@/components/DeviceGuard';
import styles from './auth.module.css';
import { createClient } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useUser } from '@/context/UserContext';

function AuthContent() {
  const { user, profile, isLoading, checkSession, hasCompletedGate, logout } = useUser();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [mode, setMode] = useState(modeParam || 'signup');

  const [email, setEmail] = useState('');
  const [step, setStep] = useState(modeParam ? 'email' : 'landing');
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const routeUser = () => {
    if (!profile || !profile.readingTime) {
      router.replace('/setup');
    } else if (!hasCompletedGate) {
      router.replace('/gate');
    } else {
      router.replace('/app');
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      const isFullySetup = profile?.readingTime && profile?.gateCompleted;
      
      if (isFullySetup || step !== 'landing') {
        routeUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, profile, step]);

  const handleStart = async (selectedMode) => {
    if (user) {
      await logout(true);
    }
    setMode(selectedMode);
    setStep('email');
  };

  if (isLoading) {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100dvh' }}>
            <Logo size={80} glow />
          </div>
        </div>
      </div>
    );
  }

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const { account } = createClient();
      const token = await account.createEmailToken(ID.unique(), email);
      setUserId(token.userId);
      setStep('code');
    } catch (e) {
      setError(e.message || 'Could not send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length < 4) return;
    setLoading(true);
    setError('');

    try {
      const { account } = createClient();
      await account.createSession(userId, code);
      await checkSession();
    } catch (e) {
      setError(e.message || 'Wrong code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
      alert("Google Login is currently blocked by Apple's strict privacy settings on iPhones. Please use the email verification code above instead!");
      return;
    }

    try {
      const { account } = createClient();
      account.createOAuth2Session(
        'google',
        `${window.location.origin}/auth?mode=${mode}`,
        `${window.location.origin}/auth?mode=${mode}&error=oauth_failed`
      );
    } catch {}
  };

  const isSignup = mode === 'signup';

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div className={styles.page}>
          <div className={styles.inner}>

            {step === 'landing' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}>
                <Logo size={80} />
                <h1 className="t-heading-1" style={{ marginTop: '24px', marginBottom: '8px' }}>
                  Welcome to TOT
                </h1>
                <p className="t-body" style={{ opacity: 0.7, marginBottom: '40px' }}>
                  The one topic a day reading habit.
                </p>
                <button
                  className="btn btn-primary btn-large btn-full"
                  style={{ marginBottom: '16px' }}
                  onClick={() => handleStart('signup')}
                >
                  Get Started
                </button>
                <button
                  className="btn btn-secondary btn-large btn-full"
                  onClick={() => handleStart('login')}
                >
                  Log In
                </button>
              </div>
            ) : (
              <>
                <div className={styles.header}>
                  <Logo size={56} />
                  <h1 className="t-heading-1" style={{ marginTop: '8px' }}>
                    {isSignup ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="t-caption">
                    {isSignup ? 'Start your daily reading habit' : 'Sign in to continue'}
                  </p>
                </div>

            {error && <div className={styles.error}>{error}</div>}

            {step === 'email' ? (
              <>
                <form className={styles.form} onSubmit={handleSendCode}>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-large btn-full"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Continue'}
                  </button>
                </form>

                <div className={styles.divider}>or</div>

                <button className={styles.googleBtn} onClick={handleGoogle}>
                  <svg viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            ) : (
              <form className={styles.form} onSubmit={handleVerifyCode}>
                <p className="t-body" style={{ marginBottom: '8px' }}>
                  Code sent to <strong style={{ color: 'var(--white)' }}>{email}</strong>
                </p>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  autoFocus
                  style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.2em', fontWeight: 600 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-large btn-full"
                  disabled={loading || code.length < 4}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-full"
                  onClick={() => { setStep('email'); setCode(''); setError(''); }}
                >
                  Use a different email
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setMode(isSignup ? 'login' : 'signup');
                setStep('email');
                setError('');
              }}
              className={styles.backLink}
              style={{ display: 'block', margin: '24px auto 0', background: 'none', border: 'none', padding: '8px' }}
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <DeviceGuard>
      <Suspense fallback={
        <div className="app-desktop-shell">
          <div className="app-desktop-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100dvh' }}>
              <Logo size={56} />
            </div>
          </div>
        </div>
      }>
        <AuthContent />
      </Suspense>
    </DeviceGuard>
  );
}

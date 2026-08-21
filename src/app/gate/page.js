'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Logo from '@/components/Logo';
import DeviceGuard from '@/components/DeviceGuard';
import styles from './gate.module.css';

function GateContent() {
  const { user, profile, isLoading, hasCompletedGate, isExpired, updateProfile, logout } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [screen, setScreen] = useState('choose'); // 'choose', 'student', 'success', 'expired'
  const [studentEmail, setStudentEmail] = useState('');
  const [studentError, setStudentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentUserId, setStudentUserId] = useState('');
  const [studentCode, setStudentCode] = useState('');

  const handleCheckoutSuccess = async () => {
    setScreen('success');
    
    // For DodoPayments success, we don't automatically set free_month, 
    // we just mark gateCompleted (webhook handles the rest ideally, but we can optimistically unlock)
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30); // Optimistic 30 days
    await updateProfile({ gateCompleted: true, plan: 'paid_subscription', plan_expires_at: expDate.toISOString() });
    
    setTimeout(() => {
      router.replace('/app');
    }, 2000);
  };

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace('/auth');
      return;
    }
    
    if (hasCompletedGate && !isExpired && !searchParams.get('success')) {
      router.replace('/app');
      return;
    }
    
    if (isExpired && !searchParams.get('success')) {
      setScreen('expired');
    }
    
    if (searchParams.get('success') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleCheckoutSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, hasCompletedGate, isExpired, searchParams, router]);

  const handleStartFreeMonth = async () => {
    setIsSubmitting(true);
    try {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 30);
      
      await updateProfile({ 
        gateCompleted: true, 
        plan: 'free_month',
        plan_expires_at: expDate.toISOString() 
      });
      router.replace('/app');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email,
          name: profile?.name
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleSendStudentCode = async (e) => {
    e.preventDefault();
    setStudentError('');
    
    const validDomains = ['.edu', '.ac.uk', '.edu.au', '.ac.in'];
    const emailLower = studentEmail.toLowerCase();
    const isValid = validDomains.some(domain => emailLower.endsWith(domain));
    
    if (!isValid) {
      setStudentError('Please use a valid college email (.edu, .ac.uk, etc.)');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { createClient } = await import('@/lib/appwrite');
      const { ID } = await import('appwrite');
      const { account } = createClient();
      
      const token = await account.createEmailToken(ID.unique(), emailLower);
      setStudentUserId(token.userId);
      setScreen('student-code');
    } catch (err) {
      console.error(err);
      setStudentError('Could not send verification code. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyStudentCode = async (e) => {
    e.preventDefault();
    if (studentCode.length < 4) return;
    setStudentError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/verify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentUserId,
          secret: studentCode,
          studentEmail: studentEmail.toLowerCase(),
          currentUserEmail: user?.email
        })
      });
      const data = await res.json();
      
      if (data.success) {
        await updateProfile(data.user);
        setScreen('success');
        setTimeout(() => {
          router.replace('/app');
        }, 2000);
      } else {
        setStudentError(data.error || 'Invalid code. Try again.');
      }
    } catch (err) {
      console.error(err);
      setStudentError('Verification failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  if (screen === 'success') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.page}>
            <div className={styles.successScreen}>
              <div className={styles.emoji}>🎉</div>
              <h1 className="t-heading-1">You&apos;re in!</h1>
              <p className="t-body">Redirecting to TOT...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'student') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.page}>
            <div className={styles.header}>
              <Logo />
              <h1 className="t-heading-1">Verify your student email</h1>
              <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
                Enter your .edu or .ac.uk email. This is only for verification — your login stays the same.
              </p>
            </div>
            
            <form className={styles.form} onSubmit={handleSendStudentCode}>
              <input
                type="email"
                className="input"
                placeholder="college@uni.edu"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
              />
              {studentError && <p className={styles.error}>{studentError}</p>}
              
              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-full"
                disabled={isSubmitting || !studentEmail}
              >
                {isSubmitting ? 'Sending Code...' : 'Send Code'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary btn-full"
                onClick={() => setScreen('choose')}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'student-code') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.page}>
            <div className={styles.header}>
              <Logo />
              <h1 className="t-heading-1">Enter Code</h1>
              <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
                We sent a code to {studentEmail}
              </p>
            </div>
            
            <form className={styles.form} onSubmit={handleVerifyStudentCode}>
              <input
                type="text"
                className="input"
                placeholder="000000"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                maxLength={6}
                required
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.2em', fontWeight: 600 }}
              />
              {studentError && <p className={styles.error}>{studentError}</p>}
              
              <button 
                type="submit" 
                className="btn btn-primary btn-large btn-full"
                disabled={isSubmitting || studentCode.length < 4}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary btn-full"
                onClick={() => {
                  setScreen('student');
                  setStudentCode('');
                  setStudentError('');
                }}
              >
                Change email
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div className={styles.page}>
          
          {screen === 'expired' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className={styles.header}>
                <Logo />
                <h1 className="t-heading-1">Trial Expired</h1>
                <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
                  Your free trial has ended. Subscribe to maintain your streak and continue reading exactly what you want, when you want.
                </p>
              </div>
              <div className={styles.cards} style={{ marginTop: 'auto' }}>
                <div className={`${styles.card} ${styles.cardFeatured}`}>
                  <div>
                    <h2 className="t-heading-2">Individual</h2>
                    <div className={styles.price}>$1/month</div>
                  </div>
                  <button 
                    className="btn btn-primary btn-large btn-full"
                    onClick={handleSubscribe}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Loading...' : 'Subscribe'}
                  </button>
                  <button 
                    className="btn btn-full"
                    style={{ backgroundColor: 'transparent', color: 'var(--white-60)', marginTop: '0.5rem' }}
                    onClick={() => logout()}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'choose' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className={styles.header}>
                <Logo />
                <h1 className="t-heading-1">Almost there</h1>
                <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
                  Choose how you&apos;d like to access TOT. You won&apos;t be charged today.
                </p>
              </div>
              <div className={styles.cards} style={{ marginTop: 'auto' }}>
                <div className={`${styles.card} ${styles.cardFeatured}`}>
                  <div>
                    <span className={styles.badge}>First month free</span>
                    <h2 className="t-heading-2">Individual</h2>
                    <div className={styles.price}>$1/month</div>
                  </div>
                  <button 
                    className="btn btn-primary btn-large btn-full" 
                    onClick={handleStartFreeMonth}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Loading...' : 'Start free month'}
                  </button>
                </div>
                
                <div className={styles.card}>
                  <div>
                    <h2 className="t-heading-2">Student 🎓</h2>
                    <div className={styles.price}>Free for 1 year</div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-full" 
                    onClick={() => setScreen('student')}
                  >
                    Verify student email
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <DeviceGuard>
      <Suspense fallback={null}>
        <GateContent />
      </Suspense>
    </DeviceGuard>
  );
}

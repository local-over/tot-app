'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Logo from '@/components/Logo';
import DeviceGuard from '@/components/DeviceGuard';
import styles from './gate.module.css';

function GateContent() {
  const { user, profile, isLoading, hasCompletedGate, updateProfile } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [screen, setScreen] = useState('choose'); // 'choose', 'student', 'success'
  const [studentEmail, setStudentEmail] = useState('');
  const [studentError, setStudentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace('/auth');
      return;
    }
    
    if (hasCompletedGate && !searchParams.get('success')) {
      router.replace('/app');
      return;
    }
    
    if (searchParams.get('success') === 'true') {
      handleCheckoutSuccess();
    }
  }, [user, isLoading, hasCompletedGate, searchParams, router]);

  const handleCheckoutSuccess = async () => {
    setScreen('success');
    await updateProfile({ gateCompleted: true, plan: 'free_month' });
    setTimeout(() => {
      router.replace('/app');
    }, 2000);
  };

  const handleStartFreeMonth = async () => {
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

  const handleVerifyStudent = async (e) => {
    e.preventDefault();
    setStudentError('');
    
    const validDomains = ['.edu', '.ac.uk', '.edu.au', '.ac.in'];
    const emailLower = studentEmail.toLowerCase();
    const isValid = validDomains.some(domain => emailLower.endsWith(domain));
    
    if (!isValid) {
      setStudentError('Please use a valid college email');
      return;
    }
    
    setIsSubmitting(true);
    await updateProfile({ 
      isStudent: true, 
      gateCompleted: true, 
      studentEmail: emailLower, 
      plan: 'student' 
    });
    
    setScreen('success');
    setTimeout(() => {
      router.replace('/app');
    }, 2000);
  };

  if (isLoading || !user) return null;

  if (screen === 'success') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.page}>
            <div className={styles.successScreen}>
              <div className={styles.emoji}>🎉</div>
              <h1 className="t-heading-1">You're in!</h1>
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
            
            <form className={styles.form} onSubmit={handleVerifyStudent}>
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
                {isSubmitting ? 'Verifying...' : 'Verify'}
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

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div className={styles.page}>
          <div className={styles.header}>
            <Logo />
            <h1 className="t-heading-1">Almost there</h1>
            <p className="t-body" style={{ color: 'var(--text-secondary)' }}>
              Choose how you'd like to access TOT
            </p>
          </div>
          
          <div className={styles.cards}>
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

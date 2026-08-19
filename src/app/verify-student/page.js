'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import styles from '../app/app.module.css';

export default function VerifyStudent() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'code', 'success'
  const router = useRouter();

  const handleSendCode = () => {
    if (!email.endsWith('.edu') && !email.endsWith('.ac.uk')) {
      alert('Please enter a valid university email (.edu or .ac.uk)');
      return;
    }
    setStep('code');
  };

  const handleVerifyCode = () => {
    if (code.length >= 4) {
      setStep('success');
      setTimeout(() => {
        // Mock updating the user to student tier
        const userStr = localStorage.getItem('tot_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.isStudent = true;
          user.plan = 'student';
          localStorage.setItem('tot_user', JSON.stringify(user));
        }
        router.push('/app');
      }, 3000);
    }
  };

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div className={styles.container}>
          <div className={styles.screen} style={{ textAlign: 'center', justifyContent: 'center' }}>
            {step === 'success' ? (
              <>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎓</div>
                <h2 className="t-heading-1" style={{ marginBottom: '8px', color: 'var(--amber)' }}>Student Verified</h2>
                <p className="t-body" style={{ color: 'var(--white-70)' }}>You get 1 year of TOT completely free. Redirecting to app...</p>
              </>
            ) : (
              <>
                <Logo size={60} glow className={styles.homeLogo} />
                <h2 className="t-heading-1" style={{ marginTop: '24px', marginBottom: '8px' }}>Verify Student Status</h2>
                <p className="t-body" style={{ color: 'var(--white-70)', marginBottom: '32px' }}>
                  {step === 'email' ? 'Enter your university email to get your free year.' : `We sent a code to ${email}`}
                </p>

                {step === 'email' ? (
                  <>
                    <input 
                      type="email" 
                      className={styles.input} 
                      placeholder="student@university.edu" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleSendCode}>
                      Send Code
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }} onClick={() => router.back()}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="Enter verification code" 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                      maxLength={6}
                    />
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleVerifyCode}>
                      Verify
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }} onClick={() => setStep('email')}>
                      Back
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

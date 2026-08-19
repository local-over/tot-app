'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('tot_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.loggedIn) {
          router.push('/app');
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    localStorage.setItem('tot_user', JSON.stringify({
      email,
      loggedIn: true,
      loginDate: new Date().toISOString()
    }));
    
    router.push('/app');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Logo />
        
        <div>
          <h1 className="t-heading-1">Welcome back</h1>
          <p className="t-caption">Or create your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="input" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-large btn-full">
            Continue
          </button>
          <p className="t-caption">No password needed. We'll send you a link.</p>
        </form>

        <div className={styles.divider}></div>

        <Link href="/pricing" className="btn btn-secondary btn-full">
          Are you a student?
        </Link>

        <Link href="/" className={styles.backLink}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/appwrite';
import styles from './app.module.css';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { categories as allCategories, readingStyles, contentVibes, readingTimes } from '@/data/categories';
import { getRecommendation, getStreak } from '@/lib/recommend';
import { topics } from '@/data/topics';
import QRCode from 'react-qr-code';

export default function App() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [screen, setScreen] = useState('splash');
  const [profile, setProfile] = useState({
    name: '',
    categories: [],
    readingStyle: '',
    contentVibe: '',
    readingTime: '',
  });
  const [topic, setTopic] = useState(null);
  const [streak, setStreak] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();
  
  // Rating state
  const [ratingStep, setRatingStep] = useState(0); // 0, 1, 2 for the 3 questions
  const [ratingData, setRatingData] = useState({
    rating: null,
    moreOrLess: null,
    length: null
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Auth state
  const [authEmail, setAuthEmail] = useState('');
  const [authStep, setAuthStep] = useState('email'); // email or code
  const [authCode, setAuthCode] = useState('');
  const [bypassDesktop, setBypassDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 768) {
      setIsDesktop(true);
    }
    const checkAppwriteSession = async () => {
      try {
        const { account } = createClient();
        const session = await account.get();
        if (session) {
          const email = session.email;
          const isStudent = email.endsWith('.edu') || email.endsWith('.ac.uk');
          const userData = { email, loggedIn: true, loginDate: new Date().toISOString(), isStudent, plan: isStudent ? 'student' : 'free_month' };
          localStorage.setItem('tot_user', JSON.stringify(userData));
          return true;
        }
      } catch (error) {
        // No valid Appwrite session
      }
      return false;
    };

    const runInit = async () => {
      let loggedInUser = null;
      const isValidAppwrite = await checkAppwriteSession();
      
      const userStr = localStorage.getItem('tot_user');
      try {
        if (userStr) loggedInUser = JSON.parse(userStr);
      } catch (e) {}

      if (isValidAppwrite && (!loggedInUser || !loggedInUser.loggedIn)) {
        // Appwrite logged us in!
        loggedInUser = JSON.parse(localStorage.getItem('tot_user'));
      } else if (!isValidAppwrite && loggedInUser && loggedInUser.loggedIn) {
        // Invalid Appwrite session but local says logged in? Log them out!
        localStorage.removeItem('tot_user');
        loggedInUser = null;
      }

      setIsAuthChecked(true);

      const savedProfile = localStorage.getItem('tot_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.setupComplete) {
            setProfile(parsed);
            
            if (!loggedInUser || !loggedInUser.loggedIn) {
              setTimeout(() => setScreen('signup'), 2500);
              return;
            }

            checkTimeReady(parsed);
            const recommended = getRecommendation(parsed, getFeedbackHistory());
            setTopic(recommended || topics[0]);
            setStreak(getStreak() || 1);
            
            setTimeout(() => setScreen('home'), 2500);
            return;
          }
        } catch (e) {}
      }
      
      setTimeout(() => setScreen('welcome'), 2500);
    };

    runInit();
  }, []);

  const getFeedbackHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('tot_feedback')) || [];
    } catch {
      return [];
    }
  };

  const checkTimeReady = (userProfile) => {
    if (!userProfile?.readingTime) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple matching logic for the time slot (parsing hour from time slot if possible, or just mock it)
    const timeSlot = readingTimes.find(t => t.id === userProfile.readingTime);
    let targetHour = 8; // Default morning
    
    if (timeSlot) {
      if (timeSlot.id === 'morning') targetHour = 8;
      else if (timeSlot.id === 'lunch') targetHour = 12;
      else if (timeSlot.id === 'evening') targetHour = 18;
      else if (timeSlot.id === 'night') targetHour = 22;
    }
    
    const isWithinWindow = Math.abs(currentHour - targetHour) <= 1;
    setIsReady(isWithinWindow);
  };

  const saveProfile = (finalProfile) => {
    const data = {
      ...finalProfile,
      setupComplete: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('tot_profile', JSON.stringify(data));
    setProfile(data);
    
    const userStr = localStorage.getItem('tot_user');
    let loggedInUser = null;
    try {
      if (userStr) loggedInUser = JSON.parse(userStr);
    } catch (e) {}

    if (!loggedInUser || !loggedInUser.loggedIn) {
      setScreen('signup');
      return;
    }
    
    const recommended = getRecommendation(data, getFeedbackHistory());
    setTopic(recommended || topics[0]);
    setStreak(getStreak() || 1);
    checkTimeReady(data);
    
    setScreen('home');
  };

  const handleGoogleLogin = () => {
    try {
      const { account } = createClient();
      account.createOAuth2Session(
        'google',
        'https://tot-app.pages.dev/app',
        'https://tot-app.pages.dev/app'
      );
    } catch (error) {
      console.error('OAuth initiation failed', error);
    }
  };

  const handleLoginSuccess = async (email) => {
    const isStudent = email.endsWith('.edu') || email.endsWith('.ac.uk');
    const userData = { email, loggedIn: true, loginDate: new Date().toISOString(), isStudent, plan: isStudent ? 'student' : 'free_month' };
    
    // Save to Appwrite backend
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, profile, isStudent })
      });
    } catch (e) {
      console.warn('Backend sync failed, falling back to local');
    }

    localStorage.setItem('tot_user', JSON.stringify(userData));
    
    if (isStudent) {
      setScreen('student_gift');
      setTimeout(() => {
        const recommended = getRecommendation(profile, getFeedbackHistory());
        setTopic(recommended || topics[0]);
        setStreak(getStreak() || 1);
        checkTimeReady(profile);
        setScreen('home');
      }, 4000);
    } else {
      setScreen('pricing_wall');
    }
  };

  const submitFeedback = async () => {
    const feedbackData = {
      topicId: topic?.id || 'unknown',
      rating: ratingData.rating,
      moreOrLess: ratingData.moreOrLess,
      length: ratingData.length,
      date: new Date().toISOString()
    };
    
    // Fallback logic for local storage
    let history = [];
    const historyStr = localStorage.getItem('tot_feedback');
    if (historyStr) {
      history = JSON.parse(historyStr);
    }
    history.push(feedbackData);
    localStorage.setItem('tot_feedback', JSON.stringify(history));
    
    // Sync to Appwrite Backend
    try {
      const userStr = localStorage.getItem('tot_user');
      const email = userStr ? JSON.parse(userStr).email : 'unknown';
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feedbackData })
      });
    } catch (e) {
      console.warn('Backend feedback sync failed, falling back to local');
    }

    setStreak(prev => prev + 1);
    setScreen('reading');
    
    // Reset rating
    setRatingStep(0);
    setRatingData({ rating: null, moreOrLess: null, length: null });
  };

  const handleScroll = (e) => {
    const element = e.target;
    const { scrollTop, scrollHeight, clientHeight } = element;
    if (scrollHeight === clientHeight) {
      setScrollProgress(100);
    } else {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const toggleCategory = (id) => {
    setProfile(prev => {
      const isSelected = prev.categories.includes(id);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== id) };
      } else {
        return { ...prev, categories: [...prev.categories, id] };
      }
    });
  };

  const renderStepDots = (currentStep) => {
    const totalSteps = 6;
    return (
      <div className={styles.stepDots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${i + 1 === currentStep ? styles.dotActive : ''}`} 
          />
        ))}
      </div>
    );
  };

  // ----- Screens ----- //

  if (!isAuthChecked) return null;

  if (isDesktop && !bypassDesktop) {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
          <Logo size={80} glow />
          <h2 className="t-heading-1" style={{ marginTop: '24px', marginBottom: '16px' }}>TOT is mobile-first</h2>
          <p className="t-body" style={{ color: 'var(--white-70)', marginBottom: '32px', maxWidth: '300px' }}>
            To keep you focused, the daily reading experience is designed primarily for your phone.
          </p>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
            <QRCode value="https://tot-app.com/app" size={150} />
          </div>
          <p className="t-caption" style={{ marginBottom: '24px' }}>Scan to open on your phone</p>
          <button className="btn btn-ghost" onClick={() => setBypassDesktop(true)}>
            Use on desktop anyway
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'splash') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.splash}>
          <Logo size={100} glow className={styles.splashLogo} />
          <h1 className="t-display">TOT</h1>
          <p className="t-caption">The Only Topic</p>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'welcome') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screenFull} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {renderStepDots(1)}
          <Logo size={80} />
          <h1 className="t-display">One topic.</h1>
          <h1 className="t-display" style={{ color: 'var(--amber)' }}>Every day.</h1>
          
          <div className={styles.bottomActions} style={{ width: '100%' }}>
            <button className="btn btn-primary btn-large btn-full" onClick={() => setScreen('name')}>
              Let's set you up
            </button>
            <button className="btn btn-ghost btn-full" style={{ marginTop: '12px' }} onClick={() => {
              setScreen('signup');
              setAuthStep('email');
            }}>
              Already have an account? Log in
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'name') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screen}>
          {renderStepDots(2)}
          <h2 className="t-heading-1">What should we call you?</h2>
          
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Your name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              autoFocus
            />
          </div>

          <div className={styles.bottomActions}>
            <button className="btn btn-ghost" onClick={() => setScreen('categories')}>Skip</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={() => setScreen('categories')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'categories') {
    const isReady = profile.categories.length >= 3;
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screen}>
          {renderStepDots(3)}
          <h2 className="t-heading-1">Pick at least 3</h2>
          <p className="t-body" style={{ color: 'var(--color-text-muted)' }}>What are you curious about?</p>
          
          <div className={styles.categoriesGrid}>
            {allCategories.map(cat => {
              const isSelected = profile.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  className={`pill ${isSelected ? 'pill-selected' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.emoji} {cat.name}
                </button>
              );
            })}
          </div>

          <div className={styles.bottomActions}>
            <button className="btn btn-ghost" onClick={() => setScreen('name')}>Back</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={!isReady}
              onClick={() => setScreen('style')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'style') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screen}>
          {renderStepDots(4)}
          <h2 className="t-heading-1">How deep do you go?</h2>
          
          <div className={styles.optionCards}>
            {readingStyles.map(style => (
              <div 
                key={style.id}
                className={`${styles.optionCard} ${profile.readingStyle === style.id ? styles.optionCardSelected : ''}`}
                onClick={() => setProfile({...profile, readingStyle: style.id})}
              >
                <div className={styles.optionCardEmoji}>{style.emoji}</div>
                <div className={styles.optionCardContent}>
                  <h3 className="t-heading-2">{style.label}</h3>
                  <p className="t-caption">{style.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActions}>
            <button className="btn btn-ghost" onClick={() => setScreen('categories')}>Back</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={!profile.readingStyle}
              onClick={() => setScreen('vibe')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'vibe') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screen}>
          {renderStepDots(5)}
          <h2 className="t-heading-1">What kind of content?</h2>
          
          <div className={styles.optionCards}>
            {contentVibes.map(vibe => (
              <div 
                key={vibe.id}
                className={`${styles.optionCard} ${profile.contentVibe === vibe.id ? styles.optionCardSelected : ''}`}
                onClick={() => setProfile({...profile, contentVibe: vibe.id})}
              >
                <div className={styles.optionCardEmoji}>{vibe.emoji}</div>
                <div className={styles.optionCardContent}>
                  <h3 className="t-heading-2">{vibe.label}</h3>
                  <p className="t-caption">{vibe.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActions}>
            <button className="btn btn-ghost" onClick={() => setScreen('style')}>Back</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={!profile.contentVibe}
              onClick={() => setScreen('time')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'time') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screen}>
          {renderStepDots(6)}
          <h2 className="t-heading-1">When's your reading moment?</h2>
          
          <div className={styles.optionCards}>
            {readingTimes.map(time => (
              <div 
                key={time.id}
                className={`${styles.optionCard} ${profile.readingTime === time.id ? styles.optionCardSelected : ''}`}
                onClick={() => setProfile({...profile, readingTime: time.id})}
              >
                <div className={styles.optionCardEmoji}>{time.emoji}</div>
                <div className={styles.optionCardContent}>
                  <h3 className="t-heading-2">{time.name}</h3>
                  <p className="t-caption">{time.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomActions}>
            <button className="btn btn-ghost" onClick={() => setScreen('vibe')}>Back</button>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              disabled={!profile.readingTime}
              onClick={() => saveProfile(profile)}
            >
              Finish Setup
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'signup') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.screen} style={{ textAlign: 'center', justifyContent: 'center' }}>
              <Logo size={80} glow className={styles.homeLogo} />
              <h2 className="t-heading-1" style={{ marginTop: '24px', marginBottom: '8px' }}>Your profile is ready</h2>
              <p className="t-body" style={{ color: 'var(--white-70)', marginBottom: '32px' }}>Save it to get your first topic.</p>
              
              <button className="btn" style={{ background: '#fff', color: '#000', width: '100%', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }} onClick={() => {
                handleLoginSuccess('user@gmail.com');
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--white-50)' }}>
                Student? Sign in with your .edu Google Account to automatically skip payment.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'student_gift') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.screen} style={{ textAlign: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎓</div>
              <h2 className="t-heading-1" style={{ marginBottom: '8px', color: 'var(--amber)' }}>Student Verified</h2>
              <p className="t-body" style={{ color: 'var(--white-70)' }}>You get 1 year of TOT completely free. Enjoy your topics!</p>
              <div style={{ marginTop: '32px' }} className={styles.countdown}>Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'pricing_wall') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.screen} style={{ textAlign: 'center', justifyContent: 'center', overflowY: 'auto' }}>
              <Logo size={60} glow className={styles.homeLogo} />
              <h2 className="t-heading-1" style={{ marginTop: '16px', marginBottom: '32px' }}>Choose your plan</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', textAlign: 'left', width: '100%' }}>
                <div className="pricing-card" style={{ padding: '24px' }}>
                  <div className="pricing-badge" style={{ top: '-10px', fontSize: '0.65rem' }}>MOST POPULAR</div>
                  <h3 className="t-heading-2" style={{ fontSize: '1.25rem' }}>Individual</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--amber)' }}>First month free</div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={async () => {
                    try {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        body: JSON.stringify({ email: authEmail || profile.name || 'user@tot.app', name: profile.name }),
                        headers: { 'Content-Type': 'application/json' }
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        alert('Failed to initiate checkout');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Checkout error');
                    }
                  }}>Start my free month</button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', textAlign: 'center', marginTop: '8px' }}>No credit card required. $1/month after.</p>
                </div>
                
                <div className="pricing-card" style={{ padding: '24px' }}>
                  <h3 className="t-heading-2" style={{ fontSize: '1.25rem' }}>Student Access</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--white-70)' }}>Free 1 year</div>
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => {
                    router.push('/verify-student');
                  }}>I am a student</button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--white-50)', textAlign: 'center', marginTop: '8px' }}>Verify your college email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.homeScreen}>
          <Logo size={80} glow={isReady} className={styles.homeLogo} />
          
          <div className={styles.streakBadge}>
            🔥 Day {streak} streak
          </div>

          {isReady ? (
            <>
              <h2 className="t-display" style={{ color: 'var(--amber)' }}>Your topic is ready</h2>
              <p className="t-body">A fresh dive tailored just for you.</p>
              
              <div className={styles.actions} style={{ marginTop: '2rem' }}>
                <button className="btn btn-primary btn-large btn-full" onClick={() => setScreen('reading')}>
                  Start Reading
                </button>
                <button className="btn btn-ghost btn-full" onClick={() => {}}>
                  Remind me later
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="t-heading-1">Your next topic</h2>
              <div className={styles.countdown}>
                04:23:15
              </div>
              <p className="t-caption">until your scheduled reading time</p>
              
              <div className={styles.actions} style={{ marginTop: '2rem' }}>
                <button className="btn btn-ghost btn-full" onClick={() => setScreen('reading')}>
                  Read now (Demo)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'reading') {
    if (!topic) return null; // Safety fallback
    
    const cat = allCategories.find(c => c.id === topic.categoryId);
    
    return (
      <div className="app-desktop-shell">
        <div className="reading-desktop">
          <div className={styles.container} style={{ padding: 0, overflowY: 'auto', height: '100dvh' }} onScroll={handleScroll}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} style={{ width: `${scrollProgress}%` }} />
        </div>
        
        <div className={styles.readingContainer} style={{ padding: '2rem 1.5rem 6rem' }}>
          <div className={styles.articleHeader}>
            <span className="pill pill-selected" style={{ width: 'fit-content' }}>
              {cat?.emoji || '✨'} {cat?.name || 'Topic'}
            </span>
            <h1 className="t-display">{topic.title}</h1>
            <p className="t-caption">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {topic.readTime || '3 min'} read</p>
          </div>
          
          <div className={styles.articleBody}>
            {topic.body ? (
              // Handle arrays of paragraphs or just a single string for demo
              Array.isArray(topic.body) 
                ? topic.body.map((p, i) => <p key={i}>{p}</p>)
                : <p>{topic.body}</p>
            ) : (
              <p>Content unavailable.</p>
            )}
          </div>
          
          {topic.closingFact && (
            <div className={styles.closingFact}>
              <p className="t-label" style={{ marginBottom: '0.5rem', color: 'var(--amber)' }}>Takeaway Fact</p>
              <p className="t-body" style={{ fontStyle: 'italic' }}>{topic.closingFact}</p>
            </div>
          )}
          
          <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-large btn-full" onClick={() => setScreen('rating')}>
              Done reading
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'rating') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.screenFull} style={{ justifyContent: 'center' }}>
          
          <div className={styles.ratingContainer}>
            {ratingStep >= 0 && (
              <div className={styles.ratingQuestion}>
                <h2 className="t-heading-2">How was this?</h2>
                <div className={styles.ratingEmojis}>
                  {[
                    { value: 1, emoji: '😴' },
                    { value: 2, emoji: '😐' },
                    { value: 3, emoji: '🙂' },
                    { value: 4, emoji: '🤩' },
                    { value: 5, emoji: '🤯' },
                  ].map(item => (
                    <button 
                      key={item.value}
                      className={`${styles.ratingEmoji} ${ratingData.rating === item.value ? styles.ratingEmojiSelected : ''}`}
                      onClick={() => {
                        setRatingData({...ratingData, rating: item.value});
                        if (ratingStep === 0) setTimeout(() => setRatingStep(1), 300);
                      }}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {ratingStep >= 1 && (
              <div className={styles.ratingQuestion}>
                <h2 className="t-heading-2">Want more like this?</h2>
                <div className={styles.ratingPills}>
                  {['less', 'right', 'more'].map(opt => (
                    <button
                      key={opt}
                      className={`${styles.ratingPill} ${ratingData.moreOrLess === opt ? styles.ratingPillSelected : ''}`}
                      onClick={() => {
                        setRatingData({...ratingData, moreOrLess: opt});
                        if (ratingStep === 1) setTimeout(() => setRatingStep(2), 300);
                      }}
                    >
                      {opt === 'less' ? 'Less' : opt === 'right' ? 'About right' : 'More'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {ratingStep >= 2 && (
              <div className={styles.ratingQuestion}>
                <h2 className="t-heading-2">How was the length?</h2>
                <div className={styles.ratingPills}>
                  {['short', 'perfect', 'long'].map(opt => (
                    <button
                      key={opt}
                      className={`${styles.ratingPill} ${ratingData.length === opt ? styles.ratingPillSelected : ''}`}
                      onClick={() => {
                        setRatingData({...ratingData, length: opt});
                      }}
                    >
                      {opt === 'short' ? 'Too short' : opt === 'perfect' ? 'Perfect' : 'Too long'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.bottomActions} style={{ opacity: ratingData.length ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: ratingData.length ? 'auto' : 'none' }}>
            <button className="btn btn-primary btn-large btn-full" onClick={submitFeedback}>
              Submit
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  if (screen === 'done') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
        <div className={styles.doneScreen}>
          <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          
          <h1 className="t-display">Done for today</h1>
          
          <div className={styles.streakBadge} style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
            Day {streak} streak 🔥
          </div>
          
          <div style={{ marginTop: '3rem', width: '100%' }}>
            <button className="btn btn-primary btn-large btn-full" onClick={() => {
              setScreen('home');
              setRatingStep(0);
              setRatingData({ rating: null, moreOrLess: null, length: null });
            }}>
              See you tomorrow
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    );
  }

  return null;
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import styles from './app.module.css';
import Logo from '@/components/Logo';
import { categories as allCategories, readingTimes } from '@/data/categories';
import { getRecommendation } from '@/lib/recommend';
import { topics } from '@/data/topics';

export default function App() {
  const { user, profile, isLoading, hasCompletedGate, updateProfile } = useUser();
  const router = useRouter();

  const [screen, setScreen] = useState('splash');
  const [topic, setTopic] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState('00:00:00');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [ratingStep, setRatingStep] = useState(0);
  const [ratingData, setRatingData] = useState({
    rating: null, moreOrLess: null, length: null
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/'); return; }
    if (!profile?.readingTime) { router.replace('/setup'); return; }
    if (!hasCompletedGate) { router.replace('/gate'); return; }

    if (screen === 'splash') {
      const recommended = getRecommendation(profile, []);
      setTopic(recommended || topics[0]);
      setTimeout(() => setScreen('home'), 1200);
    }
  }, [user, profile, isLoading, hasCompletedGate, screen, router]);

  useEffect(() => {
    if (screen !== 'home' || isReady || !profile?.readingTime) return;

    const tick = () => {
      const now = new Date();
      const slot = readingTimes.find(t => t.id === profile.readingTime);
      const targetHour = slot?.hour || 8;

      let target = new Date();
      target.setHours(targetHour, 0, 0, 0);
      if (now > target && (now - target > 3600000)) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      if (diff <= 0) { setIsReady(true); return; }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [screen, isReady, profile]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight === clientHeight) { setScrollProgress(100); return; }
    setScrollProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
  };

  const submitFeedback = async () => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user.email,
          topicId: topic?.id,
          rating: ratingData.rating,
          moreOrLess: ratingData.moreOrLess,
          length: ratingData.length,
        })
      });
      if (profile) {
        await updateProfile({ streak: (profile.streak || 0) + 1 });
      }
    } catch {}
    setScreen('done');
    setRatingStep(0);
    setRatingData({ rating: null, moreOrLess: null, length: null });
  };

  /* ── Splash ── */
  if (isLoading || screen === 'splash') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.homeScreen}>
              <Logo size={80} glow />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Home ── */
  if (screen === 'home') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.homeScreen}>
              <Logo size={80} glow={isReady} className={styles.homeLogo} />

              <div className={styles.streakBadge}>
                🔥 Day {profile?.streak || 0} streak
              </div>

              {isReady ? (
                <>
                  <h2 className="t-display" style={{ color: 'var(--amber)' }}>Your topic is ready</h2>
                  <p className="t-body">A fresh read, just for you.</p>
                  <div className={styles.actions} style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary btn-large btn-full" onClick={() => setScreen('reading')}>
                      Start Reading
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="t-heading-1">Your next topic</h2>
                  <div className={styles.countdown}>{countdown}</div>
                  <p className="t-caption">until your scheduled reading time</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Reading ── */
  if (screen === 'reading') {
    if (!topic) return null;
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
                <p className="t-caption">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {topic.readTime || '3 min'} read
                </p>
              </div>

              <div className={styles.articleBody}>
                {topic.body ? (
                  Array.isArray(topic.body)
                    ? topic.body.map((p, i) => <p key={i}>{p}</p>)
                    : <p>{topic.body}</p>
                ) : <p>Content unavailable.</p>}
              </div>

              {topic.closingFact && (
                <div className={styles.closingFact}>
                  <p className="t-label" style={{ marginBottom: '0.5rem', color: 'var(--amber)' }}>Takeaway</p>
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

  /* ── Rating ── */
  if (screen === 'rating') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.homeScreen} style={{ justifyContent: 'center' }}>
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
                            setRatingData({ ...ratingData, rating: item.value });
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
                            setRatingData({ ...ratingData, moreOrLess: opt });
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
                          onClick={() => setRatingData({ ...ratingData, length: opt })}
                        >
                          {opt === 'short' ? 'Too short' : opt === 'perfect' ? 'Perfect' : 'Too long'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: '2rem', width: '100%',
                opacity: ratingData.length ? 1 : 0,
                transition: 'opacity 300ms',
                pointerEvents: ratingData.length ? 'auto' : 'none',
              }}>
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

  /* ── Done ── */
  if (screen === 'done') {
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.container}>
            <div className={styles.doneScreen}>
              <svg className={styles.checkmark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>

              <h1 className="t-display">Done for today</h1>

              <div className={styles.streakBadge} style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
                Day {profile?.streak || 0} streak 🔥
              </div>

              <div style={{ marginTop: '3rem', width: '100%' }}>
                <button className="btn btn-primary btn-large btn-full" onClick={() => setScreen('home')}>
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

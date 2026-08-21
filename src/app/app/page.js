'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import styles from './app.module.css';
import Logo from '@/components/Logo';
import { categories as allCategories, readingTimes } from '@/data/categories';
import DeviceGuard from '@/components/DeviceGuard';

function AppContent() {
  const { user, profile, isLoading, hasCompletedGate, updateProfile, logout } = useUser();
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false);
  const [menuView, setMenuView] = useState('main'); // 'main', 'saved', 'history', 'settings'
  const [userHistory, setUserHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  
  const [accountForm, setAccountForm] = useState({ name: '', categories: [] });
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Swipe-to-dismiss logic
  const [touchStartY, setTouchStartY] = useState(null);
  const [modalTranslateY, setModalTranslateY] = useState(0);

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/user/history?userId=${user?.id || user?.email}`);
      if (res.ok) {
        const data = await res.json();
        setUserHistory(data.history || []);
      }
    } catch (err) {
      console.error(err);
    }
    setIsHistoryLoading(false);
  };

  useEffect(() => {
    if (showProfileMenu) {
      if (menuView === 'saved' || menuView === 'history') fetchHistory();
      if (menuView === 'settings' && profile) {
        setAccountForm({
          name: profile.name || '',
          categories: profile.categories || []
        });
      }
    }
  }, [showProfileMenu, menuView, profile]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const handleSaveAccount = async () => {
    setIsSavingAccount(true);
    try {
      await updateProfile({ name: accountForm.name, categories: accountForm.categories });
    } catch (err) {
      console.error(err);
    }
    setIsSavingAccount(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel? You will lose access at the end of your billing cycle.')) return;
    setIsCancelling(true);
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dodo_subscription_id: profile?.dodo_subscription_id, userId: user?.id })
      });
      if (res.ok) {
        alert('Subscription scheduled for cancellation.');
        await updateProfile({ dodo_subscription_id: '' }); 
      } else {
        alert('Could not cancel subscription. Contact support.');
      }
    } catch (err) {
      alert('Error cancelling subscription');
    }
    setIsCancelling(false);
  };

  const toggleCategory = (catId) => {
    setAccountForm(prev => {
      const isSelected = prev.categories.includes(catId);
      if (isSelected) return { ...prev, categories: prev.categories.filter(id => id !== catId) };
      return { ...prev, categories: [...prev.categories, catId] };
    });
  };

  const toggleMark = async (assignmentId, currentMarkedStatus) => {
    if (isMarking || !assignmentId) return;
    setIsMarking(true);
    try {
      const res = await fetch('/api/user/mark', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, isMarked: !currentMarkedStatus })
      });
      if (res.ok) {
        setUserHistory(prev => prev.map(h => 
          h.id === assignmentId ? { ...h, isMarked: !currentMarkedStatus } : h
        ));
        if (topic && topic.assignmentId === assignmentId) {
          setTopic(prev => ({ ...prev, isMarked: !currentMarkedStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    }
    setIsMarking(false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/'); return; }
    if (!hasCompletedGate) { router.replace('/gate'); return; }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (screen === 'splash') {
      const fetchTopic = async () => {
        const todayStr = new Date().toDateString();
        const cachedTopicKey = 'tot_topic_' + todayStr;
        const cachedTopic = localStorage.getItem(cachedTopicKey);

        if (cachedTopic) {
          try { setTopic(JSON.parse(cachedTopic)); } catch {}
          setScreen('home');
        }

        try {
          const params = new URLSearchParams({
            userId: user.id || user.email,
            readingStyle: profile.readingStyle || 'mix',
            categories: (profile.categories || []).join(',')
          });
          const res = await fetch(`/api/topics/today?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setTopic(data);
            localStorage.setItem(cachedTopicKey, JSON.stringify(data));
          }
        } catch (err) {
          console.error("Failed to fetch today's topic:", err);
        } finally {
          if (!cachedTopic) {
            setScreen('home');
          }
        }
      };
      fetchTopic();
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
      if (diff <= 0) { 
        setIsReady(true);
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          const lastNotified = localStorage.getItem('tot_last_notified');
          const todayStr = new Date().toDateString();
          if (lastNotified !== todayStr) {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('Time to read!', {
                  body: 'Your daily TOT is ready.',
                  icon: '/logo_black.png'
                });
              });
            } else {
              new Notification('Time to read!', {
                body: 'Your daily TOT is ready.',
                icon: '/logo.png'
              });
            }
            localStorage.setItem('tot_last_notified', todayStr);
          }
        }
        return;
      }

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

  const closeProfileMenu = () => {
    setIsClosingMenu(true);
    setTimeout(() => {
      setShowProfileMenu(false);
      setIsClosingMenu(false);
      setMenuView('main'); // Reset to main list for next time
    }, 300);
  };

  const renderProfileModal = () => {
    if (!showProfileMenu && !isClosingMenu) return null;
    const displayedHistory = menuView === 'saved' 
      ? userHistory.filter(h => h.isMarked) 
      : userHistory;

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (touchStartY === null) return;
      
      // Check if user is scrolling inside a scrollable list
      const scrollable = e.target.closest('.scrollable-area');
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;
      
      // If we are in a scrollable area, and pulling down while not at the top, let native scroll happen
      if (scrollable && scrollable.scrollTop > 0 && diff > 0) {
        return;
      }
      // If we are in a scrollable area and pulling up while not at the bottom, let native scroll happen
      if (scrollable && diff < 0 && scrollable.scrollHeight - scrollable.scrollTop > scrollable.clientHeight) {
        return;
      }

      if (diff > 0) {
        // Dragging down (closing direction)
        setModalTranslateY(diff);
      } else {
        // Dragging up (rubber banding effect)
        setModalTranslateY(diff * 0.25);
      }
    };

    const handleTouchEnd = () => {
      if (modalTranslateY > 120) {
        closeProfileMenu();
      }
      setTouchStartY(null);
      setModalTranslateY(0);
    };

    return (
      <div className={`${styles.profileModalOverlay} ${isClosingMenu ? styles.profileModalOverlayClosing : ''}`} onClick={closeProfileMenu}>
        <div 
          className={`${styles.profileModal} ${isClosingMenu ? styles.profileModalClosing : ''}`} 
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ transform: modalTranslateY !== 0 ? `translateY(${modalTranslateY}px)` : undefined, transition: touchStartY ? 'none' : 'transform 0.3s ease' }}
        >
          <div className={styles.dragHandle} />
          
          <div className={styles.sheetHeader}>
            <div className={styles.accountAvatar}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="t-heading-2">{profile?.name || user?.name || 'User'}</h3>
            <div className={styles.accountPlanBadge}>
              {profile?.plan === 'student' ? '🎓 Free for 1 year (Student)' 
                : profile?.plan === 'free_month' ? 'First month free' 
                : '$1 / month'}
            </div>
          </div>

          <div className={styles.profileModalBody} style={{ padding: 0 }}>
            {menuView === 'main' ? (
              <div className={`${styles.menuList} scrollable-area`}>
                <button className={styles.menuItem} onClick={() => setMenuView('saved')}>
                  <span className={styles.menuItemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                  </span>
                  Saved Articles
                </button>
                <button className={styles.menuItem} onClick={() => setMenuView('history')}>
                  <span className={styles.menuItemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </span>
                  Reading History
                </button>
                <button className={styles.menuItem} onClick={() => setMenuView('settings')}>
                  <span className={styles.menuItemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </span>
                  Edit Profile & Interests
                </button>
                <button className={styles.menuItem} onClick={() => setMenuView('payment')}>
                  <span className={styles.menuItemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </span>
                  Subscription & Billing
                </button>
                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.5rem 1rem' }} />
                <button className={styles.menuItem} onClick={() => logout(true)} style={{ color: '#ff6b6b' }}>
                  <span className={styles.menuItemIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </span>
                  Log Out
                </button>
              </div>
            ) : menuView === 'settings' ? (
              <div className={styles.accountFormSection}>
                <div className={styles.sheetTitleBar}>
                  <button className={styles.backBtn} onClick={() => setMenuView('main')}>←</button>
                  <h3 className="t-heading-3" style={{ margin: 0 }}>Edit Profile</h3>
                </div>

                <div className="scrollable-area" style={{ overflowY: 'auto', flex: 1, paddingBottom: '2rem' }}>
                  <div className={styles.formGroup}>
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={accountForm.name} 
                      onChange={e => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                    <label>Your Interests (Select at least 3)</label>
                    <div className={styles.categoriesGrid}>
                      {allCategories.map(cat => {
                        const isSelected = accountForm.categories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            className={`pill ${isSelected ? 'pill-selected' : ''}`}
                            onClick={() => toggleCategory(cat.id)}
                            style={{ fontSize: '0.875rem', padding: '6px 12px' }}
                          >
                            {cat.emoji} {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    className={`btn btn-primary btn-full ${styles.saveBtn}`}
                    onClick={handleSaveAccount}
                    disabled={isSavingAccount || accountForm.name.trim().length < 2 || accountForm.categories.length < 3}
                    style={{ marginTop: '2rem' }}
                  >
                    {isSavingAccount ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : menuView === 'payment' ? (
              <div className={styles.accountFormSection}>
                <div className={styles.sheetTitleBar}>
                  <button className={styles.backBtn} onClick={() => setMenuView('main')}>←</button>
                  <h3 className="t-heading-3" style={{ margin: 0 }}>Subscription & Billing</h3>
                </div>

                <div className="scrollable-area" style={{ overflowY: 'auto', flex: 1, paddingBottom: '2rem', padding: '1rem' }}>
                  <div style={{ background: 'var(--surface-3)', borderRadius: '12px', padding: '1.5rem' }}>
                    <h4 className="t-heading-4" style={{ margin: '0 0 1rem' }}>Your Plan</h4>
                    <p style={{ margin: '0 0 0.5rem', color: 'var(--white)', fontSize: '1.1rem' }}>
                      {profile?.plan === 'student' ? 'Student (Free Year)' : profile?.plan === 'free_month' ? 'Free Month' : 'Paid Subscription'}
                    </p>
                    <p style={{ margin: '0', color: 'var(--white-60)' }}>
                      Access valid until: {profile?.plan_expires_at ? new Date(profile.plan_expires_at).toLocaleDateString() : 'Unknown'}
                    </p>
                    
                    {profile?.dodo_subscription_id && (
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        style={{ 
                          marginTop: '2rem', 
                          border: '1px solid var(--error)', 
                          color: 'var(--error)', 
                          width: '100%',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {isCancelling ? 'Processing...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className={styles.sheetTitleBar}>
                  <button className={styles.backBtn} onClick={() => setMenuView('main')}>←</button>
                  <h3 className="t-heading-3" style={{ margin: 0 }}>{menuView === 'saved' ? 'Saved Articles' : 'Reading History'}</h3>
                </div>
                
                {isHistoryLoading ? (
                  <p style={{ textAlign: 'center', color: 'var(--white-60)', marginTop: '2rem' }}>Loading...</p>
                ) : displayedHistory.length > 0 ? (
                  <div className="scrollable-area" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1, paddingBottom: '2rem' }}>
                    {displayedHistory.map(item => (
                      <div key={item.id} className={styles.historyItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span className={styles.historyDate}>{item.date}</span>
                          <button 
                            className={`${styles.bookmarkBtn} ${item.isMarked ? styles.bookmarkBtnActive : ''}`}
                            onClick={() => toggleMark(item.id, item.isMarked)}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={item.isMarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </button>
                        </div>
                        <h3 className={styles.historyTitle}>{item.title}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--white-60)', marginTop: '2rem' }}>
                    {menuView === 'saved' ? 'No saved articles yet.' : 'No reading history yet.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
          <div className={styles.profileCircle} onClick={() => setShowProfileMenu(true)}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {renderProfileModal()}
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
                <div className={styles.articleHeaderTop}>
                  <span className="pill pill-selected" style={{ width: 'fit-content' }}>
                    {cat?.emoji || '✨'} {cat?.name || 'Topic'}
                  </span>
                  <button 
                    className={`${styles.bookmarkBtn} ${topic?.isMarked ? styles.bookmarkBtnActive : ''}`}
                    onClick={() => toggleMark(topic?.assignmentId, topic?.isMarked)}
                    title={topic?.isMarked ? "Remove bookmark" : "Bookmark this article"}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={topic?.isMarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>
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
          <div className={styles.profileCircle} onClick={() => setShowProfileMenu(true)}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {renderProfileModal()}
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

export default function App() {
  return (
    <DeviceGuard>
      <AppContent />
    </DeviceGuard>
  );
}

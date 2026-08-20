'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { categories, readingStyles, contentVibes, readingTimes } from '@/data/categories';
import Logo from '@/components/Logo';
import styles from './setup.module.css';

export default function SetupPage() {
  const router = useRouter();
  const { user, profile, isLoading, updateProfile } = useUser();

  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [readingStyle, setReadingStyle] = useState('');
  const [contentVibe, setContentVibe] = useState('');
  const [readingTime, setReadingTime] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/auth');
      return;
    }
    if (profile?.readingTime && profile?.gateCompleted) {
      router.push('/app');
    }
  }, [user, profile, isLoading, router]);

  if (isLoading || !user) return null;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => 
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsSaving(true);
    await updateProfile({
      name,
      categories: selectedCategories,
      readingStyle,
      contentVibe,
      readingTime
    });
    router.push('/gate');
  };

  return (
    <div className="app-desktop-shell">
      <div className="app-desktop-card">
        <div className={styles.page}>
          
          <div className={styles.header}>
            {step > 1 && (
              <button className={styles.backBtn} onClick={handleBack}>
                &larr; Back
              </button>
            )}
            <div className={styles.stepDots}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${styles.dot} ${step === i ? styles.dotActive : ''}`} />
              ))}
            </div>
          </div>

          <div className={styles.content} key={step}>
            {step === 1 && (
              <>
                <h1 className="t-heading-2">What should we call you?</h1>
                <p className="t-body" style={{ opacity: 0.7 }}>
                  This is how we'll address you in your daily briefings.
                </p>
                
                <div className={styles.inputGroup} style={{ marginTop: '24px' }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className={styles.footer}>
                  <button 
                    className="btn btn-primary btn-large btn-full"
                    onClick={handleNext}
                    disabled={name.length < 2}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="t-heading-2">Pick your interests</h1>
                <p className="t-body" style={{ opacity: 0.7, marginBottom: '16px' }}>
                  {selectedCategories.length} of {categories.length} selected (min 3)
                </p>

                <div className={styles.grid}>
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
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

                <div className={styles.footer}>
                  <button 
                    className="btn btn-primary btn-large btn-full"
                    onClick={handleNext}
                    disabled={selectedCategories.length < 3}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={{ paddingBottom: '20px' }}>
                  <h2 className="t-heading-2" style={{ marginBottom: '16px' }}>How do you read?</h2>
                  <div className={styles.cards}>
                    {readingStyles.map((style) => (
                      <div 
                        key={style.id}
                        className={`${styles.card} ${readingStyle === style.id ? styles.cardActive : ''}`}
                        onClick={() => setReadingStyle(style.id)}
                      >
                        <span className={styles.cardEmoji}>{style.emoji}</span>
                        <div className={styles.cardText}>
                          <span className={styles.cardTitle}>{style.label}</span>
                          <span className={`${styles.cardDesc} t-caption`}>{style.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h2 className="t-heading-2" style={{ marginTop: '32px', marginBottom: '16px' }}>What's your vibe?</h2>
                  <div className={styles.cards}>
                    {contentVibes.map((vibe) => (
                      <div 
                        key={vibe.id}
                        className={`${styles.card} ${contentVibe === vibe.id ? styles.cardActive : ''}`}
                        onClick={() => setContentVibe(vibe.id)}
                      >
                        <span className={styles.cardEmoji}>{vibe.emoji}</span>
                        <div className={styles.cardText}>
                          <span className={styles.cardTitle}>{vibe.label}</span>
                          <span className={`${styles.cardDesc} t-caption`}>{vibe.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.footer}>
                  <button 
                    className="btn btn-primary btn-large btn-full"
                    onClick={handleNext}
                    disabled={!readingStyle || !contentVibe}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="t-heading-2">When's your reading time?</h1>
                <p className="t-body" style={{ opacity: 0.7, marginBottom: '16px' }}>
                  We'll prepare your personalized edition just in time.
                </p>

                <div className={styles.cards}>
                  {readingTimes.map((time) => (
                    <div 
                      key={time.id}
                      className={`${styles.card} ${readingTime === time.id ? styles.cardActive : ''}`}
                      onClick={() => setReadingTime(time.id)}
                    >
                      <span className={styles.cardEmoji}>{time.emoji}</span>
                      <div className={styles.cardText}>
                        <span className={styles.cardTitle}>{time.label}</span>
                        <span className={`${styles.cardDesc} t-caption`}>{time.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.footer}>
                  <button 
                    className="btn btn-primary btn-large btn-full"
                    onClick={handleFinish}
                    disabled={!readingTime || isSaving}
                  >
                    {isSaving ? 'Finishing...' : 'Finish'}
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

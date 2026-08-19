'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Logo from '@/components/Logo';
import styles from './organizations.module.css';

export default function Organizations() {
  const [formState, setFormState] = useState({
    companyName: '',
    email: '',
    teamSize: '1-10',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('tot_org_lead', JSON.stringify(formState));
    setSubmitted(true);
  };

  return (
    <div className={`has-nav ${styles.page}`}>
      <Nav />
      <div className={styles.container}>
        <div className={styles.hero}>
          <Logo size={60} />
          <h1 className="t-display">Give your team one good read every day</h1>
          <p className="t-body-large">
            TOT for organizations brings daily learning to your workplace. Set up in 5 minutes.
          </p>
          <a href="#contact" className="btn btn-primary btn-large">
            Get started
          </a>
        </div>

        <div className={styles.plans}>
          <div className="pricing-card">
            <h2 className={styles.planName}>Starter</h2>
            <div className={styles.planSeats}>Up to 25 seats</div>
            <div className="t-display">$5<span className="t-body">/seat/month</span></div>
            <ul className="pricing-features">
              <li>✓ Team dashboard</li>
              <li>✓ All categories</li>
              <li>✓ Email support</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h2 className={styles.planName}>Growth</h2>
            <div className={styles.planSeats}>Up to 100 seats</div>
            <div className="t-display">$4<span className="t-body">/seat/month</span></div>
            <ul className="pricing-features">
              <li>✓ Team dashboard</li>
              <li>✓ All categories</li>
              <li>✓ Email support</li>
              <li>✓ Custom categories</li>
              <li>✓ Analytics export</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h2 className={styles.planName}>Enterprise</h2>
            <div className={styles.planSeats}>Unlimited seats</div>
            <div className="t-display">Custom</div>
            <ul className="pricing-features">
              <li>✓ Everything in Growth</li>
              <li>✓ SSO/SAML</li>
              <li>✓ Custom content</li>
              <li>✓ Dedicated manager</li>
              <li>✓ API access</li>
            </ul>
          </div>
        </div>

        <div className={styles.stepsSection}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3>Create your account</h3>
            <p className="t-body">Enter your company email. Pick a plan.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3>Invite your team</h3>
            <p className="t-body">Share a link or add emails. They&apos;re in.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3>Watch engagement grow</h3>
            <p className="t-body">Track who&apos;s reading, what resonates, and how your team learns.</p>
          </div>
        </div>

        <div id="contact" className={styles.contactSection}>
          <h2>Ready to get started?</h2>
          {submitted ? (
            <div className={styles.successMsg}>
              <h3>Thanks for your interest!</h3>
              <p className="t-body">We&apos;ll get back to you within 24 hours to set up your team.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                className="input"
                placeholder="Company name"
                required
                value={formState.companyName}
                onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
              />
              <input
                type="email"
                className="input"
                placeholder="Work email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
              <select
                className={styles.select}
                value={formState.teamSize}
                onChange={(e) => setFormState({ ...formState, teamSize: e.target.value })}
              >
                <option value="1-10">1-10 seats</option>
                <option value="11-25">11-25 seats</option>
                <option value="26-100">26-100 seats</option>
                <option value="100+">100+ seats</option>
              </select>
              <button type="submit" className="btn btn-primary btn-large">
                Get started
              </button>
              <p className="t-caption" style={{ textAlign: 'center' }}>
                We&apos;ll get back to you within 24 hours
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

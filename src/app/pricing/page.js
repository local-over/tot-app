import Link from 'next/link';
import Nav from '@/components/Nav';
import styles from './pricing.module.css';

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <Nav />
      <div className="has-nav">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className="t-display">Simple pricing</h1>
            <p className="t-body">Start free. Upgrade when you're ready.</p>
          </div>

          <div className={styles.grid}>
            {/* Card 1 */}
            <div className="pricing-card">
              <div className={styles.cardEmoji}>🎓</div>
              <h2 className={styles.cardTitle}>Student Access</h2>
              <div className="pricing-price">Free</div>
              <div className="pricing-price-period">for your first year</div>
              
              <ul className="pricing-features">
                <li>One topic every day</li>
                <li>All 12 categories</li>
                <li>Personal recommendations</li>
                <li>Reading streak tracking</li>
              </ul>
              
              <Link href="/verify-student" className="btn btn-secondary btn-full">
                Verify with .edu email
              </Link>
              <div className={styles.cardNote}>Valid university email required</div>
            </div>

            {/* Card 2 */}
            <div className="pricing-card pricing-card-featured">
              <div className="pricing-badge">MOST POPULAR</div>
              <div className={styles.cardEmoji}>☀️</div>
              <h2 className={styles.cardTitle}>Individual</h2>
              <div className={styles.cardSubline}>First month free</div>
              <div className="pricing-price">$1</div>
              <div className="pricing-price-period">/month</div>
              
              <ul className="pricing-features">
                <li>Everything in Student, plus:</li>
                <li>Priority topic matching</li>
                <li>Reading history &amp; stats</li>
                <li>Support development</li>
              </ul>
              
              <Link href="/login" className="btn btn-primary btn-large btn-full">
                Start my free month
              </Link>
              <div className={styles.cardNote}>No credit card required. Cancel anytime.</div>
            </div>

          </div>

          <div className="trust-bar" style={{ marginTop: '80px' }}>
            <div className="trust-label">FREE FOR STUDENTS AT 50+ UNIVERSITIES</div>
            <div className="trust-logos">
              <span>MIT</span>
              <span>Stanford</span>
              <span>Oxford</span>
              <span>ETH Zurich</span>
              <span>+ 50 more colleges</span>
            </div>
          </div>

          <div className={styles.faqSection}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What happens after my free month?</h3>
              <p className={styles.faqAnswer}>You'll get a gentle reminder. If you choose to continue, it's $1/month. If not, no worries — no charge.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do you verify students?</h3>
              <p className={styles.faqAnswer}>Enter your university email (.edu or equivalent). We'll send a verification link. That's it.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I switch plans?</h3>
              <p className={styles.faqAnswer}>Yes, anytime. Upgrade, downgrade, or cancel with one click.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Why only $1?</h3>
              <p className={styles.faqAnswer}>We keep costs low by recommending from curated topic groups, not building custom content per person. One dollar keeps the lights on.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

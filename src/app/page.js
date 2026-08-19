import Link from 'next/link';
import Nav from '@/components/Nav';
import Logo from '@/components/Logo';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={`${styles.container} has-nav`}>
      <Nav />
      <header className={styles.hero}>
        <div className={styles.logoContainer}>
          <Logo size={80} glow />
        </div>
        <h1 className={styles.title}>One topic. Every day.</h1>
        <p className={styles.subtitle}>
          TOT picks one thing worth reading each morning. Matched to what you actually care about. Read it. Rate it. Come back tomorrow.
        </p>
        <Link href="/app" className={styles.cta}>
          Start reading
        </Link>
        <p className={styles.note}>Free. No account needed.</p>
      </header>

      <section className={styles.howItWorks}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>01</span>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Pick your interests</h2>
            <p className={styles.stepDesc}>Choose from 12 categories. Science, psychology, food, sports — whatever you're into.</p>
          </div>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>02</span>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Read one topic</h2>
            <p className={styles.stepDesc}>Every day at your chosen time, one short article appears. Just for you.</p>
          </div>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>03</span>
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Rate and move on</h2>
            <p className={styles.stepDesc}>Three quick questions. We learn what you like and pick better topics tomorrow.</p>
          </div>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className={styles.categories}>
          {[
            "🔬 Science & Nature", "💻 Technology & AI", "📜 History",
            "🧠 Psychology & Mind", "💰 Business & Money", "🏋️ Health & Body",
            "🎨 Art & Design", "💭 Philosophy", "🌍 World & Society",
            "🍕 Food & Travel", "⚽ Sports", "🎬 Entertainment"
          ].map(cat => (
            <span key={cat} className={styles.pill}>{cat}</span>
          ))}
        </div>
      </section>

      <section className={styles.antiScrollSection}>
        <h2 className="t-heading-1">Reclaim your morning.</h2>
        <p className="t-body" style={{ color: 'var(--white-70)', marginTop: '16px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          84% of people start their day scrolling through addictive feeds. Replace the doomscroll with one high-quality, thought-provoking topic.
        </p>
      </section>

      <section className={styles.trustSection}>
        <div className="stats-bar">
          <div className="stat">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">daily readers</div>
          </div>
          <div className="stat">
            <div className="stat-number">50+</div>
            <div className="stat-label">universities</div>
          </div>
          <div className="stat">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">average rating</div>
          </div>
        </div>
        <div className="trust-bar">
          <p className="trust-label">Free for students at 50+ universities</p>
          <div className="trust-logos">
            <span>MIT</span>
            <span>Stanford</span>
            <span>Oxford</span>
            <span>ETH Zürich</span>
            <span>+ 50 more colleges</span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>TOT — The Only Topic</p>
        <p className={styles.footerSub}>Made for people who read</p>
        <div className={styles.footerLinks}>
          <Link href="/pricing">Pricing</Link>
          <Link href="/organizations">Organizations</Link>
        </div>
      </footer>
    </div>
  );
}

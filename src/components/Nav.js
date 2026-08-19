import Link from 'next/link';
import Logo from './Logo';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <Logo size={32} />
          <span className="nav-brand-text">TOT</span>
        </Link>
        <div className="nav-links">
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/login" className="nav-link nav-link-cta">Log in</Link>
        </div>
      </div>
    </nav>
  );
}

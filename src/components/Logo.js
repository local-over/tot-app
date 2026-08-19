import Image from 'next/image';

export default function Logo({ size = 80, glow = false, className = '' }) {
  const glowStyle = glow
    ? { filter: 'drop-shadow(0 0 24px rgba(245, 166, 35, 0.35))' }
    : {};

  return (
    <Image
      src="/logo.png"
      alt="TOT Logo"
      width={size}
      height={size}
      className={className}
      style={{ ...glowStyle, objectFit: 'contain' }}
      priority
    />
  );
}

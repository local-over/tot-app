import Image from 'next/image';

export default function Logo({ size = 80, className = '' }) {
  return (
    <div style={{ width: size, height: size, position: 'relative' }} className={className}>
      <Image
        src="/logo.png"
        alt="TOT Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
}

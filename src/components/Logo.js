export default function Logo({ size = 80, glow = false, className = '' }) {
  // Exact recreation of the user's sunrise/horizon logo:
  // - Cream/beige (#E0D5C5) half-arc stroke sitting on a horizon line
  // - Golden amber (#F5A623) solid circle at upper-right of the arc
  // - Transparent background, works on both black and white

  const glowStyle = glow
    ? { filter: 'drop-shadow(0 0 24px rgba(245, 166, 35, 0.35))' }
    : {};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowStyle}
      aria-label="TOT logo"
    >
      {/* Half-arc (sunrise arch) */}
      <path
        d="M 50 140 A 55 55 0 0 1 150 140"
        stroke="#E0D5C5"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      {/* Horizon line */}
      <line
        x1="42"
        y1="140"
        x2="158"
        y2="140"
        stroke="#E0D5C5"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Sun dot */}
      <circle
        cx="145"
        cy="82"
        r="16"
        fill="#F5A623"
      />
    </svg>
  );
}

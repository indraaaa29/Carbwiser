

export function AmbientBackground() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="footprint-glow" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#b0f0d6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#003527" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#footprint-glow)" />
        <path d="M0,100 C30,80 70,90 100,60 L100,100 Z" fill="#002117" opacity="0.3" />
        <path d="M0,100 C40,90 60,70 100,80 L100,100 Z" fill="#0b513d" opacity="0.2" />
      </svg>
    </div>
  );
}

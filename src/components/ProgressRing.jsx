export default function ProgressRing({ progress, size = 52 }) {
  const r = 20, circ = 2 * Math.PI * r, offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="-rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
      <circle cx="24" cy="24" r={r} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-700" style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }} />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="12" fontWeight="600"
        className="rotate-90 origin-center">{progress}%</text>
    </svg>
  );
}

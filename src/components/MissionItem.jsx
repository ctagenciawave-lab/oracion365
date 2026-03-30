export default function MissionItem({ icon, label, done, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3.5 p-[14px_18px] rounded-2xl border text-left transition-all duration-300 ${
      done ? 'bg-spirit-500/[0.06] border-spirit-500/[0.12]' : 'bg-white/[0.015] border-white/[0.04]'
    }`}>
      <span className="text-base">{icon}</span>
      <span className={`flex-1 text-[13px] transition-all duration-300 ${done ? 'text-white/35 line-through' : 'text-white/60'}`}>{label}</span>
      <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
        done ? 'border-spirit-400/50 bg-spirit-500/15' : 'border-white/[0.08]'
      } ${done ? 'animate-check-pop' : ''}`}>
        {done && <svg className="w-[11px] h-[11px] text-spirit-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
    </button>
  );
}

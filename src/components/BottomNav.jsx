const tabs = [
  { id:'home', label:'Inicio', d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { id:'plans', label:'Planes', d:'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' },
  null,
  { id:'community', label:'Oración', d:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8' },
  { id:'journal', label:'Diario', d:'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
];

export default function BottomNav({ activeTab, onTabChange, onPray }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="absolute inset-0 bg-night-950/[0.92] backdrop-blur-xl border-t border-white/[0.03]" />
      <div className="relative max-w-lg mx-auto flex items-center justify-around px-3 pt-1.5 pb-2.5 safe-bottom">
        {tabs.map((tab, i) => {
          if (!tab) return (
            <button key="cta" onClick={onPray}
              className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-spirit-600 to-spirit-500 flex items-center justify-center -mt-5 shadow-[0_4px_20px_rgba(124,58,237,0.3)] active:scale-95 transition-transform">
              <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
            </button>
          );
          const a = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 ${a ? 'text-spirit-400' : 'text-white/15'}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d={tab.d} /></svg>
              <span className={`text-[9px] font-medium tracking-wider uppercase ${a ? 'text-spirit-300/60' : 'text-white/10'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

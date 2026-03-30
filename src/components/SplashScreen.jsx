export default function SplashScreen() {
  return (
    <div className="fixed inset-0 gradient-bg flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-[18px] bg-gradient-to-br from-spirit-500 to-spirit-700 flex items-center justify-center animate-breathe">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L12 22"/><path d="M5 8L19 8"/></svg>
        </div>
        <h1 className="font-display text-2xl text-white/80 tracking-wide">Oración 365</h1>
        <div className="mt-6"><div className="w-6 h-6 border-2 border-spirit-500/30 border-t-spirit-400 rounded-full animate-spin mx-auto" /></div>
      </div>
    </div>
  );
}

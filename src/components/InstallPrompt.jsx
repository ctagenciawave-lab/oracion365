import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) return;
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 86400000) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    if (ios) { setTimeout(() => setShow(true), 5000); return; }

    const h = (e) => { e.preventDefault(); setPrompt(e); setTimeout(() => setShow(true), 3000); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  const install = async () => { if (prompt) { prompt.prompt(); const { outcome } = await prompt.userChoice; if (outcome === 'accepted') setShow(false); setPrompt(null); } };
  const dismiss = () => { setShow(false); setShowGuide(false); localStorage.setItem('pwa-dismissed', String(Date.now())); };

  if (!show) return null;

  if (isIOS && showGuide) return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end justify-center p-4" onClick={dismiss}>
      <div className="w-full max-w-sm glass rounded-3xl p-6 mb-4 animate-fade-up" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg text-white mb-4">Instalar Oración 365</h3>
        <div className="space-y-3 text-sm text-white/60">
          <p><span className="text-spirit-300 font-medium">1.</span> Toca <strong className="text-white">Compartir</strong> en Safari</p>
          <p><span className="text-spirit-300 font-medium">2.</span> <strong className="text-white">"Agregar a pantalla de inicio"</strong></p>
          <p><span className="text-spirit-300 font-medium">3.</span> Toca <strong className="text-white">"Agregar"</strong></p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto animate-fade-up">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spirit-500 to-spirit-700 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L12 22"/><path d="M5 8L19 8"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">Instalar Oración 365</p>
          <p className="text-white/30 text-xs">Accede desde tu pantalla</p>
        </div>
        <button onClick={isIOS ? () => setShowGuide(true) : install} className="px-4 py-2 rounded-xl bg-spirit-500 text-white text-sm font-medium shrink-0 active:scale-95 transition-transform">
          {isIOS ? 'Cómo' : 'Instalar'}
        </button>
        <button onClick={dismiss} className="text-white/15 shrink-0 text-xs">✕</button>
      </div>
    </div>
  );
}

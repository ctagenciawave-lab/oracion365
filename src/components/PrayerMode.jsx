import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { getTomorrowContent, emotionalFeedback } from '../data/content';

export default function PrayerMode({ content, onClose }) {
  const { saveReflection, updateStreak, markMission } = useApp();
  const [step, setStep] = useState(0);
  const [cd, setCd] = useState(10);
  const [vis, setVis] = useState(true);
  const [txt, setTxt] = useState('');
  const [saving, setSaving] = useState(false);
  const [emotional] = useState(() => emotionalFeedback[Math.floor(Math.random() * emotionalFeedback.length)]);
  const tomorrow = getTomorrowContent();

  useEffect(() => { if (step !== 0 || cd <= 0) return; const t = setTimeout(() => setCd(c => c - 1), 1000); return () => clearTimeout(t); }, [step, cd]);
  useEffect(() => { if (step === 0 && cd === 0) go(); }, [cd, step]);

  const go = useCallback(() => { setVis(false); setTimeout(() => { setStep(s => s + 1); setVis(true); }, 600); }, []);

  const handleSave = async () => {
    if (!txt.trim()) return;
    setSaving(true);
    try {
      await saveReflection(txt.trim());
      await updateStreak();
    } catch (e) { console.error('Save error:', e); }
    setSaving(false);
    go();
  };

  const handleSkip = async () => {
    try { await updateStreak(); } catch (e) { console.error('Streak error:', e); }
    go();
  };

  const handleDone = () => {
    try { markMission('prayer'); markMission('devotional'); } catch (e) {}
    onClose();
  };

  const dots = Array.from({ length: 7 });

  return (
    <div className="fixed inset-0 z-50 gradient-bg flex flex-col">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-spirit-600/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-20 flex justify-between items-center px-5 pt-[52px] pb-3">
        <button onClick={onClose} className="w-[38px] h-[38px] rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/30 text-base">\u2715</button>
        <div className="flex gap-1">
          {dots.map((_, i) => (
            <div key={i} className="h-[2.5px] rounded-full transition-all duration-600" style={{ width: i <= step ? 24 : 5, background: i <= step ? '#8b5cf6' : 'rgba(255,255,255,0.06)', transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }} />
          ))}
        </div>
        <div className="w-[38px]" />
      </div>
      <div className={`flex-1 flex items-center justify-center relative z-10 transition-all duration-600 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)' }}>
        {step === 0 && (
          <div className="flex flex-col items-center text-center px-10">
            <div className="w-[140px] h-[140px] rounded-full border border-white/[0.06] flex items-center justify-center mb-10 animate-breathe">
              <div className="w-[100px] h-[100px] rounded-full border border-white/[0.03] flex items-center justify-center">
                <span className="font-display text-[52px] text-white/70 font-light">{cd}</span>
              </div>
            </div>
            <h2 className="font-display text-[26px] text-white/85 mb-3 font-normal tracking-wide">Respira profundo...</h2>
            <p className="text-white/30 text-sm max-w-[260px] leading-relaxed">Cierra tus ojos. Inhala paz, exhala preocupaci\u00f3n.</p>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center text-center px-9">
            <p className="text-gold-400/40 text-[11px] tracking-[4px] uppercase mb-7 font-medium">Dios quiere hablarte hoy</p>
            <p className="font-display text-[23px] text-white/[0.88] italic leading-relaxed max-w-[320px] mb-4">"\u201c{content.t}\u201d"</p>
            <p className="text-spirit-400/50 text-[13px] font-medium mb-11">\u2014 {content.v}</p>
            <button onClick={go} className="px-11 py-[13px] rounded-full text-white/50 border border-white/[0.06] bg-white/[0.02] text-sm">Continuar</button>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center text-center px-9">
            <p className="text-spirit-400/35 text-[11px] tracking-[4px] uppercase mb-7 font-medium">Reflexiona</p>
            <p className="text-white/75 text-lg leading-relaxed max-w-[320px] mb-11">{content.r}</p>
            <button onClick={go} className="px-11 py-[13px] rounded-full text-white/50 border border-white/[0.06] bg-white/[0.02] text-sm">Continuar</button>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center text-center px-9">
            <div className="text-[28px] mb-7 animate-pulse">\ud83d\ude4f</div>
            <p className="text-spirit-400/35 text-[11px] tracking-[4px] uppercase mb-6 font-medium">Habla con Dios</p>
            <p className="font-display text-[19px] text-white/80 italic leading-relaxed max-w-[320px] mb-5">{content.p}</p>
            <p className="text-white/20 text-xs mb-9">T\u00f3mate tu tiempo...</p>
            <button onClick={go} className="px-11 py-[13px] rounded-full text-white/50 border border-white/[0.06] bg-white/[0.02] text-sm">Am\u00e9n</button>
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-col items-center text-center px-9">
            <div className="w-[72px] h-[72px] rounded-full bg-gold-500/[0.08] flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-gold-400/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" /></svg>
            </div>
            <p className="font-display text-[22px] text-white leading-relaxed max-w-[280px] mb-11 whitespace-pre-line">{emotional}</p>
            <button onClick={go} className="px-11 py-[13px] rounded-full text-white/50 border border-white/[0.06] bg-white/[0.02] text-sm">Continuar</button>
          </div>
        )}
        {step === 5 && (
          <div className="flex flex-col items-center px-7 w-full max-w-[380px]">
            <p className="text-spirit-400/35 text-[11px] tracking-[4px] uppercase mb-3 font-medium">Tu diario con Dios</p>
            <h2 className="font-display text-[24px] text-white/[0.88] mb-7 text-center font-normal">\u00bfQu\u00e9 sentiste hoy?</h2>
            <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Escribe lo que Dios puso en tu coraz\u00f3n..."
              className="w-full h-[120px] px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-white/20 text-[15px] leading-relaxed resize-none outline-none focus:border-spirit-500/40 transition-all font-body" autoFocus />
            <button onClick={handleSave} disabled={saving || !txt.trim()} className="w-full py-4 rounded-2xl bg-gradient-to-r from-spirit-600 to-spirit-500 text-white text-base font-medium mt-4 disabled:opacity-25 flex items-center justify-center border-none cursor-pointer">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Guardar reflexi\u00f3n'}
            </button>
            <button onClick={handleSkip} className="mt-3.5 text-white/20 text-[13px] bg-transparent border-none cursor-pointer">Omitir por hoy</button>
          </div>
        )}
        {step === 6 && (
          <div className="flex flex-col items-center text-center px-9">
            <div className="text-[48px] mb-5">\u2728</div>
            <h2 className="font-display text-[26px] text-white mb-2 font-normal">\u00a1Momento completado!</h2>
            <p className="text-white/30 text-sm max-w-[260px] leading-relaxed mb-8">Tu fidelidad de hoy tiene un impacto eterno.</p>
            <div className="w-full max-w-[300px] p-[18px_24px] rounded-2xl bg-spirit-500/[0.06] border border-spirit-500/10 mb-8">
              <p className="text-spirit-400/50 text-[10px] tracking-[3px] uppercase mb-2 font-semibold">Ma\u00f1ana descubrir\u00e1s</p>
              <p className="text-white/70 text-[15px] italic">"{tomorrow.hook}"</p>
            </div>
            <button onClick={handleDone} className="w-full max-w-[300px] py-4 rounded-2xl bg-gradient-to-r from-spirit-600 to-spirit-500 text-white text-base font-medium border-none cursor-pointer">Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
}

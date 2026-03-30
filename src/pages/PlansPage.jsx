import { useState, useEffect } from 'react';
import { plans } from '../data/content';
import { useApp } from '../contexts/AppContext';

function PlanDayView({ plan, dayIdx, done, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [vis, setVis] = useState(true);
  const day = plan.days[dayIdx];
  const go = () => { setVis(false); setTimeout(() => { setStep(s => s + 1); setVis(true); }, 400); };
  const labels = ['Versículo', 'Devocional', 'Oración'];

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-white/25 text-[13px] mb-7">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>Volver
        </button>
        <p className="text-[10px] tracking-[3px] uppercase mb-1.5" style={{ color: plan.color, opacity: 0.6 }}>{plan.title} · Día {day.day}</p>
        <h2 className="font-display text-[22px] text-white mb-6 font-normal">{day.title}</h2>
        <div className="flex gap-1.5 mb-6">
          {labels.map((l, i) => <div key={i} className="flex-1"><div className="h-[2.5px] rounded-full transition-all duration-500" style={{ background: i <= step ? plan.color : 'rgba(255,255,255,0.04)' }} /><p className={`text-[9px] text-center mt-1.5 ${i <= step ? 'text-white/40' : 'text-white/[0.12]'}`}>{l}</p></div>)}
        </div>
        <div className={`transition-all duration-400 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}`}>
          {step === 0 && <div className="animate-fade-in"><div className="card"><p className="text-gold-400/40 text-[10px] tracking-[3px] uppercase mb-4">{day.verse}</p><p className="font-display text-lg text-white/85 italic leading-relaxed">"{day.text}"</p></div><button className="btn-primary mt-4" style={{ background: plan.color }} onClick={go}>Continuar</button></div>}
          {step === 1 && <div className="animate-fade-in"><div className="card"><p className="text-spirit-400/35 text-[10px] tracking-[3px] uppercase mb-4">Un mensaje para tu corazón</p><p className="text-white/60 text-[15px] leading-relaxed">{day.dev}</p></div><button className="btn-primary mt-4" style={{ background: plan.color }} onClick={go}>Continuar</button></div>}
          {step === 2 && <div className="animate-fade-in"><div className="card"><div className="flex items-center gap-2.5 mb-3.5"><span className="text-lg animate-pulse">🙏</span><p className="text-spirit-400/35 text-[10px] tracking-[3px] uppercase">Habla con Dios</p></div><p className="font-display text-[17px] text-white/80 italic leading-relaxed">{day.pray}</p></div>
            {!done ? <button className="btn-primary mt-4" style={{ background: plan.color }} onClick={onComplete}>Completar día {day.day} ✓</button>
            : <p className="text-center mt-5 text-sm" style={{ color: plan.color, opacity: 0.6 }}>✓ Completado</p>}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const { getPlanProgress, savePlanProgress } = useApp();
  const [prog, setProg] = useState({});
  const [selPlan, setSelPlan] = useState(null);
  const [selDay, setSelDay] = useState(null);

  useEffect(() => { (async () => { const p = {}; for (const pl of plans) p[pl.id] = await getPlanProgress(pl.id); setProg(p); })(); }, []);

  const complete = async (pid, day) => { await savePlanProgress(pid, day); setProg(p => ({ ...p, [pid]: [...new Set([...(p[pid] || []), day])] })); setSelDay(null); };

  if (selPlan !== null && selDay !== null) {
    const p = plans[selPlan];
    return <PlanDayView plan={p} dayIdx={selDay} done={(prog[p.id] || []).includes(selDay + 1)} onComplete={() => complete(p.id, selDay + 1)} onBack={() => setSelDay(null)} />;
  }

  if (selPlan !== null) {
    const p = plans[selPlan], done = prog[p.id] || [], pct = Math.round(done.length / p.totalDays * 100);
    return (
      <div className="min-h-screen pb-28 relative">
        <div className="fixed inset-0 gradient-bg pointer-events-none" />
        <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
          <button onClick={() => setSelPlan(null)} className="flex items-center gap-2 text-white/25 text-[13px] mb-6"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>Volver</button>
          <div className="flex items-center gap-3.5 mb-5"><span className="text-[32px]">{p.emoji}</span><div><h1 className="font-display text-xl text-white font-normal">{p.title}</h1><p className="text-white/25 text-xs">{p.desc}</p></div></div>
          <div className="mb-5"><div className="flex justify-between text-[11px] mb-1.5"><span className="text-white/20">Día {done.length} de {p.totalDays}</span><span style={{ color: p.color, opacity: 0.6 }}>{pct}%</span></div><div className="h-1 bg-white/[0.03] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: p.color }} /></div></div>
          <div className="flex flex-col gap-1.5">
            {p.days.map((d, i) => { const isDone = done.includes(i + 1), isNext = !isDone && (i === 0 || done.includes(i)); return (
              <button key={i} onClick={() => setSelDay(i)} className={`w-full flex items-center gap-3 p-[13px_16px] rounded-[14px] border text-left transition-all ${isDone ? 'border-white/[0.04] bg-white/[0.02]' : isNext ? 'border-white/[0.06] bg-white/[0.025]' : 'border-white/[0.03] bg-white/[0.01]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-white/[0.06]' : isNext ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white/[0.015]'}`}>
                  {isDone ? <svg className="w-3 h-3" style={{ color: p.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : <span className={`text-xs font-medium ${isNext ? 'text-white/50' : 'text-white/15'}`}>{d.day}</span>}
                </div>
                <div className="flex-1 min-w-0"><p className={`text-[13px] font-medium truncate ${isDone ? 'text-white/35' : isNext ? 'text-white/70' : 'text-white/20'}`}>{d.title}</p><p className="text-[10px] text-white/[0.12] mt-0.5">{d.verse}</p></div>
              </button>
            ); })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
        <div className="mb-7 animate-fade-up"><p className="text-white/25 text-[13px] mb-1 font-light">Planes temáticos</p><h1 className="font-display text-2xl text-white font-normal">Crece en tu fe</h1></div>
        <div className="flex flex-col gap-3.5">
          {plans.map((p, idx) => { const done = prog[p.id] || [], pct = Math.round(done.length / p.totalDays * 100); return (
            <button key={p.id} onClick={() => setSelPlan(idx)} className="card text-left w-full animate-fade-up opacity-0" style={{ animationDelay: `${idx * 80 + 80}ms` }}>
              <div className="flex items-center gap-3.5 mb-3">
                <span className="text-[28px]">{p.emoji}</span>
                <div className="flex-1 min-w-0"><h2 className="font-display text-[17px] text-white font-normal">{p.title}</h2><p className="text-white/25 text-xs">{p.totalDays} días · {p.desc}</p></div>
                <svg className="w-3.5 h-3.5 text-white/10 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
              {done.length > 0 && <div><div className="flex justify-between text-[10px] mb-1"><span className="text-white/20">{done.length}/{p.totalDays}</span><span style={{ color: p.color, opacity: 0.5 }}>{pct}%</span></div><div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color }} /></div></div>}
            </button>
          ); })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getTodayContent, getGreeting, getStreakMessage } from '../data/content';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import PrayerMode from '../components/PrayerMode';
import MissionItem from '../components/MissionItem';
import ProgressRing from '../components/ProgressRing';
import Calendar from '../components/Calendar';

export default function HomePage() {
  const { profile, signOut } = useAuth();
  const { todayCompleted, markMission, loadTodayStatus, toggleFavorite, isFavorite } = useApp();
  const [showPrayer, setShowPrayer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const content = getTodayContent();
  const streak = profile?.streak || 0;

  useEffect(() => { loadTodayStatus(); }, [loadTodayStatus]);
  useEffect(() => { isFavorite(content.v).then(setIsFav); }, [content.v]);

  const handleFav = async () => { const r = await toggleFavorite(content.v, content.t); setIsFav(r); };

  const mDone = Object.values(todayCompleted).filter(Boolean).length;
  const mPct = Math.round((mDone / 3) * 100);

  if (showPrayer) return <PrayerMode content={content} onClose={() => setShowPrayer(false)} />;

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      <div className="fixed -top-[10%] -right-[20%] w-[500px] h-[500px] bg-spirit-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] -left-[15%] w-[400px] h-[400px] bg-gold-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div>
            <p className="text-white/25 text-[13px] mb-1 font-light">{getGreeting()}</p>
            <h1 className="font-display text-2xl font-normal text-white tracking-wide">Oración 365</h1>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/30">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 glass rounded-2xl p-5 animate-fade-in space-y-3">
            {profile?.longest_streak > 0 && <p className="text-white/25 text-xs">Racha más larga: {profile.longest_streak} días</p>}
            <button onClick={signOut} className="text-red-400/60 text-sm">Cerrar sesión</button>
          </div>
        )}

        {/* Streak + Progress */}
        <div className="flex items-center gap-4 mb-7 animate-fade-up opacity-0" style={{ animationDelay: '80ms' }}>
          <div className="card flex-1 !p-[16px_20px] flex items-center gap-3.5">
            <span className={`text-[28px] ${streak >= 7 ? '' : 'animate-breathe'}`}>{streak >= 7 ? '🏆' : '🔥'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-lg font-semibold">{streak} {streak === 1 ? 'día' : 'días'}</p>
              <p className="text-white/25 text-[11px] leading-snug truncate">{getStreakMessage(streak)}</p>
            </div>
          </div>
          <ProgressRing progress={mPct} />
        </div>

        {/* Verse */}
        <div className="card mb-4 relative overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: '160ms' }}>
          <div className="absolute -top-5 -right-5 w-[120px] h-[120px] bg-gold-500/[0.03] rounded-full blur-[40px] pointer-events-none" />
          <div className="flex justify-between items-center mb-3.5">
            <p className="text-gold-400/40 text-[10px] tracking-[3.5px] uppercase font-semibold">Dios quiere hablarte hoy</p>
            <button onClick={handleFav} className="transition-all active:scale-90 p-1">
              <svg className={`w-[18px] h-[18px] transition-colors ${isFav ? 'text-red-400 fill-red-400' : 'text-white/[0.12]'}`}
                viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
          <p className="font-display text-[19px] text-white/[0.88] italic leading-relaxed mb-3.5">"{content.t}"</p>
          <p className="text-spirit-400/45 text-xs font-medium">— {content.v}</p>
        </div>

        {/* Devotional */}
        <div className="card mb-5 animate-fade-up opacity-0" style={{ animationDelay: '240ms' }} onClick={() => markMission('devotional')}>
          <p className="text-spirit-400/30 text-[10px] tracking-[3.5px] uppercase mb-3.5 font-semibold">Un mensaje para tu corazón</p>
          <p className="text-white/55 text-[14.5px] leading-[1.75]">{content.d}</p>
        </div>

        {/* CTA */}
        <div className="mb-7 animate-fade-up opacity-0" style={{ animationDelay: '320ms' }}>
          <button onClick={() => setShowPrayer(true)} className="btn-primary animate-glow flex items-center justify-center gap-3">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
            Comenzar mi momento con Dios
          </button>
        </div>

        {/* Missions */}
        <div className="mb-7 animate-fade-up opacity-0" style={{ animationDelay: '400ms' }}>
          <div className="flex justify-between items-center mb-3.5 px-1">
            <p className="text-white/[0.18] text-[10px] tracking-[3px] uppercase font-semibold">Misión de hoy</p>
            <p className="text-spirit-400/40 text-xs font-medium">{mDone}/3</p>
          </div>
          <div className="flex flex-col gap-2">
            <MissionItem icon="📖" label="Leer el mensaje de hoy" done={todayCompleted.devotional} onClick={() => markMission('devotional')} />
            <MissionItem icon="🙏" label="Completar tu momento con Dios" done={todayCompleted.prayer} onClick={() => setShowPrayer(true)} />
            <MissionItem icon="✍️" label="Escribir tu reflexión" done={todayCompleted.reflection} onClick={() => setShowPrayer(true)} />
          </div>
        </div>

        {/* Calendar */}
        <div className="animate-fade-up opacity-0" style={{ animationDelay: '480ms' }}>
          <p className="text-white/[0.18] text-[10px] tracking-[3px] uppercase mb-3.5 px-1 font-semibold">Tu camino espiritual</p>
          <Calendar />
        </div>
      </div>
    </div>
  );
}

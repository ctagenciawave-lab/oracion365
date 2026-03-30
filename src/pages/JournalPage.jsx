import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatDateES } from '../data/content';

export default function JournalPage() {
  const { getReflections, getFavorites } = useApp();
  const [reflections, setReflections] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReflections(), getFavorites()]).then(([r, f]) => { setReflections(r); setFavorites(f); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-spirit-500/30 border-t-spirit-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
        <div className="mb-7 animate-fade-up">
          <p className="text-white/25 text-[13px] mb-1 font-light">Tus reflexiones</p>
          <h1 className="font-display text-2xl text-white font-normal">Diario con Dios</h1>
        </div>

        {/* Favorites horizontal scroll */}
        {favorites.length > 0 && (
          <div className="mb-7">
            <p className="text-white/15 text-[10px] tracking-[3px] uppercase mb-3 font-semibold">Versículos guardados</p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
              {favorites.map((f, i) => (
                <div key={f.id} className="min-w-[220px] p-[16px_20px] rounded-2xl bg-white/[0.02] border border-white/[0.04] shrink-0">
                  <p className="text-gold-400/40 text-[9px] tracking-[2px] uppercase mb-2">{f.verse_ref}</p>
                  <p className="font-display text-sm text-white/70 italic leading-snug">"{f.verse_text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflections */}
        {reflections.length === 0 ? (
          <div className="text-center pt-16 animate-fade-in">
            <div className="text-[44px] opacity-20 mb-5">📖</div>
            <p className="text-white/20 text-sm max-w-[240px] mx-auto leading-relaxed">Completa tu momento con Dios y escribe lo que sientes.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {reflections.map((r, i) => (
              <div key={r.id} className="card animate-fade-up opacity-0" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="text-spirit-400/30 text-[10px] tracking-[2px] uppercase mb-2.5">{formatDateES(r.created_at)}</p>
                <p className="text-white/55 text-[14.5px] leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

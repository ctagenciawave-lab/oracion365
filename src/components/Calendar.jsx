import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { monthNames } from '../data/content';

export default function Calendar() {
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [mo, setMo] = useState(new Date().getMonth());
  const [yr, setYr] = useState(new Date().getFullYear());

  useEffect(() => { load(); }, [mo, yr, user]);

  const load = async () => {
    if (!user) return;
    const start = `${yr}-${String(mo + 1).padStart(2, '0')}-01`;
    const end = mo === 11 ? `${yr + 1}-01-01` : `${yr}-${String(mo + 2).padStart(2, '0')}-01`;
    const { data } = await supabase.from('oracion_daily_completions').select('completed_date')
      .eq('user_id', user.id).eq('prayer_completed', true).gte('completed_date', start).lt('completed_date', end);
    setDays((data || []).map(d => d.completed_date));
  };

  const today = new Date();
  const first = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let i = 1; i <= dim; i++) cells.push(i);

  const isDone = d => d && days.includes(`${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  const isToday = d => d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();

  const prev = () => { if (mo === 0) { setMo(11); setYr(y => y - 1); } else setMo(m => m - 1); };
  const next = () => { if (mo === 11) { setMo(0); setYr(y => y + 1); } else setMo(m => m + 1); };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="w-7 h-7 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/30 text-xs">‹</button>
        <div className="text-center">
          <p className="text-white text-[13px] font-medium">{monthNames[mo]}</p>
          <p className="text-white/20 text-[10px] mt-0.5">{days.length} días con Dios</p>
        </div>
        <button onClick={next} className="w-7 h-7 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/30 text-xs">›</button>
      </div>
      <div className="grid grid-cols-7 gap-[3px] mb-1.5">
        {['D','L','M','M','J','V','S'].map((d, i) => <div key={i} className="text-center text-[9px] text-white/[0.12] font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((d, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {d && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] transition-all ${
                isDone(d) ? 'bg-spirit-500/[0.12] text-spirit-300 font-semibold' :
                isToday(d) ? 'bg-white/[0.06] text-white font-semibold shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]' :
                'text-white/20'
              }`}>
                {isDone(d) ? <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> : d}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

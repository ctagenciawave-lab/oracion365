import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

const TYPES = [{ id:'peticion', l:'🙏 Petición' }, { id:'agradecimiento', l:'💛 Gracias' }, { id:'alabanza', l:'✨ Alabanza' }];
const typeEmoji = { peticion:'🙏', agradecimiento:'💛', alabanza:'✨' };

export default function CommunityPage() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('peticion');
  const [prayingIds, setPrayingIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); loadInteractions(); }, []);

  const load = async () => {
    const { data } = await supabase.from('oracion_prayer_wall').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(50);
    setPrayers(data || []); setLoading(false);
  };

  const loadInteractions = async () => {
    if (!user) return;
    const { data } = await supabase.from('oracion_prayer_interactions').select('prayer_id').eq('user_id', user.id);
    setPrayingIds((data || []).map(d => d.prayer_id));
  };

  const submit = async () => {
    if (!text.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('oracion_prayer_wall').insert({ user_id: user.id, display_name: name.trim() || 'Hermano(a)', prayer_text: text.trim(), prayer_type: type });
    setText(''); setName(''); setShowForm(false); setSubmitting(false); load();
  };

  const togglePray = async (id) => {
    if (!user) return;
    const { data } = await supabase.rpc('oracion_toggle_praying', { p_prayer_id: id, p_user_id: user.id });
    if (data?.praying) { setPrayingIds(p => [...p, id]); setPrayers(p => p.map(x => x.id === id ? { ...x, praying_count: x.praying_count + 1 } : x)); }
    else { setPrayingIds(p => p.filter(x => x !== id)); setPrayers(p => p.map(x => x.id === id ? { ...x, praying_count: Math.max(0, x.praying_count - 1) } : x)); }
  };

  const timeAgo = (d) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); if (m < 1) return 'ahora'; if (m < 60) return `hace ${m}m`; const h = Math.floor(m / 60); if (h < 24) return `hace ${h}h`; return `hace ${Math.floor(h / 24)}d`; };

  return (
    <div className="min-h-screen pb-28 relative">
      <div className="fixed inset-0 gradient-bg pointer-events-none" />
      <div className="relative z-10 px-5 pt-[52px] max-w-lg mx-auto">
        <div className="flex justify-between items-start mb-6 animate-fade-up">
          <div><p className="text-white/25 text-[13px] mb-1 font-light">Comunidad</p><h1 className="font-display text-2xl text-white font-normal">Muro de oración</h1></div>
          <button onClick={() => setShowForm(!showForm)} className="w-9 h-9 rounded-full bg-spirit-500/10 flex items-center justify-center text-spirit-300 text-lg">+</button>
        </div>

        {showForm && (
          <div className="card mb-5 animate-fade-in">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre (opcional)" className="input-field mb-3 !py-3 text-sm" />
            <div className="flex gap-1.5 mb-3">
              {TYPES.map(t => <button key={t.id} onClick={() => setType(t.id)} className={`flex-1 py-[7px] rounded-xl text-[11px] font-medium transition-all border ${type === t.id ? 'bg-spirit-500/10 text-spirit-300 border-spirit-500/15' : 'bg-white/[0.02] text-white/30 border-white/[0.03]'}`}>{t.l}</button>)}
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Comparte tu oración..." className="w-full h-[70px] px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder-white/20 text-sm leading-relaxed resize-none outline-none mb-2.5 font-body" />
            <button onClick={submit} disabled={submitting || !text.trim()} className="btn-primary !py-3.5 text-sm disabled:opacity-25">{submitting ? 'Compartiendo...' : 'Compartir'}</button>
          </div>
        )}

        {loading ? <div className="flex justify-center py-20"><div className="w-7 h-7 border-2 border-spirit-500/30 border-t-spirit-400 rounded-full animate-spin" /></div>
        : prayers.length === 0 ? <div className="text-center py-16"><div className="text-[44px] opacity-20 mb-5">🙏</div><p className="text-white/20 text-sm max-w-[240px] mx-auto leading-relaxed">Sé el primero en compartir una oración.</p></div>
        : <div className="flex flex-col gap-3.5">
          {prayers.map((p, i) => {
            const isPraying = prayingIds.includes(p.id);
            return (
              <div key={p.id} className="card animate-fade-up opacity-0" style={{ animationDelay: `${i * 50 + 80}ms` }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-[30px] h-[30px] rounded-full bg-spirit-500/[0.06] flex items-center justify-center text-[13px]">{typeEmoji[p.prayer_type]}</div>
                  <div className="flex-1"><p className="text-white/60 text-[13px] font-medium">{p.display_name}</p><p className="text-white/15 text-[10px]">{timeAgo(p.created_at)}</p></div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-3.5">{p.prayer_text}</p>
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.03]">
                  <button onClick={() => togglePray(p.id)} className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-xs font-medium transition-all border ${isPraying ? 'bg-spirit-500/10 text-spirit-300 border-spirit-500/[0.12]' : 'bg-white/[0.02] text-white/30 border-white/[0.03]'}`}>🙏 {isPraying ? 'Orando' : 'Orar'}</button>
                  <span className="text-white/[0.12] text-[11px]">{p.praying_count > 0 && `${p.praying_count} orando`}</span>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </div>
  );
}

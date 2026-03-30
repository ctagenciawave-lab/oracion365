import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const { user, refreshProfile } = useAuth();
  const [todayCompleted, setTodayCompleted] = useState({ devotional: false, prayer: false, reflection: false });

  const markMission = useCallback(async (key) => {
    setTodayCompleted(prev => ({ ...prev, [key]: true }));
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const update = {};
    if (key === 'devotional') update.devotional_read = true;
    if (key === 'prayer') update.prayer_completed = true;
    if (key === 'reflection') update.reflection_written = true;
    const { data: existing } = await supabase.from('oracion_daily_completions')
      .select('id').eq('user_id', user.id).eq('completed_date', today).maybeSingle();
    if (existing) {
      await supabase.from('oracion_daily_completions').update(update).eq('id', existing.id);
    } else {
      await supabase.from('oracion_daily_completions').insert({ user_id: user.id, completed_date: today, ...update });
    }
  }, [user]);

  const saveReflection = useCallback(async (text) => {
    if (!user || !text.trim()) return;
    try {
      await supabase.from('oracion_reflections').insert({ user_id: user.id, text: text.trim() });
      markMission('reflection');
    } catch (e) { console.error('saveReflection error:', e); }
  }, [user, markMission]);

  const getReflections = useCallback(async () => {
    if (!user) return [];
    const { data } = await supabase.from('oracion_reflections').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
    return data || [];
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return 1;
    try {
      const { data } = await supabase.rpc('oracion_update_streak', { p_user_id: user.id });
      await refreshProfile();
      return data?.streak || 1;
    } catch (e) { console.error('updateStreak error:', e); return 1; }
  }, [user, refreshProfile]);

  const savePlanProgress = useCallback(async (planId, day) => {
    if (!user) return;
    try {
      const { data: existing } = await supabase.from('oracion_plan_progress')
        .select('days_completed').eq('user_id', user.id).eq('plan_id', planId).maybeSingle();
      if (existing) {
        const days = existing.days_completed || [];
        if (!days.includes(day)) await supabase.from('oracion_plan_progress').update({ days_completed: [...days, day], updated_at: new Date().toISOString() }).eq('user_id', user.id).eq('plan_id', planId);
      } else {
        await supabase.from('oracion_plan_progress').insert({ user_id: user.id, plan_id: planId, days_completed: [day] });
      }
    } catch (e) { console.error('savePlanProgress error:', e); }
  }, [user]);

  const getPlanProgress = useCallback(async (planId) => {
    if (!user) return [];
    try {
      const { data } = await supabase.from('oracion_plan_progress')
        .select('days_completed').eq('user_id', user.id).eq('plan_id', planId).maybeSingle();
      return data?.days_completed || [];
    } catch (e) { return []; }
  }, [user]);

  const loadTodayStatus = useCallback(async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('oracion_daily_completions')
        .select('*').eq('user_id', user.id).eq('completed_date', today).maybeSingle();
      if (data) setTodayCompleted({ devotional: data.devotional_read || false, prayer: data.prayer_completed || false, reflection: data.reflection_written || false });
    } catch (e) { /* no completion today */ }
  }, [user]);

  const toggleFavorite = useCallback(async (ref, text) => {
    if (!user) return false;
    try {
      const { data } = await supabase.from('oracion_favorites')
        .select('id').eq('user_id', user.id).eq('verse_ref', ref).maybeSingle();
      if (data) { await supabase.from('oracion_favorites').delete().eq('id', data.id); return false; }
      else { await supabase.from('oracion_favorites').insert({ user_id: user.id, verse_ref: ref, verse_text: text }); return true; }
    } catch (e) { return false; }
  }, [user]);

  const isFavorite = useCallback(async (ref) => {
    if (!user) return false;
    try {
      const { data } = await supabase.from('oracion_favorites')
        .select('id').eq('user_id', user.id).eq('verse_ref', ref).maybeSingle();
      return !!data;
    } catch (e) { return false; }
  }, [user]);

  const getFavorites = useCallback(async () => {
    if (!user) return [];
    const { data } = await supabase.from('oracion_favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return data || [];
  }, [user]);

  return <Ctx.Provider value={{ todayCompleted, markMission, saveReflection, getReflections, updateStreak, savePlanProgress, getPlanProgress, loadTodayStatus, toggleFavorite, isFavorite, getFavorites }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);

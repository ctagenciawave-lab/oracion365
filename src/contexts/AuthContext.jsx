import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user || null);
      if (session?.user) await loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (uid) => {
    const { data, error } = await supabase.from('oracion_profiles').select('*').eq('user_id', uid).single();
    if (error?.code === 'PGRST116') {
      const { data: u } = await supabase.auth.getUser();
      const { data: np } = await supabase.from('oracion_profiles').insert({ user_id: uid, email: u.user?.email || '' }).select().single();
      setProfile(np);
    } else if (data) setProfile(data);
    setLoading(false);
  };

  const signIn = async (email, pw) => { const { error } = await supabase.auth.signInWithPassword({ email, password: pw }); if (error) throw error; };
  const signUp = async (email, pw) => { const { error } = await supabase.auth.signUp({ email, password: pw }); if (error) throw error; };
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };
  const refreshProfile = async () => { if (user) await loadProfile(user.id); };

  return <Ctx.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

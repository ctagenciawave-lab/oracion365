import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout - never stay loading for more than 5 seconds
    const timeout = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user || null);
      if (session?.user) await loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const loadProfile = async (uid) => {
    try {
      const { data, error } = await supabase.from('oracion_profiles').select('*').eq('user_id', uid).maybeSingle();
      if (data) {
        setProfile(data);
      } else {
        // Profile doesn't exist yet, create it
        const { data: u } = await supabase.auth.getUser();
        const { data: np } = await supabase.from('oracion_profiles')
          .insert({ user_id: uid, email: u.user?.email || '' })
          .select()
          .maybeSingle();
        setProfile(np);
      }
    } catch (e) {
      console.error('loadProfile error:', e);
    }
    setLoading(false);
  };

  const signIn = async (email, pw) => { const { error } = await supabase.auth.signInWithPassword({ email, password: pw }); if (error) throw error; };
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };
  const refreshProfile = async () => { if (user) await loadProfile(user.id); };

  return <Ctx.Provider value={{ user, profile, loading, signIn, signOut, refreshProfile }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

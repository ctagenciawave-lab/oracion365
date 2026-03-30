import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await signIn(email, pw);
    } catch (err) { setError(err.message || 'Credenciales inválidas. Verifica tu email y contraseña.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 gradient-bg relative overflow-hidden">
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-spirit-600/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-[340px] relative z-10">
        <div className="text-center mb-[52px] animate-fade-in">
          <div className="w-[68px] h-[68px] mx-auto mb-5 rounded-[20px] bg-gradient-to-br from-spirit-500 to-spirit-700 flex items-center justify-center shadow-[0_20px_60px_rgba(124,58,237,0.25)]">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L12 22"/><path d="M5 8L19 8"/></svg>
          </div>
          <h1 className="font-display text-[32px] font-normal text-white tracking-wide mb-1.5">Oración 365</h1>
          <p className="text-white/25 text-xs tracking-[3px] uppercase">Tu momento con Dios</p>
        </div>
        <form onSubmit={handle} className="flex flex-col gap-3 animate-fade-up opacity-0" style={{ animationDelay: '200ms' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" className="input-field" required />
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Contraseña" className="input-field" required minLength={6} />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-1 flex items-center justify-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Entrar'}
          </button>
        </form>
        <div className="text-center mt-8 animate-fade-up opacity-0" style={{ animationDelay: '400ms' }}>
          <p className="text-white/15 text-xs leading-relaxed">
            ¿Aún no tienes acceso?
          </p>
          <a href="https://pay.hotmart.com/T104969975T?checkoutMode=10" target="_blank" rel="noopener noreferrer" className="text-spirit-400/50 text-xs hover:text-spirit-400 transition-colors mt-1 inline-block">
            Adquirir Oración 365
          </a>
        </div>
      </div>
    </div>
  );
}

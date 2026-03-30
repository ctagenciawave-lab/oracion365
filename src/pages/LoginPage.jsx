import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isReg, setIsReg] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      if (isReg) { await signUp(email, pw); setSuccess('¡Cuenta creada! Revisa tu correo.'); }
      else await signIn(email, pw);
    } catch (err) { setError(err.message || 'Error. Inténtalo de nuevo.'); }
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
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-1 flex items-center justify-center disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isReg ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-white/20 text-[13px] mt-7 animate-fade-up opacity-0" style={{ animationDelay: '400ms' }}>
          {isReg ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <button onClick={() => { setIsReg(!isReg); setError(''); setSuccess(''); }} className="text-spirit-400/60 hover:text-spirit-400 transition-colors">
            {isReg ? 'Inicia sesión' : 'Crear una'}
          </button>
        </p>
      </div>
    </div>
  );
}

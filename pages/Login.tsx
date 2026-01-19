
import React, { useState } from 'react';
import { PROFESSIONALS, LOGO_URL } from '../constants';
import { User } from '../types';
import { Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PROFESSIONALS.find(p => p.login === login && p.password === password);
    
    if (found) {
      onLogin({
        id: found.id,
        name: found.name,
        role: found.role,
        login: found.login || ''
      });
    } else {
      setError('Credenciais inválidas. Verifique seu login e senha.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>
        
        <div className="text-center mb-10">
          <img src={LOGO_URL} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display tracking-tight">ACESSO ADMIN</h2>
          <p className="text-slate-400 mt-2">Área restrita para profissionais</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Login</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-amber-500 focus:bg-slate-800 outline-none transition-all"
                placeholder="Ex: LeonardoFitipaldi"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-amber-500 focus:bg-slate-800 outline-none transition-all"
                placeholder="Sua senha secreta"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-4 rounded-xl shadow-xl shadow-amber-600/20 active:scale-[0.98] transition-all"
          >
            ENTRAR NO PAINEL
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

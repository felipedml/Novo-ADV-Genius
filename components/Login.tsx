import React, { useState } from 'react';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-adv-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-adv-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-adv-petrol/20 rounded-full blur-[150px]" />

      <div className="z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-black to-adv-gray border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-adv-gold/10">
            <Logo className="w-14 h-14" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">ADV Genius</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-adv-petrol to-adv-gold mt-4 rounded-full"></div>
          <p className="text-gray-400 mt-4 text-center font-light">
            <span className="text-adv-gold font-medium">Inteligência Jurídica</span>
          </p>
        </div>

        <div className="bg-adv-gray border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-2xl">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-adv-gold uppercase tracking-wider mb-2">E-mail Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-adv-gold transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none transition-all"
                    placeholder="nome@escritorio.com.br"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-adv-gold hover:bg-adv-goldDim text-adv-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-adv-gold/20"
              >
                {loading ? 'Verificando...' : 'Acessar Plataforma'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm">Código de segurança enviado para</p>
                <p className="text-white font-medium mt-1">{email}</p>
                <button 
                  type="button" 
                  onClick={() => setStep('email')}
                  className="text-xs text-adv-gold underline mt-2 hover:text-white transition-colors"
                >
                  Corrigir e-mail
                </button>
              </div>
              <div>
                <label className="block text-xs font-bold text-adv-gold uppercase tracking-wider mb-2">Código 2FA</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-adv-gold transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-adv-gold focus:ring-1 focus:ring-adv-gold outline-none transition-all tracking-[0.5em] text-center text-lg font-mono"
                    placeholder="000000"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-adv-gold hover:bg-adv-goldDim text-adv-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-adv-gold/20"
              >
                {loading ? 'Validando Acesso...' : 'Confirmar Identidade'}
              </button>
            </form>
          )}
        </div>
        
        <div className="mt-8 flex justify-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
            <span>Privacidade</span>
            <span>Termos de Uso</span>
            <span>Suporte</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
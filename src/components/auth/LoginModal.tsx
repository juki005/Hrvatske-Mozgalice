import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, Chrome, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        console.log("Submitting login form...");
        await login(email, password);
      } else {
        console.log("Submitting registration form...");
        await register(email, password, name);
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error("Auth Form Error:", error);
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'Korisnik nije pronađen.' 
        : error.code === 'auth/wrong-password' 
        ? 'Pogrešna lozinka.' 
        : 'Pojavila se pogreška. Molimo pokušajte ponovno.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      console.log("Submitting Google login...");
      await loginWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Google Login Modal Error:", error);
      alert('Pogreška pri prijavi s Google računom.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-brand-bg rounded-[2.5rem] shadow-2xl overflow-hidden border border-nyt-border"
          >
            {/* Header Decorations */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-red" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-brand-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-black text-[#2D2D2D] mb-3">
                  {success ? 'Dobrodošli natrag!' : mode === 'login' ? 'Vratite se igri' : 'Pridružite se zajednici'}
                </h2>
                <div className="flex flex-col gap-2">
                  <p className="text-brand-muted text-sm font-medium leading-relaxed px-4">
                    {success 
                      ? 'Uspješno ste prijavljeni u Hrvatske Mozgalice.'
                      : mode === 'login' 
                        ? 'Prijavite se kako biste spremili svoje nizove, omiljene igre i pratili napredak na svim uređajima.' 
                        : 'Registracija je brza i besplatna. Otključajte postignuća i natječite se s drugima.'}
                  </p>
                </div>
              </div>

              {success ? (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-2 border-green-100">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-black text-[#2D2D2D] uppercase tracking-[0.2em] text-xs">Sinkronizacija profila...</p>
                    <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full bg-green-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Primary Google Action */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="group relative w-full py-4 bg-white border-2 border-nyt-border text-[#2D2D2D] rounded-2xl font-black flex items-center justify-center gap-3 hover:border-[#2D2D2D] hover:bg-[#FBF9F4] transition-all shadow-xl shadow-black/5 disabled:opacity-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Chrome className="w-6 h-6 z-10" />
                    <span className="z-10 text-base">Nastavi s Google-om</span>
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-nyt-border"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-brand-muted bg-brand-bg px-5">
                      <span>Ili koristi e-mail</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Vaše ime"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nyt-border rounded-2xl focus:border-brand-text outline-none transition-colors font-medium text-brand-text"
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email adresa"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nyt-border rounded-2xl focus:border-brand-text outline-none transition-colors font-medium text-brand-text"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Lozinka"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nyt-border rounded-2xl focus:border-brand-text outline-none transition-colors font-medium text-brand-text"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#2D2D2D] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/5 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-base">{mode === 'login' ? 'Prijavi se' : 'Registriraj se'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                      className="text-xs font-black uppercase tracking-[0.1em] text-brand-muted hover:text-[#2D2D2D] transition-colors"
                    >
                      {mode === 'login' 
                        ? 'Nemaš račun? Registriraj se ovdje' 
                        : 'Već imaš račun? Prijavi se ovdje'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
            
            <div className="p-6 bg-nyt-card border-t border-nyt-border text-center">
              <p className="text-[10px] text-brand-muted font-medium uppercase tracking-tight">
                Prijavom prihvaćate naše <span className="underline cursor-pointer">Uvjete korištenja</span> i <span className="underline cursor-pointer">Pravila privatnosti</span>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

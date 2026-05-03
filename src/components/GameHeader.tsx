import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, Heart, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  timer?: string;
  points?: number;
}

export default function GameHeader({ title, subtitle, onBack, timer, points }: GameHeaderProps) {
  const { user, isAdmin, logout, setIsAuthModalOpen } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsFavorited(!isFavorited);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div className="flex flex-col w-full sticky top-0 z-50 pointer-events-auto">
      {/* Top Banner (Optional for alerts/status) */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-nyt-border flex items-center justify-between px-6 py-4 shadow-sm rounded-b-[2rem]">
        {/* Left Section: Back & Title */}
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-brand-text flex items-center justify-center"
            aria-label="Natrag"
          >
            <ChevronLeft className="w-7 h-7" />
          </motion.button>
          
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl font-black text-[#2D2D2D] leading-none tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted mt-1 leading-none">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center Section: Stats (Timer/Points) */}
        <div className="flex items-center gap-6">
          {timer && (
            <div className="flex flex-col items-center bg-[#FBF9F4] px-4 py-2 rounded-2xl border border-nyt-border shadow-inner">
              <span className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-0.5">Vrijeme</span>
              <span className="font-mono text-base font-bold text-[#2D2D2D] tabular-nums leading-none">{timer}</span>
            </div>
          )}
          {points !== undefined && (
            <div className="flex flex-col items-center bg-[#FBF9F4] px-4 py-2 rounded-2xl border border-nyt-border shadow-inner">
              <span className="text-[8px] font-black text-brand-muted uppercase tracking-widest mb-0.5">Bodovi</span>
              <span className="font-mono text-base font-bold text-[#2D2D2D] tabular-nums leading-none">{points}</span>
            </div>
          )}
        </div>

        {/* Right Section: Auth & Profile */}
        <div className="flex items-center gap-2">
          {!user ? (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 bg-[#2D2D2D] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md active:shadow-sm"
            >
              Prijavi se
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-[#FBF9F4] p-1.5 pr-4 rounded-2xl border border-nyt-border">
              <div className="relative">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                ) : (
                  <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center border border-nyt-border">
                    <span className="font-bold text-brand-text">{user.displayName[0]}</span>
                  </div>
                )}
                {isAdmin && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-tr from-amber-400 to-yellow-200 p-1 rounded-full shadow-sm border border-white">
                    <Shield className="w-2.5 h-2.5 text-amber-900" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-[#2D2D2D] leading-none mb-0.5 truncate max-w-[100px]">{user.displayName}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-[8px] font-black uppercase tracking-tighter text-purple-700 rounded-md border border-purple-200 leading-none">
                      Admin
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-brand-muted hover:text-brand-red transition-colors text-left"
                >
                  <LogOut className="w-2.5 h-2.5" />
                  Odjavi se
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 ml-2">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleFavoriteClick}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${isFavorited ? 'text-brand-red bg-red-50 border border-red-100' : 'text-brand-muted hover:bg-gray-50 border border-transparent'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </motion.button>
            <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-brand-muted flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, LogOut, RefreshCw } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { useDailyStats } from '../hooks/useDailyStats';
import { useAuth } from '../context/AuthContext';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const { resetSystem } = useGameContext();
  const { user, logout } = useAuth();
  const { streakData, completedCount } = useDailyStats();
  
  const handleReset = () => {
    resetSystem();
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible overlay for closing on click outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 w-72 bg-brand-bg rounded-[2rem] shadow-2xl border border-nyt-border z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-nyt-border bg-nyt-card">
              <div className="flex items-center gap-3 mb-1">
                {user?.photoURL && (
                  <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-xl shadow-sm" />
                )}
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-text leading-tight">{user?.displayName || 'Gost'}</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-brand-muted">{user?.role === 'admin' ? 'Administrator' : 'Igrač'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-nyt-border">
              <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-4">Tvoj napredak</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-brand-text">{streakData.currentStreak}</span>
                  <span className="text-xs text-brand-muted font-medium mt-1">Niz dana</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-brand-text">{completedCount}</span>
                  <span className="text-xs text-brand-muted font-medium mt-1">Riješeno danas</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-brand-muted mb-1.5">
                  <span>Godišnji cilj</span>
                  <span>95/365</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gold rounded-full" style={{ width: `${(95/365)*100}%` }} />
                </div>
              </div>

              <p className="text-xs text-center text-brand-muted mt-4">
                Prijavi se za čuvanje napretka
              </p>
            </div>

            <div className="p-2">
              <button 
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-orange-50 transition-colors text-orange-600 font-medium text-sm text-left"
              >
                <RefreshCw className="w-4 h-4" />
                Resetiraj napredak (Test)
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-brand-text font-bold text-sm text-left">
                <Settings className="w-4 h-4 text-brand-muted" />
                Postavke profila
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-brand-red font-bold text-sm text-left"
              >
                <LogOut className="w-4 h-4" />
                Odjavi se
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

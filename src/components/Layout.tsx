import React, { useState } from 'react';
import { Menu, User, Calendar, Grid, Archive, Flame, Clock, CheckCircle2 } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import { useDailyStats } from '../hooks/useDailyStats';
import { useGameContext } from '../context/GameContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { streakData, timeLeft, completedCount, totalGames } = useDailyStats();
  const { setActiveGame } = useGameContext();

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-brand-text flex flex-col font-sans">
      {/* Header - Refined Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between shadow-sm">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="font-serif text-xl font-bold tracking-tight text-brand-red hidden sm:block">
            Hrvatske Igre
          </h1>
          <h1 className="font-serif text-lg font-bold tracking-tight text-brand-red sm:hidden">
            HI
          </h1>
        </div>
        
        {/* Center: Bento Info Group */}
        <div className="flex items-center bg-gray-50 rounded-2xl px-3 py-1.5 border border-gray-100 gap-4 shadow-inner">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Niz</span>
              <span className="text-xs font-bold text-brand-text leading-tight">{streakData.currentStreak} dana</span>
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Danas</span>
              <span className="text-xs font-bold text-brand-text leading-tight">{completedCount}/{totalGames}</span>
            </div>
          </div>
        </div>
        
        {/* Right: Timer & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Reset za</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-brand-muted" />
              <span className="text-xs font-bold text-brand-text">{timeLeft}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative bg-gray-50 border border-gray-100"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 relative pb-20 sm:pb-0 pt-6 sm:pt-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-brand-bg border-t border-gray-200 flex justify-around items-center h-16 z-30 pb-safe">
        <button className="flex flex-col items-center justify-center w-full h-full text-brand-red">
          <Calendar className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Danas</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text">
          <Grid className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Moje Igre</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text">
          <Archive className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Arhiva</span>
        </button>
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text"
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="flex border-t border-gray-200 py-8 px-4 flex-col items-center justify-center gap-4 bg-brand-card mb-16 sm:mb-0">
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-brand-muted">
          <a href="#" className="hover:text-brand-text">Arhiva</a>
          <a href="#" className="hover:text-brand-text">Pravila</a>
          <a href="#" className="hover:text-brand-text">O nama</a>
          <button 
            onClick={() => setActiveGame('admin')}
            className="hover:text-brand-text underline decoration-dotted underline-offset-4"
          >
            Admin Editor
          </button>
        </div>
        <div className="text-xs text-gray-400">
          © 2026 Hrvatske Igre. Sva prava pridržana.
        </div>
      </footer>
    </div>
  );
}

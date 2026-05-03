import React, { useState } from 'react';
import { Menu, User, Calendar, Grid, Archive, Flame, Clock, CheckCircle2 } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import LoginModal from './auth/LoginModal';
import { useDailyStats } from '../hooks/useDailyStats';
import { useGameContext } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

const Header = React.memo(({ 
  onMenuClick, 
  onProfileClick, 
  user, 
  authLoading, 
  streakData, 
  timeLeft, 
  completedCount, 
  totalGames 
}: any) => (
  <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between shadow-sm flex-shrink-0">
    <div className="flex items-center gap-4 min-w-[120px]">
      <button 
        type="button"
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Izbornik"
      >
        <Menu size={20} className="text-brand-text" />
      </button>
      <h1 className="font-serif text-xl font-bold tracking-tight text-brand-red hidden sm:block whitespace-nowrap">
        Hrvatske Mozgalice
      </h1>
      <h1 className="font-serif text-lg font-bold tracking-tight text-brand-red sm:hidden">
        HM
      </h1>
    </div>
    <div className="hidden sm:flex items-center bg-gray-50 rounded-2xl px-4 py-1.5 border border-gray-100 gap-6 shadow-inner h-11">
      <div className="flex items-center gap-2 min-w-[80px]">
        <Flame size={16} className="text-orange-500 fill-orange-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Niz</span>
          <span className="text-xs font-extra-bold text-brand-text leading-tight whitespace-nowrap">
            {streakData.currentStreak !== undefined ? `${streakData.currentStreak} dana` : '--'}
          </span>
        </div>
      </div>
      <div className="w-px h-6 bg-gray-200" />
      <div className="flex items-center gap-2 min-w-[60px]">
        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Danas</span>
          <span className="text-xs font-extra-bold text-brand-text leading-tight whitespace-nowrap">
            {totalGames > 0 ? `${completedCount}/${totalGames}` : '0/0'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 sm:gap-4 h-10 min-w-[120px] justify-end">
      <div className="hidden md:flex flex-col items-end min-w-[90px]">
        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none">Reset za</span>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-brand-muted flex-shrink-0" />
          <span className="text-xs font-bold text-brand-text tabular-nums">{timeLeft || '--:--:--'}</span>
        </div>
      </div>
      <div className="min-w-[44px] sm:min-w-[120px] flex justify-end">
        {authLoading ? (
          <div className="w-10 h-10 sm:w-32 sm:h-10 bg-gray-100 animate-pulse rounded-xl" />
        ) : (
          <button 
            type="button"
            onClick={onProfileClick}
            className="p-1 sm:p-2 sm:px-3 hover:bg-gray-100 rounded-xl transition-all relative bg-gray-50 border border-gray-100 flex items-center gap-2 group min-h-[40px] w-full justify-center sm:justify-start"
          >
            <div className="relative flex-shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg shadow-sm object-cover" />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 rounded-lg">
                  <User size={18} className="text-gray-500" />
                </div>
              )}
            </div>
            {user ? (
              <span className="hidden lg:block text-xs font-bold truncate max-w-[80px]">{user.displayName}</span>
            ) : (
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest px-1 text-brand-muted group-hover:text-brand-text">Prijava</span>
            )}
          </button>
        )}
      </div>
    </div>
  </header>
));

const MobileNav = React.memo(({ onProfileClick }: any) => (
  <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-brand-bg border-t border-gray-200 flex justify-around items-center h-16 z-30 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
    <button className="flex flex-col items-center justify-center w-full h-full text-brand-red">
      <Calendar size={20} className="mb-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-tighter">Danas</span>
    </button>
    <button className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text">
      <Grid size={20} className="mb-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-tighter">Igre</span>
    </button>
    <button className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text">
      <Archive size={20} className="mb-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-tighter">Arhiva</span>
    </button>
    <button 
      onClick={onProfileClick}
      className="flex flex-col items-center justify-center w-full h-full text-brand-muted hover:text-brand-text"
    >
      <User size={20} className="mb-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-tighter">Profil</span>
    </button>
  </nav>
));

const Footer = React.memo(({ onAdminClick, user }: any) => (
  <footer className="flex border-t border-gray-200 py-10 px-4 flex-col items-center justify-center gap-6 bg-brand-card mb-16 sm:mb-0 w-full">
    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-black uppercase tracking-widest text-brand-muted w-full max-w-2xl mx-auto">
      <a href="#" className="hover:text-brand-text transition-colors whitespace-nowrap">Arhiva</a>
      <a href="#" className="hover:text-brand-text transition-colors whitespace-nowrap">Pravila</a>
      <a href="#" className="hover:text-brand-text transition-colors whitespace-nowrap">O nama</a>
      {user?.isAdmin && (
        <button 
          onClick={onAdminClick}
          className="hover:text-brand-text underline decoration-brand-red decoration-2 underline-offset-4 transition-colors whitespace-nowrap"
        >
          Admin Editor
        </button>
      )}
    </div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center">
      © 2026 Hrvatske Mozgalice. Sva prava pridržana.
    </div>
  </footer>
));

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { streakData, timeLeft, completedCount, totalGames } = useDailyStats();
  const { setActiveGame } = useGameContext();
  const { user, isAuthModalOpen, setIsAuthModalOpen, loading: authLoading } = useAuth();

  const handleProfileClick = React.useCallback(() => {
    if (user) setIsProfileOpen(prev => !prev);
    else setIsAuthModalOpen(true);
  }, [user, setIsAuthModalOpen]);

  const handleAdminClick = React.useCallback(() => setActiveGame('admin'), [setActiveGame]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-brand-text flex flex-col font-sans selection:bg-brand-red selection:text-white">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={handleProfileClick}
        user={user}
        authLoading={authLoading}
        streakData={streakData}
        timeLeft={timeLeft}
        completedCount={completedCount}
        totalGames={totalGames}
      />

      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 relative pb-20 sm:pb-0 pt-6 sm:pt-8 bg-[#FBF9F4]">
        {children}
      </main>

      <MobileNav onProfileClick={handleProfileClick} />
      <Footer onAdminClick={handleAdminClick} user={user} />
    </div>
  );
}
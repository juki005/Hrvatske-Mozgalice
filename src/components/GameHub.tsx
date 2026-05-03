import React, { useState } from 'react';
import { CheckCircle2, Heart, Shield, ArrowRight } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { useDailyStats } from '../hooks/useDailyStats';
import { isGameCompleted } from '../utils/streakManager';
import { GAMES } from '../constants/games';
import { useAuth } from '../context/AuthContext';

interface GameHubProps {
  onSelectGame: (gameId: string) => void;
}

export default function GameHub({ onSelectGame }: GameHubProps) {
  const { dailyIndex } = useGameContext();
  const { user, isAdmin, setIsAuthModalOpen } = useAuth();
  const { completedCount, totalGames } = useDailyStats();

  const GameCard = ({ id, title, subtitle, icon: Icon, colorClass, isFeatured = false }: any) => {
    const isCompleted = isGameCompleted(id);
    const [isFavorited, setIsFavorited] = useState(false);

    const handleHeartClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      setIsFavorited(!isFavorited);
    };

    return (
      <div
        onClick={() => onSelectGame(id)}
        className={`
          group relative overflow-hidden cursor-pointer transition-all duration-300
          rounded-[2rem] border border-nyt-border shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.99]
          bg-white p-6 sm:p-8 flex flex-col h-full
          ${isFeatured ? 'col-span-1 md:col-span-2 lg:col-span-3 min-h-[200px]' : 'min-h-[160px]'}
          ${isCompleted ? 'bg-green-50/20 border-green-100' : ''}
        `}
      >
        {/* Heart Icon / Favorite Status */}
        <button 
          onClick={handleHeartClick}
          className={`absolute top-6 right-6 p-2 rounded-full z-20 transition-all ${isFavorited ? 'bg-red-50 text-brand-red' : 'bg-gray-50 text-brand-muted hover:bg-gray-100'}`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-2 z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${colorClass} bg-opacity-10 mb-2`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div>
            <h3 className={`font-serif font-black text-[#2D2D2D] tracking-tight ${isFeatured ? 'text-3xl sm:text-5xl mb-2' : 'text-xl sm:text-2xl mb-1'}`}>
              {title}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between z-10">
          {isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100/50 rounded-xl text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Završeno</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FBF9F4] rounded-xl border border-nyt-border group-hover:bg-brand-text group-hover:text-white transition-colors duration-300">
              <span className="text-xs font-black uppercase tracking-widest">Igraj</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>

        {/* Hidden decorative icon */}
        <Icon className="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-black text-[#2D2D2D] mb-1">Mozgalice za danas</h2>
          <p className="text-brand-muted text-base font-medium">Svaki dan donosi nove izazove. Spremni?</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-nyt-border shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Odigrano</span>
              <span className="text-lg font-black text-[#2D2D2D]">{completedCount}/{totalGames}</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
               <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24" cy="24" r="20"
                  stroke="currentColor" strokeWidth="4" fill="transparent"
                  className="text-brand-red"
                  strokeDasharray={`${(completedCount/totalGames) * 126} 126`}
                />
              </svg>
              <span className="absolute text-[8px] font-black">{Math.round((completedCount/totalGames)*100)}%</span>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => onSelectGame('admin')}
              className="px-6 py-4 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-transform"
            >
              <Shield className="w-5 h-5" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </div>
  );
}

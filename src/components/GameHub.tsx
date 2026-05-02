import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { getCrosswordData } from '../data/krizaljka';
import { useDailyStats } from '../hooks/useDailyStats';
import { isGameCompleted } from '../utils/streakManager';
import { GAMES } from '../constants/games';

interface GameHubProps {
  onSelectGame: (gameId: string) => void;
}

export default function GameHub({ onSelectGame }: GameHubProps) {
  const { dailyIndex } = useGameContext();
  const crosswordData = getCrosswordData(5);
  const { streakData, completedCount, totalGames } = useDailyStats();

  const GameCard = ({ id, title, subtitle, icon: Icon, colorClass, isFeatured = false }: any) => {
    const isCompleted = isGameCompleted(id);

    return (
      <motion.div
        layoutId={`game-card-${id}`}
        whileHover={!isCompleted ? { scale: 1.02, y: -4 } : {}}
        whileTap={!isCompleted ? { scale: 0.98 } : {}}
        onClick={() => !isCompleted && onSelectGame(id)}
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300
          rounded-[1.25rem] sm:rounded-[2.5rem] border-2 shadow-xl
          bg-white p-3 sm:p-8 flex flex-col
          ${isFeatured ? 'col-span-2 lg:col-span-3 min-h-[140px] sm:min-h-[220px]' : 'min-h-[130px] sm:min-h-[180px]'}
          ${isCompleted ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}
          ${!isCompleted ? 'hover:shadow-2xl hover:border-brand-text/10' : ''}
        `}
      >
        {!isCompleted && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-brand-text/5 to-transparent pointer-events-none"
          />
        )}

        <div className="flex justify-between items-start mb-1 sm:mb-4 z-10">
          <div className="flex-1 min-w-0">
            <h3 className={`font-serif font-bold text-brand-text truncate ${isFeatured ? 'text-xl sm:text-4xl mb-0.5 sm:mb-2' : 'text-sm sm:text-xl mb-0 sm:mb-1'}`}>
              {title}
            </h3>
            <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-brand-muted truncate">{subtitle}</p>
          </div>
          <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg border-2 border-gray-50 ${colorClass} bg-opacity-10 shrink-0 ml-2`}>
            <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="mt-auto z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1.5 bg-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 h-3" /> RIJEŠENO
              </span>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGame(id);
                }}
                className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-brand-muted bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-brand-text hover:text-white transition-colors"
              >
                ZAPOČNI
              </button>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className={`absolute -bottom-6 -right-6 opacity-[0.03] ${colorClass.split(' ')[0]}`}>
          <Icon className="w-32 h-32" />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      key={dailyIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="max-w-5xl mx-auto px-4 md:px-8 py-8 w-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-brand-text mb-1">Dnevni izazovi</h2>
        <p className="text-brand-muted text-sm font-medium">Zadaci se osvježavaju svaki dan u ponoć.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {GAMES.map((game, index) => (
          <motion.div 
            key={game.id}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.05 }}
            className={game.isFeatured ? "col-span-2 lg:col-span-3" : ""}
          >
            <GameCard
              {...game}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

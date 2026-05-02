import React from 'react';
import { motion } from 'motion/react';
import { Lock, Flame } from 'lucide-react';

interface GameCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  streak?: number;
  progress?: number; // 0 to 100
  status?: string;
  isFeatured?: boolean;
  locked?: boolean;
  onClick?: () => void;
  colorClass?: string;
}

export default function GameCard({
  title,
  subtitle,
  icon,
  streak,
  progress,
  status,
  isFeatured,
  locked,
  onClick,
  colorClass = "bg-blue-50 text-blue-600"
}: GameCardProps) {
  return (
    <motion.div
      whileHover={!locked ? { y: -4, scale: 1.01 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onClick={!locked ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-2xl border border-nyt-border bg-nyt-card 
        ${locked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer shadow-sm hover:shadow-md'}
        transition-all duration-300 flex flex-col
        ${isFeatured ? 'col-span-full md:flex-row min-h-[200px]' : 'h-full min-h-[160px]'}
      `}
    >
      {/* Icon Area */}
      <div className={`
        flex items-center justify-center p-6
        ${isFeatured ? 'md:w-1/3 border-b md:border-b-0 md:border-r border-nyt-border' : 'border-b border-nyt-border h-24'}
        ${colorClass}
      `}>
        {icon}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-serif font-bold text-xl text-nyt-midnight">{title}</h3>
            {locked && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
          {subtitle && <p className="text-sm text-gray-500 font-medium mb-3">{subtitle}</p>}
        </div>

        <div className="mt-auto pt-4">
          {/* Progress Bar for ongoing games */}
          {progress !== undefined && progress > 0 && progress < 100 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                <span>{status || 'Započeto'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-nyt-midnight h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status or Streak */}
          <div className="flex items-center justify-between mt-2">
            {progress === 100 ? (
              <span className="text-sm font-bold text-green-600">Riješeno</span>
            ) : (
              <span className="text-sm font-semibold text-nyt-midnight">
                {locked ? 'Uskoro' : 'Igraj'}
              </span>
            )}

            {streak !== undefined && streak > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                <Flame className="w-3.5 h-3.5 text-nyt-gold fill-nyt-gold" />
                <span>Niz: {streak}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

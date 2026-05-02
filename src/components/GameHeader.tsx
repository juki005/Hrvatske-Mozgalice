import React from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  timer?: string;
  points?: number;
}

export default function GameHeader({ title, subtitle, onBack, timer, points }: GameHeaderProps) {
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onBack();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#FBF9F4]/80 backdrop-blur-md sticky top-0 z-50 pointer-events-auto">
      <div className="flex items-center gap-3">
        <div className="relative z-[9999]">
          <button 
            type="button"
            onClick={handleBackClick}
            className="cursor-pointer hover:bg-gray-100 p-2 -ml-2 rounded-full transition-all text-brand-text min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Natrag"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-brand-text leading-tight">{title}</h2>
          {subtitle && <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {timer && (
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter">Vrijeme</span>
            <span className="font-mono text-sm font-bold text-brand-text tabular-nums">{timer}</span>
          </div>
        )}
        {points !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-brand-muted uppercase tracking-tighter">Bodovi</span>
            <span className="font-mono text-sm font-bold text-brand-text tabular-nums">{points}</span>
          </div>
        )}
        <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors text-brand-muted min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Delete } from 'lucide-react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStatuses: Record<string, 'correct' | 'present' | 'absent' | 'unused'>;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Š', 'Đ'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Č', 'Ć'],
  ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'Ž', 'BACKSPACE']
];

export default function Keyboard({ onKeyPress, onDelete, onEnter, letterStatuses }: KeyboardProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter();
      } else if (e.key === 'Backspace') {
        onDelete();
      } else {
        const key = e.key.toUpperCase();
        if (/^[A-ZČĆDŽĐŠŽ]$/.test(key)) {
          onKeyPress(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, onDelete, onEnter]);

  const getKeyClass = (key: string, status: string) => {
    const baseClass = "flex items-center justify-center rounded font-bold text-sm sm:text-base cursor-pointer select-none transition-colors h-14";
    const widthClass = key === 'ENTER' || key === 'BACKSPACE' ? "px-2 sm:px-4 flex-grow max-w-[80px]" : "flex-1 max-w-[40px]";
    
    let colorClass = "bg-[#d3d6da] text-black hover:bg-gray-300";
    if (status === 'correct') colorClass = "bg-[#6aaa64] text-white";
    else if (status === 'present') colorClass = "bg-[#c9b458] text-white";
    else if (status === 'absent') colorClass = "bg-[#787c7e] text-white";

    return `${baseClass} ${widthClass} ${colorClass}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 flex flex-col gap-2 pb-8 touch-manipulation">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((key) => {
            const status = letterStatuses[key] || 'unused';
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === 'ENTER') onEnter();
                  else if (key === 'BACKSPACE') onDelete();
                  else onKeyPress(key);
                }}
                className={getKeyClass(key, status)}
              >
                {key === 'BACKSPACE' ? <Delete className="w-5 h-5" /> : key === 'ENTER' ? 'UNESI' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

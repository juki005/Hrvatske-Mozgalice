import React from 'react';
import { ChevronLeft, ChevronRight, Delete } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Š', 'Đ'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Č', 'Ć', 'Ž'],
  ['Y', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function VirtualKeyboard({ 
  onKeyPress, 
  onDelete, 
  onNext, 
  onPrev,
  className = "" 
}: VirtualKeyboardProps) {
  return (
    <div className={`w-full max-w-md mx-auto p-2 bg-gray-100/80 backdrop-blur-md rounded-t-2xl shadow-2xl border-t border-gray-200 fixed bottom-0 left-0 right-0 z-[100] lg:hidden ${className}`}>
      {/* Navigation Controls */}
      {(onNext || onPrev) && (
        <div className="flex justify-between mb-2 px-2">
          <button 
            onClick={onPrev}
            className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl text-brand-text font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4" /> Prethodno
          </button>
          <button 
            onClick={onNext}
            className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl text-brand-text font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            Sljedeće <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Keyboard Rows */}
      <div className="flex flex-col gap-1.5">
        {ROWS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map(key => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="flex-1 min-w-[28px] h-11 bg-white rounded-lg shadow-sm text-brand-text font-bold text-sm active:bg-gray-200 active:scale-95 transition-all flex items-center justify-center"
              >
                {key}
              </button>
            ))}
            {i === 2 && (
              <button
                onClick={onDelete}
                className="flex-[1.5] min-w-[44px] h-11 bg-gray-300 rounded-lg shadow-sm text-brand-text font-bold active:bg-gray-400 active:scale-95 transition-all flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Safe Area Spacer for mobile browsers */}
      <div className="h-4" />
    </div>
  );
}

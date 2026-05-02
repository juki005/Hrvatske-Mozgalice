import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

interface CroKeyboardProps {
  onKey: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  keyStates?: Record<string, 'correct' | 'present' | 'absent' | 'default'>;
}

const CroKeyboard: React.FC<CroKeyboardProps> = ({ onKey, onDelete, onSubmit, keyStates = {} }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Š', 'Đ'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Č', 'Ć', 'Ž'],
    ['SUBMIT', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'DŽ', 'LJ', 'NJ', 'DELETE']
  ];

  const getKeyColor = (key: string) => {
    const state = keyStates[key];
    switch (state) {
      case 'correct': return 'bg-green-500 text-white';
      case 'present': return 'bg-yellow-500 text-white';
      case 'absent': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-brand-text';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => {
            if (key === 'SUBMIT') {
              return (
                <button
                  key={key}
                  onClick={onSubmit}
                  className="px-3 py-4 rounded-lg bg-brand-text text-white font-black text-xs uppercase flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  <CornerDownLeft size={16} />
                </button>
              );
            }
            if (key === 'DELETE') {
              return (
                <button
                  key={key}
                  onClick={onDelete}
                  className="px-3 py-4 rounded-lg bg-gray-300 text-brand-text font-black text-xs uppercase flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  <Delete size={16} />
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`
                  min-w-[30px] sm:min-w-[40px] py-4 rounded-lg font-black text-xs sm:text-sm uppercase flex items-center justify-center shadow-md active:scale-95 transition-all
                  ${getKeyColor(key)}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CroKeyboard;

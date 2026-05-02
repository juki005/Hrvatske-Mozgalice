import React from 'react';
import { motion } from 'motion/react';

interface WordleGridProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  isFinished: boolean;
}

const WordleGrid: React.FC<WordleGridProps> = ({ guesses, currentGuess, solution, isFinished }) => {
  const rows = Array(6).fill('');
  
  const getCellColor = (letter: string, index: number, guess: string) => {
    if (!letter) return 'bg-white border-gray-200';
    
    if (letter === solution[index]) return 'bg-green-500 border-green-600 text-white';
    if (solution.includes(letter)) return 'bg-yellow-500 border-yellow-600 text-white';
    return 'bg-gray-400 border-gray-500 text-white';
  };

  return (
    <div className="grid grid-rows-6 gap-2 w-full max-w-[300px] mx-auto p-4">
      {rows.map((_, i) => {
        const guess = guesses[i] !== undefined ? guesses[i] : (i === guesses.length ? currentGuess : '');
        const isSubmitted = i < guesses.length;
        
        return (
          <div key={i} className="grid grid-cols-5 gap-2">
            {Array(5).fill('').map((_, j) => {
              const letter = guess[j] || '';
              return (
                <motion.div
                  key={j}
                  initial={false}
                  animate={isSubmitted ? { rotateX: 360 } : {}}
                  transition={{ delay: j * 0.1, duration: 0.5 }}
                  className={`
                    aspect-square border-2 rounded-xl flex items-center justify-center text-2xl font-black uppercase
                    ${isSubmitted ? getCellColor(letter, j, guess) : (letter ? 'border-brand-text' : 'border-gray-200')}
                  `}
                >
                  {letter}
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default WordleGrid;

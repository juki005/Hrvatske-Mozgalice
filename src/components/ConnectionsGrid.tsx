import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectionGroup {
  category: string;
  words: string[];
  difficulty: 0 | 1 | 2 | 3;
}

interface ConnectionsGridProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  solvedGroups: ConnectionGroup[];
  isShaking: boolean;
}

const difficultyColors = [
  '#F9DF6D', // Yellow
  '#A0C35A', // Green
  '#B0C4EF', // Blue
  '#BA81C5', // Purple
];

const ConnectionsGrid: React.FC<ConnectionsGridProps> = ({
  words,
  selectedWords,
  onWordClick,
  solvedGroups,
  isShaking,
}) => {
  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-4 gap-2">
      {/* Solved Groups */}
      <AnimatePresence>
        {solvedGroups.map((group, idx) => (
          <motion.div
            key={group.category}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="col-span-4 h-16 rounded-2xl flex flex-col items-center justify-center text-black font-black shadow-lg"
            style={{ backgroundColor: difficultyColors[group.difficulty] }}
          >
            <div className="text-sm uppercase tracking-widest opacity-80">{group.category}</div>
            <div className="text-lg">{group.words.join(', ')}</div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Active Grid */}
      {words.map((word) => {
        const isSelected = selectedWords.includes(word);
        return (
          <motion.button
            key={word}
            onClick={() => onWordClick(word)}
            animate={isShaking && isSelected ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`
              aspect-square rounded-2xl flex items-center justify-center p-2 text-center font-black text-sm md:text-base
              transition-all duration-200 shadow-md
              ${isSelected 
                ? 'bg-brand-text text-white scale-95' 
                : 'bg-gray-100 text-brand-text hover:bg-gray-200'}
            `}
          >
            {word}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ConnectionsGrid;

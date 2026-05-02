import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hexagon, CornerDownLeft, Delete, RefreshCw, AlertCircle } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { beePuzzles } from '../data/spellingBeeData';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import { markGameCompleted } from '../utils/streakManager';
import { generateShareGrid } from '../utils/shareUtils';

interface SpellingBeeProps {
  onBack: () => void;
}

const SpellingBee: React.FC<SpellingBeeProps> = ({ onBack }) => {
  const { difficulty, timerSeconds } = useDifficulty();
  const puzzle = useMemo(() => beePuzzles[difficulty || 'Lako'], [difficulty]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setCurrentWord('');
    setFoundWords([]);
    setIsFinished(false);
    setShowResult(false);
    setHasStarted(false);
  }, [puzzle]);

  const handleGameOver = useCallback((success: boolean) => {
    setIsFinished(true);
    if (success) markGameCompleted('pcelica');
    setTimeout(() => setShowResult(true), 1500);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, () => handleGameOver(false));

  const handleLetter = (letter: string) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);
    setCurrentWord(prev => prev + letter);
  };

  const handleDelete = () => {
    if (isFinished || currentWord.length === 0) return;
    setCurrentWord(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isFinished || currentWord.length === 0) return;

    if (currentWord.length < (difficulty === 'Lako' ? 4 : 5)) {
      setToast('Riječ je prekratka');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    if (!currentWord.includes(puzzle.center)) {
      setToast('Mora sadržavati središnje slovo');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    if (foundWords.includes(currentWord)) {
      setToast('Riječ je već pronađena');
      setTimeout(() => setToast(null), 1500);
      return;
    }

    if (puzzle.validWords.includes(currentWord) || currentWord === puzzle.pangram) {
      setFoundWords(prev => [...prev, currentWord]);
      setCurrentWord('');
      
      if (difficulty === 'Teško' && currentWord === puzzle.pangram) {
        handleGameOver(true);
      } else if (difficulty !== 'Teško' && foundWords.length + 1 >= 5) {
        handleGameOver(true);
      }
    } else {
      setToast('Riječ nije na popisu');
      setTimeout(() => setToast(null), 1500);
    }
  };

  const shuffleLetters = () => {
    // Shuffling logic for outer letters
  };

  const getShareText = () => {
    // For Spelling Bee, we can represent progress as a grid of hexagons/circles
    const grid = Array(Math.min(foundWords.length, 5)).fill(['correct', 'correct', 'correct', 'correct']);
    return generateShareGrid(grid, 'Pčelica');
  };

  return (
    <GameWrapper
      title="Pčelica"
      subtitle={`Razina: ${difficulty}`}
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-lg mx-auto py-8 flex flex-col items-center">
        {/* Word Display */}
        <div className="h-12 flex items-center justify-center mb-8">
          <span className="text-4xl font-black uppercase tracking-widest text-brand-text">
            {currentWord.split('').map((l, i) => (
              <span key={i} className={l === puzzle.center ? 'text-yellow-500' : ''}>{l}</span>
            ))}
            <span className="animate-pulse border-r-4 border-brand-text ml-1 h-10"></span>
          </span>
        </div>

        {/* Hex Grid */}
        <div className="relative w-64 h-64 mb-12">
          {/* Center */}
          <button
            onClick={() => handleLetter(puzzle.center)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-500 text-white font-black text-2xl rounded-xl shadow-xl active:scale-90 transition-all flex items-center justify-center z-10"
          >
            {puzzle.center}
          </button>
          
          {/* Outer */}
          {puzzle.outer.map((letter, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const r = 80;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            
            return (
              <button
                key={i}
                onClick={() => handleLetter(letter)}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-100 text-brand-text font-black text-xl rounded-xl shadow-md active:scale-90 transition-all flex items-center justify-center"
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Found Words */}
        <div className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-inner mb-8 min-h-[100px]">
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2">Pronađene riječi ({foundWords.length})</div>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((w, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-brand-text uppercase">{w}</span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 w-full">
          <button onClick={handleDelete} className="flex-1 py-4 bg-gray-100 text-brand-text font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
            <Delete size={20} />
            Obriši
          </button>
          <button onClick={handleSubmit} className="flex-1 py-4 bg-brand-text text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all">
            <CornerDownLeft size={20} />
            Potvrdi
          </button>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 px-6 py-3 bg-red-500 text-white font-black rounded-full shadow-xl flex items-center gap-2"
            >
              <AlertCircle size={20} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          onBack();
        }}
        title={foundWords.length >= 5 || (difficulty === 'Teško' && foundWords.includes(puzzle.pangram)) ? 'Genijalno!' : 'Više sreće drugi put!'}
        message={`Pronašli ste ${foundWords.length} riječi.`}
        stats={[
          { label: 'Riječi', value: foundWords.length },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
};

export default SpellingBee;

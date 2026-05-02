import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import WordleGrid from './WordleGrid';
import CroKeyboard from './CroKeyboard';
import { croWords5 } from '../data/wordleData';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import { markGameCompleted } from '../utils/streakManager';
import { generateShareGrid } from '../utils/shareUtils';

interface WordleGameProps {
  onBack: () => void;
}

const WordleGame: React.FC<WordleGameProps> = ({ onBack }) => {
  const { difficulty, timerSeconds } = useDifficulty();
  const words = useMemo(() => croWords5[difficulty || 'Lako'], [difficulty]);
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSolution(randomWord.toUpperCase());
    setGuesses([]);
    setCurrentGuess('');
    setIsFinished(false);
    setShowResult(false);
    setHasStarted(false);
  }, [words]);

  const handleGameOver = useCallback((success: boolean) => {
    setIsFinished(true);
    if (success) markGameCompleted('rijec-dana');
    setTimeout(() => setShowResult(true), 1500);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, () => handleGameOver(false));

  const handleKey = (key: string) => {
    if (isFinished || currentGuess.length >= 5) return;
    if (!hasStarted) setHasStarted(true);
    setCurrentGuess(prev => prev + key);
  };

  const handleDelete = () => {
    if (isFinished || currentGuess.length === 0) return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isFinished || currentGuess.length !== 5) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === solution) {
      handleGameOver(true);
    } else if (newGuesses.length >= 6) {
      handleGameOver(false);
    }
  };

  const keyStates = useMemo(() => {
    const states: Record<string, 'correct' | 'present' | 'absent' | 'default'> = {};
    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        if (letter === solution[i]) {
          states[letter] = 'correct';
        } else if (solution.includes(letter) && states[letter] !== 'correct') {
          states[letter] = 'present';
        } else if (!solution.includes(letter) && !states[letter]) {
          states[letter] = 'absent';
        }
      });
    });
    return states;
  }, [guesses, solution]);

  const getShareText = () => {
    const grid = guesses.map(guess => 
      guess.split('').map((letter, i) => {
        if (letter === solution[i]) return 'correct';
        if (solution.includes(letter)) return 'present';
        return 'absent';
      })
    );
    return generateShareGrid(grid, 'Riječ dana');
  };

  return (
    <GameWrapper
      title="Riječ dana"
      subtitle={`Razina: ${difficulty}`}
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-lg mx-auto py-4 flex flex-col items-center">
        <WordleGrid 
          guesses={guesses} 
          currentGuess={currentGuess} 
          solution={solution} 
          isFinished={isFinished} 
        />
        
        <div className="mt-auto w-full">
          <CroKeyboard 
            onKey={handleKey} 
            onDelete={handleDelete} 
            onSubmit={handleSubmit} 
            keyStates={keyStates} 
          />
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
        title={guesses.includes(solution) ? 'Genijalno!' : 'Više sreće drugi put!'}
        message={guesses.includes(solution) 
          ? `Pronašli ste riječ dana u ${guesses.length} pokušaja.` 
          : `Riječ je bila: ${solution}`}
        stats={[
          { label: 'Pokušaji', value: `${guesses.length}/6` },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
};

export default WordleGame;

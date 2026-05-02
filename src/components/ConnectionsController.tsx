import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import ConnectionsGrid from './ConnectionsGrid';
import { connectionsData, ConnectionGroup } from '../data/connectionsData';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import { markGameCompleted } from '../utils/streakManager';
import { generateShareGrid } from '../utils/shareUtils';

interface ConnectionsControllerProps {
  onBack: () => void;
}

const ConnectionsController: React.FC<ConnectionsControllerProps> = ({ onBack }) => {
  const { difficulty, timerSeconds } = useDifficulty();
  const filteredLevels = useMemo(() => 
    connectionsData.filter(l => l.difficulty === difficulty),
    [difficulty]
  );
  
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = filteredLevels[levelIndex] || filteredLevels[0];
  
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionGroup[]>([]);
  const [mistakesLeft, setMistakesLeft] = useState(4);
  const [isShaking, setIsShaking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!currentLevel) return;
    // Initialize level
    const allWords = currentLevel.groups.flatMap(g => g.words);
    setWords(allWords.sort(() => Math.random() - 0.5));
    setSolvedGroups([]);
    setSelectedWords([]);
    setMistakesLeft(4);
    setIsFinished(false);
    setShowResult(false);
    setHasStarted(false);
  }, [currentLevel]);

  const handleGameOver = useCallback((success: boolean) => {
    setIsFinished(true);
    if (success) markGameCompleted('poveznice');
    setTimeout(() => setShowResult(true), 1000);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, () => handleGameOver(false));

  const handleWordClick = (word: string) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const handleCheck = () => {
    if (selectedWords.length !== 4 || isFinished) return;

    const foundGroup = currentLevel.groups.find(group => 
      group.words.every(w => selectedWords.includes(w))
    );

    if (foundGroup) {
      setSolvedGroups(prev => [...prev, foundGroup]);
      setWords(prev => prev.filter(w => !selectedWords.includes(w)));
      setSelectedWords([]);
      
      if (solvedGroups.length + 1 === 4) {
        handleGameOver(true);
      }
    } else {
      setIsShaking(true);
      setToast('Pokušaj ponovno');
      setMistakesLeft(prev => prev - 1);
      setTimeout(() => {
        setIsShaking(false);
        setToast(null);
      }, 1500);

      if (mistakesLeft - 1 === 0) {
        handleGameOver(false);
      }
    }
  };

  const getShareText = () => {
    // For Connections, we can represent the solved groups as rows of emojis
    // Each group has a difficulty level (0-3) which we can map to colors
    const grid = solvedGroups.map(group => {
      const type = group.difficulty === 0 ? 'correct' : (group.difficulty === 1 ? 'present' : 'absent');
      return Array(4).fill(type);
    });
    return generateShareGrid(grid, 'Poveznice');
  };

  return (
    <GameWrapper
      title="Poveznice"
      subtitle={`Razina: ${difficulty}`}
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-lg mx-auto py-8 px-4 flex flex-col items-center">
        {/* Mistakes Left */}
        <div className="flex gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              animate={{ scale: i < mistakesLeft ? 1 : 0.5, opacity: i < mistakesLeft ? 1 : 0.2 }}
              className="w-4 h-4 rounded-full bg-brand-text"
            />
          ))}
        </div>

        {/* Grid */}
        <ConnectionsGrid
          words={words}
          selectedWords={selectedWords}
          onWordClick={handleWordClick}
          solvedGroups={solvedGroups}
          isShaking={isShaking}
        />

        {/* Controls */}
        <div className="mt-8 flex gap-4 w-full">
          <button
            onClick={() => setSelectedWords([])}
            className="flex-1 py-4 bg-gray-100 text-brand-text font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            <RefreshCw size={20} />
            Poništi sve
          </button>
          <button
            onClick={handleCheck}
            disabled={selectedWords.length !== 4 || isFinished}
            className="flex-1 py-4 bg-brand-text text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
          >
            <CheckCircle2 size={20} />
            Provjeri
          </button>
        </div>

        {/* Toast */}
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
          if (solvedGroups.length === 4) {
            if (levelIndex < filteredLevels.length - 1) {
              setLevelIndex(prev => prev + 1);
            } else {
              onBack();
            }
          } else {
            setLevelIndex(levelIndex); // Restart current level
          }
        }}
        title={solvedGroups.length === 4 ? 'Genijalno!' : 'Više sreće drugi put!'}
        message={solvedGroups.length === 4 
          ? `Uspješno ste povezali sve kategorije u razini ${difficulty}.` 
          : 'Pokušajte ponovno otkriti skrivene poveznice.'}
        stats={[
          { label: 'Riješeno', value: `${solvedGroups.length}/4` },
          { label: 'Greške', value: 4 - mistakesLeft },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
};

export default ConnectionsController;

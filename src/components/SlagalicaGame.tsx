import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { slagalicaData } from '../data/balkanClassics';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { isValidCroatianWord } from '../utils/dictionary';
import { markGameCompleted } from '../utils/streakManager';

export default function SlagalicaGame({ onBack }: { onBack: () => void }) {
  const [letters, setLetters] = useState<{char: string, used: boolean, id: number}[]>([]);
  const [currentWord, setCurrentWord] = useState<{char: string, id: number}[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [submittedWord, setSubmittedWord] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    setLetters(slagalicaData.letters.map((char, i) => ({ char, used: false, id: i })));
  }, []);

  useEffect(() => {
    if (hasStarted && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleTimeUp();
    }
  }, [hasStarted, isFinished, timeLeft]);

  const handleTimeUp = () => {
    setIsFinished(true);
    checkWord(currentWord.map(l => l.char).join(''));
  };

  const handleLetterClick = (id: number) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);

    const letterIdx = letters.findIndex(l => l.id === id);
    if (letterIdx === -1 || letters[letterIdx].used) return;

    const newLetters = [...letters];
    newLetters[letterIdx].used = true;
    setLetters(newLetters);
    
    setCurrentWord(prev => [...prev, { char: newLetters[letterIdx].char, id }]);
  };

  const handleRemoveLetter = (id: number) => {
    if (isFinished) return;
    
    const newCurrentWord = currentWord.filter(l => l.id !== id);
    setCurrentWord(newCurrentWord);

    const newLetters = [...letters];
    const letterIdx = newLetters.findIndex(l => l.id === id);
    if (letterIdx !== -1) {
      newLetters[letterIdx].used = false;
      setLetters(newLetters);
    }
  };

  const handleSubmit = () => {
    if (isFinished) return;
    setIsFinished(true);
    checkWord(currentWord.map(l => l.char).join(''));
  };

  const checkWord = (word: string) => {
    setSubmittedWord(word);
    if (word.length > 0 && isValidCroatianWord(word)) {
      setIsValid(true);
      markGameCompleted('slagalica');
    } else {
      setIsValid(false);
    }
  };

  const getRank = (len: number) => {
    if (len >= 10) return "Genijalac";
    if (len >= 8) return "Odlično";
    if (len >= 6) return "Vrlo dobro";
    return "Dobar";
  };

  const getShareText = () => {
    return `Hrvatske Igre: SLAGALICA\nMoja riječ: ${submittedWord} (${submittedWord.length} slova)\nNajduža: ${slagalicaData.longestWord} (${slagalicaData.longestWord.length} slova)\n🏆 ${isValid ? getRank(submittedWord.length) : 'Pokušaj ponovno'}`;
  };

  const formattedTime = `00:${timeLeft.toString().padStart(2, '0')}`;

  return (
    <GameWrapper 
      title="Slagalica" 
      subtitle="Najduža riječ" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-md mx-auto py-4 flex flex-col items-center">
        {/* Current Word Display */}
        <div className="w-full min-h-[80px] bg-white border-2 border-gray-100 rounded-[2rem] mb-10 flex flex-wrap items-center justify-center gap-2 p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-text/5"></div>
          {currentWord.length > 0 ? currentWord.map((l, i) => (
            <motion.div
              key={`${l.id}-${i}`}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveLetter(l.id)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-text text-white rounded-2xl flex items-center justify-center text-2xl font-serif font-bold cursor-pointer shadow-lg border-2 border-white/20"
            >
              {l.char}
            </motion.div>
          )) : (
            <span className="text-gray-300 italic font-serif text-xl">Složi najdužu riječ...</span>
          )}
        </div>

        {/* Letter Grid */}
        <div className="grid grid-cols-6 gap-3 mb-12 w-full">
          {letters.map((l) => (
            <motion.div
              key={l.id}
              onClick={() => handleLetterClick(l.id)}
              className={`
                aspect-square rounded-2xl flex items-center justify-center text-2xl font-serif font-bold cursor-pointer transition-all border-2
                ${l.used 
                  ? 'bg-gray-50 text-gray-200 border-transparent shadow-inner' 
                  : 'bg-white border-gray-100 text-brand-text hover:border-brand-text/30 shadow-md hover:shadow-lg active:scale-90'}
              `}
              whileTap={!l.used ? { scale: 0.9 } : {}}
            >
              {l.char}
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isFinished || currentWord.length === 0}
          className="w-full py-5 bg-brand-text text-white text-2xl font-black rounded-[2rem] shadow-2xl disabled:opacity-50 hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em]"
        >
          POTVRDI RIJEČ
        </button>

        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center bg-green-50 p-6 rounded-[2rem] border-2 border-green-100 w-full shadow-sm"
          >
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Najduža pronađena riječ</p>
            <div className="text-4xl font-serif font-bold text-green-700 tracking-widest uppercase">
              {slagalicaData.longestWord}
            </div>
          </motion.div>
        )}
      </div>

      <ResultModal
        isOpen={isFinished}
        onClose={onBack}
        title={isValid ? "Bravo!" : "Isteklo vrijeme!"}
        message={isValid ? `Pronašli ste riječ od ${submittedWord.length} slova.` : "Niste pronašli važeću riječ."}
        stats={[
          { label: 'Vaša riječ', value: isValid ? submittedWord.length : 0 },
          { label: 'Najduža', value: slagalicaData.longestWord.length }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

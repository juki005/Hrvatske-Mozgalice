import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, HelpCircle, Zap } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { useTimer } from '../hooks/useTimer';
import { zagonetnaOsobaData } from '../data/zagonetnaOsoba';
import { getDailyIndex } from '../utils/scheduler';
import { useDifficulty } from '../context/DifficultyContext';
import { markGameCompleted } from '../utils/streakManager';

export default function ZagonetnaOsobaGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);
  
  const [person, setPerson] = useState(zagonetnaOsobaData[0]);
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isWon, setIsWon] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Select person based on daily index
    const index = getDailyIndex('2024-01-01') % zagonetnaOsobaData.length;
    setPerson(zagonetnaOsobaData[index]);

    // Set initial clues based on difficulty
    if (difficulty === 'Lako') {
      setCluesRevealed(3);
    } else if (difficulty === 'Srednje') {
      setCluesRevealed(2);
    } else {
      setCluesRevealed(1);
    }
  }, [difficulty]);

  const handleRevealClue = () => {
    if (difficulty === 'Teško') return; // Cannot reveal more in Hard mode
    if (cluesRevealed < 3) {
      setCluesRevealed(prev => prev + 1);
      if (!hasStarted) setHasStarted(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isFinished || !input.trim()) return;
    if (!hasStarted) setHasStarted(true);

    const normalizedInput = input.trim().toUpperCase();
    const normalizedTarget = person.name.toUpperCase();
    
    // Check for match
    const isMatch = normalizedInput === normalizedTarget || 
                   (normalizedTarget.includes(normalizedInput) && normalizedInput.length > 5);

    if (isMatch) {
      setIsWon(true);
      setIsFinished(true);
      markGameCompleted('zagonetna-osoba');
    } else {
      setError('Netočno. Pokušajte ponovno.');
      setInput('');
      setShowSuggestions(false);
    }
  };

  const getPoints = () => {
    if (!isWon) return 0;
    let basePoints = 0;
    if (difficulty === 'Teško') basePoints = 10;
    else if (difficulty === 'Srednje') basePoints = 5;
    else basePoints = 3;

    // Penalty for clues used
    const penalty = (cluesRevealed - 1) * (difficulty === 'Lako' ? 0.5 : 1);
    return Math.max(1, basePoints - penalty);
  };

  const getShareText = () => {
    return `Hrvatske Igre: ZAGONETNA OSOBA\nRazina: ${difficulty}\nOsoba: ${isWon ? person.name : '???'}\nBodovi: ${getPoints()}\n⏱️ ${formattedTime}`;
  };

  const suggestions = zagonetnaOsobaData
    .map(p => p.name)
    .filter(name => name.toUpperCase().includes(input.toUpperCase()) && input.length > 1)
    .slice(0, 3);

  return (
    <GameWrapper 
      title="Zagonetna Osoba" 
      subtitle="Tko sam ja?" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-md mx-auto py-4 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto bg-brand-text/5 rounded-full flex items-center justify-center mb-4 shadow-inner border border-brand-text/10">
            <HelpCircle className="w-12 h-12 text-brand-text/40" />
          </div>
          <div className="inline-flex items-center px-4 py-1.5 bg-brand-text/5 rounded-full mb-2 border border-brand-text/10">
            <p className="text-brand-text font-bold uppercase tracking-[0.2em] text-[10px]">Razina: {difficulty}</p>
          </div>
          <p className="text-brand-muted text-sm font-medium">Pogodite o kojoj se poznatoj osobi radi.</p>
        </div>

        <div className="space-y-4 mb-8 w-full">
          {[0, 1, 2].map((index) => (
            <motion.div 
              key={index} 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: index < cluesRevealed ? 1 : 0.3 }}
              className={`p-5 rounded-[1.5rem] border-2 transition-all duration-500 relative overflow-hidden
                ${index < cluesRevealed 
                  ? 'bg-white border-brand-text/10 shadow-lg' 
                  : 'bg-gray-50 border-gray-100 opacity-50'}`}
            >
              {index < cluesRevealed && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-text/20"></div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                  ${index === 0 ? 'bg-red-50 text-red-600 border border-red-100' : 
                    index === 1 ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 
                    'bg-green-50 text-green-600 border border-green-100'}`}
                >
                  {index === 0 ? 'TRAG 1 • Oskuran' : index === 1 ? 'TRAG 2 • Kriptičan' : 'TRAG 3 • Očit'}
                </span>
              </div>
              <p className={`font-serif text-lg leading-relaxed text-brand-text ${index >= cluesRevealed ? 'blur-md select-none' : ''}`}>
                {index >= cluesRevealed ? 'Ova pomoć je skrivena.' : person.clues[index]}
              </p>
            </motion.div>
          ))}
        </div>

        {cluesRevealed < 3 && !isFinished && difficulty !== 'Teško' && (
          <button 
            onClick={handleRevealClue}
            className="w-full py-4 mb-8 bg-white border-2 border-gray-200 text-brand-text font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-50 transition-all shadow-md active:scale-95"
          >
            Otkrij sljedeću pomoć (-bodovi)
          </button>
        )}

        <div className="relative w-full mt-auto">
          {error && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-500 text-center font-bold mb-4 w-full text-xs bg-red-50 py-2 rounded-xl border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text/30">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => { 
                setInput(e.target.value); 
                setError(''); 
                setShowSuggestions(true);
                if (!hasStarted) setHasStarted(true); 
              }}
              placeholder="UPIŠI IME OSOBE..."
              disabled={isFinished}
              className={`w-full h-16 pl-14 pr-32 rounded-2xl border-2 outline-none font-sans text-lg font-black shadow-xl transition-all uppercase tracking-wider
                ${error ? 'border-red-500 text-red-500 animate-shake' : 'border-gray-200 focus:border-brand-text text-brand-text bg-white'}`}
            />
            <button 
              onClick={() => handleSubmit()}
              disabled={isFinished || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-brand-text text-white font-black uppercase tracking-widest text-[10px] rounded-xl disabled:opacity-50 hover:bg-black transition-all active:scale-95 shadow-lg"
            >
              POGODI
            </button>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                >
                  {suggestions.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(name);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-6 py-4 text-left font-black text-brand-text hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors uppercase text-sm"
                    >
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={isFinished}
        onClose={onBack}
        title={isWon ? "Točno!" : "Kraj igre"}
        message={
          <div className="flex flex-col items-center gap-4">
            {isWon && difficulty === 'Teško' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-current" /> Gospodar Brzine
              </div>
            )}
            <p>{isWon ? `Pogodili ste! Tražena osoba je ${person.name}.` : `Tražena osoba je bila ${person.name}.`}</p>
          </div>
        }
        stats={[
          { label: 'Bodovi', value: getPoints() },
          { label: 'Razina', value: difficulty || 'Lako' }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

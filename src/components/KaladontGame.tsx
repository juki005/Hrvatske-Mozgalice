import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { isValidCroatianWord } from '../utils/dictionary';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import CroKeyboard from './CroKeyboard';
import { markGameCompleted } from '../utils/streakManager';

const START_WORDS = ['TRAVA', 'VODA', 'JABUKA', 'KUĆA', 'SUNCE', 'RIJEKA', 'ZIMA', 'LJETO'];

export default function KaladontGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [startWord] = useState(() => START_WORDS[Math.floor(Math.random() * START_WORDS.length)]);
  const [words, setWords] = useState<string[]>([startWord]);
  const [input, setInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  useEffect(() => {
    if (words.length === 11) { // Start word + 10 words
      setIsFinished(true);
      setIsWon(true);
      markGameCompleted('kaladont');
    }
  }, [words]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);

    const lastWord = words[words.length - 1];
    const requiredStart = lastWord.slice(-2);
    
    let typed = input.replace(/\s+/g, '').toUpperCase();
    // If user accidentally typed the prefix, remove it to prevent VAVATRA
    if (typed.startsWith(requiredStart) && typed.length > requiredStart.length) {
      typed = typed.slice(requiredStart.length);
    }
    
    const fullWord = requiredStart + typed;

    // Difficulty constraints
    if (difficulty !== 'Lako') {
      if (fullWord.length <= 3) {
        setError('Riječ mora imati više od 3 slova.');
        return;
      }
    }

    if (difficulty === 'Teško') {
      const forbidden = ['KA', 'NT', 'RT'];
      if (forbidden.some(end => fullWord.endsWith(end))) {
        setError(`Riječ ne smije završavati na ${forbidden.join(', ')}.`);
        return;
      }
    }

    if (words.includes(fullWord)) {
      setError('Riječ je već iskorištena.');
      return;
    }

    if (!isValidCroatianWord(fullWord)) {
      setError('Nepoznata riječ.');
      return;
    }

    setWords(prev => [...prev, fullWord]);
    setInput('');
    setError('');
    
    // Scroll to bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const getShareText = () => {
    return `Hrvatske Igre: KALADONT\nRazina: ${difficulty}\n⛓️ Riječi: ${words.length - 1}/10\n${isWon ? '🏆 Pobjeda!' : '❌ Kraj igre'}`;
  };

  const requiredPrefix = words[words.length - 1].slice(-2);

  const handleKey = (key: string) => {
    if (isFinished) return;
    setInput(prev => prev + key);
    if (!hasStarted) setHasStarted(true);
    setError('');
  };

  const handleDelete = () => {
    if (isFinished) return;
    setInput(prev => prev.slice(0, -1));
  };

  return (
    <GameWrapper 
      title="Kaladont" 
      subtitle="Brzinski sprint" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-md mx-auto py-4 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-brand-text/5 rounded-full mb-4 border border-brand-text/10">
            <p className="text-brand-text font-bold uppercase tracking-[0.2em] text-[10px]">Pravila igre - {difficulty}</p>
          </div>
          <p className="text-brand-muted text-sm font-medium leading-relaxed">
            Pronađi 10 riječi. Svaka mora početi sa zadnja 2 slova prethodne.<br/>
            {difficulty === 'Teško' && (
              <span className="text-red-500 font-bold">Zabranjeno:</span>
            )}
            {difficulty === 'Teško' && (
              <span> završetak na <span className="font-black">KA, NT, RT</span>.</span>
            )}
            {difficulty === 'Srednje' && (
              <span className="text-brand-text font-bold">Min. 4 slova.</span>
            )}
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mb-4">
          {words.map((w, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-5 rounded-[1.5rem] font-serif text-2xl font-bold border-2 shadow-sm relative overflow-hidden
                ${i === 0 
                  ? 'bg-brand-text text-white border-brand-text shadow-xl' 
                  : 'bg-white text-brand-text border-gray-100'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-white/40' : 'text-brand-muted'}`}>
                  {i === 0 ? 'POČETNA' : `RIJEČ ${i}`}
                </span>
                {i > 0 && <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="opacity-40 text-sm font-sans mr-2">#{(i+1).toString().padStart(2, '0')}</span>
                <span>{w.slice(0, -2)}</span>
                <span className="text-red-500 font-black underline decoration-2 underline-offset-4">{w.slice(-2)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4 mb-8">
          {error && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-3 text-center bg-red-50 py-2 rounded-lg border border-red-100"
            >
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className={`flex-1 flex items-center h-16 px-6 rounded-2xl border-2 bg-white transition-all shadow-lg ${error ? 'border-red-500 animate-shake' : 'border-gray-200 focus-within:border-brand-text focus-within:ring-4 focus-within:ring-brand-text/5'}`}>
              <span className="font-serif font-black text-red-500 text-2xl mr-1">{requiredPrefix}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(''); if (!hasStarted) setHasStarted(true); }}
                className={`flex-1 h-full p-0 m-0 border-none outline-none font-sans uppercase font-black text-2xl bg-transparent placeholder:text-gray-200 ${error ? 'text-red-500' : 'text-brand-text'}`}
                placeholder="..."
                disabled={isFinished}
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={isFinished || !input}
              className="h-16 px-8 bg-brand-text text-white font-black uppercase tracking-widest text-xs rounded-2xl disabled:opacity-50 hover:bg-black transition-all active:scale-95 shadow-xl"
            >
              UNESI
            </button>
          </form>
        </div>

        <div className="w-full bg-gray-50/50 py-6 border-t border-gray-100">
          <CroKeyboard 
            onKey={handleKey}
            onDelete={handleDelete}
            onSubmit={() => handleSubmit({ preventDefault: () => {} } as any)}
          />
        </div>
      </div>

      <ResultModal
        isOpen={isFinished}
        onClose={onBack}
        title={isWon ? "Bravo!" : "Kraj igre"}
        message={
          <div className="flex flex-col items-center gap-4">
            {isWon && difficulty === 'Teško' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-current" /> Gospodar Brzine
              </div>
            )}
            <p>{isWon ? "Uspješno ste završili lanac." : `Uspjeli ste povezati ${words.length - 1} riječi.`}</p>
          </div>
        }
        stats={[
          { label: 'Razina', value: difficulty || 'Lako' },
          { label: 'Riječi', value: `${words.length - 1}/10` }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

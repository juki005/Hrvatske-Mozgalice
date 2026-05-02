import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { isValidCategoryWord } from '../utils/dictionary';
import { useTimer } from '../hooks/useTimer';
import { useDifficulty } from '../context/DifficultyContext';
import CroKeyboard from './CroKeyboard';
import { markGameCompleted } from '../utils/streakManager';

const CATEGORIES = [
  { id: 'grad', label: 'Grad' },
  { id: 'drzava', label: 'Država' },
  { id: 'zivotinja', label: 'Životinja' },
  { id: 'biljka', label: 'Biljka' },
  { id: 'stvar', label: 'Stvar' }
];

const LETTER_GROUPS = {
  Lako: ['A', 'S', 'M', 'P', 'K', 'O'],
  Srednje: ['B', 'G', 'V', 'R', 'D', 'T', 'N', 'L'],
  Teško: ['F', 'Đ', 'Ž', 'Č', 'Š', 'H', 'U', 'I', 'E']
};

export default function GradDrzavaGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [letter] = useState(() => {
    const group = LETTER_GROUPS[difficulty as keyof typeof LETTER_GROUPS] || LETTER_GROUPS.Lako;
    return group[Math.floor(Math.random() * group.length)];
  });

  const [inputs, setInputs] = useState<Record<string, string>>({
    grad: '', drzava: '', zivotinja: '', biljka: '', stvar: ''
  });
  const [validations, setValidations] = useState<Record<string, boolean | null>>({
    grad: null, drzava: null, zivotinja: null, biljka: null, stvar: null
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(null);
  
  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  useEffect(() => {
    const allValid = CATEGORIES.every(c => validations[c.id] === true);
    if (allValid && hasStarted && !isFinished) {
      setIsFinished(true);
      markGameCompleted('grad-drzava');
    }
  }, [validations, hasStarted, isFinished]);

  const handleInputChange = (id: string, val: string) => {
    if (!hasStarted) setHasStarted(true);
    setInputs(prev => ({ ...prev, [id]: val.toUpperCase() }));
    // Reset validation when typing
    if (validations[id] !== null) {
      setValidations(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleCheck = (id: string, isEnter: boolean = false) => {
    const word = inputs[id].trim();
    if (!word) return;
    
    const isValid = isValidCategoryWord(word, letter, id);
    setValidations(prev => ({ ...prev, [id]: isValid }));
    
    if (isEnter && isValid) {
      // Find next input
      const currentIndex = CATEGORIES.findIndex(c => c.id === id);
      if (currentIndex < CATEGORIES.length - 1) {
        const nextId = CATEGORIES[currentIndex + 1].id;
        inputRefs.current[nextId]?.focus();
      }
    }
  };

  const handleKey = (key: string) => {
    if (isFinished || !focusedCategoryId) return;
    handleInputChange(focusedCategoryId, inputs[focusedCategoryId] + key);
  };

  const handleDelete = () => {
    if (isFinished || !focusedCategoryId) return;
    handleInputChange(focusedCategoryId, inputs[focusedCategoryId].slice(0, -1));
  };

  const getShareText = () => {
    return `Hrvatske Igre: GRAD-DRŽAVA\nRazina: ${difficulty}\nSlovo: ${letter}\n⏱️ ${formattedTime}\n${isFinished ? '🏆 Završeno!' : '❌ Kraj'}`;
  };

  return (
    <GameWrapper 
      title="Grad-Država" 
      subtitle="Kategorijski blitz" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-md mx-auto py-4 flex flex-col items-center">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-brand-text/5 rounded-full mb-4 border border-brand-text/10">
            <p className="text-brand-text font-bold uppercase tracking-[0.2em] text-[10px]">Pronađi riječi na slovo - {difficulty}</p>
          </div>
          <div className="w-24 h-24 mx-auto bg-brand-text text-white rounded-[2rem] flex items-center justify-center text-6xl font-serif font-bold shadow-2xl border-4 border-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <span className="relative z-10">{letter}</span>
          </div>
        </div>

        <div className="w-full space-y-6 mb-12">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{cat.label}</span>
                {validations[cat.id] === true && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> TOČNO
                  </motion.span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={el => inputRefs.current[cat.id] = el}
                  type="text"
                  value={inputs[cat.id]}
                  onChange={(e) => handleInputChange(cat.id, e.target.value)}
                  onFocus={() => {
                    setFocusedCategoryId(cat.id);
                    // Scroll into view on mobile
                    setTimeout(() => {
                      inputRefs.current[cat.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                  }}
                  onBlur={() => {
                    handleCheck(cat.id);
                    // Small delay to allow keyboard clicks
                    setTimeout(() => setFocusedCategoryId(prev => prev === cat.id ? null : prev), 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCheck(cat.id, true);
                    }
                  }}
                  placeholder="..."
                  disabled={isFinished || validations[cat.id] === true}
                  className={`
                    w-full h-16 px-6 rounded-2xl border-2 outline-none font-sans uppercase font-black text-xl transition-all shadow-sm
                    ${validations[cat.id] === true ? 'bg-green-50 border-green-500 text-green-700 shadow-inner' : 
                      validations[cat.id] === false ? 'bg-red-50 border-red-500 text-red-700 animate-shake' : 
                      'bg-white border-gray-200 focus:border-brand-text focus:ring-2 focus:ring-brand-text/10 text-brand-text'}
                  `}
                />
                {validations[cat.id] === false && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold">✗</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-50/50 py-6 border-t border-gray-100">
          <CroKeyboard 
            onKey={handleKey}
            onDelete={handleDelete}
            onSubmit={() => focusedCategoryId && handleCheck(focusedCategoryId, true)}
          />
        </div>
      </div>

      <ResultModal
        isOpen={isFinished}
        onClose={onBack}
        title="Bravo!"
        message={
          <div className="flex flex-col items-center gap-4">
            {difficulty === 'Teško' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-current" /> Gospodar Brzine
              </div>
            )}
            <p>Uspješno ste popunili sve kategorije.</p>
          </div>
        }
        stats={[
          { label: 'Razina', value: difficulty || 'Lako' },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

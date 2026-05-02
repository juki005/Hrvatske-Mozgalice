import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Delete, RotateCcw, Zap } from 'lucide-react';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { useTimer } from '../hooks/useTimer';
import { useDifficulty } from '../context/DifficultyContext';
import { evaluateExpression, findClosestSolution } from '../utils/MathEvaluator';
import { markGameCompleted } from '../utils/streakManager';

const OPERATORS = ['+', '-', '*', '/', '(', ')'];

export default function IgraBrojevaGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);
  
  // Game state
  const [targetNumber, setTargetNumber] = useState(0);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [expression, setExpression] = useState<(number | string)[]>([]);
  const [usedNumbers, setUsedNumbers] = useState<boolean[]>([]);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [aiSolution, setAiSolution] = useState<{expr: string, result: number, diff: number} | null>(null);

  // Initialize game
  useEffect(() => {
    // 4 small digits
    const smallOptions = difficulty === 'Lako' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const singleDigits = Array.from({ length: 4 }, () => smallOptions[Math.floor(Math.random() * smallOptions.length)]);
    
    // 1 middle
    const middleOptions = difficulty === 'Lako' ? [10, 15, 20] : [10, 15, 20, 25];
    const middle = middleOptions[Math.floor(Math.random() * middleOptions.length)];
    
    // 1 large
    const largeOptions = [25, 50, 75, 100];
    const large = largeOptions[Math.floor(Math.random() * largeOptions.length)];
    
    const allNums = [...singleDigits, middle, large];
    setNumbers(allNums);
    setUsedNumbers(new Array(6).fill(false));
    
    // Target based on difficulty
    let target = 0;
    if (difficulty === 'Lako') {
      target = Math.floor(Math.random() * 200) + 100; // 100-300
    } else if (difficulty === 'Srednje') {
      target = Math.floor(Math.random() * 400) + 300; // 300-700
    } else {
      target = Math.floor(Math.random() * 300) + 700; // 700-1000
    }
    setTargetNumber(target);

    // Find AI solution
    const solution = findClosestSolution(allNums, target);
    setAiSolution(solution);
  }, [difficulty]);

  // Evaluate expression safely
  useEffect(() => {
    const result = evaluateExpression(expression);
    setCurrentResult(result);
  }, [expression]);

  const handleNumberClick = (index: number) => {
    if (isFinished || usedNumbers[index]) return;
    if (!hasStarted) setHasStarted(true);
    
    setExpression(prev => [...prev, numbers[index]]);
    setUsedNumbers(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleOperatorClick = (op: string) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);
    setExpression(prev => [...prev, op]);
  };

  const handleUndo = () => {
    if (isFinished || expression.length === 0) return;
    
    const lastItem = expression[expression.length - 1];
    setExpression(prev => prev.slice(0, -1));
    
    if (typeof lastItem === 'number') {
      // Find the index of this number in the original array that is marked as used
      const indexToRestore = numbers.findIndex((n, i) => n === lastItem && usedNumbers[i]);
      if (indexToRestore !== -1) {
        setUsedNumbers(prev => {
          const next = [...prev];
          next[indexToRestore] = false;
          return next;
        });
      }
    }
  };

  const handleClear = () => {
    if (isFinished) return;
    setExpression([]);
    setUsedNumbers(new Array(6).fill(false));
  };

  const handleSubmit = () => {
    if (currentResult !== null) {
      setIsFinished(true);
      markGameCompleted('igra-brojeva');
    }
  };

  const difference = currentResult !== null ? Math.abs(targetNumber - currentResult) : null;
  const isExact = difference === 0;

  const getShareText = () => {
    return `Hrvatske Igre: IGRA BROJEVA\nRazina: ${difficulty}\nCilj: ${targetNumber}\nRezultat: ${currentResult || 'Nema'}\nRazlika: ${difference !== null ? difference : 'X'}\n⏱️ ${formattedTime}`;
  };

  return (
    <GameWrapper 
      title="Igra Brojeva" 
      subtitle="Matematički sprint" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-md mx-auto py-4 flex flex-col items-center">
        {/* Target Number */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-brand-text/5 rounded-full mb-4 border border-brand-text/10">
            <p className="text-brand-text font-bold uppercase tracking-[0.2em] text-[10px]">Traženi broj - {difficulty}</p>
          </div>
          <div className="w-40 h-24 bg-brand-text text-white rounded-[2rem] flex items-center justify-center text-6xl font-serif font-bold shadow-2xl border-4 border-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
            <span className="relative z-10">{targetNumber}</span>
          </div>
        </div>

        {/* Expression Display Card */}
        <div className="w-full bg-white rounded-[2rem] p-6 mb-8 shadow-xl border border-gray-100 flex flex-col gap-6 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-brand-text rounded-l-[2rem]"></div>
          
          <div className="flex flex-wrap gap-2 text-3xl font-mono font-bold text-brand-text min-h-[80px] items-center content-center px-2">
            {expression.length > 0 ? expression.map((item, i) => (
              <motion.span 
                key={i} 
                initial={{ scale: 0.8, opacity: 0, y: 5 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className={typeof item === 'string' ? 'text-blue-600' : 'bg-gray-100 px-3 py-1 rounded-xl shadow-sm'}
              >
                {item}
              </motion.span>
            )) : <span className="text-gray-300 italic text-2xl font-normal">Složi izraz...</span>}
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Trenutni rezultat</span>
              <div className={`text-5xl font-mono font-black transition-all ${currentResult === targetNumber ? 'text-green-600 scale-110 origin-left' : 'text-brand-text'}`}>
                {currentResult !== null ? currentResult : '---'}
              </div>
            </div>
            {currentResult !== null && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Razlika</span>
                <div className="text-3xl font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                  {Math.abs(targetNumber - currentResult)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={handleUndo} 
            disabled={expression.length === 0 || isFinished} 
            className="py-4 bg-white border-2 border-gray-200 text-brand-text rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-gray-50 transition-all active:scale-95 shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Vrati
          </button>
          <button 
            onClick={handleClear} 
            disabled={expression.length === 0 || isFinished} 
            className="py-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-red-100 transition-all active:scale-95 shadow-md"
          >
            <Delete className="w-4 h-4" /> Obriši
          </button>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {numbers.map((num, i) => (
            <motion.button
              key={i}
              whileTap={!usedNumbers[i] && !isFinished ? { scale: 0.95 } : {}}
              onClick={() => handleNumberClick(i)}
              disabled={usedNumbers[i] || isFinished}
              className={`h-20 rounded-[1.5rem] text-3xl font-black font-mono transition-all relative overflow-hidden border-2
                ${usedNumbers[i] 
                  ? 'bg-gray-50 text-gray-200 border-transparent shadow-inner' 
                  : 'bg-white text-brand-text shadow-lg border-gray-100 hover:border-brand-text/30 active:bg-gray-50'}`}
            >
              {num}
              {usedNumbers[i] && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-full h-1 bg-gray-400 rotate-45 absolute"></div>
                  <div className="w-full h-1 bg-gray-400 -rotate-45 absolute"></div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Operator Grid */}
        <div className="grid grid-cols-6 gap-2 w-full mb-10">
          {OPERATORS.map((op, i) => (
            <motion.button
              key={i}
              whileTap={!isFinished ? { scale: 0.9 } : {}}
              onClick={() => handleOperatorClick(op)}
              disabled={isFinished}
              className="h-14 bg-blue-50/70 text-blue-700 border-2 border-blue-100/50 rounded-2xl text-2xl font-black font-mono shadow-sm hover:bg-blue-100 transition-all flex items-center justify-center"
            >
              {op}
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isFinished || currentResult === null}
          className="w-full py-5 bg-brand-text text-white text-2xl font-black rounded-[2rem] shadow-2xl disabled:opacity-50 hover:bg-black transition-all active:scale-[0.98] uppercase tracking-[0.2em]"
        >
          POTVRDI REZULTAT
        </button>
      </div>

      <ResultModal
        isOpen={isFinished}
        onClose={onBack}
        title={isExact ? "Točno!" : "Kraj igre"}
        message={
          <div className="space-y-4">
            {isExact && difficulty === 'Teško' && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-xs uppercase tracking-widest mx-auto w-fit">
                <Zap className="w-4 h-4 fill-current" /> Gospodar Brzine
              </div>
            )}
            <p>{isExact ? "Svaka čast, pogodili ste točan broj!" : `Vaš najbolji rezultat je ${currentResult || 0}.`}</p>
            {aiSolution && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
                <p className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Najbolje rješenje (AI):</p>
                <p className="font-mono text-lg text-brand-text mb-1">{aiSolution.expr} = <span className="font-bold">{aiSolution.result}</span></p>
                <p className="text-xs text-blue-500">Razlika: {aiSolution.diff}</p>
              </div>
            )}
          </div>
        }
        stats={[
          { label: 'Razina', value: difficulty || 'Lako' },
          { label: 'Razlika', value: difference !== null ? difference : '-' }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

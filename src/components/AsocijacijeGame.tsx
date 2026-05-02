import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { asocijacijeData } from '../data/balkanClassics';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { useTimer } from '../hooks/useTimer';
import { markGameCompleted } from '../utils/streakManager';
import { generateShareGrid } from '../utils/shareUtils';

export default function AsocijacijeGame({ onBack }: { onBack: () => void }) {
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());
  const [solvedColumns, setSolvedColumns] = useState<Set<string>>(new Set());
  const [finalSolved, setFinalSolved] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({ A: '', B: '', C: '', D: '', FINAL: '' });
  const [hasStarted, setHasStarted] = useState(false);
  
  const { formattedTime, seconds } = useTimer(hasStarted, finalSolved);

  const handleFieldClick = (col: string, idx: number) => {
    if (finalSolved || solvedColumns.has(col)) return;
    if (!hasStarted) setHasStarted(true);
    setRevealedFields(prev => new Set(prev).add(`${col}${idx}`));
  };

  const handleInputChange = (col: string, val: string) => {
    if (!hasStarted) setHasStarted(true);
    setInputs(prev => ({ ...prev, [col]: val.toUpperCase() }));
  };

  const checkColumn = (col: 'A' | 'B' | 'C' | 'D') => {
    if (inputs[col] === asocijacijeData.columns[col].solution) {
      setSolvedColumns(prev => new Set(prev).add(col));
      // Reveal all fields in this column
      const newRevealed = new Set(revealedFields);
      [0, 1, 2, 3].forEach(i => newRevealed.add(`${col}${i}`));
      setRevealedFields(newRevealed);
    }
  };

  const checkFinal = () => {
    if (inputs.FINAL === asocijacijeData.finalSolution) {
      setFinalSolved(true);
      markGameCompleted('asocijacije');
      setSolvedColumns(new Set(['A', 'B', 'C', 'D']));
      const allFields = new Set<string>();
      ['A', 'B', 'C', 'D'].forEach(c => {
        [0, 1, 2, 3].forEach(i => allFields.add(`${c}${i}`));
      });
      setRevealedFields(allFields);
    }
  };

  const getRank = (secs: number) => {
    if (secs < 30) return "Genijalac";
    if (secs < 60) return "Odlično";
    if (secs < 120) return "Vrlo dobro";
    return "Dobar";
  };

  const getShareText = () => {
    // For Asocijacije, we can represent solved columns as rows
    const grid: ('correct' | 'absent')[][] = [];
    ['A', 'B', 'C', 'D'].forEach(col => {
      grid.push(Array(4).fill(solvedColumns.has(col) ? 'correct' : 'absent'));
    });
    // Add final solution row
    grid.push(Array(4).fill(finalSolved ? 'correct' : 'absent'));
    
    return generateShareGrid(grid, 'Asocijacije');
  };

  return (
    <GameWrapper 
      title="Asocijacije" 
      subtitle="Dnevni izazov" 
      onBack={onBack} 
      timer={formattedTime}
    >
      <div className="w-full max-w-4xl mx-auto py-4 flex flex-col items-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-16">
          {(['A', 'B', 'C', 'D'] as const).map((col) => (
            <div key={col} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 bg-white/50 backdrop-blur-sm p-3 rounded-[2rem] border-2 border-gray-100 shadow-xl">
                {[0, 1, 2, 3].map((idx) => {
                  const fieldId = `${col}${idx}`;
                  const isRevealed = revealedFields.has(fieldId) || solvedColumns.has(col) || finalSolved;
                  return (
                    <motion.div
                      key={fieldId}
                      onClick={() => handleFieldClick(col, idx)}
                      className={`
                        h-14 flex items-center justify-center rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-sm
                        ${isRevealed 
                          ? 'bg-white border-gray-100 text-brand-text font-serif font-bold text-lg shadow-inner italic' 
                          : 'bg-brand-text text-white border-brand-text hover:bg-black hover:shadow-lg active:scale-95 font-black uppercase tracking-widest text-xs'}
                      `}
                      whileTap={!isRevealed ? { scale: 0.95 } : {}}
                    >
                      {isRevealed ? asocijacijeData.columns[col].fields[idx] : `${col}${idx + 1}`}
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="px-1">
                {solvedColumns.has(col) ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-14 flex items-center justify-center rounded-2xl bg-[#f6c523] border-2 border-[#f6c523] text-brand-text font-serif font-bold text-xl shadow-lg italic"
                  >
                    {asocijacijeData.columns[col].solution}
                  </motion.div>
                ) : (
                  <div className="relative group">
                    <input
                      type="text"
                      value={inputs[col]}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkColumn(col)}
                      placeholder={`Kolona ${col}`}
                      className="w-full h-14 text-center rounded-2xl border-2 border-gray-200 focus:border-brand-text focus:ring-4 focus:ring-brand-text/5 outline-none font-sans uppercase font-black text-brand-text transition-all bg-white shadow-md placeholder:text-gray-200 text-sm tracking-widest"
                      disabled={finalSolved}
                    />
                    <button 
                      onClick={() => checkColumn(col)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand-text text-white flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-xl">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted">Konačno rješenje</span>
            
            {finalSolved ? (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full h-24 flex items-center justify-center rounded-[2.5rem] bg-brand-text border-4 border-white text-white font-serif font-bold text-5xl shadow-2xl italic"
              >
                {asocijacijeData.finalSolution}
              </motion.div>
            ) : (
              <div className="w-full relative group">
                <input
                  type="text"
                  value={inputs.FINAL}
                  onChange={(e) => handleInputChange('FINAL', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkFinal()}
                  placeholder="UPIŠI RJEŠENJE"
                  className="w-full h-24 text-center rounded-[2.5rem] border-4 border-gray-200 focus:border-brand-text outline-none font-sans uppercase font-black text-brand-text text-4xl shadow-2xl transition-all bg-white placeholder:text-gray-100 tracking-widest"
                />
                <button 
                  onClick={checkFinal}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-3xl bg-brand-text text-white flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity shadow-xl"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={finalSolved}
        onClose={onBack}
        title="Bravo!"
        message="Uspješno ste riješili asocijaciju."
        stats={[
          { label: 'Vrijeme', value: formattedTime },
          { label: 'Rang', value: getRank(seconds) }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

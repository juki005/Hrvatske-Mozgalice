import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { strandsData, StrandsPuzzle } from '../data/niti';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { markGameCompleted } from '../utils/streakManager';
import { generateShareGrid } from '../utils/shareUtils';

export default function StrandsGrid({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const puzzle = useMemo(() => 
    strandsData.find(p => p.difficulty === difficulty) || strandsData[0],
    [difficulty]
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number, y: number } | null>(null);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [spangramFound, setSpangramFound] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
    setShowResult(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  const getCellId = (r: number, c: number) => `${r}-${c}`;

  const handleMouseDown = (r: number, c: number, e: React.MouseEvent) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);
    setIsDragging(true);
    setSelection([{ r, c }]);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    if (isFinished) return;
    if (e.cancelable) e.preventDefault();
    if (!hasStarted) setHasStarted(true);
    setIsDragging(true);
    setSelection([{ r, c }]);
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isDragging || isFinished) return;
    
    // Check if already in selection
    if (selection.some(s => s.r === r && s.c === c)) return;

    // Check if adjacent to last selection
    const last = selection[selection.length - 1];
    const dr = Math.abs(r - last.r);
    const dc = Math.abs(c - last.c);
    if (dr <= 1 && dc <= 1) {
      setSelection([...selection, { r, c }]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isFinished) return;
    
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
    
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const cellData = element.getAttribute('data-cell');
    if (!cellData) return;

    const [r, c] = cellData.split('-').map(Number);
    
    // Check if already in selection
    if (selection.some(s => s.r === r && s.c === c)) return;

    // Check if adjacent to last selection
    const last = selection[selection.length - 1];
    const dr = Math.abs(r - last.r);
    const dc = Math.abs(c - last.c);
    if (dr <= 1 && dc <= 1) {
      setSelection([...selection, { r, c }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragPos(null);

    const word = selection.map(s => puzzle.grid[s.r][s.c]).join('');
    const reversedWord = [...word].reverse().join('');

    if (puzzle.words.includes(word) || puzzle.words.includes(reversedWord) || word === puzzle.spangram || reversedWord === puzzle.spangram) {
      const actualWord = puzzle.words.includes(word) ? word : (puzzle.words.includes(reversedWord) ? reversedWord : (word === puzzle.spangram ? word : reversedWord));
      
      if (!foundWords.includes(actualWord)) {
        setFoundWords([...foundWords, actualWord]);
        const newFoundCells = new Set(foundCells);
        selection.forEach(s => newFoundCells.add(getCellId(s.r, s.c)));
        setFoundCells(newFoundCells);
        
        if (actualWord === puzzle.spangram) setSpangramFound(true);

        // Check win
        if (foundWords.length + 1 === puzzle.words.length + 1) {
          setIsFinished(true);
          markGameCompleted('niti');
          setTimeout(() => setShowResult(true), 1000);
        }
      }
    }
    setSelection([]);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [selection, isDragging, foundWords, foundCells]);

  const isCellSelected = (r: number, c: number) => selection.some(s => s.r === r && s.c === c);
  const isCellFound = (r: number, c: number) => foundCells.has(getCellId(r, c));

  const getRelativePos = (r: number, c: number) => {
    if (!gridContainerRef.current) return { x: 0, y: 0 };
    const cellSize = 48; // sm:w-12
    const gap = 8; // gap-2
    const padding = 16; // p-4
    return {
      x: padding + c * (cellSize + gap) + cellSize / 2,
      y: padding + r * (cellSize + gap) + cellSize / 2
    };
  };

  const getDragPosRelative = () => {
    if (!dragPos || !gridContainerRef.current) return null;
    const rect = gridContainerRef.current.getBoundingClientRect();
    return {
      x: dragPos.x - rect.left,
      y: dragPos.y - rect.top
    };
  };

  const getShareText = () => {
    // For Strands, we can represent the grid of found cells
    const grid = puzzle.grid.map((row, r) => 
      row.map((_, c) => {
        if (foundCells.has(getCellId(r, c))) return 'correct';
        return 'absent';
      })
    );
    return generateShareGrid(grid, 'Niti');
  };

  return (
    <GameWrapper
      title="Niti"
      subtitle={difficulty === 'Teško' && !spangramFound ? '???' : puzzle.theme}
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        {/* Grid Area */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div 
            ref={gridContainerRef}
            onMouseMove={handleMouseMove}
            className="relative p-4 bg-white rounded-[2.5rem] shadow-2xl border-2 border-gray-100 touch-none"
          >
            <div 
              className="grid gap-2 select-none touch-none"
              style={{ gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(0, 1fr))` }}
              onTouchMove={handleTouchMove}
            >
              {puzzle.grid.map((row, r) => (
                row.map((letter, c) => (
                  <div
                    key={getCellId(r, c)}
                    data-cell={`${r}-${c}`}
                    onMouseDown={(e) => handleMouseDown(r, c, e)}
                    onMouseEnter={() => handleMouseEnter(r, c)}
                    onTouchStart={(e) => handleTouchStart(e, r, c)}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-black uppercase transition-all cursor-pointer touch-manipulation
                      ${isCellFound(r, c) ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-brand-text hover:bg-gray-100'}
                      ${isCellSelected(r, c) ? 'bg-brand-text text-white scale-110 z-10 shadow-lg' : ''}
                    `}
                  >
                    {letter}
                  </div>
                ))
              ))}
            </div>

            {/* SVG Overlay for Thread */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-20">
              {selection.length > 0 && (
                <g>
                  <motion.polyline
                    points={selection.map(s => {
                      const pos = getRelativePos(s.r, s.c);
                      return `${pos.x},${pos.y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-text opacity-40"
                  />
                  {isDragging && dragPos && (
                    <line
                      x1={getRelativePos(selection[selection.length - 1].r, selection[selection.length - 1].c).x}
                      y1={getRelativePos(selection[selection.length - 1].r, selection[selection.length - 1].c).y}
                      x2={getDragPosRelative()?.x}
                      y2={getDragPosRelative()?.y}
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="text-brand-text opacity-40"
                    />
                  )}
                </g>
              )}
            </svg>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-brand-muted text-sm italic font-medium">
               {difficulty === 'Teško' && !spangramFound ? 'Pronađi Spangram za temu!' : puzzle.hint}
             </p>
          </div>
        </div>

        {/* Word List Area */}
        <div className="w-full lg:w-64 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border-2 border-gray-100 shadow-xl">
            <h3 className="font-black text-brand-text border-b-2 border-gray-100 mb-4 pb-2 uppercase tracking-widest text-[10px]">Pronađene riječi</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {[...puzzle.words, puzzle.spangram].map(word => {
                const isFound = foundWords.includes(word);
                const isSpangram = word === puzzle.spangram;
                return (
                  <div 
                    key={word}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-black uppercase transition-all
                      ${isFound ? (isSpangram ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700') : 'bg-gray-50 text-gray-300'}
                    `}
                  >
                    {isFound ? word : '• '.repeat(word.length)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          onBack();
        }}
        title={foundWords.length === puzzle.words.length + 1 ? 'Genijalno!' : 'Vrijeme je isteklo!'}
        message={foundWords.length === puzzle.words.length + 1 ? 'Sve niti su povezane.' : 'Pokušajte ponovno.'}
        stats={[
          { label: 'Riječi', value: `${foundWords.length}/${puzzle.words.length + 1}` },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { NewCrosswordData, NewClue, getCrosswordData } from '../data/krizaljka';
import { useTimer } from '../hooks/useTimer';
import { useDifficulty, Difficulty } from '../context/DifficultyContext';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { markGameCompleted } from '../utils/streakManager';
import VirtualKeyboard from './VirtualKeyboard';
import { generateShareGrid } from '../utils/shareUtils';

type ClueWithPos = NewClue & { row: number, col: number, direction: 'across' | 'down' };

export default function CrosswordGrid({ onBack, difficulty: propDifficulty }: { onBack: () => void, difficulty?: Difficulty | null }) {
  const { difficulty: contextDifficulty, timerSeconds } = useDifficulty();
  const difficulty = propDifficulty || contextDifficulty;

  if (!difficulty) return null;

  const size = difficulty === 'Lako' ? 5 : difficulty === 'Srednje' ? 7 : 12;
  const data = useMemo(() => getCrosswordData(size), [size]);
  
  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array(data.size).fill(null).map(() => Array(data.size).fill(''))
  );

  // Reset userGrid when data changes (e.g. difficulty change)
  useEffect(() => {
    setUserGrid(Array(data.size).fill(null).map(() => Array(data.size).fill('')));
    setFocusedCell(initialCell);
    setDirection('across');
    setHasStarted(false);
    setIsFinished(false);
    setShowResult(false);
  }, [data]);
  
  // Find first non-black cell
  const initialCell = useMemo(() => {
    for (let r = 0; r < data.size; r++) {
      for (let c = 0; c < data.size; c++) {
        if (data.grid[r][c] !== '.') return { row: r, col: c };
      }
    }
    return { row: 0, col: 0 };
  }, [data]);

  const [focusedCell, setFocusedCell] = useState<{row: number, col: number} | null>(initialCell);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [shake, setShake] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
    setShowResult(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.focus();
    }
  }, []);

  // Numbering algorithm and cell info
  const { cellNumbers, cluesWithPositions } = useMemo(() => {
    const map = new Map<string, number>();
    const acrossClues: ClueWithPos[] = [];
    const downClues: ClueWithPos[] = [];
    
    let currentNumber = 1;
    
    for (let r = 0; r < data.size; r++) {
      for (let c = 0; c < data.size; c++) {
        if (data.grid[r][c] === '.') continue;
        
        const isAcrossStart = c === 0 || data.grid[r][c-1] === '.';
        const isDownStart = r === 0 || data.grid[r-1][c] === '.';
        
        const hasAcrossWord = isAcrossStart && c + 1 < data.size && data.grid[r][c+1] !== '.';
        const hasDownWord = isDownStart && r + 1 < data.size && data.grid[r+1][c] !== '.';
        
        if (hasAcrossWord || hasDownWord) {
          map.set(`${r},${c}`, currentNumber);
          
          if (hasAcrossWord) {
            const clue = data.clues.across.find(cl => cl.no === currentNumber);
            if (clue) acrossClues.push({ ...clue, row: r, col: c, direction: 'across' });
          }
          if (hasDownWord) {
            const clue = data.clues.down.find(cl => cl.no === currentNumber);
            if (clue) downClues.push({ ...clue, row: r, col: c, direction: 'down' });
          }
          
          currentNumber++;
        }
      }
    }
    
    return { cellNumbers: map, cluesWithPositions: [...acrossClues, ...downClues] };
  }, [data]);

  const isBlackSquare = (r: number, c: number) => data.grid[r][c] === '.';

  const checkWin = (grid: string[][]) => {
    for (let r = 0; r < data.size; r++) {
      for (let c = 0; c < data.size; c++) {
        if (!isBlackSquare(r, c) && grid[r][c] !== data.grid[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const isGridFull = (grid: string[][]) => {
    for (let r = 0; r < data.size; r++) {
      for (let c = 0; c < data.size; c++) {
        if (!isBlackSquare(r, c) && grid[r][c] === '') {
          return false;
        }
      }
    }
    return true;
  };

  // Find active clue
  const activeClue = useMemo(() => {
    if (!focusedCell) return null;
    return cluesWithPositions.find(c => {
      if (c.direction !== direction) return false;
      if (direction === 'across') {
        return c.row === focusedCell.row && focusedCell.col >= c.col && focusedCell.col < c.col + c.answer.length;
      } else {
        return c.col === focusedCell.col && focusedCell.row >= c.row && focusedCell.row < c.row + c.answer.length;
      }
    });
  }, [focusedCell, direction, cluesWithPositions]);

  const handleKeyPress = (key: string) => {
    if (!focusedCell || isFinished) return;
    if (!hasStarted) setHasStarted(true);
    
    const newGrid = [...userGrid];
    newGrid[focusedCell.row][focusedCell.col] = key.toUpperCase();
    setUserGrid(newGrid);
    
    if (checkWin(newGrid)) {
      setIsFinished(true);
      markGameCompleted('krizaljka');
      setTimeout(() => setShowResult(true), 1000);
    } else if (isGridFull(newGrid)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      const next = getNextCell(focusedCell.row, focusedCell.col, direction, 1);
      if (next) setFocusedCell(next);
    }
  };

  const handleDelete = () => {
    if (!focusedCell || isFinished) return;
    if (!hasStarted) setHasStarted(true);
    
    const newGrid = [...userGrid];
    if (newGrid[focusedCell.row][focusedCell.col] !== '') {
      newGrid[focusedCell.row][focusedCell.col] = '';
      setUserGrid(newGrid);
    } else {
      const prev = getNextCell(focusedCell.row, focusedCell.col, direction, -1);
      if (prev) {
        setFocusedCell(prev);
        newGrid[prev.row][prev.col] = '';
        setUserGrid(newGrid);
      }
    }
  };

  const handleNextClue = () => {
    if (!activeClue) return;
    const currentIdx = cluesWithPositions.indexOf(activeClue);
    const nextIdx = (currentIdx + 1) % cluesWithPositions.length;
    const nextClue = cluesWithPositions[nextIdx];
    setFocusedCell({row: nextClue.row, col: nextClue.col});
    setDirection(nextClue.direction);
  };

  const handlePrevClue = () => {
    if (!activeClue) return;
    const currentIdx = cluesWithPositions.indexOf(activeClue);
    const prevIdx = (currentIdx - 1 + cluesWithPositions.length) % cluesWithPositions.length;
    const prevClue = cluesWithPositions[prevIdx];
    setFocusedCell({row: prevClue.row, col: prevClue.col});
    setDirection(prevClue.direction);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell || isFinished) return;
      
      // Only handle if the grid or its children are focused
      if (gridRef.current && !gridRef.current.contains(document.activeElement)) {
        return;
      }
      
      // If user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Handle letters (including Croatian diacritics)
      if (/^[a-zA-ZčćdžđšžČĆDŽĐŠŽ]$/.test(e.key)) {
        handleKeyPress(e.key);
        return;
      }

      if (e.key === 'Backspace') {
        handleDelete();
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setDirection(prev => prev === 'across' ? 'down' : 'across');
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) handlePrevClue();
        else handleNextClue();
        return;
      }

      if (e.key === 'ArrowRight') {
        const next = getNextCell(focusedCell.row, focusedCell.col, 'across', 1);
        if (next) { setFocusedCell(next); setDirection('across'); }
        return;
      }
      if (e.key === 'ArrowLeft') {
        const prev = getNextCell(focusedCell.row, focusedCell.col, 'across', -1);
        if (prev) { setFocusedCell(prev); setDirection('across'); }
        return;
      }
      if (e.key === 'ArrowDown') {
        const next = getNextCell(focusedCell.row, focusedCell.col, 'down', 1);
        if (next) { setFocusedCell(next); setDirection('down'); }
        return;
      }
      if (e.key === 'ArrowUp') {
        const prev = getNextCell(focusedCell.row, focusedCell.col, 'down', -1);
        if (prev) { setFocusedCell(prev); setDirection('down'); }
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [focusedCell, isFinished, userGrid, direction, activeClue, cluesWithPositions, hasStarted]);

  const handleCellClick = (r: number, c: number) => {
    if (isBlackSquare(r, c)) return;
    if (!hasStarted) setHasStarted(true);
    
    if (focusedCell?.row === r && focusedCell?.col === c) {
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setFocusedCell({row: r, col: c});
    }
  };

  const getNextCell = (r: number, c: number, dir: 'across' | 'down', step: number = 1) => {
    let nr = r;
    let nc = c;
    while (true) {
      if (dir === 'across') nc += step;
      else nr += step;
      
      if (nr < 0 || nr >= data.size || nc < 0 || nc >= data.size) return null;
      if (!isBlackSquare(nr, nc)) return {row: nr, col: nc};
    }
  };

  const isCellHighlighted = (r: number, c: number) => {
    if (!activeClue) return false;
    if (activeClue.direction === 'across') {
      return r === activeClue.row && c >= activeClue.col && c < activeClue.col + activeClue.answer.length;
    } else {
      return c === activeClue.col && r >= activeClue.row && r < activeClue.row + activeClue.answer.length;
    }
  };

  const getShareText = () => {
    const grid: ('correct' | 'absent')[][] = [];
    for (let r = 0; r < data.size; r++) {
      const row: ('correct' | 'absent')[] = [];
      for (let c = 0; c < data.size; c++) {
        row.push(data.grid[r][c] === '.' ? 'absent' : 'correct');
      }
      grid.push(row);
    }
    return generateShareGrid(grid, 'Križaljka', data.puzzle_no);
  };

  return (
    <GameWrapper 
      title="Križaljka" 
      subtitle={data.date}
      onBack={onBack} 
      timer={formattedTime}
      maxWidthClass="max-w-[1400px]"
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:items-start lg:h-[calc(100vh-160px)] pb-40 lg:pb-0">
        {/* Left Column: Vodoravno (Desktop: 25%) */}
        <div className="w-full lg:w-1/4 order-2 lg:order-1 flex flex-col lg:h-full">
          <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 border-2 border-gray-100 shadow-xl overflow-hidden flex flex-col h-full max-h-[400px] lg:max-h-none">
            <div className="sticky top-0 bg-white/50 backdrop-blur-sm z-10 border-b-2 border-gray-100 mb-4 pb-2">
              <h3 className="font-black text-brand-text uppercase tracking-widest text-[10px]">Vodoravno</h3>
            </div>
            <ul className="text-sm space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {cluesWithPositions.filter(c => c.direction === 'across').map(c => (
                <li 
                  key={`${c.no}-across`}
                  className={`cursor-pointer px-3 py-2 rounded-xl transition-all ${activeClue === c ? 'bg-blue-50 text-brand-text shadow-sm border border-blue-100' : 'hover:bg-white text-brand-muted'}`}
                  onClick={() => {
                    setFocusedCell({row: c.row, col: c.col});
                    setDirection('across');
                    if (!hasStarted) setHasStarted(true);
                    gridRef.current?.focus();
                  }}
                >
                  <span className={`font-black mr-3 ${activeClue === c ? 'text-blue-600' : 'text-brand-text'}`}>{c.no}</span>
                  <span className="font-serif italic">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Column: Grid (Desktop: 50%) */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col items-center justify-center lg:h-full">
          {/* Mobile Clue Bar */}
          {activeClue && (
            <div className="lg:hidden w-full bg-white p-3 rounded-xl shadow-md border border-gray-100 mb-4 flex items-center gap-3">
              <div className="bg-brand-text text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                {activeClue.no}
              </div>
              <p className="text-sm font-serif italic text-brand-text leading-tight">
                {activeClue.text}
              </p>
            </div>
          )}

          <motion.div 
            ref={gridRef}
            animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="grid gap-0 border-4 border-brand-text bg-brand-text w-full aspect-square touch-none outline-none shadow-2xl rounded-xl overflow-hidden max-w-[600px] lg:max-w-none lg:max-h-[80vh]"
            style={{ gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))` }}
            tabIndex={0}
          >
            {data.grid.map((row, r) => (
              row.map((cell, c) => {
                const isBlack = isBlackSquare(r, c);
                const isFocused = focusedCell?.row === r && focusedCell?.col === c;
                const isHighlighted = isCellHighlighted(r, c);
                const num = cellNumbers.get(`${r},${c}`);

                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      relative aspect-square border-[0.5px] border-gray-200 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black uppercase cursor-pointer select-none transition-colors touch-manipulation
                      ${isBlack ? 'bg-brand-text' : 'bg-white'}
                      ${isHighlighted && !isFocused && !isBlack ? 'bg-blue-50' : ''}
                      ${isFocused && !isBlack ? 'bg-[#f6c523] text-brand-text' : ''}
                    `}
                  >
                    {!isBlack && num && (
                      <span className="absolute top-0.5 left-1 text-[8px] sm:text-[10px] md:text-xs font-black text-brand-muted">
                        {num}
                      </span>
                    )}
                    {!isBlack && userGrid[r][c]}
                  </div>
                );
              })
            ))}
          </motion.div>
        </div>

        {/* Right Column: Okomito (Desktop: 25%) */}
        <div className="w-full lg:w-1/4 order-3 lg:order-3 flex flex-col lg:h-full">
          <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 border-2 border-gray-100 shadow-xl overflow-hidden flex flex-col h-full max-h-[400px] lg:max-h-none">
            <div className="sticky top-0 bg-white/50 backdrop-blur-sm z-10 border-b-2 border-gray-100 mb-4 pb-2">
              <h3 className="font-black text-brand-text uppercase tracking-widest text-[10px]">Okomito</h3>
            </div>
            <ul className="text-sm space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {cluesWithPositions.filter(c => c.direction === 'down').map(c => (
                <li 
                  key={`${c.no}-down`}
                  className={`cursor-pointer px-3 py-2 rounded-xl transition-all ${activeClue === c ? 'bg-blue-50 text-brand-text shadow-sm border border-blue-100' : 'hover:bg-white text-brand-muted'}`}
                  onClick={() => {
                    setFocusedCell({row: c.row, col: c.col});
                    setDirection('down');
                    if (!hasStarted) setHasStarted(true);
                    gridRef.current?.focus();
                  }}
                >
                  <span className={`font-black mr-3 ${activeClue === c ? 'text-blue-600' : 'text-brand-text'}`}>{c.no}</span>
                  <span className="font-serif italic">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <VirtualKeyboard 
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        onNext={handleNextClue}
        onPrev={handlePrevClue}
      />

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Genijalno!"
        message={`${data.puzzle_no}/365 dana riješeno u 2026!`}
        stats={[
          { label: 'Vrijeme', value: formattedTime },
          { label: 'Uspjeh', value: 'Bolji od 80%' }
        ]}
        shareText={getShareText()}
      />
    </GameWrapper>
  );
}

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SudokuEngine, SudokuBoard } from '../lib/SudokuEngine';
import { useDifficulty } from '../context/DifficultyContext';
import { useTimer } from '../hooks/useTimer';
import GameWrapper from './GameWrapper';
import ResultModal from './ResultModal';
import { markGameCompleted } from '../utils/streakManager';

export default function SudokuGame({ onBack }: { onBack: () => void }) {
  const { difficulty, timerSeconds } = useDifficulty();
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [puzzle, setPuzzle] = useState<SudokuBoard>([]);
  const [solution, setSolution] = useState<SudokuBoard>([]);
  const [userGrid, setUserGrid] = useState<SudokuBoard>([]);
  const [notes, setNotes] = useState<Set<number>[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [duplicates, setDuplicates] = useState<boolean[][]>([]);

  const handleTimeUp = useCallback(() => {
    setIsFinished(true);
    setShowResult(true);
  }, []);

  const { formattedTime } = useTimer(hasStarted, isFinished, timerSeconds, handleTimeUp);

  useEffect(() => {
    const { puzzle, solution } = SudokuEngine.generatePuzzle(difficulty || 'Lako');
    setPuzzle(puzzle);
    setSolution(solution);
    setUserGrid(puzzle.map(row => [...row]));
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())));
    setDuplicates(Array(9).fill(null).map(() => Array(9).fill(false)));
  }, [difficulty]);

  useEffect(() => {
    setDuplicates(SudokuEngine.checkDuplicates(userGrid));
  }, [userGrid]);

  const handleCellClick = (r: number, c: number) => {
    if (isFinished) return;
    if (!hasStarted) setHasStarted(true);
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isFinished) return;
    const { r, c } = selectedCell;
    if (puzzle[r][c] !== null) return; // Original cell

    if (isNotesMode) {
      const newNotes = [...notes];
      const cellNotes = new Set(newNotes[r][c]);
      if (cellNotes.has(num)) cellNotes.delete(num);
      else cellNotes.add(num);
      newNotes[r][c] = cellNotes;
      setNotes(newNotes);
    } else {
      const newGrid = userGrid.map(row => [...row]);
      newGrid[r][c] = newGrid[r][c] === num ? null : num;
      setUserGrid(newGrid);
      
      // Check if full and correct
      if (checkWin(newGrid)) {
        setIsFinished(true);
        markGameCompleted('sudoku');
        setTimeout(() => setShowResult(true), 1000);
      }
    }
  };

  const handleDelete = () => {
    if (!selectedCell || isFinished) return;
    const { r, c } = selectedCell;
    if (puzzle[r][c] !== null) return;

    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = null;
    setUserGrid(newGrid);

    const newNotes = [...notes];
    newNotes[r][c] = new Set();
    setNotes(newNotes);
  };

  const checkWin = (grid: SudokuBoard) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  };

  const isSameGroup = (r: number, c: number) => {
    if (!selectedCell) return false;
    const { r: sr, c: sc } = selectedCell;
    if (r === sr || c === sc) return true;
    const boxR = Math.floor(r / 3);
    const boxC = Math.floor(c / 3);
    const sBoxR = Math.floor(sr / 3);
    const sBoxC = Math.floor(sc / 3);
    return boxR === sBoxR && boxC === sBoxC;
  };

  return (
    <GameWrapper
      title="Sudoku"
      subtitle={`Razina: ${difficulty}`}
      onBack={onBack}
      timer={formattedTime}
    >
      <div className="w-full max-w-2xl mx-auto py-4 px-2 flex flex-col items-center">
        {/* Sudoku Grid */}
        <div className="grid grid-cols-9 border-4 border-brand-text bg-brand-text shadow-2xl rounded-xl overflow-hidden aspect-square w-full max-w-[500px]">
          {userGrid.map((row, r) => (
            row.map((cell, c) => {
              const isOriginal = puzzle[r][c] !== null;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isHighlighted = isSameGroup(r, c);
              const isDuplicate = duplicates[r][c];
              const isThickRight = (c + 1) % 3 === 0 && c !== 8;
              const isThickBottom = (r + 1) % 3 === 0 && r !== 8;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                    relative flex items-center justify-center text-xl sm:text-2xl font-black cursor-pointer select-none transition-all aspect-square
                    ${isOriginal ? 'text-brand-text bg-gray-50' : 'text-blue-600 bg-white'}
                    ${isHighlighted && !isSelected ? 'bg-blue-50' : ''}
                    ${isSelected ? 'bg-[#f6c523] text-brand-text scale-105 z-10 shadow-lg' : ''}
                    ${isDuplicate ? 'bg-red-100' : ''}
                    ${isThickRight ? 'border-r-2 border-brand-text' : 'border-r-[0.5px] border-gray-200'}
                    ${isThickBottom ? 'border-b-2 border-brand-text' : 'border-b-[0.5px] border-gray-200'}
                  `}
                >
                  {cell !== null ? (
                    cell
                  ) : (
                    <div className="grid grid-cols-3 w-full h-full p-0.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <div key={n} className="text-[8px] sm:text-[10px] flex items-center justify-center leading-none text-gray-400 font-bold">
                          {notes[r][c].has(n) ? n : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>

        {/* Controls */}
        <div className="w-full max-w-[500px] mt-8 flex flex-col gap-6">
          {/* Number Pad */}
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="aspect-square flex items-center justify-center bg-white border-2 border-gray-100 rounded-2xl text-2xl font-black text-brand-text shadow-md hover:border-brand-text active:scale-90 transition-all min-w-[44px] min-h-[44px] touch-manipulation"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsNotesMode(!isNotesMode)}
              className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-md ${isNotesMode ? 'bg-brand-text text-white' : 'bg-white text-brand-text border-2 border-gray-100'}`}
            >
              <Pencil size={20} />
              Bilješke {isNotesMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-4 bg-white border-2 border-gray-100 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-50 transition-all shadow-md"
            >
              <Trash2 size={20} />
              Obriši
            </button>
          </div>
        </div>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          onBack();
        }}
        title={checkWin(userGrid) ? 'Genijalno!' : 'Vrijeme je isteklo!'}
        message={checkWin(userGrid) ? 'Savršeno ste riješili Sudoku izazov.' : 'Više sreće drugi put.'}
        stats={[
          { label: 'Razina', value: difficulty || 'Lako' },
          { label: 'Vrijeme', value: formattedTime }
        ]}
        shareText={`Hrvatske Igre - Sudoku\nRazina: ${difficulty}\n⏱️ ${formattedTime}`}
      />
    </GameWrapper>
  );
}

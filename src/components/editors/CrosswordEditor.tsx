import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { generateGameContent } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

type GridSize = 5 | 7 | 12;

export default function CrosswordEditor() {
  const { user } = useAuth();
  const [size, setSize] = useState<GridSize>(7);
  const [grid, setGrid] = useState<string[][]>(
    Array(7).fill(null).map(() => Array(7).fill(''))
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user?.isAdmin) {
    return <div className="p-8 text-center text-red-500 font-bold">Pristup odbijen.</div>;
  }

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a ${size}x${size} crossword grid in Croatian. 
      Use '.' for black squares and letters for the grid. 
      The grid must be symmetrical if possible.
      Format as a JSON object with 'grid' (array of arrays of strings).`;
      
      const data = await generateGameContent('krizaljka', prompt);
      
      if (data && data.grid && Array.isArray(data.grid)) {
        setGrid(data.grid);
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Došlo je do pogreške prilikom generiranja.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSizeChange = (newSize: GridSize) => {
    setSize(newSize);
    setGrid(Array(newSize).fill(null).map(() => Array(newSize).fill('')));
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c] = val.toUpperCase();
    setGrid(newGrid);
  };

  const toggleBlackSquare = (r: number, c: number) => {
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c] = newGrid[r][c] === '.' ? '' : '.';
    setGrid(newGrid);
  };

  const applySymmetry = () => {
    const newGrid = [...grid.map(row => [...row])];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '.') {
          newGrid[size - 1 - r][size - 1 - c] = '.';
        }
      }
    }
    setGrid(newGrid);
  };

  // Detect Words
  const { acrossWords, downWords } = useMemo(() => {
    const across: { word: string, r: number, c: number }[] = [];
    const down: { word: string, r: number, c: number }[] = [];

    // Across
    for (let r = 0; r < size; r++) {
      let currentWord = '';
      let startC = -1;
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== '.') {
          if (currentWord === '') startC = c;
          currentWord += grid[r][c] || ' ';
        } else {
          if (currentWord.length > 1) across.push({ word: currentWord, r, c: startC });
          currentWord = '';
        }
      }
      if (currentWord.length > 1) across.push({ word: currentWord, r, c: startC });
    }

    // Down
    for (let c = 0; c < size; c++) {
      let currentWord = '';
      let startR = -1;
      for (let r = 0; r < size; r++) {
        if (grid[r][c] !== '.') {
          if (currentWord === '') startR = r;
          currentWord += grid[r][c] || ' ';
        } else {
          if (currentWord.length > 1) down.push({ word: currentWord, r: startR, c });
          currentWord = '';
        }
      }
      if (currentWord.length > 1) down.push({ word: currentWord, r: startR, c });
    }

    return { acrossWords: across, downWords: down };
  }, [grid, size]);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const allWords = [...acrossWords, ...downWords];
    
    // 1. Short words (< 3)
    const shortWords = allWords.filter(w => w.word.length < 3 && !w.word.includes(' '));
    if (shortWords.length > 0) {
      errors.push(`Pronađeno ${shortWords.length} riječi kraćih od 3 slova.`);
    }

    // 2. Identical Across/Down
    const acrossSet = new Set(acrossWords.map(w => w.word).filter(w => !w.includes(' ')));
    const downSet = new Set(downWords.map(w => w.word).filter(w => !w.includes(' ')));
    const duplicates = [...acrossSet].filter(w => downSet.has(w));
    if (duplicates.length > 0) {
      errors.push(`Ponavljanje riječi (Vodoravno i Okomito): ${duplicates.join(', ')}`);
    }

    // 3. Isolated Islands
    let whiteSquares = 0;
    let startNode: {r: number, c: number} | null = null;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== '.') {
          whiteSquares++;
          if (!startNode) startNode = {r, c};
        }
      }
    }

    if (startNode) {
      const visited = new Set<string>();
      const queue = [startNode];
      visited.add(`${startNode.r},${startNode.c}`);

      while (queue.length > 0) {
        const {r, c} = queue.shift()!;
        const neighbors = [
          {r: r-1, c}, {r: r+1, c}, {r, c: c-1}, {r, c: c+1}
        ];
        for (const n of neighbors) {
          if (n.r >= 0 && n.r < size && n.c >= 0 && n.c < size && grid[n.r][n.c] !== '.') {
            const key = `${n.r},${n.c}`;
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(n);
            }
          }
        }
      }

      if (visited.size < whiteSquares) {
        errors.push(`Mreža ima izolirane otoke! (${visited.size} od ${whiteSquares} polja povezano)`);
      }
    }

    // Check for empty cells
    const hasEmpty = grid.some(row => row.some(cell => cell === ''));
    if (hasEmpty) {
      warnings.push('Mreža nije do kraja ispunjena.');
    }

    return { errors, warnings };
  }, [acrossWords, downWords, grid, size]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Editor Section */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <select 
              value={size} 
              onChange={(e) => handleSizeChange(Number(e.target.value) as GridSize)}
              className="px-4 py-2 border rounded-lg font-medium text-brand-text bg-gray-50"
            >
              <option value={5}>Mini (5x5)</option>
              <option value={7}>Midi (7x7)</option>
              <option value={12}>Classic (12x12)</option>
            </select>

            <button 
              onClick={applySymmetry}
              className="px-4 py-2 bg-brand-text text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Simetrija
            </button>

            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Generiranje...' : 'AI Grid'}
            </button>
          </div>

          <div 
            className="grid gap-0 border-2 border-gray-800 bg-gray-800 w-full max-w-[500px]"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) => (
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className="relative aspect-square">
                  <input
                    type="text"
                    maxLength={1}
                    value={cell === '.' ? '' : cell}
                    onChange={(e) => handleCellChange(r, c, e.target.value)}
                    onDoubleClick={() => toggleBlackSquare(r, c)}
                    className={`
                      w-full h-full text-center text-2xl font-bold uppercase outline-none
                      ${cell === '.' ? 'bg-gray-900 cursor-not-allowed' : 'bg-white hover:bg-gray-50 focus:bg-yellow-50'}
                      border-[0.5px] border-gray-300
                    `}
                    disabled={cell === '.'}
                  />
                  {cell === '.' && (
                    <div 
                      className="absolute inset-0 cursor-pointer" 
                      onDoubleClick={() => toggleBlackSquare(r, c)}
                    />
                  )}
                </div>
              ))
            ))}
          </div>
          <p className="text-sm text-brand-muted mt-3">
            * Dvostruki klik na polje za postavljanje/uklanjanje crnog polja.
          </p>
        </div>

        {/* Validation & Output Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-bold text-brand-text mb-4">Validacija Mreže</h2>
            
            {validation.errors.length === 0 && validation.warnings.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600 font-medium p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                Mreža je savršena! Nema grešaka.
              </div>
            ) : (
              <div className="space-y-3">
                {validation.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    {err}
                  </div>
                ))}
                {validation.warnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    {warn}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-64 overflow-y-auto">
              <h3 className="font-bold text-brand-text mb-2 border-b pb-2">Vodoravno ({acrossWords.length})</h3>
              <ul className="text-sm space-y-1 font-mono text-gray-700">
                {acrossWords.map((w, i) => (
                  <li key={i}>{w.word.includes(' ') ? <span className="text-gray-400 italic">Nepotpuno</span> : w.word}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-64 overflow-y-auto">
              <h3 className="font-bold text-brand-text mb-2 border-b pb-2">Okomito ({downWords.length})</h3>
              <ul className="text-sm space-y-1 font-mono text-gray-700">
                {downWords.map((w, i) => (
                  <li key={i}>{w.word.includes(' ') ? <span className="text-gray-400 italic">Nepotpuno</span> : w.word}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

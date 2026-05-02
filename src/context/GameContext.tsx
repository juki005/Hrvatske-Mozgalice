import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDailyIndex } from '../utils/scheduler';

interface GameProgress {
  status: 'locked' | 'not-started' | 'in-progress' | 'finished';
  progress: number; // 0-100
  streak: number;
}

interface GameState {
  [gameId: string]: GameProgress;
}

interface GameContextType {
  gameState: GameState;
  updateGameProgress: (gameId: string, progress: Partial<GameProgress>) => void;
  dailyIndex: number;
  resetSystem: () => void;
  activeGame: string | null;
  setActiveGame: (gameId: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({});
  const [dailyIndex, setDailyIndex] = useState(0);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const initializeState = (index: number) => {
    const initialState: GameState = {
      'krizaljka': { status: 'not-started', progress: 0, streak: 1 },
      'poveznice': { status: 'not-started', progress: 0, streak: 1 },
      'niti': { status: 'not-started', progress: 0, streak: 1 },
      'rijec-dana': { status: 'not-started', progress: 0, streak: 1 },
      'sudoku': { status: 'not-started', progress: 0, streak: 1 },
      'pcelica': { status: 'not-started', progress: 0, streak: 1 },
      'asocijacije': { status: 'not-started', progress: 0, streak: 1 },
      'kaladont': { status: 'not-started', progress: 0, streak: 1 },
      'grad-drzava': { status: 'not-started', progress: 0, streak: 1 },
      'slagalica': { status: 'not-started', progress: 0, streak: 1 },
      'igra-brojeva': { status: 'not-started', progress: 0, streak: 1 },
      'zagonetna-osoba': { status: 'not-started', progress: 0, streak: 1 },
    };
    setGameState(initialState);
    localStorage.setItem(`mozgalice-state-${index}`, JSON.stringify(initialState));
  };

  useEffect(() => {
    const checkMidnight = () => {
      const index = getDailyIndex('2024-01-01');
      setDailyIndex(index);
      
      const savedState = localStorage.getItem(`mozgalice-state-${index}`);
      if (savedState) {
        setGameState(JSON.parse(savedState));
      } else {
        initializeState(index);
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateGameProgress = (gameId: string, progress: Partial<GameProgress>) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        [gameId]: { ...prev[gameId], ...progress }
      };
      localStorage.setItem(`mozgalice-state-${dailyIndex}`, JSON.stringify(newState));
      return newState;
    });
  };

  const resetSystem = () => {
    localStorage.clear();
    const index = getDailyIndex('2024-01-01');
    initializeState(index);
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      updateGameProgress, 
      dailyIndex, 
      resetSystem,
      activeGame,
      setActiveGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within GameProvider');
  return context;
};

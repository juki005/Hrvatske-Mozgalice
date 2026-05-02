import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Difficulty = 'Lako' | 'Srednje' | 'Teško';

interface DifficultyContextType {
  difficulty: Difficulty | null;
  setDifficulty: (d: Difficulty | null) => void;
  timerSeconds: number | null;
}

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

export const DifficultyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const timerSeconds = difficulty === 'Srednje' ? 180 : difficulty === 'Teško' ? 60 : null;

  return (
    <DifficultyContext.Provider value={{ difficulty, setDifficulty, timerSeconds }}>
      {children}
    </DifficultyContext.Provider>
  );
};

export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (context === undefined) {
    throw new Error('useDifficulty must be used within a DifficultyProvider');
  }
  return context;
};

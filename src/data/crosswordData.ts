export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
  direction: 'across' | 'down';
}

export interface CrosswordLevel {
  id: string;
  name: string;
  size: number;
  blackSquares: { row: number, col: number }[];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

export const crosswordData: Record<string, CrosswordLevel> = {
  lako: {
    id: 'lako',
    name: 'LAKO (Mini)',
    size: 5,
    blackSquares: [
      { row: 2, col: 2 }
    ],
    clues: {
      across: [
        { number: 1, clue: 'Glavni grad Hrvatske', answer: 'ZAGREB', row: 0, col: 0, length: 6, direction: 'across' }, // Wait, 5x5 grid
      ],
      down: []
    }
  }
};

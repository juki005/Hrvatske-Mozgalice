export type Grid = (number | null)[][];

export const createEmptyGrid = (): Grid => Array(9).fill(null).map(() => Array(9).fill(null));

export const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
    if (grid[x][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

export const solveSudoku = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const countSolutions = (grid: Grid, count = { val: 0 }): number => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            countSolutions(grid, count);
            grid[row][col] = null;
            if (count.val > 1) return count.val;
          }
        }
        return count.val;
      }
    }
  }
  count.val++;
  return count.val;
};

export const generateSolvedGrid = (): Grid => {
  const grid = createEmptyGrid();
  const fillGrid = (g: Grid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === null) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (isValid(g, row, col, num)) {
              g[row][col] = num;
              if (fillGrid(g)) return true;
              g[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  fillGrid(grid);
  return grid;
};

export const generatePuzzle = (difficulty: 'Lako' | 'Srednje' | 'Teško'): { puzzle: Grid, solution: Grid } => {
  const solution = generateSolvedGrid();
  const puzzle = solution.map(row => [...row]);
  
  let attempts = difficulty === 'Lako' ? 30 : difficulty === 'Srednje' ? 45 : 55;
  
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (puzzle[row][col] === null) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    
    const backup = puzzle[row][col];
    puzzle[row][col] = null;
    
    const gridCopy = puzzle.map(r => [...r]);
    if (countSolutions(gridCopy, { val: 0 }) !== 1) {
      puzzle[row][col] = backup;
      attempts--;
    }
  }
  
  return { puzzle, solution };
};

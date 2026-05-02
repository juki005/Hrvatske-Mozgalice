/**
 * Sudoku Engine for generating and validating Sudoku boards.
 */

export type SudokuBoard = (number | null)[][];

export class SudokuEngine {
  private static isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  private static solve(board: SudokuBoard): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.solve(board)) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  public static generateFullBoard(): SudokuBoard {
    const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Fill diagonal 3x3 boxes first (they are independent)
    for (let i = 0; i < 9; i += 3) {
      this.fillBox(board, i, i);
    }

    this.solve(board);
    return board;
  }

  private static fillBox(board: SudokuBoard, row: number, col: number) {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!this.isUnusedInBox(board, row, col, num));
        board[row + i][col + j] = num;
      }
    }
  }

  private static isUnusedInBox(board: SudokuBoard, rowStart: number, colStart: number, num: number): boolean {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  }

  public static generatePuzzle(difficulty: 'Lako' | 'Srednje' | 'Teško'): { puzzle: SudokuBoard, solution: SudokuBoard } {
    const solution = this.generateFullBoard();
    const puzzle: SudokuBoard = solution.map(row => [...row]);
    
    let attempts = 0;
    let cellsToRemove = 0;
    
    if (difficulty === 'Lako') cellsToRemove = 81 - 45;
    else if (difficulty === 'Srednje') cellsToRemove = 81 - 30;
    else cellsToRemove = 81 - 22;

    while (attempts < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        attempts++;
      }
    }

    return { puzzle, solution };
  }

  public static checkDuplicates(board: SudokuBoard): boolean[][] {
    const duplicates = Array(9).fill(null).map(() => Array(9).fill(false));

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val === null) continue;

        // Check row
        for (let i = 0; i < 9; i++) {
          if (i !== c && board[r][i] === val) duplicates[r][c] = true;
        }
        // Check col
        for (let i = 0; i < 9; i++) {
          if (i !== r && board[i][c] === val) duplicates[r][c] = true;
        }
        // Check box
        const startRow = r - (r % 3);
        const startCol = c - (c % 3);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const currR = i + startRow;
            const currC = j + startCol;
            if ((currR !== r || currC !== c) && board[currR][currC] === val) {
              duplicates[r][c] = true;
            }
          }
        }
      }
    }

    return duplicates;
  }
}

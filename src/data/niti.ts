export interface StrandsPuzzle {
  id: string;
  difficulty: 'Lako' | 'Srednje' | 'Teško';
  theme: string;
  hint: string;
  grid: string[][];
  words: string[];
  spangram: string;
}

export const strandsData: StrandsPuzzle[] = [
  {
    id: 'lako-1',
    difficulty: 'Lako',
    theme: 'VOĆE',
    hint: 'Slatki plodovi prirode.',
    grid: [
      ['J', 'A', 'B', 'U', 'K', 'A'],
      ['Š', 'L', 'J', 'I', 'V', 'A'],
      ['K', 'R', 'U', 'Š', 'K', 'A'],
      ['V', 'I', 'Š', 'N', 'J', 'A'],
      ['D', 'U', 'N', 'J', 'A', 'M'],
      ['B', 'A', 'N', 'A', 'N', 'A'],
      ['L', 'U', 'B', 'E', 'N', 'I'],
      ['C', 'A', 'V', 'O', 'Ć', 'E']
    ],
    words: ['JABUKA', 'ŠLJIVA', 'KRUŠKA', 'VIŠNJA', 'DUNJA', 'BANANA', 'LUBENICA'],
    spangram: 'VOĆE'
  },
  {
    id: 'srednje-1',
    difficulty: 'Srednje',
    theme: 'HLADNO JE',
    hint: 'Zimske radosti i muke.',
    grid: [
      ['S', 'N', 'I', 'J', 'E', 'G'],
      ['L', 'E', 'D', 'M', 'R', 'A'],
      ['Z', 'B', 'U', 'R', 'A', 'Z'],
      ['I', 'N', 'J', 'E', 'S', 'A'],
      ['M', 'A', 'G', 'L', 'A', 'K'],
      ['S', 'K', 'I', 'J', 'A', 'N'],
      ['J', 'E', 'P', 'A', 'L', 'O'],
      ['H', 'L', 'A', 'D', 'N', 'O']
    ],
    words: ['SNIJEG', 'LED', 'MRAZ', 'BURA', 'INJE', 'MAGLA', 'SKIJANJE'],
    spangram: 'HLADNO'
  },
  {
    id: 'tesko-1',
    difficulty: 'Teško',
    theme: 'ZLATNA GRANA',
    hint: 'Blago jadranske obale.',
    grid: [
      ['M', 'A', 'S', 'L', 'I', 'N'],
      ['A', 'U', 'L', 'J', 'E', 'A'],
      ['S', 'M', 'O', 'K', 'V', 'A'],
      ['L', 'O', 'Z', 'A', 'V', 'I'],
      ['N', 'O', 'R', 'O', 'G', 'A'],
      ['Č', 'B', 'A', 'D', 'E', 'M'],
      ['P', 'R', 'Š', 'U', 'T', 'O'],
      ['Z', 'L', 'A', 'T', 'N', 'A']
    ],
    words: ['MASLINA', 'ULJE', 'SMOKVA', 'LOZA', 'VINO', 'ROGAČ', 'BADEM', 'PRŠUT'],
    spangram: 'ZLATNA'
  }
];

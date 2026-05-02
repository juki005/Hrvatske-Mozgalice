export interface PcelicaData {
  id: string;
  centerLetter: string;
  outerLetters: string[];
  words: string[];
  pangrams: string[];
}

export const pcelicaPuzzle: PcelicaData = {
  id: 'pcelica-1',
  centerLetter: 'A',
  outerLetters: ['P', 'U', 'T', 'O', 'K', 'Z'],
  words: [
    'PUTOKAZ', 'KAPA', 'PAPA', 'TATA', 'ZATO', 'KOTA', 'KUTA', 
    'PATKA', 'KAPUT', 'POKAZ', 'UKAZ', 'ZAKUP', 'ZAKOP', 'TOKA', 
    'KAZA', 'ZAPO', 'POTKA', 'KOPTA'
  ],
  pangrams: ['PUTOKAZ']
};

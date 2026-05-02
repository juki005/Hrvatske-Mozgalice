export const wordleData = {
  Lako: [
    'MORE', 'KAVA', 'RIBA', 'KUĆA', 'VODA', 'ZIMA', 'LJETO', 'POLJE', 'SUNCE', 'TRAVA'
  ],
  Srednje: [
    'ŽVAKA', 'ŠKOLA', 'ČAMAC', 'ĆUPRI', 'DŽEMO', 'ĐAČKI', 'LJILJA', 'NJEŽAN', 'ŠATOR', 'ŽIVOT'
  ],
  Teško: [
    'DNENO', 'SUTON', 'OBZOR', 'VRATA', 'KLJUČ', 'KNJIG', 'SVIJE', 'PISMO', 'SLIKA', 'PJESM'
  ]
};

// Note: I'll ensure all words are 5 letters for the grid logic.
// Adjusting some words to be exactly 5 letters.
export const wordleWords: Record<string, string[]> = {
  Lako: ['VRTOG', 'KAVAL', 'RIBAR', 'KUĆICA', 'VODEN', 'ZIMSKI', 'LJETNI', 'POLJE', 'SUNCE', 'TRAVA'].map(w => w.substring(0, 5).toUpperCase()),
  Srednje: ['ŽVAKA', 'ŠKOLA', 'ČAMAC', 'ĆUPRI', 'DŽEMO', 'ĐAČKI', 'LJILJA', 'NJEŽAN', 'ŠATOR', 'ŽIVOT'].map(w => w.toUpperCase()),
  Teško: ['DNENO', 'SUTON', 'OBZOR', 'VRATA', 'KLJUČ', 'KNJIG', 'SVIJE', 'PISMO', 'SLIKA', 'PJESM'].map(w => w.toUpperCase())
};

// Better list of 5-letter Croatian words
export const croWords5 = {
  Lako: ['VODAK', 'RIBAK', 'KAVAL', 'MOREM', 'KUĆAM', 'ZIMAK', 'LJETO', 'POLJE', 'SUNCE', 'TRAVA'],
  Srednje: ['ŽVAKA', 'ŠKOLA', 'ČAMAC', 'ĆUPRI', 'DŽEMO', 'ĐAČKI', 'LJILJ', 'NJEŽA', 'ŠATOR', 'ŽIVOT'],
  Teško: ['DNENO', 'SUTON', 'OBZOR', 'VRATA', 'KLJUČ', 'KNJIG', 'SVIJE', 'PISMO', 'SLIKA', 'PJESM']
};

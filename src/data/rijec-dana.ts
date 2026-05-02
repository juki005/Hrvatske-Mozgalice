export const croatianWords = [
  "BREZA", "ŠKOLA", "OBLAK", "SUNCE", "POTOK",
  "TRAVA", "GRANA", "KAMEN", "GLINA", "BLATO",
  "VATRA", "OLUJA", "MAGLA", "JUTRO", "VEČER",
  "JESEN", "ISTOK", "ZAPAD", "SLIKA", "LIMUN",
  "KUMIR", "ANODA", "ZIDAR", "VRATA", "ORMAR",
  "TEPIH", "LAMPA", "LONAC", "ŽLICA", "ŠEĆER",
  "PAPAR", "KOLAČ", "TORTA", "SPORT", "LOPTA",
  "TEREN", "MREŽA", "REKET", "SKIJA", "AVION",
  "ČAMAC", "TAKSI", "MOTOR", "VOLAN", "KOTAČ",
  "HAUBA", "KLJUČ", "BRAVA", "ALARM", "CESTA"
];

// Returns the daily word based on the Croatian timezone
export function getDailyWord(index: number): string {
  // Use modulo to wrap around if index exceeds word list length
  return croatianWords[index % croatianWords.length];
}

// Check if a word is valid
export function isValidWord(word: string): boolean {
  return croatianWords.includes(word);
}

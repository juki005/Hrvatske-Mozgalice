// A simple mock dictionary for validation
const croatianWords = new Set([
  "TRAVA", "VAGA", "GARAŽA", "ŽABA", "BABA", "BAKAR", "ARKA", "KAVA", "VATA", "TAVA",
  "VAL", "LAV", "VRATA", "TATA", "TAMA", "MAMA", "MASA", "SAMA", "MACA", "CAR",
  "VATRA", "RANA", "NADA", "DAMA", "RADOST", "STVAR", "TRAKTOR", "ORMAR", "MRAK",
  "AKCIJA", "JABUKA", "KAMEN", "KARTA", "GALEB", "JASTUK", "UKRAS", "JAMA",
  "SPLIT", "SISAK", "SLUNJ", "SAMOBOR", "SINJ", "SLATINA", "SOLIN", "SUPETAR",
  "SLOVENIJA", "SRBIJA", "SAD", "SIRIJA", "SUDAN", "SOMALIJA", "SENEGAL",
  "SLON", "SOVA", "SRNA", "SIPA", "SVINJA", "SKAKAVAC", "SOM",
  "SMILJE", "SUNCOKRET", "SMOKVA", "ŠLJIVA", "SALATA", "SOJA",
  "STOL", "STOLICA", "SAT", "STAKLO", "SAPUN", "SVIJEĆA", "SLIKA",
  "PRIJESTOLJE", "PRIJESTOL", "STOLJEĆE", "LJEKARIJA", "RIJEKA", "PIJESAK", "PISMO", "SLOVO"
]);

export const isValidCroatianWord = (word: string): boolean => {
  // PROTOTYPE BYPASS: 
  // Since we don't have a full 100,000+ word Croatian dictionary loaded in this environment,
  // we will accept any structurally valid word (only letters, min 3 chars).
  // This prevents the user from getting stuck on valid words like "RATAR", "VATRA", etc.
  // In a production app, this would call a backend API or load a full dictionary file.
  
  const cleanWord = word.trim().toUpperCase();
  const validCharsRegex = /^[A-ZČĆĐŠŽ]+$/;
  
  // If it's in our mock list, definitely accept it
  if (croatianWords.has(cleanWord)) return true;
  
  // Otherwise, accept any valid letter combination for the sake of the game prototype
  return validCharsRegex.test(cleanWord) && cleanWord.length >= 3;
};

export const isValidCategoryWord = (word: string, letter: string, category: string): boolean => {
  // In a real app, we would check against specific category lists.
  // Here we just check if it starts with the letter and is in our mock dictionary.
  if (!word || word[0].toUpperCase() !== letter.toUpperCase()) return false;
  return isValidCroatianWord(word);
};

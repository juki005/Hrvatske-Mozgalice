export const normalizeCroatian = (str: string): string => {
  return str.toUpperCase();
};

export const compareCroatian = (str1: string, str2: string): boolean => {
  return str1.localeCompare(str2, 'hr', { sensitivity: 'base' }) === 0;
};

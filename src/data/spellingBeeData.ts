export const spellingBeeData = {
  Lako: {
    center: 'A',
    outer: ['B', 'C', 'D', 'E', 'F', 'G'],
    words: ['ABECEDA', 'BACA', 'DACE', 'GADA', 'BADE', 'FACE', 'GADE', 'BACA'],
    pangram: 'ABECEDA'
  },
  Srednje: {
    center: 'Ž',
    outer: ['V', 'A', 'K', 'O', 'L', 'Š'],
    words: ['ŽVAKA', 'ŠKOLA', 'ŽVAKALA', 'ŠKOLŽA', 'VLAŽAN', 'LOŽA'],
    pangram: 'ŽVAKALO'
  },
  Teško: {
    center: 'Đ',
    outer: ['A', 'Č', 'K', 'I', 'L', 'J'],
    words: ['ĐAČKI', 'ĐAČKILJ', 'LJAČKI', 'ČAĐA', 'ĐAK'],
    pangram: 'ĐAČKILJ'
  }
};

export const beePuzzles = {
  Lako: {
    center: 'A',
    outer: ['B', 'C', 'D', 'E', 'F', 'G'],
    validWords: ['ABECEDA', 'BACA', 'DACE', 'GADA', 'BADE', 'FACE', 'GADE', 'BACA', 'CADE', 'DECA', 'GAGA'],
    pangram: 'ABECEDA'
  },
  Srednje: {
    center: 'Ž',
    outer: ['V', 'A', 'K', 'O', 'L', 'Š'],
    validWords: ['ŽVAKA', 'ŠKOLA', 'ŽVAKALA', 'VLAŽAN', 'LOŽA', 'VAŽAN', 'KOŽA', 'ŽALBA'],
    pangram: 'ŽVAKALO'
  },
  Teško: {
    center: 'Đ',
    outer: ['A', 'Č', 'K', 'I', 'L', 'J'],
    validWords: ['ĐAČKI', 'ČAĐA', 'ĐAK', 'ĐAČKI', 'ĐAČKILJ'],
    pangram: 'ĐAČKILJ'
  }
};

export interface ConnectionGroup {
  category: string;
  words: string[];
  difficulty: 0 | 1 | 2 | 3; // 0: Yellow, 1: Green, 2: Blue, 3: Purple
}

export interface ConnectionLevel {
  id: string;
  difficulty: 'Lako' | 'Srednje' | 'Teško';
  timer?: number; // in seconds
  groups: ConnectionGroup[];
}

export const connectionsData: ConnectionLevel[] = [
  {
    id: 'lako-1',
    difficulty: 'Lako',
    groups: [
      {
        category: 'VOĆE',
        words: ['JABUKA', 'ŠLJIVA', 'KRUŠKA', 'VIŠNJA'],
        difficulty: 0
      },
      {
        category: 'POVRĆE',
        words: ['MRKVA', 'KUPUS', 'PAPRIKA', 'LUK'],
        difficulty: 1
      },
      {
        category: 'ŽIVOTINJE',
        words: ['PAS', 'MAČKA', 'KONJ', 'KRAVA'],
        difficulty: 2
      },
      {
        category: 'BOJE',
        words: ['PLAVA', 'CRVENA', 'ŽUTA', 'ZELENA'],
        difficulty: 3
      }
    ]
  },
  {
    id: 'srednje-1',
    difficulty: 'Srednje',
    timer: 180,
    groups: [
      {
        category: 'GRADOVI NA MORU',
        words: ['SPLIT', 'ZADAR', 'RIJEKA', 'PULA'],
        difficulty: 0
      },
      {
        category: 'RIJEČI KOJE POČINJU S "PO"',
        words: ['POTOK', 'POZIV', 'PONOS', 'POREZ'],
        difficulty: 1
      },
      {
        category: 'MUZIČKI INSTRUMENTI',
        words: ['KLAVIR', 'GITARA', 'BUBANJ', 'TRUBA'],
        difficulty: 2
      },
      {
        category: 'VRSTE BRODOVA',
        words: ['TRAJEKT', 'JEDRENJAK', 'KREUSER', 'BARKA'],
        difficulty: 3
      }
    ]
  },
  {
    id: 'tesko-1',
    difficulty: 'Teško',
    timer: 60,
    groups: [
      {
        category: 'SVE IDE UZ RIJEČ "VELIKI"',
        words: ['ZID', 'PAPIR', 'PUT', 'GRAH'],
        difficulty: 0
      },
      {
        category: 'HOMONIMI (ILI VIŠEZNAČNICE)',
        words: ['KOSA', 'LUK', 'BOR', 'GRAD'],
        difficulty: 1
      },
      {
        category: 'OTOCI BEZ AUTOMOBILA',
        words: ['SILBA', 'UNIJE', 'ZLARIN', 'PRVIĆ'],
        difficulty: 2
      },
      {
        category: 'VRSTE PLESA',
        words: ['KOLO', 'LINĐO', 'DRMEŠ', 'POLKA'],
        difficulty: 3
      }
    ]
  }
];

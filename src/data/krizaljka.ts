export interface NewClue {
  no: number;
  text: string;
  answer: string;
}

export interface NewCrosswordData {
  size: number;
  puzzle_no: number;
  author: string;
  date: string;
  grid: string[][];
  clues: {
    across: NewClue[];
    down: NewClue[];
  };
}

export const getCrosswordData = (size: 5 | 7 | 12): NewCrosswordData => {
  const today = new Date('2026-04-02T12:00:00Z');
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const puzzle_no = Math.floor(diff / (1000 * 60 * 60 * 24));
  const date = 'Četvrtak, 2. travnja 2026.';
  
  const authors = ["Maja V.", "Luka K.", "Križaljkaški tim", "Ivan H.", "Ana M."];
  const author = authors[puzzle_no % authors.length];
  
  if (size === 5) {
    return {
      size: 5,
      puzzle_no,
      author,
      date,
      grid: [
        ['P', 'O', 'R', 'E', 'Z'],
        ['O', 'B', 'A', 'L', 'A'],
        ['R', 'A', 'V', 'N', 'O'],
        ['E', 'L', 'I', 'T', 'A'],
        ['Z', 'A', 'N', 'A', 'T'],
      ],
      clues: {
        across: [
          { no: 1, text: 'Ono što svi moramo plaćati državi', answer: 'POREZ' },
          { no: 6, text: 'Mjesto gdje se susreću more i kopno', answer: 'OBALA' },
          { no: 7, text: 'Bez zavoja, direktno', answer: 'RAVNO' },
          { no: 8, text: 'Odabrano društvo, krema', answer: 'ELITA' },
          { no: 9, text: 'Vještina koja se uči godinama, "ispeći ___"', answer: 'ZANAT' }
        ],
        down: [
          { no: 1, text: 'PDV, prirez ili trošarina', answer: 'POREZ' },
          { no: 2, text: 'Splitska Riva ili zadarski Pozdrav Suncu', answer: 'OBALA' },
          { no: 3, text: 'Suprotno od "krivo" ili "zavojito"', answer: 'RAVNO' },
          { no: 4, text: 'VIP gosti', answer: 'ELITA' },
          { no: 5, text: 'Majstorski posao', answer: 'ZANAT' }
        ]
      }
    };
  }
  
  if (size === 7) {
    return {
      size: 7,
      puzzle_no,
      author,
      date,
      grid: [
        ['S', 'A', 'T', '.', 'B', 'O', 'T'],
        ['I', 'M', 'E', '.', 'O', 'K', 'O'],
        ['R', 'A', 'D', 'N', 'I', 'C', 'I'],
        ['.', '.', 'N', 'O', 'V', 'I', '.'],
        ['M', 'I', 'R', 'N', 'I', 'J', 'I'],
        ['O', 'K', 'O', '.', 'I', 'M', 'E'],
        ['S', 'A', 'T', '.', 'B', 'O', 'T']
      ],
      clues: {
        across: [
          { no: 1, text: 'Mjeri vrijeme', answer: 'SAT' },
          { no: 4, text: 'Računalni program', answer: 'BOT' },
          { no: 7, text: 'Naziv', answer: 'IME' },
          { no: 8, text: 'Organ vida', answer: 'OKO' },
          { no: 9, text: 'Ljudi koji rade', answer: 'RADNICI' },
          { no: 10, text: 'Koji nisu stari', answer: 'NOVI' },
          { no: 11, text: 'Koji imaju više mira', answer: 'MIRNIJI' },
          { no: 13, text: 'Organ vida', answer: 'OKO' },
          { no: 14, text: 'Naziv', answer: 'IME' },
          { no: 15, text: 'Mjeri vrijeme', answer: 'SAT' },
          { no: 16, text: 'Računalni program', answer: 'BOT' }
        ],
        down: [
          { no: 1, text: 'Mliječni proizvod', answer: 'SIR' },
          { no: 2, text: 'Žensko ime', answer: 'AMA' },
          { no: 3, text: 'Ponedjeljak, utorak...', answer: 'TJEDAN' },
          { no: 4, text: 'Boja', answer: 'BOJA' },
          { no: 5, text: 'Mjesto', answer: 'OKCI' },
          { no: 6, text: 'To', answer: 'TOI' },
          { no: 10, text: 'Noć', answer: 'NOC' },
          { no: 11, text: 'Moj', answer: 'MOS' },
          { no: 12, text: 'Ime', answer: 'IKA' }
        ]
      }
    };
  }
  
  return {
    size: 12,
    puzzle_no,
    author,
    date,
    grid: [
      ["S", "P", "L", "I", "T", ".", "A", "M", "A", "N", "E", "T"],
      ["P", "R", "A", "V", "O", ".", "P", "O", "R", "E", "Z", "I"],
      ["A", "V", "I", "O", "N", ".", "A", "P", "A", "R", "A", "T"],
      ["S", "I", "R", "E", "N", "A", ".", "R", "A", "D", "I", "O"],
      [".", ".", ".", "N", "O", "V", "I", "N", "A", "R", "I", "."],
      ["O", "B", "A", "L", "A", ".", "O", "K", "O", ".", ".", "."],
      [".", ".", ".", "O", "K", "O", ".", "A", "L", "A", "B", "O"],
      [".", "I", "R", "A", "N", "I", "V", "O", "N", ".", ".", "."],
      ["O", "I", "D", "A", "R", ".", "A", "N", "E", "R", "I", "S"],
      ["T", "A", "R", "A", "P", "A", ".", "N", "O", "I", "V", "A"],
      ["I", "Z", "E", "R", "O", "P", ".", "O", "V", "A", "R", "P"],
      ["T", "E", "N", "A", "M", "A", ".", "S", "A", "T", "I", "C"]
    ],
    clues: {
      across: [
        { no: 1, text: "Metropola pod Marjanom koja živi za balun", answer: "SPLIT" },
        { no: 6, text: "Zavjet koji se čuva kao najveća svetinja", answer: "AMANET" },
        { no: 12, text: "Ono što studiraju budući odvjetnici, a traže svi", answer: "PRAVO" },
        { no: 13, text: "Državni harač koji nitko ne voli plaćati", answer: "POREZI" },
        { no: 14, text: "Čelična ptica koja ne maše krilima", answer: "AVION" },
        { no: 15, text: "Stroj koji nam kuha kavu ili pere rublje", answer: "APARAT" },
        { no: 16, text: "Pola žena, pola riba, a pjeva opasno dobro", answer: "SIRENA" },
        { no: 18, text: "Kutija iz koje svira glazba, a nema sliku", answer: "RADIO" },
        { no: 19, text: "Lovci na ekskluzive i tiskane riječi", answer: "NOVINARI" },
        { no: 21, text: "Tamo gdje se more susreće s kopnom", answer: "OBALA" },
        { no: 22, text: "Prozor duše koji sve vidi", answer: "OKO" },
        { no: 23, text: "Ono što nam treba za dobar vid", answer: "OKO" },
        { no: 24, text: "Obala koja se gleda u ogledalu", answer: "ALABO" },
        { no: 26, text: "Novinari koji pišu unatrag", answer: "IRANIVON" },
        { no: 28, text: "Radio naopačke", answer: "OIDAR" },
        { no: 30, text: "Sirena koja pliva unatrag", answer: "ANERIS" },
        { no: 31, text: "Aparat koji se pokvario pa radi unazad", answer: "TARAPA" },
        { no: 32, text: "Avion koji leti u rikverc", answer: "NOIVA" },
        { no: 33, text: "Porezi koje država vraća (obrnuto)", answer: "IZEROP" },
        { no: 34, text: "Pravo koje je postalo krivo", answer: "OVARP" },
        { no: 35, text: "Amanet pročitan s desna na lijevo", answer: "TENAMA" },
        { no: 36, text: "Mali mjerač vremena", answer: "SATIC" }
      ],
      down: [
        { no: 1, text: "Spasenje u zadnji čas", answer: "SPAS" },
        { no: 2, text: "Onaj koji stiže na cilj prije svih", answer: "PRVI" },
        { no: 3, text: "Lavirint", answer: "LAVIR" },
        { no: 4, text: "Ime poznatog glumca Gregurevića", answer: "IVO" },
        { no: 5, text: "Tisuću kilograma tereta", answer: "TONA" },
        { no: 6, text: "Aparat", answer: "APARAT" },
        { no: 7, text: "More", answer: "MOPA" },
        { no: 8, text: "Papiga raskošnih boja", answer: "ARAN" },
        { no: 9, text: "Ono što ostane kad djeca odu iz sobe", answer: "NERED" },
        { no: 10, text: "Ezi", answer: "EZI" },
        { no: 11, text: "Bivši predsjednik Jugoslavije", answer: "TITO" },
        { no: 17, text: "Avion", answer: "AVION" },
        { no: 20, text: "Posjeduje", answer: "IMA" },
        { no: 24, text: "Soba", answer: "SOBA" },
        { no: 25, text: "Tlo po kojem hodamo", answer: "TLO" },
        { no: 26, text: "Luka na engleskom", answer: "PORT" },
        { no: 27, text: "Kralj visina", answer: "ORAO" },
        { no: 29, text: "Ono što spaja glavu i tijelo", answer: "VRAT" }
      ]
    }
  };
};

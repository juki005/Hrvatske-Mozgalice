export interface Tile {
  id: number;
  text: string;
  category: string;
  level: number;
}

export const dailyData: Tile[] = [
  { id: 1, text: 'Brač', category: 'Otoci', level: 0 },
  { id: 2, text: 'Hvar', category: 'Otoci', level: 0 },
  { id: 3, text: 'Vis', category: 'Otoci', level: 0 },
  { id: 4, text: 'Mljet', category: 'Otoci', level: 0 },
  { id: 5, text: 'Produžena', category: 'Vrste kave u RH', level: 1 },
  { id: 6, text: 'S hladnim', category: 'Vrste kave u RH', level: 1 },
  { id: 7, text: 'Turska', category: 'Vrste kave u RH', level: 1 },
  { id: 8, text: 'Kraća', category: 'Vrste kave u RH', level: 1 },
  { id: 9, text: 'Tesla', category: 'Poznati znanstvenici', level: 2 },
  { id: 10, text: 'Mohorovičić', category: 'Poznati znanstvenici', level: 2 },
  { id: 11, text: 'Bošković', category: 'Poznati znanstvenici', level: 2 },
  { id: 12, text: 'Penkala', category: 'Poznati znanstvenici', level: 2 },
  { id: 13, text: 'Ravna', category: 'Složenice s "Gora"', level: 3 },
  { id: 14, text: 'Moslavačka', category: 'Složenice s "Gora"', level: 3 },
  { id: 15, text: 'Petrova', category: 'Složenice s "Gora"', level: 3 },
  { id: 16, text: 'Gorski', category: 'Složenice s "Gora"', level: 3 },
];

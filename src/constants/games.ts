import { 
  Grid3x3, 
  Link2, 
  Type, 
  Hash, 
  Hexagon, 
  Globe, 
  Calculator, 
  User, 
  MapPin, 
  Quote 
} from 'lucide-react';

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  isFeatured?: boolean;
}

export const GAMES: GameDefinition[] = [
  {
    id: 'krizaljka',
    title: 'Križaljka',
    subtitle: 'Dnevni izazov',
    icon: Grid3x3,
    colorClass: 'text-blue-600',
    isFeatured: true
  },
  {
    id: 'poveznice',
    title: 'Poveznice',
    subtitle: 'Pronađi 4 grupe',
    icon: Link2,
    colorClass: 'text-purple-600'
  },
  {
    id: 'rijec-dana',
    title: 'Riječ dana',
    subtitle: 'Pogodi riječ u 6 pokušaja',
    icon: Hash,
    colorClass: 'text-green-600'
  },
  {
    id: 'pcelica',
    title: 'Pčelica',
    subtitle: 'Složi riječi iz 7 slova',
    icon: Hexagon,
    colorClass: 'text-yellow-600'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    subtitle: 'Lako, Srednje, Teško',
    icon: Grid3x3,
    colorClass: 'text-orange-600'
  },
  {
    id: 'niti',
    title: 'Niti',
    subtitle: 'Pronađi skrivene riječi',
    icon: Type,
    colorClass: 'text-teal-600'
  },
  {
    id: 'asocijacije',
    title: 'Asocijacije',
    subtitle: 'Poveži pojmove',
    icon: Grid3x3,
    colorClass: 'text-red-600'
  },
  {
    id: 'kaladont',
    title: 'Kaladont',
    subtitle: 'Brzinski sprint',
    icon: Link2,
    colorClass: 'text-pink-600'
  },
  {
    id: 'grad-drzava',
    title: 'Grad-Država',
    subtitle: 'Kategorijski blitz',
    icon: Globe,
    colorClass: 'text-cyan-600'
  },
  {
    id: 'slagalica',
    title: 'Slagalica',
    subtitle: 'Najduža riječ',
    icon: Type,
    colorClass: 'text-indigo-600'
  },
  {
    id: 'igra-brojeva',
    title: 'Igra Brojeva',
    subtitle: 'Matematički sprint',
    icon: Calculator,
    colorClass: 'text-blue-600'
  },
  {
    id: 'zagonetna-osoba',
    title: 'Zagonetna Osoba',
    subtitle: 'Tko sam ja?',
    icon: User,
    colorClass: 'text-purple-600'
  },
  {
    id: 'dijalekt',
    title: 'Dijalekt',
    subtitle: 'Regionalno blago',
    icon: MapPin,
    colorClass: 'text-amber-600'
  },
  {
    id: 'izreke',
    title: 'Poznate Izreke',
    subtitle: 'Povijest i kultura',
    icon: Quote,
    colorClass: 'text-emerald-600'
  }
];

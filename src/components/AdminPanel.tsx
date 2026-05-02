import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Link2, 
  User, 
  Hash, 
  Settings, 
  Save, 
  CheckCircle2, 
  Hexagon, 
  Grid3x3, 
  Type, 
  Globe, 
  Calculator, 
  MapPin, 
  Quote 
} from 'lucide-react';
import CrosswordEditor from './editors/CrosswordEditor';
import ConnectionsEditor from './editors/ConnectionsEditor';
import WordClueEditor from './editors/WordClueEditor';
import QuestionAnswerEditor from './editors/QuestionAnswerEditor';
import GameHeader from './GameHeader';
import { GAMES } from '../constants/games';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('krizaljka');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Podaci uspješno eksportirani za današnji dan!");
    }, 1000);
  };

  const renderEditor = () => {
    const game = GAMES.find(g => g.id === activeTab);
    if (!game) return <div>Odaberite editor</div>;

    switch (activeTab) {
      case 'krizaljka': 
        return <CrosswordEditor />;
      case 'poveznice': 
        return <ConnectionsEditor />;
      case 'rijec-dana': 
      case 'pcelica': 
      case 'niti': 
      case 'kaladont': 
      case 'grad-drzava': 
      case 'slagalica':
        return <WordClueEditor title={game.title} hasClues={activeTab === 'niti' || activeTab === 'krizaljka'} />;
      case 'asocijacije':
        return <ConnectionsEditor />; // Asocijacije can use a similar structure to Connections
      case 'sudoku':
        return <WordClueEditor title="Sudoku" />;
      case 'igra-brojeva':
        return <WordClueEditor title="Igra Brojeva" />;
      case 'zagonetna-osoba':
      case 'dijalekt':
      case 'izreke':
        return <QuestionAnswerEditor title={game.title} />;
      default: 
        return <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
          Editor za {game.title} je u pripremi...
        </div>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FBF9F4]">
      <GameHeader title="Admin Panel" subtitle="Upravljanje sadržajem" onBack={onBack} />
      
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-white border-r border-gray-200 p-4 flex flex-col gap-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Svi Editori</div>
          
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <button 
                key={game.id}
                onClick={() => setActiveTab(game.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === game.id ? 'bg-brand-text text-white shadow-lg scale-[1.02]' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon className={`w-4 h-4 ${activeTab === game.id ? 'text-white' : game.colorClass}`} /> 
                {game.title}
              </button>
            );
          })}

          <div className="mt-8 pt-4 border-t border-gray-100">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
            >
              {isExporting ? <CheckCircle2 className="w-5 h-5 animate-pulse" /> : <Save className="w-5 h-5" />}
              {isExporting ? 'Spremanje...' : 'Eksportiraj sve'}
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FBF9F4]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderEditor()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

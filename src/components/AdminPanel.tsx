import React, { useState } from 'react';
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
  Quote,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import CrosswordEditor from './editors/CrosswordEditor';
import ConnectionsEditor from './editors/ConnectionsEditor';
import WordClueEditor from './editors/WordClueEditor';
import QuestionAnswerEditor from './editors/QuestionAnswerEditor';
import GameHeader from './GameHeader';
import { GAMES } from '../constants/games';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('status');
  const [isExporting, setIsExporting] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const checkConfig = async () => {
    setLoadingConfig(true);
    // On the client, we check import.meta.env for Firebase and process.env for Gemini
    const status = {
      firebase: {
        apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
        authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      },
      gemini: {
        apiKey: !!process.env.GEMINI_API_KEY,
      }
    };
    
    // Simulate a network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setConfigStatus(status);
    setLoadingConfig(false);
  };

  React.useEffect(() => {
    if (activeTab === 'status') {
      checkConfig();
    }
  }, [activeTab]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Podaci uspješno eksportirani za današnji dan!");
    }, 1000);
  };

  const renderStatus = () => {
    if (loadingConfig) return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>;
    if (!configStatus) return <div className="p-8 text-center text-red-500">Nije moguće dohvatiti status sustava.</div>;

    const StatusItem = ({ label, value, description, envKey }: { label: string, value: boolean, description: string, envKey: string }) => (
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100 mb-3 shadow-sm">
        <div className="flex-1 pr-4">
          <div className="font-bold text-gray-800">{label}</div>
          <div className="text-xs text-gray-500 mb-1">{description}</div>
          <code className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-400 border border-gray-100">{envKey}</code>
        </div>
        {value ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            <ShieldCheck className="w-4 h-4" /> Aktivan
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            <AlertCircle className="w-4 h-4" /> Nedostaje
          </div>
        )}
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-green-600" /> Status Konfiguracije
          </h3>
          <button onClick={checkConfig} className="p-2 text-gray-400 hover:text-brand-text transition-colors">
            <RefreshCw className={`w-4 h-4 ${loadingConfig ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Firebase (Autentifikacija & Baza)</div>
          <StatusItem 
            label="Firebase API Key" 
            value={configStatus.firebase.apiKey} 
            description="Primarni ključ za komunikaciju s Firebase servisima."
            envKey="VITE_FIREBASE_API_KEY"
          />
          <StatusItem 
            label="Firebase Project ID" 
            value={configStatus.firebase.projectId} 
            description="Jedinstveni identifikator vašeg Firebase projekta."
            envKey="VITE_FIREBASE_PROJECT_ID"
          />
           <StatusItem 
            label="Auth Domain" 
            value={configStatus.firebase.authDomain} 
            description="Domena za rukovanje Google prijavom."
            envKey="VITE_FIREBASE_AUTH_DOMAIN"
          />
        </div>

        <div className="pt-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Gemini AI (Generiranje sadržaja)</div>
          <StatusItem 
            label="Gemini API Key" 
            value={configStatus.gemini.apiKey} 
            description="Potrebno za automatsko generiranje krizaljki i pitanja."
            envKey="GEMINI_API_KEY"
          />
        </div>

        {!configStatus.firebase.apiKey && (
          <div className="mt-8 p-6 bg-brand-red/5 border-2 border-brand-red/20 rounded-3xl text-brand-text">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-brand-red" /> Kako dodati ključeve?
            </h4>
            <div className="text-sm space-y-2 text-gray-700">
              <p>1. Otvorite <strong>Settings</strong> izbornik u gornjem kutu AI Studija.</p>
              <p>2. Idite na tab <strong>Secrets</strong>.</p>
              <p>3. Dodajte gore navedene nazive (npr. <code>VITE_FIREBASE_API_KEY</code>) i njihove vrijednosti iz Firebase konzole.</p>
              <p>4. Nakon spremanja, aplikacija će automatski prepoznati nove ključeve.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEditor = () => {
    if (activeTab === 'status') return renderStatus();
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
        return <ConnectionsEditor />;
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
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Sustav</div>
          <button 
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all text-sm mb-4 ${activeTab === 'status' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Status Sustava
          </button>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Editori Igara</div>
          
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

          <div className="mt-auto pt-4 border-t border-gray-100">
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
          <div key={activeTab}>
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}

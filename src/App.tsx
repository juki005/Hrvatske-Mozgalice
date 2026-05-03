import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import GameHub from './components/GameHub';
import { GameProvider, useGameContext } from './context/GameContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DifficultyProvider, useDifficulty, Difficulty } from './context/DifficultyContext';
import DifficultyModal from './components/DifficultyModal';
import LoginModal from './components/auth/LoginModal';
import Poveznice from './components/Poveznice';
import CrosswordGrid from './components/CrosswordGrid';
import StrandsGrid from './components/StrandsGrid';
import WordleGame from './components/WordleGame';
import SudokuGame from './components/SudokuGame';
import SpellingBee from './components/SpellingBee';
import AsocijacijeGame from './components/AsocijacijeGame';
import KaladontGame from './components/KaladontGame';
import GradDrzavaGame from './components/GradDrzavaGame';
import SlagalicaGame from './components/SlagalicaGame';
import IgraBrojevaGame from './components/IgraBrojevaGame';
import ZagonetnaOsobaGame from './components/ZagonetnaOsobaGame';
import DijalektGame from './components/DijalektGame';
import PoznateIzrekeGame from './components/PoznateIzrekeGame';
import AdminPanel from './components/AdminPanel';
import { dailyData } from './data/poveznice';

function AppContent() {
  const { activeGame, setActiveGame } = useGameContext();
  const { user, isAdmin, isAuthModalOpen, setIsAuthModalOpen, loading } = useAuth();
  const [selectedGameForDifficulty, setSelectedGameForDifficulty] = useState<string | null>(null);
  const { difficulty, setDifficulty } = useDifficulty();

  const handleBack = () => {
    setActiveGame(null);
    setDifficulty(null);
  };

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'admin') {
      if (!isAdmin) {
        setIsAuthModalOpen(true);
        return;
      }
      setActiveGame('admin');
    } else {
      setSelectedGameForDifficulty(gameId);
    }
  };

  const handleDifficultySelect = (d: Difficulty) => {
    setDifficulty(d);
    setActiveGame(selectedGameForDifficulty);
    setSelectedGameForDifficulty(null);
  };

  const renderGame = () => {
    if (!activeGame) return null;
    
    switch (activeGame) {
      case 'poveznice': return <Poveznice dailyData={dailyData} onBack={handleBack} />;
      case 'krizaljka': return <CrosswordGrid onBack={handleBack} difficulty={difficulty} />;
      case 'niti': return <StrandsGrid onBack={handleBack} />;
      case 'rijec-dana': return <WordleGame onBack={handleBack} />;
      case 'sudoku': return <SudokuGame onBack={handleBack} />;
      case 'pcelica': return <SpellingBee onBack={handleBack} />;
      case 'asocijacije': return <AsocijacijeGame onBack={handleBack} />;
      case 'kaladont': return <KaladontGame onBack={handleBack} />;
      case 'grad-drzava': return <GradDrzavaGame onBack={handleBack} />;
      case 'slagalica': return <SlagalicaGame onBack={handleBack} />;
      case 'igra-brojeva': return <IgraBrojevaGame onBack={handleBack} />;
      case 'zagonetna-osoba': return <ZagonetnaOsobaGame onBack={handleBack} />;
      case 'dijalekt': return <DijalektGame onBack={handleBack} />;
      case 'izreke': return <PoznateIzrekeGame onBack={handleBack} />;
      case 'admin': return <AdminPanel onBack={handleBack} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4]">
      <Layout>
        <div className="relative flex-1 flex flex-col">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FBF9F4] z-20 px-6 py-20">
              <div className="flex flex-col items-center gap-6 max-w-sm w-full">
                <div className="w-12 h-12 border-[4px] border-brand-red border-t-transparent rounded-full animate-spin" />
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-black text-brand-text mb-2">Hrvatske Mozgalice</h2>
                  <div className="flex items-center justify-center gap-2 h-4">
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex-1 flex flex-col transition-opacity duration-300 ease-out opacity-100">
              {!activeGame ? (
                <GameHub onSelectGame={handleSelectGame} />
              ) : (
                <div className="bg-brand-bg flex-1" key={activeGame}>
                  {activeGame === 'admin' && (
                    <div className="p-4">
                      <button onClick={handleBack} className="mb-4 text-brand-text font-bold hover:underline">
                        &larr; Natrag na igre
                      </button>
                    </div>
                  )}
                  {renderGame()}
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>

      <DifficultyModal 
        isOpen={!!selectedGameForDifficulty} 
        onClose={() => setSelectedGameForDifficulty(null)}
        onSelect={handleDifficultySelect}
      />

      <LoginModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <DifficultyProvider>
          <AppContent />
        </DifficultyProvider>
      </GameProvider>
    </AuthProvider>
  );
}

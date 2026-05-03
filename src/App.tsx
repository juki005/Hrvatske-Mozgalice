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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-16 h-16 border-4 border-brand-text border-t-transparent rounded-full mb-6"
        />
        <h2 className="font-serif text-2xl font-black text-[#2D2D2D] mb-2">Hrvatske Mozgalice</h2>
        <p className="text-brand-muted font-bold uppercase tracking-[0.2em] text-xs">Učitavanje tvojih izazova...</p>
      </div>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div key="dashboard" className="w-full flex flex-col">
            <GameHub onSelectGame={handleSelectGame} />
          </motion.div>
        ) : (
          <motion.div
            layoutId={`game-card-${activeGame}`}
            key="game-view"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col bg-brand-bg z-10"
          >
            {activeGame === 'admin' && (
              <div className="p-4">
                <button onClick={handleBack} className="mb-4 text-brand-text font-bold hover:underline">
                  &larr; Natrag na igre
                </button>
              </div>
            )}
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>

      <DifficultyModal 
        isOpen={!!selectedGameForDifficulty} 
        onClose={() => setSelectedGameForDifficulty(null)}
        onSelect={handleDifficultySelect}
      />

      <LoginModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </Layout>
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

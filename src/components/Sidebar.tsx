import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, History, HelpCircle, BarChart2, X, Settings } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { setActiveGame } = useGameContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-[#E2E2E2] flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-brand-text">Postavke i Arhiva</h2>
              <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors text-brand-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col gap-1 px-2">
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-brand-text font-medium text-left">
                  <Calendar className="w-5 h-5 text-brand-muted" />
                  Danas
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-brand-text font-medium text-left">
                  <History className="w-5 h-5 text-brand-muted" />
                  Arhiva igara
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-brand-text font-medium text-left">
                  <HelpCircle className="w-5 h-5 text-brand-muted" />
                  Kako igrati
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-brand-text font-medium text-left">
                  <BarChart2 className="w-5 h-5 text-brand-muted" />
                  Statistika
                </button>
                <button 
                  onClick={() => {
                    setActiveGame('admin');
                    onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-brand-text font-medium text-left border-t border-gray-50 mt-2"
                >
                  <Settings className="w-5 h-5 text-brand-muted" />
                  Admin Editor
                </button>
              </nav>
            </div>

            <div className="p-4 border-t border-[#E2E2E2] flex flex-col gap-3">
              <button className="w-full py-3 px-4 bg-brand-gold/10 text-yellow-700 font-bold rounded-lg hover:bg-brand-gold/20 transition-colors text-left">
                Pretplata
              </button>
              <div className="flex flex-col gap-2 px-4 mt-2">
                <a href="#" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Uvjeti korištenja</a>
                <a href="#" className="text-sm text-brand-muted hover:text-brand-text transition-colors">Kontakt</a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

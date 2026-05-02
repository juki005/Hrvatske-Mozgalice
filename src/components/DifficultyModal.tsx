import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Zap, Smile } from 'lucide-react';
import { Difficulty } from '../context/DifficultyContext';

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultyModal: React.FC<DifficultyModalProps> = ({ isOpen, onClose, onSelect }) => {
  const options: { label: Difficulty; icon: React.ReactNode; color: string; desc: string }[] = [
    { label: 'Lako', icon: <Smile className="text-green-500" />, color: 'bg-green-50 hover:bg-green-100 border-green-200', desc: 'Bez vremenskog ograničenja' },
    { label: 'Srednje', icon: <Clock className="text-yellow-500" />, color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200', desc: '3 minute za rješavanje' },
    { label: 'Teško', icon: <Zap className="text-red-500" />, color: 'bg-red-50 hover:bg-red-100 border-red-200', desc: '1 minuta (Blitz mode)' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-[95%] max-w-sm relative z-[101] overflow-hidden p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-brand-text mb-2 tracking-tight">Odaberi težinu</h2>
              <p className="text-brand-muted text-sm italic">Prilagodi izazov svom raspoloženju</p>
            </div>

            <div className="flex flex-col gap-4">
              {options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => onSelect(opt.label)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group ${opt.color}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-black text-brand-text text-lg leading-tight">{opt.label}</div>
                    <div className="text-xs text-brand-muted font-medium">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DifficultyModal;

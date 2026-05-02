import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, X } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  stats: { label: string; value: string | number }[];
  shareText?: string;
}

export default function ResultModal({ isOpen, onClose, title, message, stats, shareText }: ResultModalProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleShare = async () => {
    if (!shareText) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Hrvatske Igre',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-brand-bg rounded-2xl shadow-2xl w-[95%] max-w-sm relative z-50 overflow-hidden pointer-events-auto"
          >
            <div className="p-6 text-center">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-text transition-colors z-50 bg-white/50 rounded-full hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-serif text-3xl font-bold text-brand-text mb-2">{title}</h2>
              <p className="text-brand-muted mb-6">{message}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.2 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="text-3xl font-bold text-brand-text mb-1">{stat.value}</div>
                    <div className="text-xs font-medium text-brand-muted uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-sm text-brand-muted mb-2">Sljedeća igra za</div>
                <div className="font-mono text-2xl font-bold text-brand-text mb-6">{countdown}</div>
                
                {shareText && (
                  <button 
                    onClick={handleShare}
                    className="w-full py-3 px-4 bg-brand-text text-white font-bold rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2 relative z-50"
                  >
                    <Share2 className="w-5 h-5" />
                    {copied ? 'Kopirano!' : 'Podijeli'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

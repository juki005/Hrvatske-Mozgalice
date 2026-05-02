import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  initialSeconds: number | null;
  onTimeUp: () => void;
  isPaused?: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onTimeUp, isPaused = false }) => {
  const [seconds, setSeconds] = useState<number | null>(initialSeconds);

  useEffect(() => {
    if (seconds === null || isPaused) return;

    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp, isPaused]);

  if (seconds === null) return null;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${m}:${s.toString().padStart(2, '0')}`;

  const isLowTime = seconds <= 10;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold transition-all ${isLowTime ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-text text-white'}`}>
      <Clock size={16} />
      <span>{formatted}</span>
    </div>
  );
};

export default Timer;

import { useState, useEffect, useCallback } from 'react';

export function useTimer(isActive: boolean, isFinished: boolean, initialSeconds: number | null = null, onTimeUp?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds !== null ? initialSeconds : 0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (initialSeconds !== null) {
            if (prev <= 1) {
              clearInterval(interval!);
              if (onTimeUp) onTimeUp();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (isFinished && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinished, initialSeconds, onTimeUp]);

  const resetTimer = useCallback(() => {
    setSeconds(initialSeconds !== null ? initialSeconds : 0);
  }, [initialSeconds]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    formattedTime: formatTime(seconds),
    resetTimer
  };
}

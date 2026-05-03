import { useState, useEffect } from 'react';
import { getStreakData } from '../utils/streakManager';
import { GAMES } from '../constants/games';

export function useDailyStats() {
  const [streakData, setStreakData] = useState(getStreakData());
  
  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const updateStats = () => {
      setStreakData(getStreakData());
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      
      // Refresh streak data occasionally or when it might have changed
      const now = new Date();
      if (now.getSeconds() === 0) updateStats();
    }, 1000);

    // Listen for custom event if we want real-time updates when a game is marked completed
    window.addEventListener('streakUpdated', updateStats);

    return () => {
      clearInterval(timer);
      window.removeEventListener('streakUpdated', updateStats);
    };
  }, []);

  return {
    streakData,
    timeLeft,
    completedCount: streakData.completedGames.length,
    totalGames: GAMES.length
  };
}

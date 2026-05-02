
export interface StreakData {
  currentStreak: number;
  lastPlayedDate: string | null;
  completedGames: string[]; // List of game IDs completed today
}

const STORAGE_KEY = 'hrvatske_igre_streak';

export const getStreakData = (): StreakData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { currentStreak: 0, lastPlayedDate: null, completedGames: [] };
  }
  
  const parsed = JSON.parse(data);
  const today = new Date().toISOString().split('T')[0];
  
  // If last played was not today or yesterday, streak is broken
  if (parsed.lastPlayedDate) {
    const lastDate = new Date(parsed.lastPlayedDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      parsed.currentStreak = 0;
    }
    
    // If it's a new day, clear completed games
    if (parsed.lastPlayedDate !== today) {
      parsed.completedGames = [];
    }
  }
  
  return parsed;
};

export const markGameCompleted = (gameId: string) => {
  const data = getStreakData();
  const today = new Date().toISOString().split('T')[0];
  
  if (!data.completedGames.includes(gameId)) {
    // If first game of the day, increment streak if last played was yesterday
    if (data.completedGames.length === 0) {
      if (data.lastPlayedDate) {
        const lastDate = new Date(data.lastPlayedDate);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          data.currentStreak += 1;
        } else {
          data.currentStreak = 1;
        }
      } else {
        data.currentStreak = 1;
      }
    }
    
    data.completedGames.push(gameId);
    data.lastPlayedDate = today;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('streakUpdated'));
  }
};

export const isGameCompleted = (gameId: string): boolean => {
  const data = getStreakData();
  return data.completedGames.includes(gameId);
};

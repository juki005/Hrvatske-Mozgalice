/**
 * Get the daily index based on the Croatian timezone (Europe/Zagreb).
 * @param epochDateString The start date in YYYY-MM-DD format.
 */
export function getDailyIndex(epochDateString: string): number {
  const now = new Date();
  const croatianDateString = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Zagreb',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
  
  // croatianDateString is "MM/DD/YYYY"
  const [month, day, year] = croatianDateString.split('/');
  const croatianDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
  const epochDate = new Date(`${epochDateString}T00:00:00Z`);
  
  const diff = croatianDate.getTime() - epochDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

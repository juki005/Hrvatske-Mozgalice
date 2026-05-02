export const generateShareGrid = (grid: ('correct' | 'present' | 'absent' | string)[][], gameName: string, puzzleNo?: number) => {
  const mapping = {
    correct: '🟢',
    present: '🔵',
    absent: '🔴'
  };

  const gridEmojis = grid.map(row => 
    row.map(cell => {
      if (cell === 'correct') return mapping.correct;
      if (cell === 'present') return mapping.present;
      return mapping.absent;
    }).join('')
  ).join('\n');

  const appUrl = window.location.origin;
  const title = `Hrvatske Igre - ${gameName}${puzzleNo ? ` [#${puzzleNo}]` : ''}`;

  return `${title}\n\n${gridEmojis}\n\nLink: ${appUrl}`;
};

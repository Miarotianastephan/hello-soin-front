// /src/utils/calendarUtils.js

export const PRACTICE_TYPES = {
  naturopathie: 'Naturopathie',
  acuponcture: 'Acuponcture',
  hypnose: 'Hypnose'
};

export const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie': return 120;
    case 'acuponcture': return 30;
    case 'hypnose': return 90;
    default: return 0;
  }
};

export const getColorByType = (type) => {
  switch (type) {
    case 'naturopathie': return '#FF6B6B';
    case 'acuponcture': return '#4ECDC4';
    case 'hypnose': return '#45B7D1';
    default: return '#CCCCCC';
  }
};

export const mergeConsecutiveSlots = (slots) => {
  if (!slots.length) return [];
  
  const sorted = [...slots].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  return merged;
};

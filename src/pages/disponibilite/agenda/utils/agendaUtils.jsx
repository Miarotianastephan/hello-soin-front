// src/utils/agendaUtils.js
import { parse, differenceInMinutes, addHours, format } from 'date-fns';

export const AGENDA_START = '00:00';
export const AGENDA_END = '23:59';

export const parseTime = (timeStr) =>
  parse(timeStr, 'HH:mm', new Date(2000, 0, 1));

export const totalDuration =
  differenceInMinutes(parseTime(AGENDA_END), parseTime(AGENDA_START)) + 1;
export const DAY_COLUMN_HEIGHT = (1440 / 60) * 64; // 1536px
export const VISIBLE_HEIGHT = 10 * 64; // 640px

export const dayNames = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi'
};

export const getColorByType = (type) => {
  switch (type) {
    case 'naturopathie':
      return '#FF6B6B';
    case 'acuponcture':
      return '#4ECDC4';
    case 'hypnose':
      return '#45B7D1';
    default:
      return '#CCCCCC';
  }
};

export const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie':
      return 120;
    case 'acuponcture':
      return 30;
    case 'hypnose':
      return 90;
    default:
      return 0;
  }
};

export const mergePractices = (practices) => {
  if (!practices || practices.length === 0) return [];
  const sorted = [...practices].sort(
    (a, b) => parseTime(a.start) - parseTime(b.start)
  );
  const merged = [];
  let current = { ...sorted[0] };
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (
      current.type === next.type &&
      parseTime(current.end).getTime() === parseTime(next.start).getTime()
    ) {
      current.end = next.end;
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);
  return merged;
};

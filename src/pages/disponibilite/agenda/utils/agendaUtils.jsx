// src/utils/agendaUtils.js
import { parse, differenceInMinutes, addHours, format } from 'date-fns';

export const AGENDA_START = '00:00';
export const AGENDA_END = '23:59';

export const parseTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return new Date();
  
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  parse(timeString, 'HH:mm', new Date(2000, 0, 1));
  return date;
};

export const isValidTime = (timeString) => {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
};

export const addMinutes = (time, minutes) => {
  const date = new Date(time);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const totalDuration =
  differenceInMinutes(parseTime(AGENDA_END), parseTime(AGENDA_START)) + 1;
  export const DAY_COLUMN_HEIGHT = (1440 / 60) * 128; // 3072px

  export const VISIBLE_HEIGHT = 10 * 68; // 640px

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

export const mergeTimeSlots = (timeSlots) => {
  if (timeSlots.length === 0) return [];
  
  // Sort slots by start time
  const sorted = [...timeSlots].sort((a, b) => {
    const aStart = parseTime(a.start);
    const bStart = parseTime(b.start);
    return aStart - bStart;
  });

  const merged = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    
    const lastEnd = parseTime(last.end);
    const currentStart = parseTime(current.start);
    const currentEnd = parseTime(current.end);

    if (currentStart <= lastEnd) {
      // Overlapping or adjacent - merge them
      if (currentEnd > lastEnd) {
        merged[merged.length - 1].end = format(currentEnd, 'HH:mm');
      }
    } else {
      merged.push(current);
    }
  }
  
  return merged;
};


export const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie':
      return 100000000;
    case 'acuponcture':
      return 100000000;
    case 'hypnose':
      return 100000000;
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

// src/utils/scheduleUtils.js
import { addMinutes, format, parse } from 'date-fns';

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

export const getDateFromTime = (timeStr) => parse(timeStr, 'HH:mm', new Date(1970, 0, 1));

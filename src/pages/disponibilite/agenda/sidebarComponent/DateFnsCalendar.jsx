import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns';

const DateFnsCalendar = ({ selected, onSelect, locale, renderHeader, dayClassName }) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const today = startOfDay(new Date());

  // Récupération du planning spécifique depuis le localStorage
  let planning = { datesWithSlots: [] };
  try {
    const planningData = localStorage.getItem('planning');
    if (planningData) {
      planning = JSON.parse(planningData);
    }
  } catch (error) {
    planning = { datesWithSlots: [] };
  }

  // Récupération du planning général depuis le localStorage
  let general = [];
  try {
    const generalData = localStorage.getItem('general');
    if (generalData) {
      general = JSON.parse(generalData);
    }
  } catch (error) {
    general = [];
  }

  // Fonction pour déterminer si une date est disponible (cliquable)
  const isDayAvailable = (date) => {
    const dateStr = format(date, 'dd-MM-yyyy');
    // Si pour cette date, le planning spécifique contient une plage horaire, le jour est disponible
    const planningEntry = planning.datesWithSlots.find(d => d.date === dateStr);
    if (planningEntry && planningEntry.timeSlots && planningEntry.timeSlots.length > 0) {
      return true;
    }
    // Sinon, on vérifie dans le planning général pour le jour de la semaine
    const dayIndex = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
    // On considère que le planning général commence par lundi à l'indice 0 :
    const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    if (general[mappedIndex] && Array.isArray(general[mappedIndex].times) && general[mappedIndex].times.length > 0) {
      return true;
    }
    return false;
  };

  const decreaseMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const increaseMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale });
  const endDate = endOfWeek(monthEnd, { locale });

  const rows = [];
  let day = startDate;
  while (day <= endDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isPast = isBefore(day, today);
      const isSelected = selected && isSameDay(day, selected);
      const extraClass = typeof dayClassName === 'function' ? dayClassName(day) : '';
      // Détermine si le jour est disponible en se basant sur le planning spécifique et général
      const available = isDayAvailable(day);
      days.push(
        <div
          key={day.toISOString()}
          className={`p-2 text-center text-xs flex flex-col items-center justify-center 
            ${!isSameMonth(day, monthStart) ? 'text-gray-400' : isSelected ? 'text-white' : 'text-[#405969]'} 
            ${isSelected ? 'bg-[#405969] text-white rounded-lg' : ''} 
            ${(!available || isPast) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
            ${extraClass}`}
          onClick={available && !isPast ? () => onSelect(cloneDay) : undefined}
        >
          <div>{format(day, 'd')}</div>
          {isSameDay(day, today) && (
            <div className="w-1 h-1 bg-[#405969] rounded-full mt-1"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
  }

  return (
    <div>
      {renderHeader ? (
        renderHeader({ date: currentMonth, decreaseMonth, increaseMonth })
      ) : (
        <div className="flex items-center justify-between mb-2 text-xs text-[#405969]">
          <button onClick={decreaseMonth} className="p-2 text-[#405969] text-xs">
            &lt;
          </button>
          <span className="font-medium text-[#405969] text-xs capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale })}
          </span>
          <button onClick={increaseMonth} className="p-2 text-[#405969] text-xs">
            &gt;
          </button>
        </div>
      )}
      <div className="grid grid-cols-7 text-center text-xs font-bold mb-2 text-[#405969]">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((d, index) => (
          <div key={index}>{d}</div>
        ))}
      </div>
      <div>{rows}</div>
    </div>
  );
};

export default DateFnsCalendar;

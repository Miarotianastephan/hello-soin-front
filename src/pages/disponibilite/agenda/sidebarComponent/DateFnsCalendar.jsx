import React, { useState, useEffect } from 'react';
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
  parse,
  isValid
} from 'date-fns';
import BASE_URL from '@/pages/config/baseurl';

// Fonction utilitaire qui tente de parser une chaîne selon le format donné et retourne null si invalide
const safeParseDate = (dateString, dateFormat) => {
  if (!dateString) return null;
  const parsed = parse(dateString, dateFormat, new Date());
  return isValid(parsed) ? parsed : null;
};

const DateFnsCalendar = ({ selected, onSelect, locale, renderHeader, dayClassName }) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const today = startOfDay(new Date());

  // Initialisation du planning spécifique depuis le localStorage
  const [specificDates, setSpecificDates] = useState(() => {
    const saved = localStorage.getItem('specificDates');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('specificDates', JSON.stringify(specificDates));
  }, [specificDates]);

  // Chargement du planning spécifique via l'API
  useEffect(() => {
    fetch(`${BASE_URL}/specificDates`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du planning spécifique");
        }
        return response.json();
      })
      .then(data => {
        setSpecificDates(data);
      })
      .catch(error => {
        console.error(error);
        setSpecificDates([]);
      });
  }, []);

  // Initialisation du planning général depuis le localStorage
  const [general, setGeneral] = useState(() => {
    const saved = localStorage.getItem('general');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('general', JSON.stringify(general));
  }, [general]);

  // Chargement du planning général via l'API
  useEffect(() => {
    fetch(`${BASE_URL}/planning`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du planning général");
        }
        return response.json();
      })
      .then(data => {
        const transformedGeneral = data.map(day => ({
          ...day,
          times: (day.times || []).map(slot => ({
            ...slot,
            // Extraction du format "HH:mm" depuis "HH:mm:ss"
            start: slot.start.slice(0, 5),
            end: slot.end.slice(0, 5),
          })),
        }));
        setGeneral(transformedGeneral);
      })
      .catch(error => {
        console.error(error);
        setGeneral([]);
      });
  }, []);

  // Détermine si une date est disponible en vérifiant le planning spécifique et général
  const isDayAvailable = (date) => {
    const dateStr = format(date, 'dd-MM-yyyy');
  
    // Vérification dans le planning spécifique
    const specificEntry = specificDates.find(entry => {
      // On parse la date spécifique avec le format "dd-MM-yyyy"
      const parsed = safeParseDate(entry.specific_date, 'dd-MM-yyyy');
      if (!parsed) return false;
      const entryDate = format(parsed, 'dd-MM-yyyy');
      return entryDate === dateStr;
    });
    if (specificEntry && specificEntry.timeSlots && specificEntry.timeSlots.length > 0) {
      return true;
    }
  
    // Vérification dans le planning général
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
      <div className="text-xs">{rows}</div>
    </div>
  );
};

export default DateFnsCalendar;

import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
} from 'date-fns';
import fr from 'date-fns/locale/fr';
import { getColorByType } from '../utils/agendaUtils';

const MonthView = ({ currentDate, appointments, onDayClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Formater le mois/année avec la première lettre en majuscule
  const formattedMonthYear = (() => {
    const monthYear = format(currentDate, 'MMMM yyyy', { locale: fr });
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  })();

  // Filtrer les rendez‑vous pour un jour donné
  const getAppointmentsForDay = (day) => {
    const dayString = format(day, 'dd-MM-yyyy');
    return appointments.filter(app => app.date === dayString);
  };

  const today = startOfDay(new Date());

  return (
    <div className="p-2">
      <p className="font-bold text-lg mb-2">{formattedMonthYear}</p>
      {/* Entête des jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((dayName, index) => (
          <div key={index} className="text-center font-bold text-sm">
            {dayName}
          </div>
        ))}
      </div>
      {/* Grille du mois */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isPast = isBefore(day, today);
          const isFuture = isAfter(day, today);
          const clickable = !isPast; // dates passées non cliquables

          return (
            <div 
              key={index} 
              className={`border p-1 h-24 text-xs 
                ${!isSameMonth(day, currentDate) ? 'bg-gray-100' : ''} 
                ${isToday(day) ? 'bg-green-50' : ''} 
                ${clickable ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
              onClick={clickable ? () => onDayClick(day) : undefined}
            >
              <div className="flex justify-between items-center">
                <div className="text-right font-bold">{format(day, 'd')}</div>
                {isFuture && dayAppointments.length > 0 && (
                  <span className="vert text-green-500 text-4xl">•</span>
                )}
              </div>
              <div className="mt-1">
                {dayAppointments.slice(0, 2).map((app, i) => (
                  <div 
                    key={i} 
                    className="truncate" 
                    style={{ color: getColorByType(app.practice?.type) }}
                  >
                    {app.practice && app.practice.type ? app.practice.type : 'RDV'}
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-gray-500">+{dayAppointments.length - 2}...</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

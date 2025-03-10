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
} from 'date-fns';

const MonthView = ({ currentDate, appointments, onDayClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Filtrer les rendez‑vous pour un jour donné
  const getAppointmentsForDay = (day) => {
    const dayString = format(day, 'dd-MM-yyyy');
    return appointments.filter(app => app.date === dayString);
  };

  return (
    <div className="p-2">
      <h3 className="font-bold text-lg mb-2">{format(currentDate, 'MMMM yyyy')}</h3>
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
          return (
            <div 
              key={index} 
              className={`border p-1 h-24 cursor-pointer text-xs 
                ${!isSameMonth(day, currentDate) ? 'bg-gray-100' : 'bg-white'} 
                ${isToday(day) ? 'bg-blue-100' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="text-right font-bold">{format(day, 'd')}</div>
              <div className="mt-1">
                {dayAppointments.slice(0, 2).map((app, i) => (
                  <div key={i} className="truncate">
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

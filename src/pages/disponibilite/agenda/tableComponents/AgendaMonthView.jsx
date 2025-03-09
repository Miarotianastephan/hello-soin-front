import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const AgendaMonthView = ({ currentDate, onDayClick, appointments }) => {
  // Calcul de la grille du mois (6 semaines)
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = addDays(startDate, 42);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day < endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      days.push(
        <div
          key={day}
          className={`border p-2 cursor-pointer text-center ${
            !isSameMonth(day, monthStart) ? 'text-gray-400' : ''
          } ${isSameDay(day, currentDate) ? 'bg-blue-200' : ''}`}
          onClick={() => onDayClick(cloneDay)}
        >
          {format(day, 'd')}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div>
      <div className="text-center font-bold text-lg my-2">
        {format(monthStart, 'MMMM yyyy', { locale: fr })}
      </div>
      <div className="grid grid-cols-7 text-center font-bold">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mer</div>
        <div>Jeu</div>
        <div>Ven</div>
        <div>Sam</div>
        <div>Dim</div>
      </div>
      <div>{rows}</div>
    </div>
  );
};

export default AgendaMonthView;

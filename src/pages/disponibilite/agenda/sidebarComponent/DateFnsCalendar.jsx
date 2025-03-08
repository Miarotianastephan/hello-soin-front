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
      days.push(
        <div
          key={day.toISOString()}
          className={`cursor-pointer p-2 text-center text-xs flex flex-col items-center justify-center ${
            !isSameMonth(day, monthStart) ? 'text-gray-400' : isSelected ? 'text-white' : 'text-[#405969]'
          } ${isSelected ? 'bg-[#405969] text-white rounded-lg' : ''} ${
            isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${extraClass}`}
          onClick={!isPast ? () => onSelect(cloneDay) : undefined}
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
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, index) => (
          <div key={index}>{d}</div>
        ))}
      </div>
      <div>{rows}</div>
    </div>
  );
};

export default DateFnsCalendar;

import React, { useRef } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { dayNames, DAY_COLUMN_HEIGHT, VISIBLE_HEIGHT } from '../utils/agendaUtils';
import { TimeColumn } from './TimeColumn';
import DayColumn from './DayColumn';

const AgendaWeekView = ({
  schedule,
  currentDate,
  onSlotClick,
  appointments,
  onPracticeClick,
  onReservedClick,
  practiceFilter,
  specifiqueOnly,
  onOpenCreateAppointment,
  refreshSchedule,
  selectedPractice,
}) => {
  const scrollableRef = useRef(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const daysSchedule = daysInWeek.map(date => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    let entry;
    if (specifiqueOnly) {
      entry = schedule.specific.find(d => d.date === formattedDate);
      return { date, schedule: entry || { date: formattedDate, dayName: dayNames[date.getDay()], timeSlots: [] }, source: 'specific' };
    } else {
      const specificEntry = schedule.specific.find(d => d.date === formattedDate);
      if (specificEntry) {
        entry = specificEntry;
        return { date, schedule: specificEntry, source: 'specific' };
      } else {
        const dayName = dayNames[date.getDay()];
        const generalEntry = schedule.defaultGeneral.find(
          d => d.name.toLowerCase() === dayName.toLowerCase()
        );
        return { date, schedule: { date: formattedDate, dayName, timeSlots: generalEntry ? generalEntry.times : [] }, source: 'general' };
      }
    }
  });

  return (
    <div>
      <div className="overflow-y-auto scrollbar-custom" style={{ height: `${VISIBLE_HEIGHT}px` }} ref={scrollableRef}>
        <div className="grid" style={{ gridTemplateColumns: '50px repeat(7, 1fr)', height: `${DAY_COLUMN_HEIGHT}px` }}>
          <div className="relative border-r" style={{ width: '50px', flexShrink: 0 }}>
            <TimeColumn />
          </div>
          {daysSchedule.map((day, idx) => (
            <DayColumn
              key={idx}
              daySchedule={day.schedule}
              date={day.date}
              onSlotClick={(ds, slotIdx, sourceType, clickedSlot) =>
                onSlotClick(ds, slotIdx, day.source, clickedSlot)
              }
              appointments={appointments}
              onPracticeClick={onPracticeClick}
              onReservedClick={onReservedClick}
              practiceFilter={practiceFilter}
              isSelected={isSameDay(day.date, currentDate)}
              refreshSchedule={refreshSchedule}
              onOpenCreateAppointment={onOpenCreateAppointment}
              selectedPractice={selectedPractice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaWeekView;

import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { dayNames, DAY_COLUMN_HEIGHT, VISIBLE_HEIGHT } from '../utils/agendaUtils';
import { TimeColumn } from './TimeColumn';
import DayColumn from './DayColumn';

const AgendaDayView = ({
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

  useEffect(() => {
    if (scrollableRef.current) {
      // Défilement par défaut sur 8h
      scrollableRef.current.scrollTop = (8 / 25) * DAY_COLUMN_HEIGHT;
    }
  }, []);

  const formattedDate = format(currentDate, 'dd-MM-yyyy');
  let daySchedule;
  let specificEntry;
  if (specifiqueOnly) {
    specificEntry = schedule.specific.find(d => d.date === formattedDate);
    daySchedule = specificEntry || { date: formattedDate, dayName: dayNames[currentDate.getDay()], timeSlots: [] };
  } else {
    specificEntry = schedule.specific.find(d => d.date === formattedDate);
    if (specificEntry) {
      daySchedule = specificEntry;
    } else {
      const dayName = dayNames[currentDate.getDay()];
      const generalEntry = schedule.defaultGeneral.find(
        d => d.name.toLowerCase() === dayName.toLowerCase()
      );
      daySchedule = { date: formattedDate, dayName, timeSlots: generalEntry ? generalEntry.times : [] };
    }
  }

  return (
    <div>
      <div className="text-start font-bold text-lg my-2">
        {format(currentDate, 'MMMM yyyy', { locale: fr })}
      </div>
      <div className="overflow-y-auto" style={{ height: `${VISIBLE_HEIGHT}px` }} ref={scrollableRef}>
        <div className="flex" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
          <div style={{ width: '50px', flexShrink: 0, borderRight: '1px solid #ccc' }}>
            <TimeColumn />
          </div>
          <div className="flex-1 relative border-l h-full">
            <DayColumn
              daySchedule={daySchedule}
              date={currentDate}
              onSlotClick={onSlotClick}
              appointments={appointments}
              onPracticeClick={onPracticeClick}
              onReservedClick={onReservedClick}
              practiceFilter={practiceFilter}
              isSelected={true}
              onOpenCreateAppointment={onOpenCreateAppointment}
              refreshSchedule={refreshSchedule}
              selectedPractice={selectedPractice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaDayView;

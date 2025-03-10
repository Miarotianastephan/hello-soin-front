import React, { useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { dayNames, DAY_COLUMN_HEIGHT, VISIBLE_HEIGHT } from './utils/agendaUtils';
import TimeColumn from './tableComponents/TimeColumn';
import DayColumn from './tableComponents/DayColumn';
import AppointmentsList from './tableComponents/AppointmentsList';
import MonthView from './tableComponents/MonthView';

const AgendaTable = ({
  schedule,
  currentDate,
  viewMode,
  onSlotClick,
  appointments,
  onPracticeClick,
  onReservedClick,
  practiceFilter,
  specifiqueOnly,
  onOpenCreateAppointment,
  refreshSchedule,
  selectedPractice,
  onDayClick, // ajout de la prop pour la navigation depuis le calendrier mensuel
}) => {
  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      // Scroll par défaut sur 8h
      scrollableRef.current.scrollTop = (8 / 25) * DAY_COLUMN_HEIGHT;
    }
  }, [viewMode]);

  if (viewMode === 'day') {
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
                onSlotClick={(ds, idx, sourceType, clickedSlot) => onSlotClick(ds, idx, sourceType, clickedSlot)}
                appointments={appointments}
                onPracticeClick={onPracticeClick}
                onReservedClick={onReservedClick}
                practiceFilter={practiceFilter}
                isSelected={true}
                refreshSchedule={refreshSchedule}
                onOpenCreateAppointment={onOpenCreateAppointment}
                selectedPractice={selectedPractice}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (viewMode === 'week') {
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
          <div 
            className="grid" 
            style={{ gridTemplateColumns: '50px repeat(7, 1fr)', height: `${DAY_COLUMN_HEIGHT}px` }}
          >
            <div className="relative border-r" style={{ width: '50px', flexShrink: 0 }}>
              <TimeColumn />
            </div>
            {daysSchedule.map((day, idx) => (
              <DayColumn
                key={idx}
                daySchedule={day.schedule}
                date={day.date}
                onSlotClick={(ds, slotIdx, sourceType, clickedSlot) => onSlotClick(ds, slotIdx, day.source, clickedSlot)}
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
  } else if (viewMode === 'list') {
    return <AppointmentsList appointments={appointments} />;
  } else if (viewMode === 'month') {
    return (
      <MonthView
        currentDate={currentDate}
        appointments={appointments}
        onDayClick={onDayClick}
      />
    );
  }
};

export default AgendaTable;

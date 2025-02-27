// src/components/Agenda/AgendaTable.js
import React, { useRef, useEffect } from 'react';
import { format, addHours, differenceInMinutes, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  dayNames, 
  parseTime, 
  totalDuration, 
  DAY_COLUMN_HEIGHT, 
  VISIBLE_HEIGHT, 
  getColorByType, 
  mergePractices,
  AGENDA_START
} from './utils/agendaUtils';
import "../../../App.css"

export const DayHeader = ({ date }) => (
  <p className="text-center">
    {dayNames[date.getDay()]} {format(date, 'dd')}
  </p>
);

export const HoursColumn = () => {
  const hours = [];
  for (let hour = 0; hour <= 24; hour++) {
    const label =
      hour === 24
        ? '24:00'
        : format(addHours(parseTime(AGENDA_START), hour), 'HH:mm');
    const offset = (hour / 24) * 100;
    hours.push(
      <div
        key={hour}
        style={{
          position: 'absolute',
          top: `${offset}%`,
          transform: 'translateY(-50%)'
        }}
        className="text-xs text-gray-600 border-t-2 w-full px-2 mt-2"
      >
        {label}
      </div>
    );
  }
  return <div className="relative h-full">{hours}</div>;
};

export const DayColumn = ({ daySchedule, onSlotClick, onPracticeClick, onReservedClick, appointments, practiceFilter }) => {
  const slots = daySchedule ? daySchedule.timeSlots || [] : [];
  return (
    <div className="relative border-l h-full bg-gray-200">
      {slots.map((slot, idx) => {
        const slotStart = parseTime(slot.start);
        const slotEnd = parseTime(slot.end);
        const offset =
          (differenceInMinutes(slotStart, parseTime(AGENDA_START)) / totalDuration) * 100;
        const height =
          (differenceInMinutes(slotEnd, slotStart) / totalDuration) * 100;
        return (
          <div
            key={idx}
            className="absolute border bg-white cursor-pointer"
            style={{
              top: `${offset}%`,
              height: `${height}%`,
              left: 0,
              right: 0
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick && onSlotClick(daySchedule, idx, daySchedule.sourceType);
            }}
          >
            {slot.practices &&
              slot.practices.length > 0 &&
              mergePractices(slot.practices).map((practice, pIdx) => {
                if (!practiceFilter.tous && !practiceFilter[practice.type]) return null;
                const slotDuration = differenceInMinutes(slotEnd, slotStart);
                const pStart = parseTime(practice.start);
                const pEnd = parseTime(practice.end);
                const pOffset =
                  (differenceInMinutes(pStart, slotStart) / slotDuration) * 100;
                const pHeight =
                  (differenceInMinutes(pEnd, pStart) / slotDuration) * 100;
                const appointmentKey = `${daySchedule.date}_${idx}_${practice.start}_${practice.type}`;
                const appointment = appointments.find(app => app.key === appointmentKey);
                return (
                  <div
                    key={pIdx}
                    className="absolute cursor-pointer "
                    style={{
                      top: `${pOffset}%`,
                      height: `${pHeight}%`,
                      left: 0,
                      right: 0,
                      backgroundColor: getColorByType(practice.type)
                    }}
                    title={`${practice.type} (${practice.start} - ${practice.end}) ${appointment ? 'Réservé' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (appointment) {
                        onReservedClick && onReservedClick(appointment);
                      } else {
                        onPracticeClick && onPracticeClick(daySchedule, idx, practice, appointmentKey);
                      }
                    }}
                  >
                    {appointment && (
                      <div className="absolute inset-0 flex flex-col  items-center justify-center text-xs text-white bg-gray-150 bg-opacity-50">
                        <div className='font-bold'>
                          {practice.start} - {practice.end}
                        </div>
                        <div>
                          {appointment.patient.prenom}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export const AppointmentsList = ({ appointments }) => (
  <div className="p-1">
  <h3 className="font-bold">Tous les Rendez‑vous</h3>
  {/* Légende avec des points colorés */}
  <div className="flex gap-4 my-2">
    <div className="flex items-center">
      <span
        className="mr-1"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundColor: getColorByType('naturopathie'),
        }}
      />
      <span>Naturopathie</span>
    </div>
    <div className="flex items-center">
      <span
        className="mr-1"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundColor: getColorByType('acuponcture'),
        }}
      />
      <span>Acuponcture</span>
    </div>
    <div className="flex items-center">
      <span
        className="mr-1"
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          display: 'inline-block',
          backgroundColor: getColorByType('hypnose'),
        }}
      />
      <span>Hypnose</span>
    </div>
  </div>

  {appointments.length === 0 ? (
    <p>Aucun rendez‑vous.</p>
  ) : (
    <table className="w-full">
      <thead>
        <tr className="text-left border-b bg-gray-200">
          <th></th>
          <th>Date</th>
          <th>Heure</th>
          <th>Patient</th>
          <th>Motif</th>
        </tr>
      </thead>
      <tbody>
        {appointments
          // Trie par date décroissante (les plus récents en premier)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((app, idx) => (
            <tr key={idx} className="border-b">
              <td>
                {/* Point coloré pour représenter la couleur */}
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    backgroundColor: getColorByType(app.practice.type),
                  }}
                />
              </td>
              <td>{app.date}</td>
              <td>
                {app.practice.start} - {app.practice.end}
              </td>
              <td>
                {app.patient.prenom} {app.patient.nom}
              </td>
              <td>{app.motif}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )}
</div>

);
const  AgendaTable = ({
  schedule,
  currentDate,
  viewMode,
  onSlotClick,
  appointments,
  onPracticeClick,
  onReservedClick,
  practiceFilter,
  specifiqueOnly
}) => {
  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = (8 / 24) * DAY_COLUMN_HEIGHT;
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
        {format(currentDate, 'dd MMMM yyyy', { locale: fr })}
        </div>
        <div className="overflow-y-auto" style={{ height: `${VISIBLE_HEIGHT}px` }} ref={scrollableRef}>
          <div className="grid grid-cols-10 py-5" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
            <div className="col-span-1 relative border-l h-full">
              <HoursColumn />
            </div>
            <div className="col-span-9 relative border-l h-full">
              <DayColumn
                daySchedule={daySchedule}
                onSlotClick={(ds, idx) => onSlotClick(ds, idx, specificEntry ? 'specific' : 'general')}
                appointments={appointments}
                onPracticeClick={onPracticeClick}
                onReservedClick={onReservedClick}
                practiceFilter={practiceFilter}
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
        <div className="grid grid-cols-8 border">
          <div></div>
          {daysSchedule.map((day, idx) => (
            <DayHeader key={idx} date={day.date} />
          ))}
        </div>
        <div className="overflow-y-auto scrollbar-custom" style={{ height: `${VISIBLE_HEIGHT}px` }} ref={scrollableRef}>
          <div className="grid grid-cols-8" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
            <div className="relative border-l h-full">
              <HoursColumn />
            </div>
            {daysSchedule.map((day, idx) => (
              <DayColumn
                key={idx}
                daySchedule={day.schedule}
                onSlotClick={(ds, slotIdx) => onSlotClick(ds, slotIdx, day.source)}
                appointments={appointments}
                onPracticeClick={onPracticeClick}
                onReservedClick={onReservedClick}
                practiceFilter={practiceFilter}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (viewMode === 'month') {
    return <AppointmentsList appointments={appointments} />;
  }
};


export default AgendaTable;

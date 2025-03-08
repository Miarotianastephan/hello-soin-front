// src/components/Agenda/AgendaTable.js
import React, { useRef, useEffect, useState } from 'react';
import { format, addDays, startOfWeek, differenceInMinutes, isSameDay, startOfDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  dayNames, 
  parseTime, 
  totalDuration, 
  DAY_COLUMN_HEIGHT, 
  VISIBLE_HEIGHT, 
  getColorByType,
  AGENDA_START
} from './utils/agendaUtils';
import { createPlageHoraire } from './utils/scheduleUtils'; // Assurez-vous du bon chemin d'importation
import "../../../App.css";
import { Phone } from 'lucide-react';

// Hauteur de l'en-tête (en px)
const HEADER_HEIGHT = 60;

export const TimeColumn = () => {
  const intervals = [];
  const totalIntervals = 24 * 4; // 96 intervalles de 15 minutes
  for (let i = 0; i < totalIntervals; i++) {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const timeLabel =
      (hour < 10 ? '0' : '') +
      hour +
      ':' +
      (minute < 10 ? '0' : '') +
      minute;
    intervals.push(timeLabel);
  }

  const contentHeight = DAY_COLUMN_HEIGHT - HEADER_HEIGHT;

  return (
    <div 
      className="relative" 
      style={{ 
        height: `${DAY_COLUMN_HEIGHT}px`,
        width: '50px'
      }}
    >
      <div
        className="sticky top-0 bg-white z-10 border-b p-1"
        style={{ height: `${HEADER_HEIGHT}px` }}
      />
      <div
        style={{
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
          height: `${contentHeight}px`,
          width: '100%'
        }}
      >
        {intervals.map((time, idx) => {
          const top = idx * (contentHeight / totalIntervals);
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: `${top}px`,
                height: `${contentHeight / totalIntervals}px`,
                width: '100%',
                borderBottom: (idx % 4 === 3) ? '1px solid #ccc' : 'none',
                textAlign: (idx % 4 === 0) ? 'left' : 'right',
                fontWeight: (idx % 4 === 0) ? 'bold' : '',
                paddingLeft: (idx % 4 === 0) ? '4px' : '0px',
                paddingRight: (idx % 4 === 0) ? '0px' : '4px',
                fontSize: '10px'
              }}
              className='text-gray-700 text-xs'
            >
              {time}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DayColumn = ({
  daySchedule,
  date,
  onSlotClick,
  onPracticeClick,
  onReservedClick,
  appointments,
  practiceFilter,
  isSelected,
  refreshSchedule  // ajout de la prop refreshSchedule
}) => {
  const [hoverBlock, setHoverBlock] = useState(null);
  // États pour la sélection multiple avec Ctrl
  const [multiSelectStart, setMultiSelectStart] = useState(null);
  const [multiSelectCurrent, setMultiSelectCurrent] = useState(null);
  // Cet état permettra d'afficher l'overlay final pendant quelques secondes
  const [finalMultiSelectRange, setFinalMultiSelectRange] = useState(null);

  const slots = daySchedule ? daySchedule.timeSlots || [] : [];
  const contentHeight = DAY_COLUMN_HEIGHT - HEADER_HEIGHT;
  const now = new Date();
  const isToday = isSameDay(date, now);
  // Autoriser la sélection pour le jour en cours et les dates futures
  const isSelectable = startOfDay(date) >= startOfDay(now);

  let currentTimeTop = null;
  if (isToday) {
    const agendaStartTime = parseTime(AGENDA_START);
    const agendaStartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      agendaStartTime.getHours(),
      agendaStartTime.getMinutes()
    );
    const currentDate = new Date();
    if (currentDate >= agendaStartDate && currentDate <= addMinutes(agendaStartDate, totalDuration)) {
      const minutesPassed = differenceInMinutes(currentDate, agendaStartDate);
      currentTimeTop = (minutesPassed / totalDuration) * contentHeight;
    }
  }

  const handleBackgroundClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
  
    // Calcul de l'heure en fonction de la position du clic
    const rawMinutes = (clickY / contentHeight) * totalDuration;
    const roundedMinutes = Math.round(rawMinutes / 15) * 15;
    const baseTime = parseTime(AGENDA_START);
    const agendaStartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseTime.getHours(),
      baseTime.getMinutes()
    );
    const agendaEndDate = addMinutes(agendaStartDate, totalDuration);
    const clickedTime = addMinutes(agendaStartDate, roundedMinutes);
  
    if (
      clickedTime < agendaStartDate ||
      clickedTime >= agendaEndDate ||
      (isToday && clickedTime < new Date())
    ) {
      return;
    }
  
    // Gestion de la sélection multiple avec Ctrl
    if (e.ctrlKey) {
      if (!multiSelectStart) {
        setMultiSelectStart(clickedTime);
        setMultiSelectCurrent(clickedTime);
      } else {
        const startTime = multiSelectStart;
        const endTime = clickedTime;
        const selectionStartTime = startTime < endTime ? startTime : endTime;
        const selectionEndTime = startTime < endTime ? endTime : startTime;
        const formattedDate = format(date, 'dd-MM-yyyy');
        const formattedStart = format(selectionStartTime, 'HH:mm');
        const formattedEnd = format(selectionEndTime, 'HH:mm');
  
        try {
          createPlageHoraire(formattedDate, formattedStart, formattedEnd);
          // Rafraîchissement automatique du planning après création
          if (typeof refreshSchedule === 'function') {
            refreshSchedule();
          }
        } catch (error) {
          alert(error.message);
        }
        setFinalMultiSelectRange({ start: selectionStartTime, end: selectionEndTime });
        setMultiSelectStart(null);
        setMultiSelectCurrent(null);
        setTimeout(() => setFinalMultiSelectRange(null), 3000);
      }
      return;
    }
  
    // S'assurer que "slots" est toujours un tableau (même si indéfini)
    const safeSlots = Array.isArray(slots) ? slots : [];
  
    // Clic normal (sans Ctrl)
    const isWithinSlot = safeSlots.some(slot => {
      const slotStart = parseTime(slot.start);
      const slotEnd = parseTime(slot.end);
      return clickedTime >= slotStart && clickedTime < slotEnd;
    });
  
    if (!isWithinSlot) {
      const formattedDate = format(date, 'dd-MM-yyyy');
      const formattedTime = format(clickedTime, 'HH:mm');
      alert(`Date et heure cliquées: ${formattedDate} à ${formattedTime}`);
    }
  };
  

  const handleClick = (e, daySchedule, slotIndex, sourceType, clickedSlot, slotHeight) => {
    const clickY = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const slotStart = parseTime(clickedSlot.start);
    const slotEnd = parseTime(clickedSlot.end);
    const slotDuration = differenceInMinutes(slotEnd, slotStart);
    
    const minutesPerPixel = slotDuration / slotHeight;
    const rawMinutes = clickY * minutesPerPixel;
    const offsetMinutes = Math.round(rawMinutes / 15) * 15;
    
    const clampedMinutes = Math.max(0, Math.min(offsetMinutes, slotDuration));
    const newTime = new Date(slotStart.getTime() + clampedMinutes * 60000);
    const formattedTime = format(newTime, 'HH:mm');
  
    onSlotClick(daySchedule, slotIndex, sourceType, {
      ...clickedSlot,
      start: formattedTime
    });
  };

  // Gestion du survol et mise à jour de la position pour la sélection multiple
  const totalIntervals = 24 * 4; // 96 créneaux de 15 min sur 24h
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const blockHeight = contentHeight / totalIntervals;
    setHoverBlock(Math.floor(offsetY / blockHeight));

    if (multiSelectStart) {
      const rawMinutes = (offsetY / contentHeight) * totalDuration;
      const roundedMinutes = Math.round(rawMinutes / 15) * 15;
      const baseTime = parseTime(AGENDA_START);
      const agendaStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), baseTime.getHours(), baseTime.getMinutes());
      const newTime = addMinutes(agendaStartDate, roundedMinutes);
      setMultiSelectCurrent(newTime);
    }
  };

  const handleMouseLeave = () => {
    setHoverBlock(null);
  };

  // Calcul et rendu de l'overlay de sélection
  let selectionOverlay = null;
  if (finalMultiSelectRange) {
    const { start, end } = finalMultiSelectRange;
    const selectionStartTime = start < end ? start : end;
    const selectionEndTime = start < end ? end : start;
    const agendaStartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseTime(AGENDA_START).getHours(),
      parseTime(AGENDA_START).getMinutes()
    );
    const offsetTop = (differenceInMinutes(selectionStartTime, agendaStartDate) / totalDuration) * contentHeight;
    const overlayHeight = (differenceInMinutes(selectionEndTime, selectionStartTime) / totalDuration) * contentHeight;
    selectionOverlay = (
      <div style={{
         position: 'absolute',
         top: `${offsetTop}px`,
         left: 0,
         right: 0,
         height: `${overlayHeight}px`,
         backgroundColor: 'rgba(0, 128, 0, 0.3)',
         zIndex: 4,
       }} />
    );
  } else if (multiSelectStart && multiSelectCurrent) {
    const selectionStartTime = multiSelectStart < multiSelectCurrent ? multiSelectStart : multiSelectCurrent;
    const selectionEndTime = multiSelectStart < multiSelectCurrent ? multiSelectCurrent : multiSelectStart;
    const agendaStartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseTime(AGENDA_START).getHours(),
      parseTime(AGENDA_START).getMinutes()
    );
    const offsetTop = (differenceInMinutes(selectionStartTime, agendaStartDate) / totalDuration) * contentHeight;
    const overlayHeight = (differenceInMinutes(selectionEndTime, selectionStartTime) / totalDuration) * contentHeight;
    selectionOverlay = (
      <div style={{
         position: 'absolute',
         top: `${offsetTop}px`,
         left: 0,
         right: 0,
         height: `${overlayHeight}px`,
         backgroundColor: 'rgba(0, 128, 0, 0.3)',
         zIndex: 4,
       }} />
    );
  }

  return (
    <div className="relative border-l h-full bg-gray-200" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
      {/* En-tête */}
      <div
        className={`sticky top-0 z-10 p-1 ${isSelected ? 'bg-gray-300 border-b-2 border-green-500' : 'bg-white border-b'}`}
        style={{ height: `${HEADER_HEIGHT}px` }}
      >
        <p className="text-gray-700 font-bold text-xs text-start">{dayNames[date.getDay()]}</p>
        <p className="font-bold text-lg text-start">{format(date, 'dd')}</p>
      </div>
      
      {/* Zone horaire */}
      <div
        style={{
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
          left: 0,
          right: 0,
          height: `${contentHeight}px`
        }}
        onMouseMove={isSelectable ? handleMouseMove : undefined}
        onMouseLeave={isSelectable ? handleMouseLeave : undefined}
        onClick={isSelectable ? handleBackgroundClick : undefined}
      >
        {/* Overlay de sélection */}
        {selectionOverlay}
        
        {slots.map((slot, idx) => {
          const slotStart = parseTime(slot.start);
          const slotEnd = parseTime(slot.end);
          const offset = (differenceInMinutes(slotStart, parseTime(AGENDA_START)) / totalDuration) * contentHeight;
          const slotHeight = (differenceInMinutes(slotEnd, slotStart) / totalDuration) * contentHeight;
          
          let isSlotPast = false;
          if (isToday) {
            const [endHour, endMinute] = slot.end.split(':').map(Number);
            const slotEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, endMinute);
            isSlotPast = slotEndDate < new Date();
          }
          
          const pastStyle = !isSelectable ? { backgroundColor: '#f0f0f0', opacity: 0.6 } : {};
          
          const slotStyle = {
            top: `${offset}px`,
            height: `${slotHeight}px`,
            left: 0,
            right: 0,
            ...(isSlotPast && { textDecoration: 'line-through', cursor: 'not-allowed' })
          };
          
          return (
            <div
              key={idx}
              className={`absolute border rounded-lg ${isSelectable && !isSlotPast ? 'cursor-pointer bg-white' : ''} ${!isSelectable ? 'bg-gray-300' : ''}`}
              style={{ ...slotStyle, ...pastStyle }}
              onClick={isSelectable && !isSlotPast ? (e => {
                e.stopPropagation();
                handleClick(e, daySchedule, idx, daySchedule.sourceType, slot, slotHeight);
              }) : null}
            >
              {isToday && !isSlotPast && (() => {
                const currentTime = new Date();
                if (currentTime >= slotStart && currentTime < slotEnd) {
                  const totalSlotMinutes = differenceInMinutes(slotEnd, slotStart);
                  const passedMinutes = differenceInMinutes(currentTime, slotStart);
                  const overlayHeight = (passedMinutes / totalSlotMinutes) * 100;
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: `${overlayHeight}%`,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  );
                }
                return null;
              })()}
              
              {slot.practices && slot.practices.length > 0 && slot.practices.map((practice, pIdx) => {
                if (!practiceFilter.tous && !practiceFilter[practice.type]) return null;
                const practiceStart = practice.start || slot.start;
                const practiceEnd = practice.end || slot.end;
                const pStart = parseTime(practiceStart);
                const pEnd = parseTime(practiceEnd);
                const pOffset = (differenceInMinutes(pStart, slotStart) / differenceInMinutes(slotEnd, slotStart)) * 100;
                const pHeight = (differenceInMinutes(pEnd, pStart) / differenceInMinutes(slotEnd, slotStart)) * 100;
                const appointmentKey = `${daySchedule.date}_${slot.start}_${slot.end}_${practiceStart}_${practice.type}`;
                const appointment = appointments.find(app => app.key === appointmentKey);
                return (
                  <div
                    key={pIdx}
                    className="absolute cursor-pointer border-2 rounded-md text-center hover:bg-gray-200 transition-colors duration-200"
                    style={{
                      top: `${pOffset}%`,
                      height: `${pHeight}%`,
                      left: 0,
                      right: 0,
                      borderColor: getColorByType(practice.type),
                      color: getColorByType(practice.type),
                      backgroundColor: `${getColorByType(practice.type)}10`,
                      borderRadius: "8px"
                    }}
                    title={`${practice.type} (${practiceStart} - ${practiceEnd}) ${appointment ? 'Réservé' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (appointment) {
                        onReservedClick && onReservedClick(appointment);
                      } else {
                        const defaultPractice = { ...practice, start: practice.start || slot.start, end: practice.end || slot.end };
                        onPracticeClick && onPracticeClick(daySchedule, idx, defaultPractice, appointmentKey);
                      }
                    }}
                  >
                    {appointment && (
                      <div className="ml-2 absolute inset-0 flex flex-col items-start justify-start mb-2 text-xs bg-gray-150 bg-opacity-50 overflow-hidden">
                        <div className="flex items-center justify-between pr-2 mt-1 gap-1 w-full">
                          <div className="font-tsy-bold text-[10px]">{practiceStart} - {practiceEnd}</div>
                        </div>
                        <div className="w-[1/2] items-center justify-center rounded-md flex text-white text-[10px] px-2" style={{ backgroundColor: `${getColorByType(practice.type)}` }}>
                          {practice.type}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px]">Mr {appointment.patient.prenom} {appointment.patient.nom}</div>
                        <div className="flex items-center justify-start gap-1 w-full">
                          <Phone size={12} />
                          <div className="font-tsy-bold text-[10px]">{appointment.patient.numero}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {isToday && currentTimeTop !== null && (
          <div
            style={{
              position: 'absolute',
              top: `${currentTimeTop}px`,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: 'blue',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />
        )}

        {hoverBlock !== null && (
          <div
            style={{
              position: 'absolute',
              top: `${hoverBlock * (contentHeight / totalIntervals)}px`,
              height: `${contentHeight / totalIntervals}px`,
              left: 0,
              right: 0,
              backgroundColor: '#BCE2D326',
              pointerEvents: 'none'
            }}
            className='rounded-lg'
          />
        )}
      </div>
    </div>
  );
};

export const AppointmentsList = ({ appointments }) => (
  <div className="p-1">
    <h3 className="font-bold">Tous les Rendez‑vous</h3>
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
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((app, idx) => (
              <tr key={idx} className="border-b">
                <td>
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
  refreshSchedule  // ajout de la prop refreshSchedule
}) => {
  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {
      // Scroll par défaut sur 8h
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
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </div>
        <div className="overflow-y-auto" style={{ height: `${VISIBLE_HEIGHT}px` }} ref={scrollableRef}>
          <div className="flex" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
            {/* Colonne horaire */}
            <div style={{ width: '50px', flexShrink: 0, borderRight: '1px solid #ccc' }}>
              <TimeColumn />
            </div>
            {/* Colonne du jour */}
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
                refreshSchedule={refreshSchedule}  // passage de la fonction
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
                refreshSchedule={refreshSchedule}  // passage de la fonction
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

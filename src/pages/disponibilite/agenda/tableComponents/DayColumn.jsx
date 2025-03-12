import React, { useState, useEffect } from 'react';
import { format, addMinutes, differenceInMinutes, isSameDay, startOfDay } from 'date-fns';
import { dayNames, parseTime, totalDuration, DAY_COLUMN_HEIGHT, AGENDA_START, getColorByType } from '../utils/agendaUtils';
import { createPlageHoraire } from '../utils/scheduleUtils';
import { Phone } from 'lucide-react';

const HEADER_HEIGHT = 60;

const DayColumn = ({
  daySchedule,
  date,
  onSlotClick,
  onPracticeClick,
  onReservedClick,
  appointments,
  practiceFilter,
  isSelected,
  onOpenCreateAppointment,
  refreshSchedule,
  selectedPractice
}) => {
  // Retrait des états liés au survol
  const [multiSelectStart, setMultiSelectStart] = useState(null);
  const [multiSelectCurrent, setMultiSelectCurrent] = useState(null);
  const [finalMultiSelectRange, setFinalMultiSelectRange] = useState(null);

  const slots = daySchedule ? daySchedule.timeSlots || [] : [];
  const contentHeight = DAY_COLUMN_HEIGHT - HEADER_HEIGHT;
  const now = new Date();
  const isToday = isSameDay(date, now);
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
    
    if (e.ctrlKey || e.metaKey) {
      if (!multiSelectStart) {
        setMultiSelectStart(clickedTime);
        setMultiSelectCurrent(clickedTime);
      } else {
        // Sélection bidirectionnelle
        const startTime = multiSelectStart;
        const endTime = clickedTime;
        const selectionStartTime = startTime < endTime ? startTime : endTime;
        const selectionEndTime = startTime < endTime ? endTime : startTime;
        const formattedDate = format(date, 'dd-MM-yyyy');
        const formattedStart = format(selectionStartTime, 'HH:mm');
        const formattedEnd = format(selectionEndTime, 'HH:mm');
        try {
          createPlageHoraire(formattedDate, formattedStart, formattedEnd);
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
    
    const safeSlots = Array.isArray(slots) ? slots : [];
    const isWithinSlot = safeSlots.some(slot => {
      const slotStart = parseTime(slot.start);
      const slotEnd = parseTime(slot.end);
      return clickedTime >= slotStart && clickedTime < slotEnd;
    });
    
    if (!isWithinSlot) {
      const formattedDate = format(date, 'dd-MM-yyyy');
      const formattedTime = format(clickedTime, 'HH:mm');
      onOpenCreateAppointment(formattedDate, formattedTime);
      console.log('a verifier');
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

  const totalIntervals = 24 * 4; // 96 créneaux de 15 min

  // La gestion du survol de la souris a été retirée

  const computeFreeIntervals = (slot) => {
    const sStart = parseTime(slot.start);
    const sEnd = parseTime(slot.end);
    let freeIntervals = [];
    if (slot.practices && slot.practices.length > 0) {
      const sortedAppointments = slot.practices.slice().sort((a, b) => parseTime(a.start) - parseTime(b.start));
      let current = sStart;
      sortedAppointments.forEach(practice => {
        const pStart = parseTime(practice.start || slot.start);
        const pEnd = parseTime(practice.end || slot.end);
        if (pStart > current) {
          freeIntervals.push({ start: current, end: pStart });
        }
        if (pEnd > current) {
          current = pEnd;
        }
      });
      if (current < sEnd) {
        freeIntervals.push({ start: current, end: sEnd });
      }
    } else {
      freeIntervals.push({ start: sStart, end: sEnd });
    }
    return freeIntervals;
  };

  return (
    <div className="relative border-r h-full bg-gray-200" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
      <div
        className={`sticky top-0 z-10 p-1 border-l ${isSelected ? 'bg-gray-300 border-b-2 border-green-500' : 'bg-white border-b'}`}
        style={{ height: `${HEADER_HEIGHT}px` }}
      >
        <p className="text-gray-700 font-bold text-xs text-start">{dayNames[date.getDay()]}</p>
        <p className="font-bold text-lg text-start">{format(date, 'dd')}</p>
      </div>
      <div
        style={{
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
          left: 0,
          right: 0,
          height: `${contentHeight}px`
        }}
        onClick={isSelectable ? handleBackgroundClick : undefined}
      >
        {(multiSelectStart && multiSelectCurrent) && (
          (() => {
            const startTime = multiSelectStart < multiSelectCurrent ? multiSelectStart : multiSelectCurrent;
            const endTime = multiSelectStart < multiSelectCurrent ? multiSelectCurrent : multiSelectStart;
            
            const baseTime = parseTime(AGENDA_START);
            const agendaStartDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              baseTime.getHours(),
              baseTime.getMinutes()
            );
        
            const topOffset = (differenceInMinutes(startTime, agendaStartDate) / totalDuration * contentHeight);
            const bottomOffset = (differenceInMinutes(endTime, agendaStartDate) / totalDuration * contentHeight);
            const height = bottomOffset - topOffset;
        
            return (
              <div
                style={{
                  position: 'absolute',
                  top: `${topOffset}px`,
                  height: `${height}px`,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(100, 149, 237, 0.3)',
                  border: '2px solid rgba(70, 130, 180, 0.7)',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              />
            );
          })()
        )}
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
          let freeIntervals = [];
          if (selectedPractice) {
            freeIntervals = computeFreeIntervals(slot);
          }
          return (
            <div
              key={idx}
              className={`absolute border rounded-lg ${isSelectable && !isSlotPast ? 'cursor-pointer bg-white' : ''} ${!isSelectable ? 'bg-gray-300' : ''}`}
              style={{ 
                top: `${offset}px`,
                height: `${slotHeight}px`,
                left: 0,
                right: 0,
                ...pastStyle
              }}
              onClick={isSelectable && !isSlotPast ? (e => {
                e.stopPropagation();
                handleClick(e, daySchedule, idx, daySchedule.sourceType, slot, slotHeight);
              }) : null}
            >
              {selectedPractice && freeIntervals.map((interval, i) => {
                const relTop = (differenceInMinutes(interval.start, slotStart) / differenceInMinutes(slotEnd, slotStart)) * 100;
                const relHeight = (differenceInMinutes(interval.end, interval.start) / differenceInMinutes(slotEnd, slotStart)) * 100;
                return (
                  <div
                    key={`free-${i}`}
                    style={{
                      position: 'absolute',
                      top: `${relTop}%`,
                      left: 0,
                      right: 0,
                      height: `${relHeight}%`,
                      backgroundColor: getColorByType(selectedPractice) + "20",
                      zIndex: 0,
                    }}
                  />
                );
              })}
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
                    className="absolute cursor-pointer border-2 rounded-md text-center transition-colors duration-200"
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
                        <div className="w-full gap-1 font-bold text-left text-[10px]">
                          {appointment.patient.genre} {appointment.patient.prenom} {appointment.patient.nom}
                        </div>
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
      </div>
    </div>
  );
};

export default DayColumn;

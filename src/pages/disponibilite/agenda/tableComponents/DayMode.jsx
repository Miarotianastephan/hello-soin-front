// tableComponents/DayMode.js
import React, { useState, useEffect } from 'react';
import { format, addMinutes, differenceInMinutes, isSameDay, startOfDay } from 'date-fns';
import { dayNames, parseTime, totalDuration, DAY_COLUMN_HEIGHT, AGENDA_START, getColorByType } from '../utils/agendaUtils';
import { createPlageHoraire } from '../utils/scheduleUtils';
import { Phone, Mail, CalendarCheck, Notebook, User } from 'lucide-react';

const HEADER_HEIGHT = 60;

const DayMode = ({
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
  const [hoverBlock, setHoverBlock] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);
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
      // onOpenCreateAppointment(formattedDate, formattedTime);
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
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const offsetX = e.clientX - rect.left;
    const blockHeight = contentHeight / totalIntervals;
    setHoverBlock(Math.floor(offsetY / blockHeight));
    setHoverPosition({ x: offsetX, y: offsetY });
    const rawMinutes = (offsetY / contentHeight) * totalDuration;
    const roundedMinutes = Math.round(rawMinutes / 15) * 15;
    const baseTime = parseTime(AGENDA_START);
    const agendaStartDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseTime.getHours(),
      baseTime.getMinutes()
    );
    const newTime = addMinutes(agendaStartDate, roundedMinutes);
    setHoverTime(newTime);
    if (multiSelectStart) {
      setMultiSelectCurrent(newTime);
    }
  };

  const handleMouseLeave = () => {
    setHoverBlock(null);
    setHoverPosition(null);
    setHoverTime(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMultiSelectStart(null);
        setMultiSelectCurrent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      {hoverTime && hoverPosition && (
        <div
          style={{
            position: 'absolute',
            left: `${hoverPosition.x + 5}px`,
            top: `${hoverPosition.y + 10}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '2px 5px',
            borderRadius: '4px',
            fontSize: '10px',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          {format(hoverTime, 'HH:mm')}
        </div>
      )}
      {/* Header : affichage en 4 colonnes */}
      <div
        className="sticky top-0 z-10 p-1 border-l bg-white"
        style={{ 
          height: `${HEADER_HEIGHT}px`, 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', 
          alignItems: 'center',
          gap: '2px'
        }}
      >
        <div className="text-gray-500 text-xs font-bold">Nom</div>
        <div className="text-gray-500 text-xs font-bold">Telephone</div>
        <div className="text-gray-500 text-xs font-bold">Email</div>
        <div className="text-gray-500 text-xs font-bold">Type de rendez-vous</div>
        <div className="text-gray-500 text-xs font-bold">Motif</div>
      </div>
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
        {(multiSelectStart && multiSelectCurrent) && (() => {
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
        })()}
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
                ...{
                  top: `${offset}px`,
                  height: `${slotHeight}px`,
                  left: 0,
                  right: 0,
                },
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
                    className="absolute cursor-pointer border-none rounded-2xl text-center hover:bg-gray-200 transition-colors duration-200"
                    style={{
                      top: `${pOffset}%`,
                      height: `${pHeight}%`,
                      left: 0,
                      right: 0,
                      borderColor: getColorByType(practice.type),
                      color: getColorByType(practice.type),
                      backgroundColor: `${getColorByType(practice.type)}30`,
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
                      <div
                        className="absolute inset-0 bg-gray-150 bg-opacity-50 overflow-hidden py-2 px-1"
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '2px' }}
                      >
                        <div className="text-xs font-bold text-start">{appointment.patient.genre} {appointment.patient.nom} {appointment.patient.prenom}</div>
                        <div className="text-xs font-bold text-start flex items-start  gap-2" ><Phone size={12}/> {appointment.patient.numero}</div>
                        <div className="text-xs font-bold  text-start">{appointment.patient.email}</div>
                        <div className="text-xs font-bold  text-start">{practice.type}</div>
                        <div className="text-xs font-bold  text-start">{practice.motif}</div>
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

export default DayMode;

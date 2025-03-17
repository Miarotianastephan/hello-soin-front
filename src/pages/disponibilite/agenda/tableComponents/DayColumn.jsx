import React, { useState, useEffect, useRef } from 'react';
import { format, addMinutes, differenceInMinutes, isSameDay, startOfDay } from 'date-fns';
import { dayNames, parseTime, totalDuration, DAY_COLUMN_HEIGHT, AGENDA_START, getColorByType } from '../utils/agendaUtils';
import { createPlageHoraire } from '../utils/scheduleUtils';
import { Phone } from 'lucide-react';

const HEADER_HEIGHT = 60;

const DayColumn = ({
  daySchedule,
  date,
  onSlotClick,
  onReservedClick,
  appointments,
  practiceFilter,
  isSelected,
  onOpenCreateAppointment,
  refreshSchedule
}) => {
  const [multiSelectStart, setMultiSelectStart] = useState(null);
  const [multiSelectCurrent, setMultiSelectCurrent] = useState(null);
  const [finalMultiSelectRange, setFinalMultiSelectRange] = useState(null);

  const tooltipRef = useRef(null);
  const hoverBlockRef = useRef(null);
  const animationFrameId = useRef(null);

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
        const startTime = multiSelectStart < multiSelectCurrent ? multiSelectStart : multiSelectCurrent;
        const endTime = multiSelectStart < multiSelectCurrent ? multiSelectCurrent : multiSelectStart;
        const formattedDate = format(date, 'dd-MM-yyyy');
        const formattedStart = format(startTime, 'HH:mm');
        const formattedEnd = format(endTime, 'HH:mm');
        try {
          createPlageHoraire(formattedDate, formattedStart, formattedEnd);
          if (typeof refreshSchedule === 'function') {
            refreshSchedule();
          }
        } catch (error) {
          alert(error.message);
        }
        setFinalMultiSelectRange({ start: startTime, end: endTime });
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

  const totalIntervals = 24 * 4; // 96 intervalles de 15 min

  const throttledHandleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const target = e.currentTarget;
    if (animationFrameId.current) return;
    animationFrameId.current = requestAnimationFrame(() => {
      animationFrameId.current = null;
      const rect = target.getBoundingClientRect();
      const offsetY = clientY - rect.top;
      const offsetX = clientX - rect.left;
      const blockHeight = contentHeight / totalIntervals;
      const blockIndex = Math.floor(offsetY / blockHeight);
      const newTimeMinutes = Math.round((offsetY / contentHeight) * totalDuration / 15) * 15;
      const baseTime = parseTime(AGENDA_START);
      const agendaStartDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        baseTime.getHours(),
        baseTime.getMinutes()
      );
      const newTime = addMinutes(agendaStartDate, newTimeMinutes);
      
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${offsetX + 5}px`;
        tooltipRef.current.style.top = `${offsetY + HEADER_HEIGHT + 10}px`;
        tooltipRef.current.innerText = format(newTime, 'HH:mm');
        tooltipRef.current.style.display = 'block';
      }
      
      if (hoverBlockRef.current) {
        const blockTop = blockIndex * blockHeight;
        hoverBlockRef.current.style.top = `${blockTop + HEADER_HEIGHT}px`;
        hoverBlockRef.current.style.height = `${blockHeight}px`;
        hoverBlockRef.current.style.display = 'block';
      }
      
      if (multiSelectStart) {
        setMultiSelectCurrent(newTime);
      }
    });
  };

  const handleMouseLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
    if (hoverBlockRef.current) {
      hoverBlockRef.current.style.display = 'none';
    }
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

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="relative border-r h-full bg-gray-200" style={{ height: `${DAY_COLUMN_HEIGHT}px` }}>
      {/* Info-bulle gérée par ref */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '2px 5px',
          borderRadius: '4px',
          fontSize: '10px',
          pointerEvents: 'none',
          zIndex: 100,
          display: 'none',
        }}
        className='ml-10'
      />
      {/* Bloc de surbrillance lors du hover */}
      <div
        ref={hoverBlockRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundColor: '#BCE2D326',
          pointerEvents: 'none',
          zIndex: 50,
          display: 'none',
        }}
        className="rounded-lg"
      />
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
        onMouseMove={isSelectable ? throttledHandleMouseMove : undefined}
        onMouseLeave={isSelectable ? handleMouseLeave : undefined}
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
          
          return (
            <div
              key={idx}
              className={`absolute ${isSelectable && !isSlotPast ? 'cursor-pointer bg-white' : ''} ${!isSelectable ? 'bg-gray-300' : ''}`}
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
              {/* Affichage des appointments correspondant à la date de la colonne */}
              {appointments
                .filter(app => {
                  // On compare la date de l'appointment et celle de la colonne (format dd-MM-yyyy)
                  if (format(new Date(app.date), 'dd-MM-yyyy') !== format(date, 'dd-MM-yyyy')) {
                    return false;
                  }
                  // On vérifie que l'heure de début de la pratique se trouve dans le slot courant
                  const appStart = parseTime(app.practice_start);
                  const sStart = parseTime(slot.start);
                  const sEnd = parseTime(slot.end);
                  return appStart >= sStart && appStart < sEnd && (practiceFilter.tous || practiceFilter[app.practice_type]);
                })
                .map((appointment, pIdx) => {
                  const appointmentStart = parseTime(appointment.practice_start);
                  const appointmentEnd = parseTime(appointment.practice_end);
                  const practiceStartFormatted = format(appointmentStart, 'HH:mm');
                  const practiceEndFormatted = format(appointmentEnd, 'HH:mm');
                  const pOffset = (differenceInMinutes(appointmentStart, slotStart) / differenceInMinutes(slotEnd, slotStart)) * 100;
                  const pHeight = (differenceInMinutes(appointmentEnd, appointmentStart) / differenceInMinutes(slotEnd, slotStart)) * 100;
                  return (
                    <div
                      key={pIdx}
                      className="absolute cursor-pointer border-2 rounded-md text-center hover:bg-gray-200 transition-colors duration-200"
                      style={{
                        top: `${pOffset}%`,
                        height: `${pHeight}%`,
                        left: 0,
                        right: 0,
                        borderColor: getColorByType(appointment.practice_type),
                        color: getColorByType(appointment.practice_type),
                        backgroundColor: `${getColorByType(appointment.practice_type)}10`,
                        borderRadius: "4px"
                      }}
                      title={`${appointment.practice_type} (${practiceStartFormatted} - ${practiceEndFormatted}) Réservé`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReservedClick && onReservedClick(appointment);
                      }}
                    >
                      <div className="ml-2 absolute inset-0 flex flex-col items-start justify-start mb-2 text-xs bg-gray-150 bg-opacity-50 overflow-hidden">
                        <div className="flex items-center justify-between pr-2 mt-1 gap-1 w-full">
                          <div className="font-tsy-bold text-[10px]">{practiceStartFormatted} - {practiceEndFormatted}</div>
                        </div>
                        <div className="w-[1/2] items-center justify-center rounded-md flex text-white text-[10px] px-2" style={{ backgroundColor: getColorByType(appointment.practice_type) }}>
                          {appointment.practice_type}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px]">
                          {appointment.genre} {appointment.prenom} {appointment.nom}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px]">
                          {format(new Date(appointment.date), 'dd-MM-yyyy')}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              
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
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  );
                }
                return null;
              })()}
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

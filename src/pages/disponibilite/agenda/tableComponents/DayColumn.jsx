import React, { useState, useEffect, useRef } from 'react';
import { 
  format, 
  addMinutes, 
  differenceInMinutes, 
  isSameDay, 
  startOfDay, 
  parse 
} from 'date-fns';
import { 
  dayNames, 
  parseTime, 
  totalDuration, 
  DAY_COLUMN_HEIGHTW, 
  AGENDA_START 
} from '../utils/agendaUtils';
import { createPlageHoraire } from '../utils/scheduleUtils';
import { Phone } from 'lucide-react';
import BASE_URL from '@/pages/config/baseurl';
import AppointmentCountBadge from './badgs/AppointmentCountBadge';

// Fonction utilitaire pour formater une date en toute sécurité
const safeFormat = (dateValue, dateFormat) => {
  const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return !isNaN(d.getTime()) ? format(d, dateFormat) : '';
};

// Fonction qui découpe un intervalle [start, end] en segments d'une durée donnée (en minutes)
const splitSegmentByDuration = (start, end, durationMinutes) => {
  const segments = [];
  let current = start;
  while (current < end) {
    let next = addMinutes(current, durationMinutes);
    if (next > end) {
      next = end;
    }
    segments.push({ start: current, end: next });
    current = next;
  }
  return segments;
};

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
  refreshSchedule,
  selectedPractice 
}) => {
  // Récupération des pratiques depuis l'API OU le localStorage
  const [practices, setPractices] = useState([]);
  useEffect(() => {
    const localPractices = localStorage.getItem('practices');
    if (localPractices) {
      setPractices(JSON.parse(localPractices));
    } else {
      fetch(`${BASE_URL}/practices`)
        .then(res => res.json())
        .then(data => {
          setPractices(data);
          localStorage.setItem('practices', JSON.stringify(data));
        })
        .catch(err => console.error("Erreur lors du fetch des pratiques", err));
    }
  }, []);

  // Retourne la couleur associée à la pratique (comparaison en minuscules)
  const getColorByPractice = (practiceType) => {
    const practice = practices.find(p => p.nom_discipline.toLowerCase() === practiceType.toLowerCase());
    return practice ? practice.code_couleur : '#000000'; // couleur par défaut
  };

  // Pratique active (passée en prop)
  const activePractice = selectedPractice;

  // States et refs pour la gestion de la multi-sélection et du tooltip
  const [multiSelectStart, setMultiSelectStart] = useState(null);
  const [multiSelectCurrent, setMultiSelectCurrent] = useState(null);
  const [finalMultiSelectRange, setFinalMultiSelectRange] = useState(null);
  const tooltipRef = useRef(null);
  const hoverBlockRef = useRef(null);
  const animationFrameId = useRef(null);

  const slots = daySchedule ? daySchedule.timeSlots || [] : [];
  const contentHeight = DAY_COLUMN_HEIGHTW - HEADER_HEIGHT;
  const now = new Date();
  const isToday = isSameDay(date, now);
  // Pour les dates passées, on rend le jour non-sélectionnable (et n'affiche pas les dispos)
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

  // Gestion du clic sur le fond pour créer une plage horaire
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
      (isToday && clickedTime < now)
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
        const formattedDate = safeFormat(date, 'dd-MM-yyyy');
        const formattedStart = safeFormat(startTime, 'HH:mm');
        const formattedEnd = safeFormat(endTime, 'HH:mm');
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
      const formattedDate = safeFormat(date, 'dd-MM-yyyy');
      const formattedTime = safeFormat(clickedTime, 'HH:mm');
      onOpenCreateAppointment(formattedDate, formattedTime);
      console.log('a verifier');
    }
  };

  // Gestion du clic sur un slot spécifique
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
    const formattedTime = safeFormat(newTime, 'HH:mm');
    onSlotClick(daySchedule, slotIndex, sourceType, {
      ...clickedSlot,
      start: formattedTime
    });
  };

  const totalIntervals = 24 * 4; // 96 intervalles de 15 minutes

  // Gestion du mouvement de la souris pour le tooltip et le bloc de survol
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
        tooltipRef.current.innerText = safeFormat(newTime, 'HH:mm');
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
    <div className="relative border-r h-full bg-gray-200" style={{ height: `${DAY_COLUMN_HEIGHTW}px` }}>
      {/* Tooltip */}
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
        <p className="font-bold text-lg text-start">{safeFormat(date, 'dd')}</p>
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
            isSlotPast = slotEndDate < now;
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
              {/* Rendez-vous réservés */}
              {appointments
                .filter(app => {
                  const appDate = parse(app.date, 'dd-MM-yyyy', new Date());
                  if (safeFormat(appDate, 'dd-MM-yyyy') !== safeFormat(date, 'dd-MM-yyyy')) {
                    return false;
                  }
                  const appStart = parseTime(app.practice_start);
                  const sStart = parseTime(slot.start);
                  const sEnd = parseTime(slot.end);
                  const practiceTypeKey = app.practice_type.toLowerCase();
                  return appStart >= sStart && appStart < sEnd && (practiceFilter.tous || practiceFilter[practiceTypeKey]);
                })
                .map((appointment, pIdx) => {
                  const appointmentStart = parseTime(appointment.practice_start);
                  const appointmentEnd = parseTime(appointment.practice_end);
                  const practiceStartFormatted = safeFormat(appointmentStart, 'HH:mm');
                  const practiceEndFormatted = safeFormat(appointmentEnd, 'HH:mm');
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
                        borderColor: getColorByPractice(appointment.practice_type),
                        color: getColorByPractice(appointment.practice_type),
                        backgroundColor: `${getColorByPractice(appointment.practice_type)}10`,
                        borderRadius: "4px"
                      }}
                      title={`${appointment.practice_type} (${practiceStartFormatted} - ${practiceEndFormatted}) Réservé`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReservedClick && onReservedClick(appointment);
                      }}
                    >
                      <AppointmentCountBadge patientId={appointment.patient_id}/>
                      <div className="ml-2 absolute inset-0 flex flex-col items-start justify-start mb-2 text-xs bg-gray-150 bg-opacity-50 overflow-hidden">
                        <div className="flex items-center justify-between pr-2 mt-1 gap-1 w-full">
                          <div className="font-tsy-bold text-[10px]">{practiceStartFormatted} - {practiceEndFormatted}</div>
                        </div>
                        <div className="w-[1/2] items-center justify-center rounded-md flex text-white text-[10px] px-2" style={{ backgroundColor: getColorByPractice(appointment.practice_type) }}>
                          {appointment.practice_type}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px] mt-1">
                          {appointment.numero}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px]">
                          {appointment.genre} {appointment.prenom} {appointment.nom}
                        </div>
                        <div className="w-full gap-1 font-bold text-left text-[10px]">
                          {safeFormat(parse(appointment.date, 'dd-MM-yyyy', new Date()), 'dd-MM-yyyy')}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
              {/* Affichage des disponibilités pour la pratique sélectionnée uniquement si la date est aujourd'hui ET future */}
              {activePractice && isSelectable && (() => {
                const sStart = parseTime(slot.start);
                const sEnd = parseTime(slot.end);
                // Filtrer les rendez-vous dans le slot
                const appointmentsInSlot = appointments.filter(app => {
                  const appDate = parse(app.date, 'dd-MM-yyyy', new Date());
                  if (safeFormat(appDate, 'dd-MM-yyyy') !== safeFormat(date, 'dd-MM-yyyy')) return false;
                  const appStart = parseTime(app.practice_start);
                  return appStart >= sStart && appStart < sEnd;
                }).sort((a, b) => parseTime(a.practice_start) - parseTime(b.practice_start));

                let freeSegments = [];
                let current = sStart;
                appointmentsInSlot.forEach(app => {
                  const appStart = parseTime(app.practice_start);
                  const appEnd = parseTime(app.practice_end);
                  if (appStart > current) {
                    freeSegments.push({ start: current, end: appStart });
                  }
                  current = appEnd > current ? appEnd : current;
                });
                if (current < sEnd) {
                  freeSegments.push({ start: current, end: sEnd });
                }
                
                // Si la date est aujourd'hui, on ajuste le début des segments si besoin
                if (isToday) {
                  freeSegments = freeSegments
                    .map(seg => {
                      // Si le segment se termine avant maintenant, on ne le garde pas
                      if (seg.end <= now) return null;
                      // Si le segment commence avant maintenant, on ajuste son début à now
                      if (seg.start < now) {
                        return { start: now, end: seg.end };
                      }
                      return seg;
                    })
                    .filter(seg => seg !== null);
                }
                
                // Récupérer la durée en minutes de la pratique sélectionnée
                const practiceObj = practices.find(p => p.nom_discipline.toLowerCase() === activePractice.toLowerCase());
                const durationMinutes = practiceObj ? Math.round(practiceObj.duree * 60) : 60;
                
                let splittedSegments = [];
                freeSegments.forEach(seg => {
                  splittedSegments = splittedSegments.concat(splitSegmentByDuration(seg.start, seg.end, durationMinutes));
                });

                return splittedSegments.map((seg, index) => {
                  // Si le segment est complètement dans le passé, on ne l'affiche pas
                  if (isToday && seg.end <= now) return null;
                  const segStartOffset = (differenceInMinutes(seg.start, sStart) / differenceInMinutes(sEnd, sStart)) * 100;
                  const segHeight = (differenceInMinutes(seg.end, seg.start) / differenceInMinutes(sEnd, sStart)) * 100;
                  return (
                    <div key={index}
                      style={{
                        position: 'absolute',
                        top: `${segStartOffset}%`,
                        height: `${segHeight}%`,
                        left: 0,
                        right: 0,
                        border: `2px solid ${getColorByPractice(activePractice)}`,
                        boxSizing: 'border-box',
                        pointerEvents: 'none',
                        borderRadius: '2px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '1px',
                        lineHeight: 1,
                        color: 'gray',
                        marginTop:'5px'
                      }}>
                        {safeFormat(seg.start, 'HH:mm')} - {safeFormat(seg.end, 'HH:mm')}
                      </span>
                    </div>
                  );
                });
              })()}
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

// /src/components/Agenda/DayView.jsx
import { format, parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { mergeConsecutiveSlots, getDurationInMinutes, getColorByType } from "./utils/calendarUtils";
import { Timer, UserCheck, PhoneCall, Notebook } from "lucide-react";

const DayView = ({
  workDaysData,
  currentDate,
  slotsData,
  handleSlotClick,
  selectedTypes,
  selectedTimeRanges,
  setSelectedPractice,
  setIsAppointmentDialogOpen
}) => {
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  const currentDay = format(currentDate, "EEEE", { locale: fr }).toLowerCase();
  const dayAvailable = workDaysData;
  const isDayAvailable = dayAvailable.includes(currentDay);
  const currentDaySlots = slotsData.find(slot => isSameDay(parseISO(slot.date), currentDate))?.slots || [];

  if (!isDayAvailable) return null;

  // Rendu des créneaux fusionnés pour une heure donnée
  const renderMergedSlots = (pratiques, dayStart, totalMinutes) => {
    const merged = mergeConsecutiveSlots(
      pratiques.map(p => {
        const [startHour, startMinute] = p.start.split(":").map(Number);
        const duration = getDurationInMinutes(p.type);
        return {
          start: startHour * 60 + startMinute,
          end: startHour * 60 + startMinute + duration,
          type: p.type,
          appointments: p.appointments || []
        };
      })
    );

    return merged.map((slot, index) => {
      const startMinutes = slot.start - dayStart;
      const endMinutes = slot.end - dayStart;
      const top = (startMinutes / totalMinutes) * 100;
      const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
      return (
        <div
          key={index}
          className="absolute w-full rounded-sm border cursor-pointer"
          style={{
            top: `${top}%`,
            height: `${height}%`,
            backgroundColor: getColorByType(slot.type),
            opacity: 0.8,
            zIndex: 1,
            overflow: "hidden"
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (slot.appointments && slot.appointments.length > 0) {
              alert("Déjà réservé");
              return;
            }
            setSelectedPractice({
              start: `${Math.floor(slot.start / 60)}:${(slot.start % 60)
                .toString()
                .padStart(2, "0")}`,
              end: `${Math.floor(slot.end / 60)}:${(slot.end % 60)
                .toString()
                .padStart(2, "0")}`,
              type: slot.type,
              date: format(currentDate, "yyyy-MM-dd")
            });
            setIsAppointmentDialogOpen(true);
          }}
        >
          {slot.appointments.map((appointment, i) => (
            <div
              key={i}
              className="bg-transparent flex flex-row items-center justify-between gap-6 w-full px-10  h-full  rounded text-xs"
            >
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[15px] font text-[#1B1D22FF]">
                <Timer/> {appointment.start} - {appointment.end}
              </div>
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[15px] font text-[#1B1D22FF]">
                <UserCheck/> {appointment.name} ({appointment.age} ans)
              </div>
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[15px] font text-[#1B1D22FF]">
                <PhoneCall/> {appointment.telephone}</div>
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[15px] font text-[#1B1D22FF]">
                <Notebook/> {appointment.motif}</div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="border p-4 h-[730px]">
      <h3 className="font-bold">
        {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
      </h3>
      <table className="w-full h-full">
        <tbody>
          {hours.map((hour) => {
            const isSlot = currentDaySlots.some(
              (slot) => hour >= slot.start && hour < slot.end
            );
            // Récupérer toutes les pratiques pour l'heure (créneau) concerné
            const pratiques = currentDaySlots.flatMap((slot) =>
              slot.pratiques.filter((p) => {
                const [startHour, startMinute] = p.start.split(":").map(Number);
                const duration = getDurationInMinutes(p.type);
                const pStart = startHour * 60 + startMinute;
                const pEnd = pStart + duration;
                const slotStart = hour * 60;
                const slotEnd = (hour + 1) * 60;
                return pStart < slotEnd && pEnd > slotStart;
              })
            );
            // Filtrer selon les cases cochées (types et plages horaires)
            const filteredPratiques = pratiques.filter((p) => {
              const [startHour] = p.start.split(":").map(Number);
              const isTypeMatch =
                selectedTypes.includes("all") || selectedTypes.includes(p.type);
              const isTimeMatch =
                selectedTimeRanges.includes("all") ||
                selectedTimeRanges.some((range) => {
                  if (range === "morning") return startHour >= 8 && startHour < 12;
                  if (range === "afternoon") return startHour >= 12 && startHour < 18;
                  return false;
                });
              return isTypeMatch && isTimeMatch;
            });
            return (
              <tr key={hour} className="h-12 border-b">
                <td className="w-16 text-right pr-2">{`${hour}:00`}</td>
                <td
                  className="border p-1 relative"
                  style={{
                    backgroundColor: isSlot
                        ? "white"
                        : "rgba(59, 130, 246, 0.1)"
                  }}
                  onClick={() => {
                    const slot = currentDaySlots.find(
                      (s) => hour >= s.start && hour < s.end
                    );
                    if (slot) {
                      handleSlotClick(format(currentDate, "yyyy-MM-dd"), slot);
                    }
                  }}
                >
                  <div className="absolute inset-0">
                    {renderMergedSlots(filteredPratiques, hour * 60, 60)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DayView;

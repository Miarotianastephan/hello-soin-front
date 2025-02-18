// /src/components/Agenda/WeekView.jsx
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { mergeConsecutiveSlots, getDurationInMinutes, getColorByType } from "./utils/calendarUtils";
import { Timer, UserCheck, PhoneCall, Notebook } from "lucide-react";

const WeekView = ({
  workDaysData,
  currentDate,
  slotsData,
  handleSlotClick,
  selectedTypes,
  selectedTimeRanges,
  setSelectedPractice,
  setIsAppointmentDialogOpen
}) => {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  const dayAvailable = workDaysData;

  // Rendu des créneaux fusionnés pour un jour (cellule) de la vue semaine
  const renderMergedSlots = (pratiques, dayStart, totalMinutes, cellDate) => {
    const merged = mergeConsecutiveSlots(
      pratiques.map((p) => {
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
              date: format(cellDate, "yyyy-MM-dd")
            });
            setIsAppointmentDialogOpen(true);
          }}
        >
          {slot.appointments.map((appointment, i) => (
            <div
              key={i}
              className="bg-transparent flex flex-col items-start justify-center gap-3 w-full p-1 m-1 rounded text-xs"
            >
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[12px] font text-[#1B1D22FF]">
                <UserCheck/> {appointment.name} ({appointment.age} ans)
              </div>
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[12px] font text-[#1B1D22FF]">
                <Timer/> {appointment.start} - {appointment.end}
              </div>
              {/* <div className="flex flex-row items-center justify-center h-full gap-2 text-[12px] font text-[#1B1D22FF]">
                <PhoneCall/> {appointment.telephone}</div> */}
              <div className="flex flex-row items-center justify-center h-full gap-2 text-[12px] font text-[#1B1D22FF]">
                <Notebook/> {appointment.motif}</div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="overflow-x-auto h-[730px]">
      <table className="w-full h-full">
        <thead>
          <tr>
            <th className="w-16"></th>
            {weekDays.map((day) => {
              const dayName = format(day, "EEEE", { locale: fr }).toLowerCase();
              const isDayAvailable = dayAvailable.includes(dayName);
              return (
                <th
                  key={day.toString()}
                  className="text-center p-2 border"
                  style={{ display: isDayAvailable ? "table-cell" : "none" }}
                >
                  {format(day, "EEEE d", { locale: fr })}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour} className="h-12 border-b ">
              <td className="w-16 text-right pr-2 border-r">{`${hour}:00`}</td>
              {weekDays.map((day) => {
                const dayName = format(day, "EEEE", { locale: fr }).toLowerCase();
                const isDayAvailable = dayAvailable.includes(dayName);
                const daySlots = slotsData.find((slot) =>
                  isSameDay(parseISO(slot.date), day)
                )?.slots || [];
                const isSlot = daySlots.some(
                  (slot) => hour >= slot.start && hour < slot.end
                );
                // Récupérer toutes les pratiques pour l'heure de ce jour
                const pratiques = daySlots.flatMap((slot) =>
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
                // Filtrer selon les cases cochées
                const filteredPratiques = pratiques.filter((p) => {
                  const [startHour] = p.start.split(":").map(Number);
                  const isTypeMatch =
                    selectedTypes.includes("all") ||
                    selectedTypes.includes(p.type);
                  const isTimeMatch =
                    selectedTimeRanges.includes("all") ||
                    selectedTimeRanges.some((range) => {
                      if (range === "morning")
                        return startHour >= 8 && startHour < 12;
                      if (range === "afternoon")
                        return startHour >= 12 && startHour < 18;
                      return false;
                    });
                  return isTypeMatch && isTimeMatch;
                });
                return (
                  <td
                    key={day.toString()}
                    className="border p-1 relative"
                    style={{
                      display: isDayAvailable ? "table-cell" : "none",
                      backgroundColor: isSlot
                        ? "white"
                        : "rgba(59, 130, 246, 0.1)"
                    }}
                    onClick={() =>
                      isSlot &&
                      handleSlotClick(format(day, "yyyy-MM-dd"), daySlots.find((s) => hour >= s.start && hour < s.end))
                    }
                  >
                    <div className="flex absolute inset-0 justify-center items-center">
                      {renderMergedSlots(filteredPratiques, hour * 60, 60, day)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekView;

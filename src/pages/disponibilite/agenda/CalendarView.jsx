// /src/components/Agenda/CalendarView.jsx

import {
    format,
    startOfWeek,
    startOfMonth,
    eachDayOfInterval,
    endOfMonth,
    isSameDay,
    subMonths,
    addMonths
  } from "date-fns";
  import { fr } from "date-fns/locale";
  import { Button } from "@/components/ui/button";
  import { ChevronLeft, ChevronRight } from "lucide-react";
  
  
  const CalendarView = ({ currentDate, setCurrentDate, onDateSelect }) => {
    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const dayAvailable = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "dimanche"];
  
    return (
      <div className="border-2 p-2">
        <div className="flex justify-between items-center mb-2">
          <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="bg-[#0B2839FF]"><ChevronLeft /></Button>
          <span>{format(currentDate, "MMMM yyyy", { locale: fr })}</span>
          <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="bg-[#0B2839FF]"><ChevronRight /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["L", "Ma", "Mer", "Je", "Ve", "Sa", "Di"].map(day => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
          {days.map(day => {
            const dayName = format(day, "EEEE", { locale: fr }).toLowerCase();
            const isDayAvailable = dayAvailable.includes(dayName);
            return (
              <div
                key={day.toString()}
                className={`text-center p-1 rounded-lg ${isSameDay(day, currentDate) ? "bg-[#0B2839FF] text-white" : ""} ${isDayAvailable ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed opacity-50"}`}
                onClick={() => isDayAvailable && onDateSelect(day)}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default CalendarView;
  
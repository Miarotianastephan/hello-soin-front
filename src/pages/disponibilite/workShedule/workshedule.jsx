import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, PlusCircle, Save } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "../../../App.css"

dayjs.locale("fr");

const WorkSchedule = ({ selectedDates, availability, setAvailability }) => {
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const addTimeSlot = (dateKey) => {
    setAvailability((prev) => {
      const existingSlots = prev[dateKey] || [];
      const lastSlotEnd = existingSlots.length ? existingSlots[existingSlots.length - 1].end : "08:00";
      const nextStartIndex = timeSlots.indexOf(lastSlotEnd);
      const nextEndIndex = nextStartIndex + 1;

      if (nextEndIndex >= timeSlots.length) return prev;

      return {
        ...prev,
        [dateKey]: [...existingSlots, { start: timeSlots[nextStartIndex], end: timeSlots[nextEndIndex] }],
      };
    });
  };

  const updateTimeSlot = (dateKey, index, key, value) => {
    setAvailability((prev) => {
      const updatedSlots = [...prev[dateKey]];
      const newSlot = { ...updatedSlots[index], [key]: value };

      // Vérifier si le nouveau créneau chevauche un autre créneau
      const isOverlapping = updatedSlots.some((slot, i) => {
        if (i === index) return false;
        return (
          (newSlot.start >= slot.start && newSlot.start < slot.end) ||
          (newSlot.end > slot.start && newSlot.end <= slot.end) ||
          (newSlot.start <= slot.start && newSlot.end >= slot.end)
        );
      });

      if (isOverlapping) {
        alert("Les créneaux horaires ne peuvent pas se chevaucher.");
        return prev;
      }

      updatedSlots[index] = newSlot;
      return { ...prev, [dateKey]: updatedSlots };
    });
  };

  const removeTimeSlot = (dateKey, index) => {
    setAvailability((prev) => {
      const updatedSlots = prev[dateKey].filter((_, i) => i !== index);
      return { ...prev, [dateKey]: updatedSlots };
    });
  };

  // Fonction pour vérifier si une date est passée
  const isDatePassed = (dateKey) => {
    return dayjs(dateKey).isBefore(dayjs(), "day");
  };

  return (
    <div className="space-y-6 h-[400px] overflow-y-auto scrollbar-custom">
      <div className="flex justify-between items-center pb-3 border-b border-gray-300">
        <h3 className="text-xl font-semibold text-blue-600">Jours de travail Praticien</h3>
        <Button className="flex items-center gap-2 ml-10">
          <Save size={18} /> Enregistrer
        </Button>
      </div>

      {[...selectedDates]
        .sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())
        .filter(dateKey => !isDatePassed(dateKey)) // Filtrer les dates passées
        .map((dateKey) => (
          <div key={dateKey} className="pb-4 border-b border-gray-300 mt-4 lg:mt-0 ">
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3">
              {/* Date Column */}
              <h4 className="text-lg font-medium text-gray-800">
                {dayjs(dateKey).format("DD MMM YYYY (ddd)")}
              </h4>
              
              {/* Time Slots Column */}
              <div className="space-y-2 w-full">
                {(availability[dateKey] || []).map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 flex-wrap lg:flex-nowrap w-full">
                    <Select value={slot.start} onValueChange={(value) => updateTimeSlot(dateKey, index, "start", value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Début" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} disabled={time >= slot.end}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>-</span>
                    <Select value={slot.end} onValueChange={(value) => updateTimeSlot(dateKey, index, "end", value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.filter((time) => time > slot.start).map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="icon" className="ml-auto" onClick={() => removeTimeSlot(dateKey, index)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Add Button Column */}
              <Button variant="outline" className="flex items-center gap-2" onClick={() => addTimeSlot(dateKey)}>
                <PlusCircle size={18} /> Ajouter une disponibilité
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default WorkSchedule;
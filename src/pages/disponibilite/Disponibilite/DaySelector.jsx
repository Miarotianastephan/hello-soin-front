// components/Disponibilite/DaySelector.jsx
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { daysOfWeek, defaultSelectedDays } from "../utils/constants";

export const DaySelector = ({ selectedDays, toggleDay }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && defaultSelectedDays.length > 0) {
      defaultSelectedDays.forEach((day) => { // si la valeur par defaut est non vide
        if (!selectedDays.includes(day)) {
          toggleDay(day);
        }
      });
      setInitialized(true);
      console.log("Valeur par defaut ajouter")
    }
  }, [initialized, selectedDays, toggleDay]);

  return (
    <div className="w-full flex flex-row gap-x-4 border-t-2 border-b-2 p-5">
      {daysOfWeek.map((day) => (
        <div key={day} className="flex items-center gap-x-2">
          <Checkbox
            id={day}
            checked={selectedDays.includes(day)}
            onCheckedChange={() => toggleDay(day)}
          />
          <label htmlFor={day} className="text-sm font-medium">
            {day}
          </label>
        </div>
      ))}
    </div>
  );
  
};

// components/Disponibilite/TimeSlotManager.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { heures } from "../utils/constants";
import { Trash, CalendarClock, PlusCircle } from "lucide-react";

export const TimeSlotManager = ({ day, slots, addTimeSlot, deleteTimeSlot, handleAddPratique, updateTimeSlot }) => {
  const [showPratiques, setShowPratiques] = useState({});

  const togglePratiques = (index) => {
    setShowPratiques((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full border-b pb-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold w-1/3 ">{day}</h3>
        <div className="w-1/3 ">
          {slots.map((slot, index) => (
            <div key={index} className="flex flex-col gap-2 mt-2 items-center w-[80%] ">
              <div className="flex gap-2 items-center">
                <Select value={String(slot.start)} onValueChange={(val) => updateTimeSlot(day, index, "start", val)}>
                  <SelectTrigger className="w-20">{slot.start}h</SelectTrigger>
                  <SelectContent>
                    {heures.map((h) => (
                      <SelectItem key={h} value={String(h)} disabled={h < (index > 0 ? slots[index - 1].end : 8)}>
                        {h}h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>à</span>
                <Select value={String(slot.end)} onValueChange={(val) => updateTimeSlot(day, index, "end", val)}>
                  <SelectTrigger className="w-20">{slot.end}h</SelectTrigger>
                  <SelectContent>
                    {heures.slice(1).map((h) => (
                      <SelectItem key={h} value={String(h)} disabled={h <= slot.start}>
                        {h}h
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={() => deleteTimeSlot(day, index)}>
                  <Trash />
                  Supprimer
                </Button>
                <Button onClick={() => handleAddPratique(day, index)}>
                  <PlusCircle />
                  Ajouter Pratique
                </Button>
                <Button onClick={() => togglePratiques(index)} className="bg-green-700">
                  <CalendarClock />
                  {slot.pratiques.length}
                </Button>
              </div>
              {showPratiques[index] && (
                <div className="ml-4">
                  {slot.pratiques.map((pratique, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-2">
                      <span>{pratique.type} : {pratique.start}h - {pratique.end}h</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="w-1/3 flex justify-end">
          <Button variant="outline" onClick={() => addTimeSlot(day)}>
            + Ajouter plage
          </Button>
        </div>
      </div>
    </div>
  );
};
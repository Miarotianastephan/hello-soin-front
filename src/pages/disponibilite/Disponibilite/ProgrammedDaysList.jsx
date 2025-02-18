import React, { useState } from "react";
import { Trash, CalendarClock, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ProgrammedDaysList = ({ 
  programmedDays, 
  onDeleteDay, 
  onDeleteSlot,
  onEditPratique 
}) => {
  const [searchDate, setSearchDate] = useState("");

  const filteredDays = searchDate
    ? programmedDays.filter(day => day.date.toISOString().split('T')[0] === searchDate)
    : programmedDays;

  return (
    <div className="mt-4 w-full overflow-y-auto max-h-[600px]">
      <div className="flex justify-between border-b pb-4 items-center">
        <span className="font-bold">Liste des créneaux à venir</span>
        <div className="flex items-center gap-4 w-[50%] mr-5">
          <Input 
            type="date" 
            value={searchDate} 
            onChange={(e) => setSearchDate(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button>
            <Save />
            Enregistrer
          </Button>
          <Button onClick={() => onEditPratique(day.date, slotIndex)} className="bg-green-700">
              <CalendarClock className="w-4 h-4 text-white" />
              Gerer les crenaux
          </Button>
        </div>
      </div>
      <ul className="w-full">
        {filteredDays.map((day, index) => (
          <li key={index} className="mb-4 w-full">
            <div className="flex justify-between items-center font-semibold text-gray-900 bg-gray-100 p-2 px-5">
              <span>{day.day} {day.date.toLocaleDateString()}</span>
              <button 
                onClick={() => onDeleteDay(day.date)}
                className="underline ml-5 hover:text-red-700"
              >
                <span>Supprimer la date</span>
              </button>
            </div>
            <ul className="w-full">
              {day.slots.map((slot, slotIndex) => (
                <li key={slotIndex} className="flex w-full border-b py-2">
                  <div className="w-1/4 text-center font-medium">
                    {slot.start}h - {slot.end}h
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-2">
                      {slot.pratiques.map((pratique, pIndex) => (
                        <li key={pIndex} className="flex justify-between rounded-lg">
                          <span className="w-3/4">
                            {pratique.type} : {pratique.start}h - {pratique.end}h
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-1/4 flex justify-center space-x-3">
                    <Button 
                      variant="ghost" 
                      className="bg-red-700 hover:bg-red-800 text-white"
                      onClick={() => onDeleteSlot(day.date, slotIndex)}
                    >
                      <Trash className="w-5 h-5 text-white" />
                      Supprimer
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
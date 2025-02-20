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

  const handleSave = () => {
    const formattedData = programmedDays.map(day => ({
      date: day.date,
      day: day.day,
      slots: day.slots.map(slot => ({
        start: slot.start,
        end: slot.end,
        pratiques: slot.pratiques.map(pratique => ({
          start: pratique.start,
          type: pratique.type,
          date: day.date,
          appointments: pratique.appointments ? pratique.appointments.map(appointment => ({
            name: appointment.name,
            age: appointment.age,
            telephone: appointment.telephone,
            motif: appointment.motif,
            start: appointment.start,
            end: appointment.end
          })) : []
        }))
      }))
    }));
  
    console.log(JSON.stringify(formattedData, null, 2));
    
    // Stockage dans localStorage
    try {
      localStorage.setItem("programmedDays", JSON.stringify(formattedData));
      const data = localStorage.getItem("programmedDays")
      console.log(`data saved : ${data}`)
    } catch (error) {
      console.log(error)
    }
  };
  

  const filteredDays = searchDate
    ? programmedDays.filter(day => day.date === searchDate)
    : programmedDays;

  return (
    <div className="mt-4 w-full overflow-y-auto max-h-[600px]">
      <div className="flex items-center justify-between pb-4 border-b">
        <span className="font-bold">Liste des créneaux à venir</span>
        <div className="flex items-center gap-4 w-[50%] mr-5">
          <Input 
            type="date" 
            value={searchDate} 
            onChange={(e) => setSearchDate(e.target.value)}
            className="px-2 py-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSave}>
            <Save />
            Enregistrer
          </Button>
        </div>
      </div>
      <ul className="w-full">
        {filteredDays.map((day, index) => (
          <li key={index} className="w-full mb-4">
            <div className="flex items-center justify-between p-2 px-5 font-semibold text-gray-900 bg-gray-100">
              <span>{day.day} {new Date(day.date).toLocaleDateString()}</span>
              <button 
                onClick={() => onDeleteDay(day.date)}
                className="ml-5 underline hover:text-red-700"
              >
                <span>Supprimer la date</span>
              </button>
            </div>
            <ul className="w-full">
              {day.slots.map((slot, slotIndex) => (
                <li key={slotIndex} className="flex w-full py-2 border-b">
                  <div className="w-1/4 font-medium text-center">
                    {slot.start}h - {slot.end}h
                  </div>
                  <div className="w-1/2">
                    <ul className="space-y-2">
                      {slot.pratiques.map((pratique, pIndex) => (
                        <li key={pIndex} className="flex justify-between rounded-lg">
                          <span className="w-3/4">
                            {pratique.type} : {pratique.start}h - {pratique.end || ""}h
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center w-1/4 space-x-3">
                    <Button 
                      variant="ghost" 
                      className="text-white bg-red-700 hover:bg-red-800"
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
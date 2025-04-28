import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour le format en français

const SlotSelector = ({ availability, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);  // Pour garder la trace du créneau sélectionné

  useEffect(() => {
    // Par défaut, sélectionne le premier jour et le premier créneau
    const firstDate = Object.keys(availability)[0];
    const firstSlot = availability[firstDate][0];
    setSelectedDate(firstDate);
    setSelectedSlot(firstSlot);
    onSlotSelect({ date: firstDate, ...firstSlot });  // Envoie la première sélection de créneau
  }, [availability]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);  // Réinitialiser le créneau sélectionné lorsque la date change
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);  // Met à jour le créneau sélectionné
    onSlotSelect({ date: selectedDate, ...slot });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy (EEEE)", { locale: fr });
  };

  return (
    <div className="space-y-4 z-50">
      <div>
        <CardContent className="space-y-4">
          {Object.entries(availability).map(([date, slots]) => (
            <div key={date} className="border-b-2">
              <Button
                variant={selectedDate === date ? "default" : "outline"}
                onClick={() => handleDateClick(date)}
                className="w-full justify-start text-left font-normal border-0 shadow-none"
              >
                {formatDate(date)}
              </Button>
              
              {selectedDate === date && (
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot === slot ? "default" : "secondary"}  // Change de couleur si sélectionné
                      onClick={() => handleSlotClick(slot)}
                      className={`justify-start text-sm ${selectedSlot === slot ? 'bg-green-500 text-white' : 'border-2 bg-white'} mb-2 ml-2`}  // Couleur pour le créneau sélectionné
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </div>
    </div>
  );
};

export default SlotSelector;
  
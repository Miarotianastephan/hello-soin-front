import React, { useState } from 'react';
import SlotSelector from './selector/selector';
import PracticeScheduler from './practiseSheduler/practiseSheduler';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, Save } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const initialAvailability = {
  "2025-02-03": [
    { start: "08:00", end: "12:00" },
    { start: "13:00", end: "17:00" },
  ],
  "2025-02-21": [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
  ],
};

// Données factices pour initialiser l'état
const initialScheduledPractices = {
  "2025-02-03": [
    { start: "13:00", type: "naturopathie", date: "2025-02-03" },
    { start: "16:00", type: "acuponcture", date: "2025-02-03" },
    { start: "15:01", type: "acuponcture", date: "2025-02-03" },
    { start: "10:00", type: "naturopathie", date: "2025-02-03" },
  ],
};

const Crenaux = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scheduledPractices, setScheduledPractices] = useState(initialScheduledPractices);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSchedule = (practice) => {
    if (!selectedSlot) return;

    setScheduledPractices((prev) => {
      const date = selectedSlot.date;
      return {
        ...prev,
        [date]: [...(prev[date] || []), { ...practice, date }],
      };
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy (EEEE)", { locale: fr });
  };

  const handleSave = () => {
    console.log("Dernières pratiques planifiées :", scheduledPractices);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
        <h3 className="text-green-600 font-bold flex items-center"> 
          <Clock className="h-6 w-6 text-green-600 mr-2" /> 
          Sélectionner le jour et l'horaire
        </h3>
        <Button className="text-white hover:bg-green-800 flex items-center gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Enregistrer
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <SlotSelector availability={initialAvailability} onSlotSelect={handleSlotSelect} />
        </div>
        <div style={{ flex: 1 }}>
          <PracticeScheduler 
            selectedSlot={selectedSlot} 
            scheduledPractices={scheduledPractices} 
            onSchedule={handleSchedule} 
            onDeletePractice={(date, index) => {
              setScheduledPractices((prev) => ({
                ...prev,
                [date]: prev[date].filter((_, i) => i !== index),
              }));
            }}
          />
        </div>
      </div>

      <div>
        <div className="space-y-2 p-4">
          {Object.keys(scheduledPractices).length === 0 ? (
            <p className="text-gray-500">Aucune pratique planifiée.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Heure Début</th>
                  <th className="border border-gray-300 p-2">Pratique</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(scheduledPractices).map(([date, practices]) =>
                  practices.map((practice, index) => (
                    <tr key={`${date}-${index}`} className="border border-gray-300">
                      <td className="border border-gray-300 p-2">{formatDate(practice.date)}</td>
                      <td className="border border-gray-300 p-2">{practice.start}</td>
                      <td className="border border-gray-300 p-2 font-medium">{practice.type}</td>
                      <td className="border border-gray-300 p-2">
                        <Button className="text-white bg-green-700 hover:bg-green-800">Voir Agenda</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crenaux;

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, PlusCircle, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour le format en français
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Assurez-vous d'importer Card si nécessaire

const PracticeScheduler = ({ selectedSlot, onSchedule, scheduledPractices, onDeletePractice}) => {


  const [practices, setPractices] = useState(scheduledPractices); // Initialisation avec les données factices
  const [startTime, setStartTime] = useState('');
  const [practiceType, setPracticeType] = useState('');
  const [view, setView] = useState('form'); // 'form' ou 'graph'
  const [graphStartTime, setGraphStartTime] = useState(null);

  const colors = {
    naturopathie: "bg-green-800",
    acupuncture: "bg-blue-800",
    hypnose: "bg-yellow-800"
  };

  const getDurationInMinutes = (type) => {
    switch (type) {
      case 'naturopathie':
        return 120;
      case 'acupuncture':
        return 120;
      case 'hypnose': 
        return 120;
      default:
        return 0;
    }
  };

  const handleAddPractice = () => {
    if (!startTime || !practiceType || !selectedSlot) return;

    const duration = getDurationInMinutes(practiceType);
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(start.getTime() + duration * 60000);

    const slotStart = new Date(`1970-01-01T${selectedSlot.start}:00`);
    const slotEnd = new Date(`1970-01-01T${selectedSlot.end}:00`);

    if (start < slotStart || end > slotEnd) {
      alert("L'heure de début ou la durée dépasse le créneau sélectionné.");
      return;
    }

    const selectedDatePractices = practices[selectedSlot.date] || [];

    const overlap = selectedDatePractices.some(practice => {
      const practiceStart = new Date(`1970-01-01T${practice.start}:00`);
      const practiceEnd = new Date(practiceStart.getTime() + getDurationInMinutes(practice.type) * 60000);
      return (start < practiceEnd && end > practiceStart);
    });

    if (overlap) {
      alert("Il y a un chevauchement avec une pratique déjà planifiée pour cette date.");
      return;
    }

    const newPractice = { start: startTime, type: practiceType };
    setPractices({
      ...practices,
      [selectedSlot.date]: [...selectedDatePractices, newPractice]
    });
    onSchedule({ date: selectedSlot.date, ...newPractice });
    setStartTime('');
    setPracticeType('');
    setGraphStartTime(null); // Réinitialiser l'heure sélectionnée sur le graphique
  };

  const handleDeletePractice = (date, index) => {
    onDeletePractice(date, index); 
    setPractices({
      ...practices,
      [date]: practices[date].filter((_, i) => i !== index)
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy (EEEE)", { locale: fr });
  };

  const handleGraphClick = (event) => {
    if (!selectedSlot) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const totalWidth = rect.width;
    const slotStart = new Date(`1970-01-01T${selectedSlot.start}:00`).getTime();
    const slotEnd = new Date(`1970-01-01T${selectedSlot.end}:00`).getTime();
    const slotDuration = slotEnd - slotStart;
    const clickedTime = new Date(slotStart + (clickX / totalWidth) * slotDuration);

    const formattedTime = format(clickedTime, 'HH:mm');
    setStartTime(formattedTime);
    setGraphStartTime(formattedTime);
  };

  const renderGraph = () => {
    if (!selectedSlot) return null;
  
    const slotStart = new Date(`1970-01-01T${selectedSlot.start}:00`);
    const slotEnd = new Date(`1970-01-01T${selectedSlot.end}:00`);
    const slotDuration = slotEnd - slotStart;
  
    return (
      <div className="relative h-12 w-full bg-gray-200 rounded-md cursor-pointer" onClick={handleGraphClick}>
        {practices[selectedSlot.date]?.map((practice, index) => {
          const practiceStart = new Date(`1970-01-01T${practice.start}:00`);
          const practiceEnd = new Date(practiceStart.getTime() + getDurationInMinutes(practice.type) * 60000);
  
          // Vérifier si la pratique est dans la plage horaire sélectionnée
          if (practiceStart >= slotStart && practiceEnd <= slotEnd) {
            const startOffset = ((practiceStart - slotStart) / slotDuration) * 100;
            const width = ((practiceEnd - practiceStart) / slotDuration) * 100;
  
            return (
              <div
                key={index}
                className={`absolute h-full ${colors[practice.type]} rounded-md`}
                style={{ left: `${startOffset}%`, width: `${width}%` }}
              />
            );
          } else {
            // Masquer les pratiques qui ne sont pas dans la plage horaire sélectionnée
            return null;
          }
        })}
        {graphStartTime && (
          <div
            className="absolute h-full bg-blue-500 opacity-50"
            style={{
              left: `${((new Date(`1970-01-01T${graphStartTime}:00`) - slotStart) / slotDuration) * 100}%`,
              width: '2px'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 mb-6 border-l-2 pl-8 pr-2">
      {selectedSlot && (
        <div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <nav className="flex space-x-4">
                <Button variant={view === 'form' ? 'default' : 'outline'} onClick={() => setView('form')}>
                  Formulaire
                </Button>
                <Button variant={view === 'graph' ? 'default' : 'outline'} onClick={() => setView('graph')}>
                  Graphique
                </Button>
              </nav>
              <div className="text-lg font-medium text-center">
                {formatDate(selectedSlot.date)}
              </div>
              <div className="text-sm text-green-600 text-center font-bold">
                {`${selectedSlot.start} à ${selectedSlot.end}`}
              </div>
            </div>
          </div>

          <CardContent className="space-y-4">
            {view === 'form' ? (
              <div className="flex items-center gap-4 mt-5">
                <div className="flex-1 space-y-2">
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="flex-1 space-y-2">
                  <Select value={practiceType} onValueChange={setPracticeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pratique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="naturopathie">Naturopathie (2h)</SelectItem>
                      <SelectItem value="acupuncture">Acupuncture (30 min)</SelectItem>
                      <SelectItem value="hypnose">Hypnose (1h 15min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddPractice} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter une pratique
                </Button>
              </div>
            ) : (
              <div>
                {renderGraph()}
                <div className="flex items-center gap-4 mt-5">
                  <div className="fle space-y-2">
                    <p className="flex items-center"><Clock className='mr-2'/>{startTime}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Select value={practiceType} onValueChange={setPracticeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pratique" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="naturopathie">Naturopathie (2h)</SelectItem>
                        <SelectItem value="acupuncture">Acupuncture (30 min)</SelectItem>
                        <SelectItem value="hypnose">Hypnose (1h 15min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddPractice} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md">
                    <PlusCircle className="h-4 w-4" />
                    Ajouter une pratique
                  </Button>
                </div>
              </div>
            )}

            <ul className="space-y-2">
              {practices[selectedSlot.date]?.map((practice, index) => (
                <div className='flex justify-between items-center' key={index}>
                  <li className={`flex justify-between w-full mr-2 p-2 rounded-md border-2`}>
                    <span>{practice.start}</span>
                    <span>{getDurationInMinutes(practice.type)} min</span>
                    <span>{practice.type}</span>
                  </li>
                  <Button variant="destructive" className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md" size="sm" onClick={() => handleDeletePractice(selectedSlot.date, index)}>
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              ))}
            </ul>
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default PracticeScheduler;
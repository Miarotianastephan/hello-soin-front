import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';
import { parseTime } from '../utils/agendaUtils';

const AppointmentDetails = ({ practiceDialog, onStartChange, setPracticeDialog }) => {
  // Récupérer la liste des pratiques depuis l'API
  const [practices, setPractices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8888/api/practices')
      .then(response => response.json())
      .then(data => setPractices(data))
      .catch(error => console.error('Erreur lors de la récupération des pratiques : ', error));
  }, []);

  const selectedDate = practiceDialog.date
    ? format(parse(practiceDialog.date, 'dd-MM-yyyy', new Date()), 'EEEE d MMMM yyyy', { locale: fr })
    : 'Date non sélectionnée';

  // Mettre la première lettre en majuscule
  const formattedDate = selectedDate.charAt(0).toUpperCase() + selectedDate.slice(1);

  // Fonction de mise à jour de l'heure de fin en se basant sur l'heure de début et la durée.
  // Si aucune durée n'est renseignée, on utilise 20 minutes par défaut.
  const updateEndTime = (start, duration) => {
    const effectiveDuration = duration || 20;
    if (start && effectiveDuration) {
      const parsedStart = parseTime(start);
      const newEndDate = new Date(parsedStart.getTime() + parseInt(effectiveDuration, 10) * 60000);
      return format(newEndDate, 'HH:mm'); // Conserver le format HH:mm pour l'UI
    }
    return '';
  };

  // Gestion du changement du type de rendez‑vous et mise à jour de la durée par défaut
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    const selectedPractice = practices.find(practice => practice.nom_discipline === selectedType);
    const defaultDuration = selectedPractice ? Math.round(parseFloat(selectedPractice.duree) * 60) : 20;
    
    setPracticeDialog(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        type: selectedType,
        duration: defaultDuration,
        end: updateEndTime(prev.newPractice.start, defaultDuration),
        id_pratique: selectedPractice ? selectedPractice.id_pratique : null
      }
    }));
  };
  

  return (
    <>
      <DialogDescription className="flex items-center justify-start gap-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <p>Date</p>
        </div>
        <div className="flex items-center justify-between border gap-2 p-1 rounded-md text-xs h-[30px] font-bold text-gray-700">
          {formattedDate}
          <Calendar size={15} />
        </div>
      </DialogDescription>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row w-full justify-between items-center gap-6">
          <label className="w-1/2 text-xs font-bold text-gray-700">
            Type de rendez‑vous
            <select
              value={practiceDialog.newPractice.type}
              onChange={handleTypeChange}
              className="border p-1 rounded w-full mt-1 h-[30px]"
              required
            >
              <option value="">Sélectionner</option>
              {practices.map(practice => (
                <option key={practice.id_pratique} value={practice.nom_discipline}>
                  {practice.nom_discipline}
                </option>
              ))}
            </select>
          </label>
          
          <label className="w-1/4 text-xs font-bold text-gray-700">
            Heure de début
            <input
              type="time"
              value={practiceDialog.newPractice.start}
              onChange={(e) => {
                const start = e.target.value;
                const parsed = parseTime(start);
                const minTime = parseTime(practiceDialog.parentSlot.start);
                const maxTime = parseTime(practiceDialog.parentSlot.end);
                
                if (parsed >= minTime && parsed <= maxTime) {
                  setPracticeDialog(prev => ({
                    ...prev,
                    newPractice: {
                      ...prev.newPractice,
                      start,
                      end: updateEndTime(start, prev.newPractice.duration)
                    }
                  }));
                }
              }}
              className="border p-1 rounded w-full mt-1 h-[30px]"
              required
              step="900"
              min={practiceDialog.parentSlot?.start}
              max={practiceDialog.parentSlot?.end}
            />
          </label>

          <label className="w-1/4 text-xs font-bold text-gray-700">
            Durée <span className="font-normal">(minute)</span>
            <input
              type="number"
              value={practiceDialog.newPractice.duration}
              onChange={(e) => {
                const duration = e.target.value;
                setPracticeDialog(prev => ({
                  ...prev,
                  newPractice: {
                    ...prev.newPractice,
                    duration,
                    end: updateEndTime(prev.newPractice.start, duration)
                  }
                }));
              }}
              className="border p-1 rounded w-full mt-1 h-[30px]"
              placeholder="minutes"
              min="15"
              step="15"
              required
            />
          </label>
        </div>
        {practiceDialog.newPractice.error && (
          <span className="text-red-500 text-sm">{practiceDialog.newPractice.error}</span>
        )}
      </div>
    </>
  );
};

export default AppointmentDetails;

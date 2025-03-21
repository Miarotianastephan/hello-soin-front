import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';
import { parseTime } from '../utils/agendaUtils';
import BASE_URL from '@/pages/config/baseurl';

const AppointmentDetails = ({ practiceDialog, onStartChange, setPracticeDialog, durationPractice, idPractice }) => {
  // Récupérer la liste des pratiques depuis l'API
  const [practices, setPractices] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/practices`)
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
  const updateEndTime = (start, duration) => {
    const effectiveDuration = duration || 20;
    if (start && effectiveDuration) {
      const parsedStart = parseTime(start);
      const newEndDate = new Date(parsedStart.getTime() + parseInt(effectiveDuration, 10) * 60000);
      return format(newEndDate, 'HH:mm'); // format HH:mm pour l'UI
    }
    return '';
  };

  // Gestion du changement du type de rendez‑vous (pour modification manuelle)
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    const selectedPracticeObj = practices.find(practice => practice.nom_discipline === selectedType);
    const defaultDuration = selectedPracticeObj ? Math.round(parseFloat(selectedPracticeObj.duree) * 1) : 20;
    
    setPracticeDialog(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        type: selectedType,
        duration: defaultDuration,
        end: updateEndTime(prev.newPractice.start, defaultDuration),
        id_pratique: selectedPracticeObj ? selectedPracticeObj.id_pratique : null
      }
    }));
  };

  // Si aucune pratique fixe n'est définie (idPractice vide) et aucun type n'est sélectionné,
  // on sélectionne par défaut la première pratique de la liste.
 // Mettre à jour l'effet pour les pratiques fixes
useEffect(() => {
  if (idPractice && !practiceDialog.newPractice.type) {
    const fixedPractice = practices.find(practice => practice.id_pratique === idPractice);
    
    // Ajouter cette vérification cruciale
    if (!fixedPractice) return; // ⚠️ Bloque si la pratique n'existe pas

    setPracticeDialog(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        id_pratique: idPractice, // ✅ Garantit l'ID même si fixedPractice est undefined
        type: fixedPractice?.nom_discipline || '',
        duration: durationPractice ? Math.round(durationPractice * 1) : 20,
        end: updateEndTime(prev.newPractice.start, durationPractice)
      }
    }));
  }
}, [idPractice, durationPractice, practices]);

  // Si une pratique fixe est fournie (idPractice et durationPractice), on fixe automatiquement le formulaire.
  useEffect(() => {
    if (idPractice && !practiceDialog.newPractice.type) {
      // On recherche l'objet pratique correspondant à idPractice
      const fixedPractice = practices.find(practice => practice.id_pratique === idPractice);
      // Si durationPractice est fournie en heures, on la convertit en minutes
      const defaultDuration = durationPractice ? Math.round(durationPractice * 1)
        : (fixedPractice ? Math.round(parseFloat(fixedPractice.duree) * 1) : 20);
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: {
          ...prev.newPractice,
          type: fixedPractice ? fixedPractice.nom_discipline : '',
          duration: defaultDuration,
          end: updateEndTime(prev.newPractice.start, defaultDuration),
          id_pratique: idPractice
        }
      }));
    }
  }, [idPractice, durationPractice, practiceDialog.newPractice.type, practices, setPracticeDialog]);

  return (
    <>
      <DialogDescription className="flex items-center justify-start gap-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <p>Date du</p>
        </div>
        <div className="flex items-center justify-between border gap-2 p-1 rounded-md text-xs h-[35px] font-bold text-gray-700">
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
              className="border p-1 rounded w-full mt-1 h-[35px]"
              required
              disabled={!!idPractice}  // Désactivation si une pratique fixe est fournie
            >
              {idPractice ? (
                <option value={practiceDialog.newPractice.type}>
                  {practiceDialog.newPractice.type}
                </option>
              ) : (
                <>
                  <option value="">Sélectionner</option>
                  {practices.map(practice => (
                    <option key={practice.id_pratique} value={practice.nom_discipline}>
                      {practice.nom_discipline}
                    </option>
                  ))}
                </>
              )}
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
              className="border p-1 rounded w-full mt-1 h-[35px]"
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
              className="border p-1 rounded w-full mt-1 h-[35px]"
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

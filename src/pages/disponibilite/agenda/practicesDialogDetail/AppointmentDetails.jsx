import React from 'react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { DialogDescription } from '@/components/ui/dialog';
import { parseTime } from '../utils/agendaUtils';

const AppointmentDetails = ({ practiceDialog, onTypeChange, onStartChange, setPracticeDialog }) => {
    const selectedDate = practiceDialog.date
      ? format(parse(practiceDialog.date, 'dd-MM-yyyy', new Date()), 'EEEE d MMMM yyyy', { locale: fr })
      : 'Date non sélectionnée';
  
    // Capitalize first letter of formatted date
    const formattedDate = selectedDate.charAt(0).toUpperCase() + selectedDate.slice(1);

    // Handler pour la synchronisation durée/fin
    const updateEndTime = (start, duration) => {
      if (start && duration) {
        const parsedStart = parseTime(start);
        const newEndDate = new Date(parsedStart.getTime() + parseInt(duration, 10) * 60000);
        return format(newEndDate, 'HH:mm');
      }
      return '';
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
              Type de rendez-vous
              <select
                value={practiceDialog.newPractice.type}
                onChange={onTypeChange}
                className="border p-1 rounded w-full mt-1 h-[30px]"
                required
              >
                <option value="naturopathie">Naturopathie</option>
                <option value="acuponcture">Acuponcture</option>
                <option value="hypnose">Hypnose</option>
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
              Durée
              <input
                type="number"
                value={practiceDialog.newPractice.duration || ''}
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
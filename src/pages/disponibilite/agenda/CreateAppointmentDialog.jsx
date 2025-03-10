import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import PatientForm from './practicesDialogDetail/PatientForm';
import AppointmentDetails from './practicesDialogDetail/AppointmentDetails';
import { parseTime, isValidTime, addMinutes } from './utils/agendaUtils';

const CreateAppointmentDialog = ({
  isOpen,
  onClose,
  fakePatients,
  currentDate,
  onSave,
  initialDate,
  initialStartTime,
}) => {
  const getDefaultDate = () => {
    try {
      if (initialDate && isValid(parse(initialDate, 'dd-MM-yyyy', new Date()))) {
        return initialDate;
      }
      return format(currentDate, 'dd-MM-yyyy');
    } catch {
      return format(currentDate, 'dd-MM-yyyy');
    }
  };

  const [formData, setFormData] = useState({
    date: getDefaultDate(),
    newPractice: {
      type: 'naturopathie',
      start: initialStartTime || '08:00',
      duration: '60',
      end: '09:00',
      motif: '',
    },
    selectedPatientId: '',
    isNewPatient: false,
    newPatient: {},
    error: ''
  });

  const updateEndTime = (start, duration) => {
    if (start && duration) {
      const parsedStart = parseTime(start);
      return format(addMinutes(parsedStart, parseInt(duration, 10)), 'HH:mm');
    }
    return '';
  };

  // Formatage de la date pour l'affichage
  const formattedDate = () => {
    try {
      const parsedDate = parse(formData.date, 'dd-MM-yyyy', new Date());
      if (!isValid(parsedDate)) return 'Date invalide';
      
      const formatted = format(parsedDate, 'EEEE d MMMM yyyy', { locale: fr });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return 'Date invalide';
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        end: updateEndTime(prev.newPractice.start, prev.newPractice.duration)
      }
    }));
  }, [formData.newPractice.start, formData.newPractice.duration]);

  // Mise à jour initiale quand les props changent
  useEffect(() => {
    if (initialDate && initialStartTime) {
      const endTime = format(
        addMinutes(parseTime(initialStartTime), 60),
        'HH:mm'
      );
      
      setFormData(prev => ({
        ...prev,
        date: initialDate,
        newPractice: {
          ...prev.newPractice,
          start: initialStartTime,
          duration: '60',
          end: endTime
        }
      }));
    }
  }, [initialDate, initialStartTime]);

  const handleSave = () => {
    let patient;
    if (formData.isNewPatient) {
      const requiredFields = ['prenom', 'nom', 'email', 'numero', 'mobile', 'dateNaissance'];
      if (requiredFields.some(field => !formData.newPatient[field])) {
        setFormData(prev => ({ ...prev, error: 'Informations patient incomplètes' }));
        return;
      }
      const newId = Math.max(...fakePatients.map(p => parseInt(p.id))) + 1;
      patient = { ...formData.newPatient, id: newId.toString() };
      // Mise à jour du localStorage des patients pour un nouveau patient
      const updatedFakePatients = [...fakePatients, patient];
      localStorage.setItem('fakedatauser', JSON.stringify(updatedFakePatients));
    } else {
      if (!formData.selectedPatientId) {
        setFormData(prev => ({ ...prev, error: 'Patient non sélectionné' }));
        return;
      }
      patient = fakePatients.find(p => p.id === formData.selectedPatientId);
    }
    
    // Validation du rendez‑vous
    if (!formData.newPractice.motif) {
      setFormData(prev => ({ ...prev, error: 'Le motif est obligatoire' }));
      return;
    }
    
    // Création de l'objet rendez‑vous
    const appointmentKey = `${formData.date}_${formData.newPractice.start}_${formData.newPractice.end}_${formData.newPractice.type}`;
    const newAppointment = {
      key: appointmentKey,
      date: formData.date,
      practice: {
        ...formData.newPractice,
        patient
      }
    };
    
    // Sauvegarde dans le localStorage des appointments
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Mise à jour du planning (localStorage "planning")
    const planningStr = localStorage.getItem('planning');
    let planning = {};
    if (planningStr) {
      try {
        const parsed = JSON.parse(planningStr);
        planning = (parsed && typeof parsed === 'object') ? parsed : {};
      } catch (error) {
        console.error('Erreur lors du parsing du planning', error);
      }
    }
    planning.datesWithSlots = planning.datesWithSlots || [];
    
    const dateEntryIndex = planning.datesWithSlots.findIndex(entry => entry.date === formData.date);
    const newPracticeWithPatient = { ...formData.newPractice, patient };
    if (dateEntryIndex !== -1) {
      // Si la date existe déjà, vérifier si le créneau (start/end) existe
      const timeSlotIndex = planning.datesWithSlots[dateEntryIndex].timeSlots.findIndex(
        slot => slot.start === formData.newPractice.start && slot.end === formData.newPractice.end
      );
      if (timeSlotIndex !== -1) {
        planning.datesWithSlots[dateEntryIndex].timeSlots[timeSlotIndex].practices.push(newPracticeWithPatient);
      } else {
        planning.datesWithSlots[dateEntryIndex].timeSlots.push({
          start: formData.newPractice.start,
          end: formData.newPractice.end,
          practices: [newPracticeWithPatient]
        });
      }
    } else {
      // Créer une nouvelle entrée pour la date
      planning.datesWithSlots.push({
        date: formData.date,
        timeSlots: [{
          start: formData.newPractice.start,
          end: formData.newPractice.end,
          practices: [newPracticeWithPatient]
        }]
      });
    }
    localStorage.setItem('planning', JSON.stringify(planning));
    
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Nouveau rendez‑vous</h3>
          
          <div className="text-sm text-gray-600">
            {formattedDate()} - Créneau : {formData.newPractice.start} à {formData.newPractice.end}
          </div>

          <AppointmentDetails
            practiceDialog={{
              ...formData,
              parentSlot: { start: formData.newPractice.start, end: formData.newPractice.end }
            }}
            setPracticeDialog={setFormData}
            onTypeChange={(e) => setFormData(prev => ({
              ...prev,
              newPractice: { ...prev.newPractice, type: e.target.value }
            }))}
            onStartChange={(e) => setFormData(prev => ({
              ...prev,
              newPractice: { ...prev.newPractice, start: e.target.value }
            }))}
          />
          <PatientForm
            practiceDialog={formData}
            setPracticeDialog={setFormData}
            fakePatients={fakePatients}
          />

          {formData.error && <div className="text-red-500 text-sm">{formData.error}</div>}

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 text-white">
              <Save className="mr-2" /> Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;

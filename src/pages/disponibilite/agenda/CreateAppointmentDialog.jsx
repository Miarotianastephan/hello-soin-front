import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import PatientForm from './practicesDialogDetail/PatientForm';
import AppointmentDetails from './practicesDialogDetail/AppointmentDetails';
import { parseTime, addMinutes } from './utils/agendaUtils';
import BASE_URL from '@/pages/config/baseurl';

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

  // On fixe ici praticien_id à 3
  const [formData, setFormData] = useState({
    date: getDefaultDate(),
    newPractice: {
      type: '',
      start: initialStartTime || '08:00',
      duration: '60',
      end: '09:00',
      motif: '',
      isNewPatient: false,
      newPatient: {},
      praticien_id: 3,  // Fixe praticien_id à 3
      id_pratique: 1,   // ID de la pratique (à adapter selon votre contexte)
    },
    selectedPatientId: '',
    error: ''
  });

  const updateEndTime = (start, duration) => {
    if (start && duration) {
      const parsedStart = parseTime(start);
      return format(addMinutes(parsedStart, parseInt(duration, 10)), 'HH:mm');
    }
    return '';
  };

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

  const createFakeUser = async () => {
    try {
      // Utilisation de newPractice.newPatient pour récupérer les données du nouveau patient
      const response = await fetch(`${BASE_URL}/utilisateurs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.newPractice.newPatient)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du patient');
      }

      const data = await response.json();
      if (!data.id) throw new Error('Erreur: ID patient manquant');

      return data.id;
    } catch (err) {
      setFormData(prev => ({ ...prev, error: err.message }));
      return null;
    }
  };

  const handleSave = async () => {
    let fakeUserId = formData.selectedPatientId || null;

    // Si le mode nouveau patient est activé et qu'aucun patient existant n'est sélectionné
    if (!fakeUserId && formData.newPractice.isNewPatient) {
      const newPatientId = await createFakeUser();
      if (!newPatientId) {
        setFormData(prev => ({ ...prev, error: 'Impossible de créer le patient' }));
        return;
      }
      fakeUserId = newPatientId;
      setFormData(prev => ({ ...prev, selectedPatientId: newPatientId }));
    }

    const appointmentKey = `${formData.date}_${formData.newPractice.start}_${formData.newPractice.end}_${formData.newPractice.type}`;

    // Construction du payload en incluant tous les champs obligatoires
    const appointmentPayload = {
      appointment_key: appointmentKey,
      date: formData.date,
      slot_index: 0,
      motif: formData.newPractice.motif,
      fake_user_id: parseInt(fakeUserId, 10),
      praticien_id: 3,
      id_pratique: formData.newPractice.id_pratique,
      practice: {
        type: formData.newPractice.type,
        start: formData.newPractice.start,
        end: formData.newPractice.end
      }
    };

    try {
      const response = await fetch(`${BASE_URL}/appointmentWithSlot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormData(prev => ({ ...prev, error: errorData.error || "Erreur lors de la création de l'appointment" }));
        return;
      }

      onSave();
      onClose();
    } catch (err) {
      setFormData(prev => ({ ...prev, error: err.message }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <div className="flex flex-col gap-4">
         <div className="text-sm text-gray-600">
             Ouverture de {formData.newPractice.start} à {formData.newPractice.end}
          </div>

          <AppointmentDetails
            practiceDialog={formData}
            setPracticeDialog={setFormData}
            onTypeChange={(e) =>
              setFormData(prev => ({
                ...prev,
                newPractice: { ...prev.newPractice, type: e.target.value }
              }))
            }
            onStartChange={(e) =>
              setFormData(prev => ({
                ...prev,
                newPractice: { ...prev.newPractice, start: e.target.value }
              }))
            }
          />

          <PatientForm
            practiceDialog={formData}
            setPracticeDialog={setFormData}
            fakePatients={fakePatients}
          />

          {formData.error && (
            <div className="text-red-500 text-sm">{formData.error}</div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#0f2b3d] text-white">
              <Save className="mr-2" /> Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;

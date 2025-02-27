// src/components/Agenda/AppointmentDialog.js
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const AppointmentDialog = ({
  appointmentDialog,
  setAppointmentDialog,
  onAddAppointment,
  fakePatients
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = fakePatients.filter(patient =>
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={appointmentDialog.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setAppointmentDialog({
            isOpen: false,
            daySchedule: null,
            slotIndex: null,
            practice: null,
            appointmentKey: '',
            selectedPatientId: '',
            motif: '',
            error: ''
          });
        }
      }}
    >
      <DialogContent className="w-2/3 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ajouter Rendez‑vous</DialogTitle>
          <DialogDescription>
            Pratique : {appointmentDialog.practice?.type} (
            {appointmentDialog.practice?.start} - {appointmentDialog.practice?.end})
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <DialogDescription className="flex items-center justify-between">
            <p className="w-full">Sélectionner un patient :</p>
            <div className="w-full flex items-center justify-end">
              <Filter />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-1 rounded ml-2"
                placeholder="Filtrer par : Nom, Prénom ou N° de téléphone"
              />
            </div>
          </DialogDescription>

          <div className="mt-2 max-h-40 overflow-y-auto border p-2">
            {filteredPatients.length === 0 ? (
              <p>Aucun patient trouvé.</p>
            ) : (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`cursor-pointer p-1 ${
                    appointmentDialog.selectedPatientId === patient.id ? 'bg-blue-100' : ''
                  } border-b-2 flex items-center hover:bg-gray-200`}
                  onClick={() =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      selectedPatientId: patient.id,
                      error: '',
                    }))
                  }
                >
                  <div className="font-bold text-left flex-1 truncate">
                    {patient.prenom}
                  </div>
                  <DialogDescription className="text-left flex-1 truncate">
                    {patient.numero}
                  </DialogDescription>
                  <DialogDescription className="text-left flex-1 truncate">
                    {patient.adresse}
                  </DialogDescription>
                  <DialogDescription className="text-right flex-1">
                    {patient.age} ans
                  </DialogDescription>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
            Motif (obligatoire)
          </label>
          <input
            id="motif"
            type="text"
            value={appointmentDialog.motif || ''}
            onChange={(e) =>
              setAppointmentDialog(prev => ({
                ...prev,
                motif: e.target.value
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Remplir motif"
            required
          />
        </div>

        {appointmentDialog.error && (
          <p className="text-red-500">{appointmentDialog.error}</p>
        )}

        <DialogFooter>
          <Button onClick={onAddAppointment} disabled={!appointmentDialog.motif}>
            Ajouter Rendez‑vous
          </Button>
          <Button
            onClick={() =>
              setAppointmentDialog({
                isOpen: false,
                daySchedule: null,
                slotIndex: null,
                practice: null,
                appointmentKey: '',
                selectedPatientId: '',
                motif: '',
                error: ''
              })
            }
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;

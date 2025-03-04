import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const AppointmentDialog = ({
  appointmentDialog,
  setAppointmentDialog,
  onAddAppointment,
  fakePatients
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de formatage du numéro de téléphone (ex: "06 11 22 33 44")
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 10);
    return digits.match(/.{1,2}/g)?.join(' ') || '';
  };

  // Filtrer les patients existants selon le terme de recherche
  const filteredPatients = fakePatients.filter(patient =>
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de l'ajout de rendez‑vous
  const handleAddAppointment = () => {
    if (appointmentDialog.isNewPatient) {
      // Validation des champs obligatoires pour le nouveau patient
      const { newPatient } = appointmentDialog;
      if (
        !newPatient?.prenom ||
        !newPatient?.nom ||
        !newPatient?.email ||
        !newPatient?.numero ||
        !newPatient?.age ||
        !newPatient?.genre ||
        !newPatient?.adresse
      ) {
        setAppointmentDialog(prev => ({
          ...prev,
          error: "Tous les champs du patient sont obligatoires."
        }));
        return;
      }
      // Vérifier que le numéro contient exactement 10 chiffres (sans espaces)
      const phoneDigits = newPatient.numero.replace(/\s/g, '');
      if (phoneDigits.length !== 10) {
        setAppointmentDialog(prev => ({
          ...prev,
          error: "Le numéro de téléphone doit contenir 10 chiffres."
        }));
        return;
      }
      // Générer un ID pour le nouveau patient et l'ajouter à fakePatients
      const newPatientId = Date.now();
      const patientToAdd = { id: newPatientId, ...newPatient };
      fakePatients.push(patientToAdd);

      // Mettez à jour l'état en assignant directement le nouveau patient au rendez‑vous
      setAppointmentDialog(prev => ({
        ...prev,
        selectedPatientId: newPatientId,
        error: ''
      }));

      // Appeler onAddAppointment en passant l'ID du nouveau patient
      onAddAppointment(newPatientId);
    } else {
      // Pour un patient existant, vérifier qu'une sélection a été faite
      if (!appointmentDialog.selectedPatientId) {
        setAppointmentDialog(prev => ({
          ...prev,
          error: "Veuillez sélectionner un patient existant."
        }));
        return;
      }
      onAddAppointment(appointmentDialog.selectedPatientId);
    }
  };

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
            isNewPatient: false,
            newPatient: {},
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

        {/* Choix entre création d'un nouveau patient et sélection d'un patient existant */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={appointmentDialog.isNewPatient || false}
              onChange={(e) =>
                setAppointmentDialog((prev) => ({
                  ...prev,
                  isNewPatient: e.target.checked,
                  selectedPatientId: ''
                }))
              }
            />
            <span className="ml-2">Nouveau patient</span>
          </label>
        </div>

        {appointmentDialog.isNewPatient ? (
          // Formulaire de création d'un nouveau patient
          <div className="mb-4 border p-2">
            <DialogDescription>Créer un nouveau patient :</DialogDescription>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={appointmentDialog.newPatient?.prenom || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, prenom: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Prénom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={appointmentDialog.newPatient?.nom || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, nom: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={appointmentDialog.newPatient?.email || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, email: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  value={appointmentDialog.newPatient?.numero || ''}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, numero: formatted }
                    }));
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="06 11 22 33 44"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Âge</label>
                <input
                  type="number"
                  value={appointmentDialog.newPatient?.age || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, age: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Âge"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  value={appointmentDialog.newPatient?.genre || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, genre: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  value={appointmentDialog.newPatient?.adresse || ''}
                  onChange={(e) =>
                    setAppointmentDialog((prev) => ({
                      ...prev,
                      newPatient: { ...prev.newPatient, adresse: e.target.value }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Adresse"
                  required
                />
              </div>
            </div>
          </div>
        ) : (
          // Sélection d'un patient existant via la recherche
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
                        error: ''
                      }))
                    }
                  >
                    <div className="font-bold text-left flex-1 truncate">
                      {patient.prenom}
                    </div>
                    <div className="text-left flex-1 truncate">
                      {patient.numero}
                    </div>
                    <div className="text-left flex-1 truncate">
                      {patient.adresse}
                    </div>
                    <div className="text-right flex-1">
                      {patient.age} ans
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
            Motif
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Entrez le motif du rendez‑vous"
          />
        </div>

        {appointmentDialog.error && (
          <p className="text-red-500">{appointmentDialog.error}</p>
        )}

        <DialogFooter>
          <Button onClick={handleAddAppointment}>Ajouter Rendez‑vous</Button>
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
                isNewPatient: false,
                newPatient: {},
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
  
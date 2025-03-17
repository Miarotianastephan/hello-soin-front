  import React, { useState } from 'react';
  import { DialogDescription } from '@/components/ui/dialog';
  import NewPatientForm from './NewPatientForm';
  import ExistingPatientSearch from './ExistingPatientSearch';
  import ExistingPatientDisplay from './ExistingPatientDisplay';

  const PatientForm = ({ practiceDialog, setPracticeDialog, fakePatients }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Fonction de normalisation pour la recherche
    const normalize = (str) => str.toLowerCase().replace(/\s/g, '');

    const filteredPatients =
      searchTerm.trim() === ''
        ? []
        : fakePatients.filter(
            (patient) =>
              normalize(patient.prenom).includes(normalize(searchTerm)) ||
              normalize(patient.nom).includes(normalize(searchTerm)) ||
              normalize(patient.numero.toString()).includes(normalize(searchTerm)) ||
              (patient.email &&
                normalize(patient.email).includes(normalize(searchTerm)))
          );

    const suggestions = filteredPatients.slice(0, 5);
    const selectedPatient = fakePatients.find(
      (p) => p.id === practiceDialog.selectedPatientId
    );

    return (
      <div className="">
        <DialogDescription className="mt-2 text-xs">Information patient</DialogDescription>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={practiceDialog.newPractice.isNewPatient || false}
            onChange={(e) =>
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  isNewPatient: e.target.checked,
                  // Si on passe en mode nouveau patient, on réinitialise le formulaire
                  newPatient: e.target.checked ? {} : prev.newPractice.newPatient,
                },
                // Réinitialiser la sélection en cas de bascule
                selectedPatientId: e.target.checked ? '' : prev.selectedPatientId,
                error: '' // On nettoie l'erreur si présente
              }))
            }
          />
          <span className="my-2 ml-2 text-xs">Nouveau patient</span>
        </label>
        {practiceDialog.newPractice.isNewPatient ? (
          <NewPatientForm practiceDialog={practiceDialog} setPracticeDialog={setPracticeDialog} />
        ) : (
          <>
            <DialogDescription className="flex flex-col items-center justify-start w-full">
              <ExistingPatientSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                suggestions={suggestions}
                setPracticeDialog={setPracticeDialog}
                practiceDialog={practiceDialog}
              />
            </DialogDescription>
            <ExistingPatientDisplay
              selectedPatient={selectedPatient}
              practiceDialog={practiceDialog}
              setPracticeDialog={setPracticeDialog}
            />
          </>
        )}
      </div>
    );
  };

  export default PatientForm;

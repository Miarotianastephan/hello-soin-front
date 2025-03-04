import React, { useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { parseTime, getColorByType } from './utils/agendaUtils';

const PracticeDialog = ({
  practiceDialog,
  onClose,
  onTypeChange,
  onStartChange,
  onAddPractice,
  onRemovePractice,
  onSave,
  fakePatients,
  setPracticeDialog
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Normalisation pour le filtre (minuscule et suppression des espaces)
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

  // Fonction de formatage du numéro : insertion d'un espace tous les 2 chiffres (format "06 11 22 33 44")
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 10);
    return digits.match(/.{1,2}/g)?.join(' ') || '';
  };

  // Gestion de la validation avant ajout d'une pratique
  const handleLocalAddPractice = () => {
    // Vérifier que le motif est renseigné
    if (!practiceDialog.newPractice.motif) {
      setPracticeDialog((prev) => ({
        ...prev,
        newPractice: {
          ...prev.newPractice,
          error: 'Le champ motif est obligatoire.'
        }
      }));
      return;
    }
    // Si création de rendez‑vous demandée
    if (practiceDialog.newPractice.createAppointment) {
      if (practiceDialog.newPractice.isNewPatient) {
        const newPatient = practiceDialog.newPractice.newPatient || {};
        if (
          !newPatient.prenom ||
          !newPatient.nom ||
          !newPatient.email ||
          !newPatient.numero ||
          !newPatient.age ||
          !newPatient.genre ||
          !newPatient.adresse
        ) {
          setPracticeDialog((prev) => ({
            ...prev,
            newPractice: {
              ...prev.newPractice,
              error: 'Tous les champs du patient sont obligatoires.'
            }
          }));
          return;
        }
        // Valider que le numéro contient exactement 10 chiffres
        const phoneDigits = newPatient.numero.replace(/\s/g, '');
        if (phoneDigits.length !== 10) {
          setPracticeDialog((prev) => ({
            ...prev,
            newPractice: {
              ...prev.newPractice,
              error: 'Le numéro de téléphone doit contenir 10 chiffres.'
            }
          }));
          return;
        }
      } else {
        if (!practiceDialog.selectedPatientId) {
          setPracticeDialog((prev) => ({
            ...prev,
            error: 'Veuillez sélectionner un patient existant.'
          }));
          return;
        }
      }
    }
    // Si tout est validé, on efface l'erreur et on ajoute la pratique
    setPracticeDialog((prev) => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        error: ''
      }
    }));
    onAddPractice();
  };

  return (
    <Dialog
      open={practiceDialog.isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-7xl max-h-8xl">

        {/* Mise en page en deux colonnes */}
        <div className="flex flex-row gap-4 px-5">
          {/* Colonne gauche : plage horaire et pratiques ajoutées */}
          <div className="w-1/2">
            <DialogDescription className="mb-2">
              Plage horaire : {practiceDialog.parentSlot?.start} - {practiceDialog.parentSlot?.end}
            </DialogDescription>
            <div className="relative w-full h-2" style={{ background: '#e0e0e0' }}>
          {practiceDialog.parentSlot &&
            practiceDialog.practices.map((practice, idx) => {
              const parentStart = parseTime(practiceDialog.parentSlot.start);
              const parentEnd = parseTime(practiceDialog.parentSlot.end);
              const slotDuration = differenceInMinutes(parentEnd, parentStart);
              const pStart = parseTime(practice.start);
              const pEnd = parseTime(practice.end);
              const offset = (differenceInMinutes(pStart, parentStart) / slotDuration) * 100;
              const width = (differenceInMinutes(pEnd, pStart) / slotDuration) * 100;
              return (
                <div
                  key={idx}
                  className="absolute h-full"
                  style={{
                    left: `${offset}%`,
                    width: `${width}%`,
                    backgroundColor: getColorByType(practice.type)
                  }}
                  title={`${practice.type} (${practice.start} - ${practice.end})`}
                ></div>
              );
            })}
        </div>

        <div className="flex gap-4 my-2">
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('naturopathie') }} className="mr-1" />
            <span>Naturopathie</span>
          </div>
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('acuponcture') }} className="mr-1" />
            <span>Acuponcture</span>
          </div>
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('hypnose') }} className="mr-1" />
            <span>Hypnose</span>
          </div>
        </div>
            <div className="w-full mb-4 border-2 p-2">
              <DialogDescription>Pratiques ajoutées :</DialogDescription>
              {practiceDialog.practices.length === 0 ? (
                <span>Aucune pratique ajoutée.</span>
              ) : (
                <ul>
                  {practiceDialog.practices.map((practice, idx) => {
                    const parentStart = parseTime(practiceDialog.parentSlot.start);
                    const parentEnd = parseTime(practiceDialog.parentSlot.end);
                    const slotDuration = differenceInMinutes(parentEnd, parentStart);
                    const pStart = parseTime(practice.start);
                    const pEnd = parseTime(practice.end);
                    const offset = (differenceInMinutes(pStart, parentStart) / slotDuration) * 100;
                    const width = (differenceInMinutes(pEnd, pStart) / slotDuration) * 100;
                    return (
                      <li
                        key={idx}
                        className="flex items-center justify-between mb-2 w-full text-white font-bold px-2"
                        style={{
                          backgroundColor: getColorByType(practice.type)
                        }}
                        title={`${practice.type} (${practice.start} - ${practice.end})`}
                      >
                        <span>{practice.type}</span>
                        <span>
                          {practice.start} - {practice.end}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Colonne droite : formulaire d'ajout */}
          <div className="w-1/2">
            <div className="w-full mb-4 border-2 p-2">
              <DialogDescription className="py-2">Ajouter une pratique :</DialogDescription>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row w-full justify-between items-center">
                  <label>
                    Type :
                    <select
                      value={practiceDialog.newPractice.type}
                      onChange={onTypeChange}
                      className="border p-1 rounded ml-2"
                      required
                    >
                      <option value="naturopathie">Naturopathie</option>
                      <option value="acuponcture">Acuponcture</option>
                      <option value="hypnose">Hypnose</option>
                    </select>
                  </label>
                  <label>
                    Heure de début :
                    <input
                      type="time"
                      value={practiceDialog.newPractice.start}
                      onChange={onStartChange}
                      className="border p-1 rounded ml-2"
                      required
                    />
                  </label>
                </div>
                {practiceDialog.newPractice.error && (
                  <span className="text-red-500">{practiceDialog.newPractice.error}</span>
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={practiceDialog.newPractice.createAppointment}
                    onChange={(e) =>
                      setPracticeDialog((prev) => ({
                        ...prev,
                        newPractice: {
                          ...prev.newPractice,
                          createAppointment: e.target.checked
                        }
                      }))
                    }
                  />
                  <span className="ml-1 py-2">Ajouter rendez‑vous directement</span>
                </label>
                {practiceDialog.newPractice.createAppointment && (
                  <div className="mb-4">
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={practiceDialog.newPractice.isNewPatient || false}
                        onChange={(e) =>
                          setPracticeDialog((prev) => ({
                            ...prev,
                            newPractice: {
                              ...prev.newPractice,
                              isNewPatient: e.target.checked
                            }
                          }))
                        }
                      />
                      <span className="ml-1">Nouveau patient</span>
                    </label>

                    {practiceDialog.newPractice.isNewPatient ? (
                      // Formulaire de création d'un nouveau patient en 3 colonnes
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={practiceDialog.newPractice.newPatient?.prenom || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    prenom: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="Prénom"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={practiceDialog.newPractice.newPatient?.nom || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    nom: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="Nom"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            value={practiceDialog.newPractice.newPatient?.email || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    email: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <input
                            type="text"
                            value={practiceDialog.newPractice.newPatient?.numero || ''}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    numero: formatted
                                  }
                                }
                              }));
                            }}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="06 11 22 33 44"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Âge
                          </label>
                          <input
                            type="number"
                            value={practiceDialog.newPractice.newPatient?.age || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    age: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="Âge"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Genre
                          </label>
                          <select
                            value={practiceDialog.newPractice.newPatient?.genre || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    genre: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            required
                          >
                            <option value="">Sélectionner</option>
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Adresse
                          </label>
                          <input
                            type="text"
                            value={practiceDialog.newPractice.newPatient?.adresse || ''}
                            onChange={(e) =>
                              setPracticeDialog((prev) => ({
                                ...prev,
                                newPractice: {
                                  ...prev.newPractice,
                                  newPatient: {
                                    ...prev.newPractice.newPatient,
                                    adresse: e.target.value
                                  }
                                }
                              }))
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                            placeholder="Adresse"
                            required
                          />
                           <label className="block text-sm font-medium text-gray-700 mt-2">
                    Motif (obligatoire)
                  </label>
                  <input
                    type="text"
                    value={practiceDialog.newPractice.motif || ''}
                    onChange={(e) =>
                      setPracticeDialog((prev) => ({
                        ...prev,
                        newPractice: {
                          ...prev.newPractice,
                          motif: e.target.value
                        }
                      }))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                    placeholder="Remplir motif"
                    required
                  />
                        </div>
                      </div>
                    ) : (
                      // Sélection d'un patient existant
                      <>
                        <DialogDescription className="flex items-center justify-between">
                          <span className="w-full">Sélectionner patient :</span>
                          <div className="w-full flex items-center justify-end">
                            <Filter />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="border p-1 rounded ml-2"
                              placeholder="Filtre par : Nom, Prénom, email ou N° de téléphone"
                            />
                          </div>
                        </DialogDescription>
                        {searchTerm && (
                          <div className="mt-2 max-h-40 overflow-y-auto border p-2 mt-3">
                            {suggestions.length === 0 ? (
                              <span>Aucun patient trouvé.</span>
                            ) : (
                              suggestions.map((patient) => (
                                <div
                                  key={patient.id}
                                  className={`cursor-pointer p-1 ${
                                    practiceDialog.selectedPatientId === patient.id
                                      ? 'bg-blue-100'
                                      : ''
                                  } border-b-2 flex items-center hover:bg-gray-500`}
                                  onClick={() =>
                                    setPracticeDialog((prev) => ({
                                      ...prev,
                                      selectedPatientId: patient.id,
                                      error: ''
                                    }))
                                  }
                                >
                                  <span className="font-bold text-left flex-1 truncate">
                                    {patient.prenom}
                                  </span>
                                  <DialogDescription className="text-left flex-1 truncate">
                                    {patient.numero}
                                  </DialogDescription>
                                  <DialogDescription className="text-left flex-1 truncate">
                                    {patient.email ? patient.email : patient.adresse}
                                  </DialogDescription>
                                  <DialogDescription className="text-right flex-1">
                                    {patient.age} ans
                                  </DialogDescription>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                                            <div className=" mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Motif (obligatoire)
                      </label>
                      <input
                        type="text"
                        value={practiceDialog.newPractice.motif || ''}
                        onChange={(e) =>
                          setPracticeDialog((prev) => ({
                            ...prev,
                            newPractice: {
                              ...prev.newPractice,
                              motif: e.target.value
                            }
                          }))
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2"
                        placeholder="Remplir motif"
                        required
                      />
                    </div>
                      </>
                    )}
                  
                  </div>
                )}
                <Button
                  className="bg-[#2b7a72] text-white"
                  onClick={handleLocalAddPractice}
                >
                  <PlusCircle size={16} /> Ajouter
                </Button>
              </div>
            </div>
            <div className='flex justify-end w-full items-center gap-2'>
              <Button onClick={onClose} className="bg-gray-700">Annuler</Button>
              <Button onClick={onSave}>Enregistrer</Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeDialog;

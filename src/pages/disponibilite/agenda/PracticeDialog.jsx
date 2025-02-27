import React, { useState } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, UserCheck, Filter } from 'lucide-react';
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

  const filteredPatients = fakePatients.filter(patient =>
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={practiceDialog.isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-2/3 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestion des Pratiques</DialogTitle>
          <DialogDescription>
            Plage horaire : {practiceDialog.parentSlot?.start} - {practiceDialog.parentSlot?.end}
          </DialogDescription>
        </DialogHeader>
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

        {/* Conteneur flex pour placer côte à côte la liste et le formulaire */}
        <div className="flex flex-col gap-4 px-5">
          {/* Colonne de gauche : pratiques ajoutées */}
          <div className="w-full mb-4 border-2 p-2">
            <DialogDescription>Pratiques ajoutées :</DialogDescription>
            {practiceDialog.practices.length === 0 ? (
              <p>Aucune pratique ajoutée.</p>
            ) : (
              <ul>
                {practiceDialog.practices.map((practice, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between mb-2 w-full text-white text-bold px-2"
                    style={{
                      backgroundColor: getColorByType(practice.type)
                    }}
                  >
                    <span>{practice.type}</span>
                    <span>
                      {practice.start} - {practice.end}
                    </span>
                    {/* Bouton de suppression éventuellement à réactiver
                    <Button className="bg-red-500 text-white" onClick={() => onRemovePractice(idx)}>
                      <Trash2 size={16} /> Supprimer
                    </Button> */}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Colonne de droite : formulaire d'ajout */}
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
                  />
                </label>
              </div>
             
              {practiceDialog.newPractice.error && (
                <p className="text-red-500">{practiceDialog.newPractice.error}</p>
              )}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={practiceDialog.newPractice.createAppointment}
                  onChange={(e) =>
                    setPracticeDialog(prev => ({
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
                   <div className="mb-4">
                <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
                  Motif (obligatoire)
                </label>
                <input
                  id="motif"
                  type="text"
                  value={practiceDialog.newPractice.motif || ''}
                  onChange={(e) =>
                    setPracticeDialog(prev => ({
                      ...prev,
                      newPractice: {
                        ...prev.newPractice,
                        motif: e.target.value
                      }
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 "
                  placeholder="Remplir motif"
                  required
                />
              </div>
                  <DialogDescription className="flex items-center justify-between">
                    <p className="w-full">Sélectionner patient :</p>
                    <div className="w-full flex items-center justify-end">
                      <Filter />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-1 rounded ml-2"
                        placeholder="Filtre par : Nom, Prénom ou N° de téléphone"
                      />
                    </div>
                  </DialogDescription>
                  <div className="mt-2 max-h-40 overflow-y-auto border p-2 mt-3">
                    {filteredPatients.length === 0 ? (
                      <p>Aucun patient trouvé.</p>
                    ) : (
                      filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className={`cursor-pointer p-1 ${practiceDialog.selectedPatientId === patient.id ? 'bg-blue-100' : ''} border-b-2 flex items-center hover:bg-gray-500`}
                          onClick={() =>
                            setPracticeDialog(prev => ({
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
              )}
              <Button className="bg-[#2b7a72] text-white" onClick={onAddPractice}>
                <PlusCircle size={16} /> Ajouter
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onSave}>Enregistrer</Button>
          <Button onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeDialog;

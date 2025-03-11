// src/components/dialogs/PracticeDialog.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { getColorByType, getDateFromTime, getDurationInMinutes } from '../utils/scheduleUtils';

const PracticeDialog = ({
  isOpen,
  parentTimeslot,
  practices,
  newPractice,
  onPracticeTypeChange,
  onPracticeStartChange,
  onAddPractice,
  onRemovePractice,
  onSave,
  onClose,
}) => {
  if (!isOpen || !parentTimeslot) return null;

  const parentStart = getDateFromTime(parentTimeslot.start);
  const parentEnd = getDateFromTime(parentTimeslot.end);
  const totalDuration = (parentEnd - parentStart) / 60000; // en minutes

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestion des Pratiques</DialogTitle>
          <DialogDescription>
            Plage horaire : {parentTimeslot.start} - {parentTimeslot.end}
          </DialogDescription>
        </DialogHeader>
        {/* Ligne de temps */}
        <div className="relative" style={{ height: '10px', background: '#e0e0e0' }}>
          {practices.map((practice, idx) => {
            const pStart = getDateFromTime(practice.start);
            const pEnd = getDateFromTime(practice.end);
            const offset = ((pStart - parentStart) / 60000 / totalDuration) * 100;
            const width = (((pEnd - pStart) / 60000) / totalDuration) * 100;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${offset}%`,
                  width: `${width}%`,
                  height: '100%',
                  backgroundColor: getColorByType(practice.type),
                }}
                title={`${practice.type} (${practice.start})`}
              />
            );
          })}
        </div>
        {/* Légende */}
        <div className="flex gap-4">
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('naturopathie') }} className="mr-1" />
            <span>Naturopathie</span>
          </div>
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('acupuncture') }} className="mr-1" />
            <span>Acupuncture</span>
          </div>
          <div className="flex items-center">
            <div style={{ width: '15px', height: '15px', backgroundColor: getColorByType('hypnose') }} className="mr-1" />
            <span>Hypnose</span>
          </div>
        </div>
        {/* Liste des pratiques */}
        <div className="mb-4">
          <h4 className="font-bold">Pratiques ajoutées :</h4>
          {practices.length === 0 ? (
            <p>Aucune pratique ajoutée.</p>
          ) : (
            <ul>
              {practices.map((practice, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{practice.type} : {practice.start}</span>
                  <Button className="bg-red-500 text-white" onClick={() => onRemovePractice(idx)}>
                    <Trash2 size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Formulaire d'ajout */}
        <div className="mb-4">
          <h4 className="font-bold">Ajouter une pratique :</h4>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row w-full justify-between items-center px-2">
              <label>
                Type :
                <select value={newPractice.type} onChange={onPracticeTypeChange} className="border p-1 rounded ml-2">
                  <option value="naturopathie">Naturopathie</option>
                  <option value="acupuncture">Acupuncture</option>
                  <option value="hypnose">Hypnose</option>
                </select>
              </label>
              <label>
                Heure de début :
                <input type="time" value={newPractice.start} onChange={onPracticeStartChange} className="border p-1 rounded ml-2" />
              </label>
            </div>
            {newPractice.error && <p className="text-red-500">{newPractice.error}</p>}
            <Button className="bg-[#2b7a72] text-white" onClick={onAddPractice}>
              <PlusCircle size={16} /> Ajouter
            </Button>
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

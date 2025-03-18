import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ReservedDialog = ({ reservedDialog, setReservedDialog }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (reservedDialog.isOpen) {
      // Réinitialiser et lancer l'animation après un court délai
      setAnimate(false);
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [reservedDialog.isOpen]);

  if (!reservedDialog.isOpen) return null;

  return (
    <div
      className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg p-4 z-50 transform transition-transform duration-300 ${
        animate ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Détails du Rendez‑vous</h2>
        <Button onClick={() => setReservedDialog({ isOpen: false, appointment: null })}>
          Fermer
        </Button>
      </div>
      <div className="space-y-2">
        <div>Patient : {reservedDialog.appointment.prenom} {reservedDialog.appointment.nom}</div>
        <div>Numéro : {reservedDialog.appointment.numero}</div>
        <div>Âge : {reservedDialog.appointment.age} ans</div>
        <div>Type de rendezvous : {reservedDialog.appointment.practice_type}</div>
        <div>Heure : {reservedDialog.appointment.practice_start} - {reservedDialog.appointment.practice_end}</div>
        <div>Date : {reservedDialog.appointment.date}</div>
        <div>Motif : {reservedDialog.appointment.motif}</div>
      </div>
    </div>
  );
};

export default ReservedDialog;

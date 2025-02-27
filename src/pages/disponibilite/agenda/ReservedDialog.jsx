// src/components/Agenda/ReservedDialog.js
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ReservedDialog = ({ reservedDialog, setReservedDialog }) => {
  return (
    <Dialog
      open={reservedDialog.isOpen}
      onOpenChange={(open) => { if (!open) setReservedDialog({ isOpen: false, appointment: null }); }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du Rendez‑vous</DialogTitle>
          <DialogDescription>
            <div>Patient : {reservedDialog.appointment.patient.prenom} {reservedDialog.appointment.patient.nom}</div>
            <div>Numéro : {reservedDialog.appointment.patient.numero}</div>
            <div>Âge : {reservedDialog.appointment.patient.age} ans</div>
            <div>Type : {reservedDialog.appointment.practice.type}</div>
            <div>Heure : {reservedDialog.appointment.practice.start} - {reservedDialog.appointment.practice.end}</div>
            <div>Date : {reservedDialog.appointment.date}</div>
            <div>Motif : {reservedDialog.appointment.motif}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setReservedDialog({ isOpen: false, appointment: null })}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservedDialog;

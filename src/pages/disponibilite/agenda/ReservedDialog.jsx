// src/components/Agenda/ReservedDrawer.js
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const ReservedDrawer = ({ reservedDialog, setReservedDialog }) => {
  return (
    <Drawer
      open={reservedDialog.isOpen}
      onOpenChange={(open) => {
        if (!open) setReservedDialog({ isOpen: false, appointment: null });
      }}
      placement="right"
      className="h-full w-1/2" // Assure que le drawer occupe toute la hauteur
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Détails du Rendez‑vous</DrawerTitle>
          <DrawerDescription>
            <div>Patient : {reservedDialog.appointment.prenom} {reservedDialog.appointment.nom}</div>
            <div>Numéro : {reservedDialog.appointment.numero}</div>
            <div>Âge : {reservedDialog.appointment.age} ans</div>
            <div>Type de rendezvous : {reservedDialog.appointment.practice_type}</div>
            <div>Heure : {reservedDialog.appointment.practice_start} - {reservedDialog.appointment.practice_end}</div>
            <div>Date : {reservedDialog.appointment.date}</div>
            <div>Motif : {reservedDialog.appointment.motif}</div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={() => setReservedDialog({ isOpen: false, appointment: null })}>
            Fermer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ReservedDrawer;

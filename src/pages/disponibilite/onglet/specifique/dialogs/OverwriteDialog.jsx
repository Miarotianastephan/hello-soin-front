// OverwriteDialog.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const OverwriteDialog = ({ 
  isOpen, 
  overlappingDates = [], 
  appointmentsToOverwrite = [], 
  onConfirm, 
  onCancel 
}) => (
  <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmation de remplacement</DialogTitle>
        <DialogDescription asChild>
          <div>
            <p>Les dates suivantes existent déjà dans le planning :</p>
            <ul>
              {overlappingDates.map((date, index) => (
                <li key={index}>{date}</li>
              ))}
            </ul>
            {appointmentsToOverwrite.length > 0 && (
              <>
                <p>Des rendez‑vous existent également aux dates suivantes :</p>
                <ul>
                  {appointmentsToOverwrite.map((date, index) => (
                    <li key={index}>{date}</li>
                  ))}
                </ul>
              </>
            )}
            <p>Voulez-vous écraser ces dates et supprimer les rendez‑vous associés ?</p>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button className="bg-red-500 text-white" onClick={onConfirm}>Écraser</Button>
        <Button onClick={onCancel}>Annuler</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default OverwriteDialog;

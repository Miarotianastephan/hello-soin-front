import React from 'react';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AppointmentDetails from './practicesDialogDetail/AppointmentDetails';
import PatientForm from './practicesDialogDetail/PatientForm';
import { Save } from 'lucide-react';

const PracticeDialog = ({
  practiceDialog,
  onClose,
  onTypeChange,
  onStartChange,
  onSave,
  fakePatients,
  setPracticeDialog,
}) => {
  return (
    <Dialog
      open={practiceDialog.isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-xl max-h-8xl">
        <div className="flex flex-row gap-4 ">
          <div className="w-full">
            <p className="text-4xs text-gray-600 font-bold">Ajouter un rendez-vous</p>
            <DialogDescription className="py-2 text-xs">
              Plage horaire :{" "}
              {practiceDialog.parentSlot
                ? `${practiceDialog.parentSlot.start} à ${practiceDialog.parentSlot.end}`
                : "Non définie"}
            </DialogDescription>
            <div className="w-full mb-4 border-2 p-2">
              <AppointmentDetails
                practiceDialog={practiceDialog}
                onTypeChange={onTypeChange}
                onStartChange={onStartChange}
                setPracticeDialog={setPracticeDialog}
              />
              <PatientForm
                practiceDialog={practiceDialog}
                setPracticeDialog={setPracticeDialog}
                fakePatients={fakePatients}
              />
            </div>
            <div className="flex justify-end w-full items-center gap-2 h-[30px]">
              <Button
                onClick={onClose}
                className="h-full bg-transparent shadow-none text-xs border text-[#0f2b3d] border-[#0f2b3d]"
              >
                Annuler
              </Button>
              <Button
                onClick={onSave}
                className="bg-transparent bg-[#0f2b3d] text-xs font-bold shadow-none h-full"
              >
                <Save /> Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeDialog;

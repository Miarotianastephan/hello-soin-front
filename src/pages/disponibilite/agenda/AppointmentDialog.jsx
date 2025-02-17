// /src/components/Dialogs/AppointmentDialog.jsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRACTICE_TYPES } from "./utils/calendarUtils";

const AppointmentDialog = ({
  open,
  setOpen,
  selectedPractice,
  appointmentDetails,
  setAppointmentDetails,
  handleCreateAppointment
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Plage horaire</label>
              <Input 
                value={`${selectedPractice?.start} - ${selectedPractice?.end}`} 
                disabled 
              />
            </div>
            <div>
              <label>Type de pratique</label>
              <Input 
                value={PRACTICE_TYPES[selectedPractice?.type]} 
                disabled 
              />
            </div>
          </div>
          
          <Input
            placeholder="Nom complet"
            value={appointmentDetails.name}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, name: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Âge"
              value={appointmentDetails.age}
              onChange={(e) => setAppointmentDetails({ ...appointmentDetails, age: e.target.value })}
            />
            <Input
              placeholder="Téléphone"
              value={appointmentDetails.telephone}
              onChange={(e) => setAppointmentDetails({ ...appointmentDetails, telephone: e.target.value })}
            />
          </div>
          
          <Input
            placeholder="Motif de la consultation"
            value={appointmentDetails.motif}
            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, motif: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCreateAppointment}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;

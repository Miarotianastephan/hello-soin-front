// /src/components/Dialogs/PracticeDialog.jsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRACTICE_TYPES } from "./utils/calendarUtils";

const PracticeDialog = ({ open, setOpen, newPractice, setNewPractice, handleAddPractice }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une pratique</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="time"
            value={newPractice.start}
            onChange={(e) => setNewPractice({ ...newPractice, start: e.target.value })}
            className="w-full"
          />
          <Select
            value={newPractice.type}
            onValueChange={(value) => setNewPractice({ ...newPractice, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de pratique" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRACTICE_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleAddPractice}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PracticeDialog;

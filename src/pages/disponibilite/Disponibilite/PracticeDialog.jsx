import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { pratiques, heures } from "../utils/constants";

export const PracticeDialog = ({ 
  open, 
  onOpenChange, 
  startTime, 
  setStartTime, 
  selectedPratique, 
  setSelectedPratique, 
  error, 
  handleSavePratique, 
  editMode 
}) => {
  const isEditMode = editMode.pratiqueIndex !== null;
  const isDisabled = !startTime || !selectedPratique;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier" : "Ajouter"} une pratique</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Select value={String(startTime)} onValueChange={(val) => setStartTime(Number(val))}>
            <SelectTrigger aria-label="Sélectionner l'heure de début" className={error ? "border-red-500" : ""}>
              {startTime ? `${startTime}h` : "Heure de début"}
            </SelectTrigger>
            <SelectContent>
              {heures.map((h) => (
                <SelectItem key={h} value={String(h)}>{h}h</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPratique} onValueChange={setSelectedPratique}>
            <SelectTrigger aria-label="Sélectionner le type de pratique" className={error ? "border-red-500" : ""}>
              {selectedPratique ? `${selectedPratique} (${pratiques[selectedPratique]} min)` : "Type de pratique"}
            </SelectTrigger>
            <SelectContent>
              {Object.keys(pratiques).map((pratique) => (
                <SelectItem key={pratique} value={pratique}>
                  {pratique} ({pratiques[pratique]} minutes)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSavePratique} disabled={isDisabled}>
            {isEditMode ? "Modifier" : "Ajouter"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { DaySelector } from "./Disponibilite/DaySelector";
import { TimeSlotManager } from "./Disponibilite/TimeSlotManager";
import { PracticeDialog } from "./Disponibilite/PracticeDialog";
import { ProgrammedDaysList } from "./Disponibilite/ProgrammedDaysList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Play } from "lucide-react";
import { daysOfWeek, pratiques } from "./utils/constants";

const Disponibilite = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [currentSlotIndex, setCurrentSlotIndex] = useState(null);
  const [startTime, setStartTime] = useState(8);
  const [selectedPratique, setSelectedPratique] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [programmedDays, setProgrammedDays] = useState([]);
  const [editMode, setEditMode] = useState({ day: "", slotIndex: null, pratiqueIndex: null });
  const [duration, setDuration] = useState(3);
  const [activeTab, setActiveTab] = useState("planifier");

  // Fonction pour basculer la sélection d'un jour
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (!timeSlots[day]) {
      setTimeSlots((prev) => ({ ...prev, [day]: [{ start: 8, end: 10, pratiques: [] }] }));
    }
  };

  

  // Fonction pour ajouter un créneau horaire à un jour donné
  const addTimeSlot = (day) => {
    setTimeSlots((prev) => {
      const slots = prev[day] || [];
      const lastEnd = slots.length ? slots[slots.length - 1].end : 8;
      if (lastEnd >= 17) return prev; // Ne pas dépasser 17h
      return {
        ...prev,
        [day]: [...slots, { start: lastEnd, end: Math.min(lastEnd + 2, 17), pratiques: [] }],
      };
    });
  };

  // Fonction pour supprimer un créneau horaire
  const deleteTimeSlot = (day, index) => {
    setTimeSlots((prev) => {
      const updatedSlots = prev[day].filter((_, i) => i !== index);
      return { ...prev, [day]: updatedSlots };
    });
  };

  // Fonction pour ouvrir le dialogue d'ajout/modification d'une pratique
  const handleAddPratique = (day, slotIndex, pratiqueIndex = null) => {
    setCurrentDay(day);
    setCurrentSlotIndex(slotIndex);
    if (pratiqueIndex !== null) {
      // Mode édition : pré-remplir les champs avec la pratique existante
      const pratique = timeSlots[day][slotIndex].pratiques[pratiqueIndex];
      setStartTime(pratique.start);
      setSelectedPratique(pratique.type);
      setEditMode({ day, slotIndex, pratiqueIndex });
    } else {
      // Mode ajout : réinitialiser les champs
      setStartTime(8);
      setSelectedPratique("");
      setEditMode({ day: "", slotIndex: null, pratiqueIndex: null });
    }
    setDialogOpen(true);
  };

  // Fonction pour vérifier les chevauchements de pratiques
  const checkOverlap = (pratiques, newPratique) => {
    return pratiques.some(
      (pratique) =>
        (newPratique.start >= pratique.start && newPratique.start < pratique.end) ||
        (newPratique.end > pratique.start && newPratique.end <= pratique.end) ||
        (newPratique.start <= pratique.start && newPratique.end >= pratique.end)
    );
  };

  // Fonction pour sauvegarder une pratique
  const handleSavePratique = () => {
    if (!selectedPratique) {
      setError("Veuillez sélectionner un type de pratique.");
      return;
    }

    const endTime = startTime + pratiques[selectedPratique] / 60;

    // Vérifier que la pratique ne dépasse pas la plage horaire
    const slot = timeSlots[currentDay][currentSlotIndex];
    if (startTime < slot.start || endTime > slot.end) {
      setError("La pratique dépasse la plage horaire.");
      return;
    }

    // Vérifier qu'il n'y a pas de chevauchement avec d'autres pratiques
    const newPratique = { start: startTime, end: endTime, type: selectedPratique };
    if (checkOverlap(slot.pratiques, newPratique)) {
      setError("Chevauchement détecté avec une autre pratique.");
      return;
    }

    // Ajouter ou mettre à jour la pratique
    setTimeSlots((prev) => {
      const updatedSlots = [...prev[currentDay]];
      if (editMode.pratiqueIndex !== null) {
        // Mode édition : remplacer la pratique existante
        updatedSlots[currentSlotIndex].pratiques[editMode.pratiqueIndex] = newPratique;
      } else {
        // Mode ajout : ajouter une nouvelle pratique
        updatedSlots[currentSlotIndex].pratiques.push(newPratique);
      }
      return { ...prev, [currentDay]: updatedSlots };
    });

    // Fermer le dialogue et réinitialiser les états
    setDialogOpen(false);
    setError("");
    setStartTime(8);
    setSelectedPratique("");
    setEditMode({ day: "", slotIndex: null, pratiqueIndex: null });
  };

  // Fonction pour programmer les jours sélectionnés
  const handleProgram = () => {
    if (!selectedDate || isNaN(new Date(selectedDate).getTime())) {
      setError("Veuillez sélectionner une date de départ valide.");
      return;
    }

    const startDate = new Date(selectedDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration); // Utiliser la durée sélectionnée

    const daysList = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = daysOfWeek[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]; // Ajustement pour Dimanche
      if (selectedDays.includes(dayOfWeek)) {
        daysList.push({
          date: new Date(currentDate),
          day: dayOfWeek,
          slots: timeSlots[dayOfWeek] || [],
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setProgrammedDays(daysList);
    setActiveTab("programmed");
    console.log(daysList);
  };

    // Function to delete a programmed day
    const deleteProgrammedDay = (date) => {
      setProgrammedDays(prev => prev.filter(d => d.date.getTime() !== date.getTime()));
    };
  
    // Function to delete a slot within a programmed day
    const deleteProgrammedSlot = (date, slotIndex) => {
      setProgrammedDays(prev => prev.map(day => {
        if (day.date.getTime() === date.getTime()) {
          const updatedSlots = day.slots.filter((_, i) => i !== slotIndex);
          return { ...day, slots: updatedSlots };
        }
        return day;
      }));
    };
  

  // Fonction pour mettre à jour un créneau horaire
  const updateTimeSlot = (day, index, field, value) => {
    setTimeSlots((prev) => {
      const updatedSlots = [...prev[day]];
      updatedSlots[index][field] = Number(value);
      updatedSlots.sort((a, b) => a.start - b.start);

      // Vérifier les conflits d'horaires
      for (let i = 1; i < updatedSlots.length; i++) {
        if (updatedSlots[i].start < updatedSlots[i - 1].end) {
          setError(`Conflit d'horaires détecté pour ${day}`);
          alert(`Conflit d'horaires détecté pour ${day}. Veuillez ajuster les plages horaires.`);
          return prev;
        }
      }

      setError("");
      return { ...prev, [day]: updatedSlots };
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
       <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="planifier">Planifier</TabsTrigger>
          <TabsTrigger value="programmed">Jours Programmes</TabsTrigger>
        </TabsList>
        <TabsContent value="planifier">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 justify-between w-full   rounded">
        <div className="flex flex-row gap-2 w-full items-center">
  {/* Section date et durée */}
  <div className="flex flex-row items-center w-1/3 gap-2">
      <label className="text-sm font-medium">Date </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-2 border rounded w-[150px]"
      />


      <label className="text-sm font-medium ml-5">Durée </label>
      <Select value={String(duration)} onValueChange={(val) => setDuration(Number(val))}>
        <SelectTrigger className="w-32">Durée</SelectTrigger>
        <SelectContent>
          <SelectItem value="0">1 jour</SelectItem>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <SelectItem key={month} value={String(month)}>
              {month} mois
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
 
  </div>


</div>

          <DaySelector selectedDays={selectedDays} toggleDay={toggleDay} />
          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[350px]">
          {selectedDays.map((day) => (
            <TimeSlotManager
              key={day}
              day={day}
              slots={timeSlots[day] || []}
              addTimeSlot={addTimeSlot}
              deleteTimeSlot={deleteTimeSlot}
              handleAddPratique={handleAddPratique}
              updateTimeSlot={updateTimeSlot}
            />
          ))}
        </div>
        <div className="flex flex-row gap-2 w-full items-center mt-10">
  {/* Section date et durée */}
  <div className="flex flex-row items-center w-1/3 gap-2">
    
 
  </div>

  {/* Bouton Programmer aligné à droite */}
  <div className="w-2/3 flex justify-end">
    <Button onClick={handleProgram}><Play/> Programmer</Button>
  </div>
</div>
        </div>
        
      </div>

      
      
</TabsContent>
<TabsContent value="programmed">
  <div className="max-h-[500px]">
      <ProgrammedDaysList
        programmedDays={programmedDays} 
        onDeleteDay={deleteProgrammedDay}
        onDeleteSlot={deleteProgrammedSlot}
        // onEditPratique={handleEditPratique}
      />
  </div>
       </TabsContent>
    </Tabs>
      
    <PracticeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        startTime={startTime}
        setStartTime={setStartTime}
        selectedPratique={selectedPratique}
        setSelectedPratique={setSelectedPratique}
        error={error}
        handleSavePratique={handleSavePratique}
        editMode={editMode}
      />
    </div>
  );
};

export default Disponibilite;
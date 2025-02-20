// /src/components/Agenda/Agenda.jsx

import { useEffect, useState } from "react";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CalendarView from "./CalendarView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import ListView from "./ListView";
import Filters from "./Filters";
import PracticeDialog from "./PracticeDialog";
import AppointmentDialog from "./AppointmentDialog";
import {
  PRACTICE_TYPES,
  getDurationInMinutes,
  getColorByType,
} from "./utils/calendarUtils";
import { initialSlotsData, SELECTED_DAYS_KEYS } from "../utils/constants";


const AgendaContent = ({workDaysData, dataAgenda}) => {
  
  // États principaux
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState(["all"]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState(["all"]);
  const [viewMode, setViewMode] = useState("day");
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les boîtes de dialogue
  const [isPracticeDialogOpen, setIsPracticeDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newPractice, setNewPractice] = useState({ start: "", type: "" });
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    age: "",
    telephone: "",
    motif: "",
  });
  // Données des créneaux horaires
  const [slotsData, setSlotsData] = useState(dataAgenda);

  // Navigation dans le temps
  const handleNext = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      default:
        break;
    }
  };

  const handlePrev = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      default:
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Sélection d’une date via le calendrier
  const handleDateSelect = (date) => {
    setCurrentDate(date);
  };

  // Ouvrir la boîte de dialogue pour ajouter une pratique
  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    setIsPracticeDialogOpen(true);
  };

  // Ajout d'une pratique (logique à compléter selon votre besoin)
  const handleAddPractice = () => {
    const { day, slot } = selectedSlot;
    const { start, type } = newPractice;
  
    if (!start || !type) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    const [startHour, startMinute] = start.split(":").map(Number);
    const duration = getDurationInMinutes(type);
    const endMinutes = startHour * 60 + startMinute + duration;
  
    if (startHour < slot.start || endMinutes > slot.end * 60) {
      alert("La pratique dépasse la plage horaire.");
      return;
    }
  
    const isOverlap = slot.pratiques.some((p) => {
      const [pStartHour, pStartMinute] = p.start.split(":").map(Number);
      const pEndMinutes = pStartHour * 60 + pStartMinute + getDurationInMinutes(p.type);
      return (
        startHour * 60 + startMinute < pEndMinutes &&
        endMinutes > pStartHour * 60 + pStartMinute
      );
    });
  
    if (isOverlap) {
      alert("Chevauchement détecté. Veuillez choisir une autre plage.");
      return;
    }
  
    const updatedSlotsData = slotsData.map((data) => {
      if (data.date === day) {
        return {
          ...data,
          slots: data.slots.map((s) => {
            if (s.start === slot.start && s.end === slot.end) {
              return {
                ...s,
                pratiques: [...s.pratiques, { start, type, date: day, appointments: [] }],
              };
            }
            return s;
          }),
        };
      }
      return data;
    });
  
    setSlotsData(updatedSlotsData);
    localStorage.setItem("programmedDays", JSON.stringify(updatedSlotsData)); // Mise à jour du localStorage
    setIsPracticeDialogOpen(false);
    setNewPractice({ start: "", type: "" });
  };



  const handleCreateAppointment = () => {
  if (
    !appointmentDetails.name ||
    !appointmentDetails.age ||
    !appointmentDetails.telephone ||
    !appointmentDetails.motif
  ) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  const updatedSlotsData = slotsData.map((slotData) => {
    if (slotData.date === selectedPractice.date) {
      return {
        ...slotData,
        slots: slotData.slots.map((slot) => {
          return {
            ...slot,
            pratiques: slot.pratiques.map((p) => {
              if (
                p.start === selectedPractice.start &&
                p.type === selectedPractice.type
              ) {
                return {
                  ...p,
                  appointments: [
                    ...(p.appointments || []),
                    {
                      ...appointmentDetails,
                      start: selectedPractice.start,
                      end: selectedPractice.end,
                      type: selectedPractice.type,
                    },
                  ],
                };
              }
              return p;
            }),
          };
        }),
      };
    }
    return slotData;
  });

  setSlotsData(updatedSlotsData);
  localStorage.setItem("programmedDays", JSON.stringify(updatedSlotsData)); // Mise à jour du localStorage
  setIsAppointmentDialogOpen(false);
  setAppointmentDetails({
    name: "",
    age: "",
    telephone: "",
    motif: "",
  });
};
  return(
    <div className="flex gap-4 p-4">
      {/* Panneau latéral */}
      <div className="w-72">
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onDateSelect={handleDateSelect}
          workDaysData={workDaysData}
        />
        <Filters
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedTimeRanges={selectedTimeRanges}
          setSelectedTimeRanges={setSelectedTimeRanges}
          PRACTICE_TYPES={PRACTICE_TYPES}
          getColorByType={getColorByType}
          slotsData={slotsData}
        />
      </div>

      {/* Zone principale */}
      <div className="flex-1 h-[730px]">
        <div className="flex items-center justify-between px-2 py-5 mb-4 border-2">
          <div className="flex gap-2">
            <Button onClick={handlePrev} className="bg-[#307853FF] rounded">
              <ChevronLeft />
            </Button>
            <Button onClick={handleToday} className="bg-[#307853FF]">
              Aujourd'hui
            </Button>
            <Button onClick={handleNext} className="bg-[#307853FF]">
              <ChevronRight />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("day")}
              className="bg-[#0B2839FF]"
            >
              <Clock /> Jour
            </Button>
            <Button
              onClick={() => setViewMode("week")}
              className="bg-[#0B2839FF]"
            >
              <List /> Semaine
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              className="bg-[#0B2839FF]"
            >
              <CalendarIcon /> Liste
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Rechercher..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="bg-[#307853FF]">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {viewMode === "day" && (
          <DayView
            workDaysData={workDaysData}
            currentDate={currentDate}
            slotsData={slotsData}
            handleSlotClick={handleSlotClick}
            selectedTypes={selectedTypes}
            selectedTimeRanges={selectedTimeRanges}
            setSelectedPractice={setSelectedPractice}
            setIsAppointmentDialogOpen={setIsAppointmentDialogOpen}
          />
        )}
        {viewMode === "week" && (
          <WeekView
            workDaysData={workDaysData}
            currentDate={currentDate}
            slotsData={slotsData}
            handleSlotClick={handleSlotClick}
            selectedTypes={selectedTypes}
            selectedTimeRanges={selectedTimeRanges}
            setSelectedPractice={setSelectedPractice}
            setIsAppointmentDialogOpen={setIsAppointmentDialogOpen}
          />
        )}

        {viewMode === "list" && (
          <ListView
            slotsData={slotsData}
            searchQuery={searchQuery}
            PRACTICE_TYPES={PRACTICE_TYPES}
            getColorByType={getColorByType}
          />
        )}
      </div>

      {/* Boîtes de dialogue */}
      <PracticeDialog
        open={isPracticeDialogOpen}
        setOpen={setIsPracticeDialogOpen}
        newPractice={newPractice}
        setNewPractice={setNewPractice}
        handleAddPractice={handleAddPractice}
      />
      <AppointmentDialog
        open={isAppointmentDialogOpen}
        setOpen={setIsAppointmentDialogOpen}
        selectedPractice={selectedPractice}
        appointmentDetails={appointmentDetails}
        setAppointmentDetails={setAppointmentDetails}
        handleCreateAppointment={handleCreateAppointment}
        PRACTICE_TYPES={PRACTICE_TYPES}
      />
    </div>
  );
}

const Agenda = () => {
  const [isLoading, setLoading] = useState(true);
  // Donnees des jours de travails
  const [workDays, setWorkDays] = useState([]);
  const [myAgenda, setMyAgenda] = useState({});

  useEffect(() => {
    const fetchDaysAvalaible = async () => {
      try {
        const work_days = JSON.parse(localStorage.getItem(SELECTED_DAYS_KEYS));
        setWorkDays(work_days.map(day => day.toLowerCase()));
        const agenda_data = JSON.parse(localStorage.getItem("programmedDays"));
        setMyAgenda(agenda_data);
      } catch (error) {
        console.error("Erreur lors de la récupération des plages horaires :", error);
      } finally{
        setLoading(false);
      }
    };
    fetchDaysAvalaible();
  }, []);

  return (
    <>
      { isLoading ? 
        (<p>En cours de chargement</p>) : (
          <AgendaContent workDaysData={workDays} dataAgenda={myAgenda}/>
        )
      }
    </>
  );
};

export default Agenda;

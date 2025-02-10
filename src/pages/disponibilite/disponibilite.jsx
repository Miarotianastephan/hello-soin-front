import React, { useState } from "react";
import styled from "styled-components";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import des composants shadcn
import Calendar from "./Calendar/calendar";
import WorkSchedule from "./workShedule/workshedule";
import DisponibilitesList from "./list/dispoList"; // Import du tableau
import Agenda from "./agenda/agenda";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const MainContent = styled.div`
  display: flex;
  @media screen and (max-width: 1300px) {
    flex-direction: column;
  }
`;

// 🔹 Initialisation avec des données factices
const initialAvailability = {
  "2025-02-3": [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" }
  ],
  "2025-02-21": [
    { start: "08:00", end: "09:00" },
    { start: "09:00", end: "10:00" }
  ]
};

const Disponibilités = () => {
  const [selectedDates, setSelectedDates] = useState(Object.keys(initialAvailability)); // 🔹 Pré-sélectionne les dates avec dispos
  const [availability, setAvailability] = useState(initialAvailability);
  const [activeTab, setActiveTab] = useState("disponibilites"); // 🔹 État pour gérer l'onglet actif

  return (
    <AppContainer>
          <MainContent>
            <Calendar
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              availability={availability} // 🔹 Passage des disponibilités mises à jour
            />
            <WorkSchedule
              selectedDates={selectedDates}
              availability={availability}
              setAvailability={setAvailability}
            />
          </MainContent>
          <DisponibilitesList availability={availability} /> {/* 🔹 Affichage dynamique */}
    </AppContainer>
  );
};

export default Disponibilités;
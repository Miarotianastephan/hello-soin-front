import React, { useState } from "react";
import dayjs from "dayjs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import "../../../App.css"
const DisponibilitesList = ({ availability }) => {
  const [filterDate, setFilterDate] = useState("");

  const handleCreateAppointment = (date, start, end) => {
    alert(`Rendez-vous créé pour ${date} de ${start} à ${end}`);
  };

  // Fonction pour vérifier si une date est passée
  const isDatePassed = (date) => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  // Filtrer les disponibilités en fonction de la date de filtre et des dates passées
  const filteredAvailability = Object.entries(availability)
    .filter(([date]) => {
      // Appliquer le filtre de date si une date est sélectionnée
      if (filterDate && !date.includes(filterDate)) return false;
      // Exclure les dates passées
      return !isDatePassed(date);
    });

  return (
    <div className="mt-5 border-t border-gray-300 pt-4 space-y-6 h-[300px] overflow-y-auto scrollbar-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Action</TableHead>
            {/* <TableHead>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAvailability.map(([date, slots]) =>
            slots.map((slot, index) => (
              <TableRow key={`${date}-${index}`}>
                <TableCell>{dayjs(date).format("DD MMM YYYY (ddd)")}</TableCell>
                <TableCell>{slot.start}</TableCell>
                <TableCell>{slot.end}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleCreateAppointment(date, slot.start, slot.end)}
                    className="bg-green-500 hover:bg-green-600 p-2 lg:px-4"
                  >
                    <span className="hidden lg:inline">Gérer les rendez-vous</span>
                    <CalendarCheck size={18} className="lg:hidden" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisponibilitesList;
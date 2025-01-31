import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Données fictives (à remplacer par les vraies données)
const appointments = [
  { id: 1, date: "2024-02-01", status: "Confirmé", name: "Consultation Générale", duration: "30 min" },
  { id: 2, date: "2024-02-10", status: "Annulé", name: "Suivi Médical", duration: "15 min" },
  { id: 3, date: "2024-02-15", status: "En attente", name: "Examen Cardiologique", duration: "45 min" },
];

const HistoriqueRdv = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historique des rendez-vous</h2>
      <Table className="w-full bg-white border border-gray-200 rounded-lg">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left">Date</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Nom du rendez-vous</TableHead>
            <TableHead className="text-left">Durée</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="border-b hover:bg-gray-50">
              <TableCell>{appointment.date}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    appointment.status === "Confirmé"
                      ? "bg-green-100 text-green-600"
                      : appointment.status === "Annulé"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </TableCell>
              <TableCell>{appointment.name}</TableCell>
              <TableCell>{appointment.duration}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="text-dark border-dark-600 hover:bg-gray-600 hover:text-white"
                  onClick={() => navigate(`/historique/rdv/${appointment.id}`)}
                >
                  Voir Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoriqueRdv;

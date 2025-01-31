import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Données fictives (à remplacer par une requête API)
const appointments = [
  { id: 1, date: "2024-02-01", status: "Confirmé", name: "Consultation Générale", duration: "30 min" },
  { id: 2, date: "2024-02-10", status: "Annulé", name: "Suivi Médical", duration: "15 min" },
  { id: 3, date: "2024-02-15", status: "En attente", name: "Examen Cardiologique", duration: "45 min" },
];

const HistoriqueRdvCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Recherche du rendez-vous correspondant
  const appointment = appointments.find((appt) => appt.id === parseInt(id));

  if (!appointment) {
    return <p className="text-red-500 text-center text-xl">Rendez-vous introuvable.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Détails du Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg"><strong>Date :</strong> {appointment.date}</p>
            <p className="text-lg">
              <strong>Statut :</strong>{" "}
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
            </p>
            <p className="text-lg"><strong>Nom :</strong> {appointment.name}</p>
            <p className="text-lg"><strong>Durée :</strong> {appointment.duration}</p>
          </div>
          <div className="mt-6 text-center">
            <Button
              variant="outline"
                  className="text-dark border-dark-600 hover:bg-gray-600 hover:text-white"
              onClick={() => navigate("/historique/rdv")}
            >
              Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriqueRdvCard;

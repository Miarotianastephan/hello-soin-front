
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Search } from "lucide-react";

// Données fictives des médecins (à remplacer par une API)
const doctors = [
    { id: 1, name: "Dr. Jean Dupont", specialty: "Cardiologue", availableDate: "2024-02-01", location: [48.8566, 2.3522] },
    { id: 2, name: "Dr. Marie Curie", specialty: "Dentiste", availableDate: "2024-02-05", location: [48.8666, 2.3522] },
    { id: 3, name: "Dr. Albert Einstein", specialty: "Neurologue", availableDate: "2024-02-10", location: [48.8566, 2.3622] },
  ];

const About = () => {

    const [specialty, setSpecialty] = useState("");
    const [date, setDate] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);

    // Fonction de recherche
    const handleSearch = () => {
        const results = doctors.filter(
        (doc) =>
            (!specialty || doc.specialty.toLowerCase().includes(specialty.toLowerCase())) &&
            (!date || doc.availableDate === date)
        );
        setFilteredDoctors(results);
    };

    return(
        <div className="min-h-screen p-6 bg-gray-100">
      {/* Section Recherche */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Rechercher un Praticien</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Spécialité (ex: Cardiologue)" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button className="flex items-center gap-2" onClick={handleSearch}>
            <Search className="w-5 h-5" /> Rechercher
          </Button>
        </div>
      </div>

      {/* Section Résultats + Carte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des résultats */}
        <div className="grid grid-cols-2 gap-2">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <Card key={doc.id} className="max-w-fill shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl">{doc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Spécialité :</strong> {doc.specialty}</p>
                  <p><strong>Date Disponible :</strong> {doc.availableDate}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucun médecin trouvé.</p>
          )}
        </div>

        {/* Carte Interactive */}
        <div className="h-[400px] bg-white shadow-lg rounded-lg overflow-hidden">
          <MapContainer key={filteredDoctors.length} center={[48.8566, 2.3522]} zoom={12} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredDoctors.map((doc) => (
              <Marker key={doc.id} position={doc.location}>
                <Popup>
                  <strong>{doc.name}</strong>
                  <br />
                  {doc.specialty}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
    );
}

export default About;
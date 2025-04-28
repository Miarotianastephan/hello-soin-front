import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MapPinIcon,
  Building,
  PhoneCall,
  CalendarCheck,
  PlusCircle,
} from "lucide-react";
import { ToggleLeft, ToggleRight } from "lucide-react";

/**
 * Composant "Cabinets" avec mode consultation et édition de l'agenda.
 */
const Cabinets = () => {
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "" });

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: envoyer formData au serveur ou state global
    console.log("Sauvegarde de l'agenda:", formData);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <Card className="border rounded bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Édition de l'agenda</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-xs"
              >
                Retour
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border rounded p-2 text-sm"
                  placeholder="Nom de l'agenda"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="border rounded p-2 text-sm"
                  required
                />
              </div>
              <Button type="submit" className="self-end text-xs">
                Enregistrer
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-end">
            <Button
              variant="default"
              size="sm"
              className="text-xs bg-white text-gray-900 border border-gray-900 shadow-none"
              onClick={handleEditClick}
            >
              <PlusCircle className="mr-1" /> Ajouter agenda
            </Button>
          </div>
          <div
            className={`border-b-2 rounded p-4 ${
              isActive ? "bg-green-50" : "bg-gray-100"
            }`}
          >
            <CardHeader>
              <div className="flex items-center text-sm font-bold gap-2">
                <div onClick={handleToggle} className="cursor-pointer">
                  {isActive ? (
                    <ToggleLeft size={28} color="green" />
                  ) : (
                    <ToggleRight size={28} color="red" />
                  )}
                </div>
                <CardTitle>Cabinet Montmartre - Paris 18e</CardTitle>
              </div>
              <CardDescription className="mt-1 text-xs text-gray-600">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <MapPinIcon size={18} /> 12 Rue des Abbesses, 75009 Paris
                  </div>
                  <div className="flex items-center gap-1">
                    <Building size={18} /> 2<sup>e</sup> étage, interphone 07
                  </div>
                  <div className="flex items-center gap-1">
                    <PhoneCall size={18} /> 01 45 67 89 10
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-xs leading-relaxed text-gray-900">
                Adipiscing periaut ut labore exumdol do quis. Adipiscing et
                deserunt pretium est laborios consequat minim. Lorem cillum
                cupidatat irure do. Duis nisi est cupidatat eu labore et velit
                officia et deserunt consectetur cupidatat aliqua cillum ad sit
                voluptate.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <img
                  src="https://img.freepik.com/photos-gratuite/salle-travail-vide-medecins-bureau-technologie_482257-14017.jpg"
                  alt="Cabinet 1"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <img
                  src="https://img.freepik.com/photos-gratuite/cabinet-medical-moderne-vide-ayant-documents-maladie-table-equipee-mobilier-contemporain-lieu-travail-hospitalier-sans-personne-pret-pour-consultation-maladie-soutien-medical_482257-35871.jpg"
                  alt="Cabinet 2"
                  className="w-full h-auto rounded-md shadow-sm"
                />
                <img
                  src="https://img.freepik.com/photos-gratuite/personne-au-bureau-du-materiel-instruments-medicaux-pour-effectuer-visite-controle-patient-pour-soins-sante-armoire-vide-outils-pour-consulter-personnes-malades-espace-professionnel_482257-31975.jpg"
                  alt="Cabinet 3"
                  className="w-full h-auto rounded-md shadow-sm"
                />
              </div>
              <Button variant="default" className="self-start text-xs">
                <CalendarCheck className="mr-1" /> Voir l'agenda
              </Button>
            </CardFooter>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cabinets;

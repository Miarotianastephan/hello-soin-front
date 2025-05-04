import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  MapPinIcon,
  Building,
  PhoneCall,
  CalendarCheck,
  PlusCircle,
  PenSquare,
  Images,
  Save,
  CheckCircle,
} from "lucide-react";
import { ToggleLeft, ToggleRight } from "lucide-react";
const Cabinets = () => {
  const [isActive, setIsActive] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cabinetName: "",
    address: "",
    address2: "",
    phone: "",
    pmr: null,        // true = Oui, false = Non
    description: "",
    photos: [],       // File[]
  });

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      cabinetName: "",
      address: "",
      address2: "",
      phone: "",
      pmr: null,
      description: "",
      photos: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox" && name === "pmr") {
      setFormData({ ...formData, pmr: checked });
    } else if (type === "file") {
      setFormData({ ...formData, photos: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez envoyer formData au serveur
    console.log("Enregistrement cabinet :", formData);
    setIsEditing(false);
  };


  return (
    <div >
      {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-2 flex flex-col items-start justify-center">
                <div className="w-full sm:w-1/2">
                <p className="text-sm font-bold text-gray-900 mb-2">Où recevez vous vos patients ?</p>
                </div> 
                {/* Nom du cabinet */}
                <div className="w-full flex flex-col justify-center items-start">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Nom du cabinet
                  </label>
                  <input
                    type="text"
                    name="cabinetName"
                    value={formData.cabinetName}
                    onChange={handleChange}
                    placeholder="Entrer le nom de votre cabinet"
                    className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"/>
                </div>
      
                {/* Adresse complète */}
                <div className="w-full flex flex-col justify-center items-start">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Adresse complète <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Entrer votre adresse complète"
                    required
                    className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
                  />
                </div>
      
                {/* Complément d'adresse */}
                <div className="w-full flex flex-col justify-center items-start">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Complément d'adresse
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="Entrer le nom de votre complément d'adresse"
                   className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
                  />
                </div>
      
                {/* Téléphone du cabinet */}
                <div className="w-full flex flex-col justify-center items-start">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Téléphone du cabinet
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Entrer votre téléphone"
                   className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
                  />
                </div>
      
                {/* Accès PMR */}
                <div className="w-full sm:w-1/2 py-2">
                  <p className="block text-xs text-gray-700">Accès PMR</p>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pmr"
                        value="true"
                        checked={formData.pmr === true}
                        onChange={(e) => setFormData({ ...formData, pmr: true })}
                        className="form-radio"
                      />
                      <span className="ml-2 text-gray-700 text-xs">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="pmr"
                        value="false"
                        checked={formData.pmr === false}
                        onChange={(e) => setFormData({ ...formData, pmr: false })}
                        className="form-radio"
                      />
                      <span className="ml-2 text-gray-700 text-xs">Non</span>
                    </label>
                  </div>
                </div>
      
                {/* Description */}
                <div className="w-full flex flex-col justify-center items-start">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Entrer la description du cabinet"
                    rows={4}
                   className="text-xs border rounded py-2 w-full sm:w-1/2 px-1 my-1"
                  />
                </div>
      
                {/* Upload photos */}
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs  text-gray-700 w-full sm:w-1/2 text-start">
                    Téléchargez une ou plusieurs photos du cabinet
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-green-700 rounded-md cursor-pointer">
                    <div className="space-y-1 text-center">
                      <Images className="mx-auto  text-green-400" />
                      <div className="flex text-xs text-green-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white font-medium text-primary-600 hover:text-primary-500"
                        >
                          <span>Cliquer pour remplacer ou glisser-déposer</span>
                          <input
                            id="file-upload"
                            name="photos"
                            type="file"
                            accept=".svg,.png,.jpg,.jpeg,.gif"
                            multiple
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-green-500">
                        SVG, PNG, JPG ou GIF (max. 400 × 400px)
                      </p>
                    </div>
                  </div>
                </div>
      
                {/* Actions */}
                <div className="w-full sm:w-1/2">
               <div className="flex space-x-2">
                  <Button type="submit" className=" text-white text-xs rounded">
                    <Save/>
                    Enregistrer
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="text-xs rounded">
                    Annuler
                  </Button>
                </div>
               </div>
              </form>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-end">
            <Button
              variant="default"
              size="sm"
              className="text-xs bg-white text-gray-900 border border-gray-900 shadow-none"
              onClick={handleEditClick}
            >
              <PlusCircle className="mr-1" /> Ajouter un cabinet
            </Button>
          </div>
          <div
            className={`border rounded px-4 py-2 ${
              isActive ? "bg-white" : "bg-gray-100"
            }`}
          >
            <div className="my-2">
              <div className="flex items-center text-sm font-bold gap-2 ">
                <div onClick={handleToggle} className="cursor-pointer">
                  {isActive ? (
                    <ToggleRight size={35} color="#5DA781" />
                  ) : (
                    <ToggleLeft size={35} color="red" />
                  )}
                </div>
                <p className="text-gray-700">Cabinet Montmartre - Paris 18e</p>
              </div>
              <div className="mt-1 text-xs text-gray-600">
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
                  <div className="flex items-center gap-1">
                <CheckCircle size={18} /> <p>Acces PMR : <span className="text-green-400 font-bold">OUI</span></p>
              </div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-xs leading-relaxed text-gray-900">
                Adipiscing periaut ut labore exumdol do quis. Adipiscing et
                deserunt pretium est laborios consequat minim. Lorem cillum
                cupidatat irure do. Duis nisi est cupidatat eu labore et velit
                officia et deserunt consectetur cupidatat aliqua cillum ad sit
                voluptate.
              </p>
            </div>

            <div className="flex flex-col gap-4">
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
              <div className="flex w-full items-center justify-start self-start gap-2">
                <Button variant="default" className="text-xs rounded">
                  <CalendarCheck className="mr-1" /> Organiser l'agenda
                </Button>
                <Button variant="default" onClick={handleEditClick} className="bg-[#3d7056] text-xs rounded">
                  <PenSquare className="mr-1" /> Modifier<p className="sm:inline hidden">le cabinet</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cabinets;

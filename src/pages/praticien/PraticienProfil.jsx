import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Camera,
  CheckCircle,
  MapPin,
  HouseIcon,
  Video,
  SquarePen,
  Mail,
  Linkedin,
  Facebook,
  Building2
} from "lucide-react";
import Information from "./ProfileComponents/Information";
import Formation from "./ProfileComponents/Formation";
import TroubleManager from "./ProfileComponents/TroubleManager";
import Avis from "./ProfileComponents/Avis";
const TABS = [
  { id: "informations", label: "Informations" },
  { id: "formations", label: "Formations et expériences" },
  { id: "troubles", label: "Troubles et solutions" },
  { id: "cabinets", label: "Cabinets" },
  { id: "avis", label: "Avis patients" },
];

const PraticienProfil = () => {
  const [profilePic, setProfilePic] = useState("");
  const [activeTab, setActiveTab] = useState("informations"); // Onglet par défaut
  const navigate = useNavigate();

  // Au montage du composant, on vérifie si une URL est stockée dans le localStorage
  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  const handleChangePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
      // Enregistrer l'URL dans le localStorage
      localStorage.setItem("profilePic", url);
    }
  };

  const handleModifyProfile = () => {
    navigate("/completeProfile");
  };

  return (
    <div>
      {/* Carte du praticien */}
      <div className="flex items-center justify-between p-4 mx-5 border rounded ">
        {/* Colonne gauche : Avatar et informations */}
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-24 h-24 overflow-hidden ring-4 ring-gray-300">
              <AvatarImage
                src={profilePic}
                alt="Photo de profil"
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-500"
                >
                  <path d="M12 12c2.7 0 4.89-2.2 4.89-4.89S14.7 2.22 12 2.22 7.11 4.41 7.11 7.11 9.3 12 12 12zm0 2.67c-3.13 0-9.33 1.57-9.33 4.67v1.78h18.67v-1.78c0-3.1-6.2-4.67-9.34-4.67z" />
                </svg>
              </AvatarFallback>
            </Avatar>

            {/* Icône pour changer la photo */}
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer ring-2 ring-gray-300"
            >
              <Camera className="w-4 h-4 text-gray-500" />
            </label>
            <input
              type="file"
              id="profilePic"
              className="hidden"
              accept="image/*"
              onChange={handleChangePhoto}
            />
          </div>

          {/* Informations du praticien */}
          <div className="flex flex-col space-y-3">
            {/* Nom + badge Confirmé */}
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Durand Paul
              </h2>
              <div className="flex items-center px-2 py-1 space-x-1 text-xs text-green-700 bg-green-100 rounded">
                <CheckCircle className="w-4 h-4" />
                <span>Confirmé</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-800">
              <Mail className="w-4 h-4" color="white" fill="currentColor" />
              <span>moniela@gmail.com</span>
            </div>

            {/* Adresse */}
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-800">
              <MapPin className="w-4 h-4" color="white" fill="currentColor" />
              <span>
                1 boulevard des jeux olympiques sud, 78000 Versailles
              </span>
            </div>

            {/* Modalités (cabinet, distance, visio) */}
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>En cabinet</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <HouseIcon className="w-4 h-4" />
                <span>A domicile</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Video className="w-4 h-4" />
                <span>En visio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite : icônes réseaux sociaux (en haut) + bouton Modifier (en bas) */}
        <div className="flex flex-col items-end justify-between h-full space-y-10">
          {/* Icônes en haut */}
          <div className="flex mb-2 space-x-2">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Linkedin className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Facebook className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Bouton Modifier le profil (en bas) */}
          <button
            onClick={handleModifyProfile}
            className="inline-flex items-center px-4 py-2 mt-auto text-xs font-medium text-white bg-[#0f2b3d] rounded-sm hover:bg-[#14384f]"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Barre d'onglets */}
      <div className="flex items-center justify-start px-6 mt-4 space-x-6 text-sm">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 ${
                isActive
                  ? "text-[#5DA781] border-b-2 border-[#5DA781] font-semibold"
                  : "text-gray-700 hover:text-gray-900 font-semibold"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu conditionnel selon l'onglet actif */}
      <div className="mx-5 mt-4">
        {activeTab === "informations" && <Information />}
        {activeTab === "formations" && <Formation />}
        {activeTab === "troubles" && (<TroubleManager/>)}
        {activeTab === "cabinets" && (
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800">Cabinets</h2>
            <p className="mt-2 text-sm text-gray-600">
              Contenu à venir...
            </p>
          </div>
        )}
        {activeTab === "avis" && (
          <Avis/>
        )}
      </div>
    </div>
  );
};

export default PraticienProfil;

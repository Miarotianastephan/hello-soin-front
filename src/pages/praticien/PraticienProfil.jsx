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
  Building2,
  User,
  GraduationCap,
  Settings,
  Briefcase,
  Star,
  ScanHeart,
  MessagesSquare,
  MapPinHouse,
} from "lucide-react";
import Information from "./ProfileComponents/Information";
import Formation from "./ProfileComponents/Formation";
import TroubleManager from "./ProfileComponents/TroubleManager";
import Avis from "./ProfileComponents/Avis";
import { Button } from "@/components/ui/button";
import Cabinets from "./ProfileComponents/Cabinets";

const TABS = [
  { id: "informations", label: "Informations" },
  { id: "formations", label: "Formations et expériences" },
  { id: "troubles", label: "Troubles et solutions" },
  { id: "cabinets", label: "Cabinets" },
  { id: "avis", label: "Avis patients" },
];

const tabIcons = {
  informations: <User className="w-6 h-6" />,
  formations: <GraduationCap className="w-6 h-6" />,
  troubles: <ScanHeart className="w-6 h-6" />,
  cabinets: <MapPinHouse className="w-6 h-6" />,
  avis: <MessagesSquare className="w-6 h-6" />,
};

const PraticienProfil = () => {
  const [profilePic, setProfilePic] = useState("");
  const [activeTab, setActiveTab] = useState("informations"); // Onglet par défaut
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Configuration du viewport pour éviter le zoom manuel
  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");
    const contentValue = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    if (viewport) {
      viewport.setAttribute("content", contentValue);
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = contentValue;
      document.head.appendChild(meta);
    }
  }, []);

  // Suivi dynamique de la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Récupération de la photo de profil sauvegardée dans le localStorage
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
      localStorage.setItem("profilePic", url);
    }
  };

  const handleModifyProfile = () => {
    navigate("/completeProfile");
  };

  return (
    <div className="md:flex-row">
      {/* Profil du praticien */}
      <div className="flex flex-col md:flex-row items-start justify-between p-4 mx-5 border rounded bg-white">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          {/* Avatar + changement de photo */}
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
            {/* Nom et badge confirmé */}
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
              <span>durant@gmail.com</span>
            </div>
            {/* Adresse */}
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-800">
              <MapPin className="w-4 h-4" color="white" fill="currentColor" />
              <span>
                1 boulevard des jeux olympiques sud, 78000 Versailles
              </span>
            </div>
            {/* Modalités (cabinet, domicile, visio) */}
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
            {/* Bouton Modifier affiché uniquement sur mobile/tablette */}
            <div className="mt-4 md:hidden">
              <Button
                onClick={handleModifyProfile}
                className="inline-flex items-center px-2 py-2 text-xs font-medium text-white bg-[#0f2b3d] rounded-sm hover:bg-[#14384f]"
              >
                <SquarePen className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            </div>
          </div>
        </div>

        {/* Section destinée aux grands écrans (affichée en md et plus) */}
        <div className="hidden md:flex flex-col items-end justify-between space-y-8 h-full">
          {/* Icônes réseaux sociaux */}
          <div className="flex mb-2 space-x-2">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Linkedin className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Facebook className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          {/* Bouton Modifier le profil */}
          <Button
            onClick={handleModifyProfile}
            className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-[#0f2b3d] rounded-sm hover:bg-[#14384f]"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Modifier le profil
          </Button>
        </div>
      </div>

      {/* Onglets en mode desktop (affichés sur md et plus) */}
      <div className="hidden md:flex items-center justify-start px-6 mt-4 space-x-6 text-sm">
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
      <div className="mx-5 mt-4 mb-20 md:mb-4">
        {activeTab === "informations" && <Information />}
        {activeTab === "formations" && <Formation />}
        {activeTab === "troubles" && <TroubleManager />}
        {activeTab === "cabinets" && <Cabinets/>}
        {activeTab === "avis" && <Avis />}
      </div>

      {/* Barre d'onglets flottante pour mobile, placée en bas */}
      <div className="fixed z-50 bottom-0 left-0 right-0 md:hidden bg-white shadow-lg border-t p-2">
        <div className="flex justify-around">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded ${
                activeTab === tab.id
                  ? "bg-[#5DA781] text-white"
                  : "text-gray-700"
              }`}
            >
              {tabIcons[tab.id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PraticienProfil;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ArrowLeftCircle,
  Linkedin,
  Facebook,
  Save
} from "lucide-react";

const TOTAL_FIELDS = 15;

const CompleteProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // États pour la photo de profil et pour chaque champ
  const [profilePic, setProfilePic] = useState("");
  const [civilite, setCivilite] = useState("Monsieur");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobile, setMobile] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [siret, setSiret] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);

  // Au montage du composant, on récupère les données du localStorage
  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) setProfilePic(storedProfilePic);
    setCivilite(localStorage.getItem("civilite") || "Monsieur");
    setNom(localStorage.getItem("nom") || "");
    setPrenom(localStorage.getItem("prenom") || "");
    setDateNaissance(localStorage.getItem("dateNaissance") || "");
    setEmail(localStorage.getItem("email") || "");
    setTelephone(localStorage.getItem("telephone") || "");
    setMobile(localStorage.getItem("mobile") || "");
    setAdresse(localStorage.getItem("adresse") || "");
    setCodePostal(localStorage.getItem("codePostal") || "");
    setVille(localStorage.getItem("ville") || "");
    setSiret(localStorage.getItem("siret") || "");
    setLinkedinLink(localStorage.getItem("linkedinLink") || "");
    setFacebookLink(localStorage.getItem("facebookLink") || "");
    setDescription(localStorage.getItem("description") || "");
  }, []);

  // Calcul et mise à jour du pourcentage de complétion
  useEffect(() => {
    const fields = [
      profilePic,
      civilite,
      nom,
      prenom,
      dateNaissance,
      email,
      telephone,
      mobile,
      adresse,
      codePostal,
      ville,
      siret,
      linkedinLink,
      facebookLink,
      description
    ];
    const filled = fields.filter((f) => f && f.trim() !== "").length;
    setProgress(Math.round((filled / TOTAL_FIELDS) * 100));
  }, [profilePic, civilite, nom, prenom, dateNaissance, email, telephone, mobile, adresse, codePostal, ville, siret, linkedinLink, facebookLink, description]);

  // Sauvegarde toutes les informations dans le localStorage
  const handleSave = () => {
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("civilite", civilite);
    localStorage.setItem("nom", nom);
    localStorage.setItem("prenom", prenom);
    localStorage.setItem("dateNaissance", dateNaissance);
    localStorage.setItem("email", email);
    localStorage.setItem("telephone", telephone);
    localStorage.setItem("mobile", mobile);
    localStorage.setItem("adresse", adresse);
    localStorage.setItem("codePostal", codePostal);
    localStorage.setItem("ville", ville);
    localStorage.setItem("siret", siret);
    localStorage.setItem("linkedinLink", linkedinLink);
    localStorage.setItem("facebookLink", facebookLink);
    localStorage.setItem("description", description);
    alert("Informations sauvegardées !");
  };

  // Fonctions de gestion de l'image
  const handleFile = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
      localStorage.setItem("profilePic", url);
    }
  };

  const handleChangePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleModifyProfile = () => {
    navigate("/profil");
  };

  return (
    <div className="relative">
      {/* En-tête avec informations du praticien */}
      <div className="flex items-center justify-between px-4  rounded">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <button
              onClick={handleModifyProfile}
              className="inline-flex items-center px-4 py-2 mt-auto text-xs font-medium text-white bg-[#0f2b3d] rounded hover:bg-[#14384f]"
            >
              <ArrowLeftCircle className="w-4 h-4" size={15} />
            </button>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-800">
                Informations de votre profil
              </h2>
            </div>
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-800">
              <span>
                Il s'agit de vos informations personnelles que vous pouvez mettre à jour à tout moment.
              </span>
            </div>
          </div>
        </div>
        {/* Cercle de progression dynamique */}
        <div className="flex flex-col items-end justify-between h-full space-y-10">
          <div className="flex mb-2 space-x-2">
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <svg className="w-8 h-8" viewBox="0 0 36 36">
                <path
                  className="text-gray-300"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeWidth="3.8"
                  strokeDasharray={`${progress}, 100`}
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text
                  x="18"
                  y="20.35"
                  className="text-xs font-semibold fill-gray-600"
                  textAnchor="middle"
                >
                  {progress}%
                </text>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carte de chargement de la photo */}
      <div className="flex items-center justify-between p-4 mx-5 mb-4 border rounded-md">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-24 h-24 rounded ring-gray-300">
              <AvatarImage
                src={profilePic}
                alt="Photo de profil"
                className="object-cover w-full h-full rounded-none"
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
            <span className="text-xs font-semibold text-gray-700">
              Photo de profil
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md cursor-pointer w-120"
            onClick={handleDropZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <svg
              className="w-5 h-5 mb-2 text-[#5DA781]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V7.125A2.625 2.625 0 015.625 4.5h12.75A2.625 2.625 0 0121 7.125V16.5M3 16.5l3.75-3.75M21 16.5l-3.75-3.75M8.25 8.25h7.5M12 8.25v7.5"
              />
            </svg>
            <label className="text-xs text-[#5DA781]">
              Cliquer pour remplacer ou glisser-déposer
            </label>
            <input
              type="file"
              id="profilePic"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleChangePhoto}
            />
            <p className="mt-1 text-xs text-[#5DA781]">
              SVG, PNG, JPG ou GIF (max. 400 x 400px)
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'informations */}
      <div className="flex flex-col md:flex-row items-start w-full px-6 my-4">
        {/* Partie gauche : Informations personnelles */}
        <div className="w-full md:w-1/2 rounded-md mr-4">
          <span className="text-sm font-semibold text-gray-900">
            Information personnelle
          </span>
          <div className="mb-4 mt-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Civilité *
            </label>
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              value={civilite}
              onChange={(e) => setCivilite(e.target.value)}
            >
              <option className="text-xs">Monsieur</option>
              <option className="text-xs">Madame</option>
              <option className="text-xs">Mademoiselle</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="Dupont"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Prénom *
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="Elise"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Date de naissance *
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="dupont@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="06 35 36 00 92"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="tel"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="06 36 36 00 92"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="15 Rue des Lilas"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Code Postal
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                placeholder="10015"
                value={codePostal}
                onChange={(e) => setCodePostal(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Ville
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                placeholder="Versailles"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Numéro de Siret
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              placeholder="802 345 678 00012"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Type de consultations
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Cabinet
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Visio
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Domicile
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Type de patient
            </label>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Tous publics
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Hommes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Femmes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Séniors
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Adolescentes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Enfants
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Jeunes mamans
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Moyens de paiement
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Carte bancaire
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Chèque
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input type="checkbox" className="mr-1" /> Espèce
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
              rows={5}
              placeholder="Décrivez votre pratique, votre parcours, vos spécificités..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Images de présentation
            </label>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md cursor-pointer w-full">
              <svg
                className="w-5 h-5 mb-2 text-[#5DA781]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V7.125A2.625 2.625 0 015.625 4.5h12.75A2.625 2.625 0 0121 7.125V16.5M3 16.5l3.75-3.75M21 16.5l-3.75-3.75M8.25 8.25h7.5M12 8.25v7.5"
                />
              </svg>
              <p className="text-xs text-[#5DA781]">Cliquer pour ajouter ou glisser-déposer</p>
              <p className="mt-1 text-xs text-[#5DA781]">
                SVG, PNG, JPG ou GIF (max. 400 x 400px)
              </p>
            </div>
          </div>
        </div>

        {/* Partie droite : Réseaux sociaux */}
        <div className="w-full md:w-1/2 border p-4 rounded mt-4 md:mt-0">
          <span className="text-sm font-semibold text-gray-900">
            Réseaux sociaux
          </span>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <Linkedin className="w-5 h-5 text-blue-600 mr-2" />
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                placeholder="Lien LinkedIn"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Facebook className="w-5 h-5 text-blue-800 mr-2" />
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                placeholder="Lien Facebook"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'enregistrement en bas à droite */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;

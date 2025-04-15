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
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";

const MANDATORY_FIELDS = 15; // Nombre total de champs obligatoires

const CompleteProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // États pour les champs du formulaire et les erreurs
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
  const [consultationTypes, setConsultationTypes] = useState([]); // ex: Cabinet, Visio, Domicile
  const [patientTypes, setPatientTypes] = useState([]);         // ex: Tous publics, Hommes, Femmes, etc.
  const [paymentMethods, setPaymentMethods] = useState([]);       // ex: Carte bancaire, Chèque, Espèce
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Récupération des données depuis le localStorage au montage
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

  // Mise à jour du pourcentage de complétion pour les champs obligatoires
  useEffect(() => {
    const fields = [
      profilePic ? 1 : 0,
      civilite && civilite.trim() !== "" ? 1 : 0,
      nom && nom.trim() !== "" ? 1 : 0,
      prenom && prenom.trim() !== "" ? 1 : 0,
      dateNaissance && dateNaissance.trim() !== "" ? 1 : 0,
      email && email.trim() !== "" ? 1 : 0,
      mobile && mobile.trim() !== "" ? 1 : 0,
      adresse && adresse.trim() !== "" ? 1 : 0,
      codePostal && codePostal.trim() !== "" ? 1 : 0,
      ville && ville.trim() !== "" ? 1 : 0,
      siret && siret.trim() !== "" ? 1 : 0,
      description && description.trim() !== "" ? 1 : 0,
      consultationTypes.length > 0 ? 1 : 0,
      patientTypes.length > 0 ? 1 : 0,
      paymentMethods.length > 0 ? 1 : 0,
    ];
    const filled = fields.reduce((acc, cur) => acc + cur, 0);
    setProgress(Math.round((filled / MANDATORY_FIELDS) * 100));
  }, [
    profilePic,
    civilite,
    nom,
    prenom,
    dateNaissance,
    email,
    mobile,
    adresse,
    codePostal,
    ville,
    siret,
    description,
    consultationTypes,
    patientTypes,
    paymentMethods,
  ]);

  // Fonction générique pour basculer l'état d'une option dans les groupes de checkbox
  const handleToggle = (option, state, setState) => {
    if (state.includes(option)) {
      setState(state.filter((item) => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  // Fonction de validation des champs obligatoires
  const validateFields = () => {
    const newErrors = {};

    if (!profilePic) newErrors.profilePic = "La photo de profil est requise.";
    if (!civilite.trim()) newErrors.civilite = "La civilité est requise.";
    if (!nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!dateNaissance.trim())
      newErrors.dateNaissance = "La date de naissance est requise.";
    if (!email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Le format de l'email est invalide.";
    }
    // Téléphone est optionnel

    if (!mobile.trim()) newErrors.mobile = "Le numéro mobile est requis.";
    if (mobile && mobile.replace(/\D/g, "").length < 10)
      newErrors.mobile = "Le numéro mobile est invalide.";
    if (!adresse.trim()) newErrors.adresse = "L'adresse est requise.";
    if (!codePostal.trim())
      newErrors.codePostal = "Le code postal est requis.";
    if (!ville.trim()) newErrors.ville = "La ville est requise.";
    if (!siret.trim()) newErrors.siret = "Le numéro de Siret est requis.";
    if (!description.trim())
      newErrors.description = "La description est requise.";

    // Validation des groupes de checkbox (au moins une option doit être sélectionnée)
    if (consultationTypes.length === 0)
      newErrors.consultationTypes =
        "Veuillez sélectionner au moins un type de consultation.";
    if (patientTypes.length === 0)
      newErrors.patientTypes =
        "Veuillez sélectionner au moins un type de patient.";
    if (paymentMethods.length === 0)
      newErrors.paymentMethods =
        "Veuillez sélectionner au moins un moyen de paiement.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde dans le localStorage après validation
  const handleSave = () => {
    if (!validateFields()) {
      alert("Veuillez corriger les erreurs avant de sauvegarder.");
      return;
    }
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
    // Vous pouvez aussi sauvegarder les tableaux de checkbox si nécessaire.
    alert("Informations sauvegardées !");
  };

  // Gestion de la photo de profil
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
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 my-2 rounded">
        <div className="flex items-start space-x-4">
          <button
            onClick={handleModifyProfile}
            className="inline-flex items-center px-4 py-2 mt-auto text-xs font-medium text-white bg-[#0f2b3d] rounded hover:bg-[#14384f]"
          >
            <ArrowLeftCircle className="w-4 h-4" size={15} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-gray-800">
              Informations de votre profil
            </h2>
            <span className="text-xs text-gray-800">
              Mettez à jour vos informations personnelles.
            </span>
          </div>
        </div>
        {/* Cercle de progression */}
        <div className="flex flex-col items-end justify-between h-full space-y-10">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <svg className="w-8 h-8" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600"
                strokeWidth="3.8"
                strokeDasharray={`${progress}, 100`}
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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

      {/* Section photo de profil */}
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
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
                  <path d="M12 12c2.7 0 4.89-2.2 4.89-4.89S14.7 2.22 12 2.22 7.11 4.41 7.11 7.11 9.3 12 12 12zm0 2.67c-3.13 0-9.33 1.57-9.33 4.67v1.78h18.67v-1.78c0-3.1-6.2-4.67-9.34-4.67z" />
                </svg>
              </AvatarFallback>
            </Avatar>
            {errors.profilePic && (
              <span className="text-xs text-red-600">{errors.profilePic}</span>
            )}
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
              Civilité <span className="text-red-700">*</span>
            </label>
            <select
              className={`border ${
                errors.civilite ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              value={civilite}
              onChange={(e) => setCivilite(e.target.value)}
            >
              <option>Monsieur</option>
              <option>Madame</option>
              <option>Mademoiselle</option>
            </select>
            {errors.civilite && (
              <span className="text-xs text-red-600">{errors.civilite}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Nom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              className={`border ${
                errors.nom ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              placeholder="Dupont"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            {errors.nom && (
              <span className="text-xs text-red-600">{errors.nom}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Prénom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              className={`border ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              placeholder="Elise"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            {errors.prenom && (
              <span className="text-xs text-red-600">{errors.prenom}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Date de naissance <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              className={`border ${
                errors.dateNaissance ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
            />
            {errors.dateNaissance && (
              <span className="text-xs text-red-600">{errors.dateNaissance}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              placeholder="dupont@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-xs text-red-600">{errors.email}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Téléphone (facultatif)
            </label>
            <PhoneInput
              country="fr"
              localization="fr"
              onlyCountries={["fr", "de", "be", "it", "lu", "ch"]}
              value={telephone}
              onChange={(value) => setTelephone(value)}
              inputProps={{ name: "telephone", required: false }}
              inputStyle={{
                width: "100%",
                height: "20px",
                fontSize: "12px",
                border: "1px solid #e5e5e5",
              }}
              containerClass="phone-input"
              specialLabel=""
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Mobile <span className="text-red-700">*</span>
            </label>
            <PhoneInput
              country="fr"
              localization="fr"
              onlyCountries={["fr", "de", "be", "it", "lu", "ch"]}
              value={mobile}
              onChange={(value) => setMobile(value)}
              inputProps={{ name: "mobile", required: true }}
              inputStyle={{
                width: "100%",
                height: "20px",
                fontSize: "12px",
                border: "1px solid #e5e5e5",
              }}
              containerClass="phone-input"
              specialLabel=""
            />
            {errors.mobile && (
              <span className="text-xs text-red-600">{errors.mobile}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Adresse <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              className={`border ${
                errors.adresse ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              placeholder="15 Rue des Lilas"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
            {errors.adresse && (
              <span className="text-xs text-red-600">{errors.adresse}</span>
            )}
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Code Postal <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                className={`border ${
                  errors.codePostal ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 w-full text-xs`}
                placeholder="10015"
                value={codePostal}
                onChange={(e) => setCodePostal(e.target.value)}
              />
              {errors.codePostal && (
                <span className="text-xs text-red-600">{errors.codePostal}</span>
              )}
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-xs font-medium text-gray-700">
                Ville <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                className={`border ${
                  errors.ville ? "border-red-500" : "border-gray-300"
                } rounded px-3 py-2 w-full text-xs`}
                placeholder="Versailles"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
              {errors.ville && (
                <span className="text-xs text-red-600">{errors.ville}</span>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Numéro de Siret <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              className={`border ${
                errors.siret ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              placeholder="802 345 678 00012"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
            />
            {errors.siret && (
              <span className="text-xs text-red-600">{errors.siret}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Description <span className="text-red-700">*</span>
            </label>
            <textarea
              className={`border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded px-3 py-2 w-full text-xs`}
              rows={5}
              placeholder="Décrivez votre pratique, votre parcours, vos spécificités..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="text-xs text-red-600">{errors.description}</span>
            )}
          </div>
          {/* Groupes de checkbox */}
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Type de consultations <span className="text-red-700">*</span>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={consultationTypes.includes("Cabinet")}
                  onChange={() =>
                    handleToggle("Cabinet", consultationTypes, setConsultationTypes)
                  }
                />
                Cabinet
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={consultationTypes.includes("Visio")}
                  onChange={() =>
                    handleToggle("Visio", consultationTypes, setConsultationTypes)
                  }
                />
                Visio
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={consultationTypes.includes("Domicile")}
                  onChange={() =>
                    handleToggle("Domicile", consultationTypes, setConsultationTypes)
                  }
                />
                Domicile
              </label>
            </div>
            {errors.consultationTypes && (
              <span className="text-xs text-red-600">{errors.consultationTypes}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Type de patient <span className="text-red-700">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Tous publics")}
                  onChange={() =>
                    handleToggle("Tous publics", patientTypes, setPatientTypes)
                  }
                />
                Tous publics
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Hommes")}
                  onChange={() =>
                    handleToggle("Hommes", patientTypes, setPatientTypes)
                  }
                />
                Hommes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Femmes")}
                  onChange={() =>
                    handleToggle("Femmes", patientTypes, setPatientTypes)
                  }
                />
                Femmes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Séniors")}
                  onChange={() =>
                    handleToggle("Séniors", patientTypes, setPatientTypes)
                  }
                />
                Séniors
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Adolescentes")}
                  onChange={() =>
                    handleToggle("Adolescentes", patientTypes, setPatientTypes)
                  }
                />
                Adolescentes
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Enfants")}
                  onChange={() =>
                    handleToggle("Enfants", patientTypes, setPatientTypes)
                  }
                />
                Enfants
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={patientTypes.includes("Jeunes mamans")}
                  onChange={() =>
                    handleToggle("Jeunes mamans", patientTypes, setPatientTypes)
                  }
                />
                Jeunes mamans
              </label>
            </div>
            {errors.patientTypes && (
              <span className="text-xs text-red-600">{errors.patientTypes}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Moyens de paiement <span className="text-red-700">*</span>
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={paymentMethods.includes("Carte bancaire")}
                  onChange={() =>
                    handleToggle("Carte bancaire", paymentMethods, setPaymentMethods)
                  }
                />
                Carte bancaire
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={paymentMethods.includes("Chèque")}
                  onChange={() =>
                    handleToggle("Chèque", paymentMethods, setPaymentMethods)
                  }
                />
                Chèque
              </label>
              <label className="flex items-center text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={paymentMethods.includes("Espèce")}
                  onChange={() =>
                    handleToggle("Espèce", paymentMethods, setPaymentMethods)
                  }
                />
                Espèce
              </label>
            </div>
            {errors.paymentMethods && (
              <span className="text-xs text-red-600">{errors.paymentMethods}</span>
            )}
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
                placeholder="Lien LinkedIn (facultatif)"
                value={linkedinLink}
                onChange={(e) => setLinkedinLink(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Facebook className="w-5 h-5 text-blue-800 mr-2" />
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                placeholder="Lien Facebook (facultatif)"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex p-2 items-center justify-end w-full">
        <Button
          onClick={handleSave}
          className="flex items-center px-4 py-2 text-white text-xs font-medium rounded hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default CompleteProfile;

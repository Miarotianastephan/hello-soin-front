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
import axios from "axios";
import svg from "./image.svg";
import { useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL;


const MANDATORY_FIELDS = 15; // Nombre total de champs obligatoires
const FR_PHONE_LENGTH = 11;

const CompleteProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  // 1. Récupération de la donnée passée
  const location = useLocation();
  const initialImgFile = location.state?.imgFile || null;


  // États pour les champs du formulaire et les erreurs
  const [initialData, setInitialData] = useState(null);
  const [imgFile] = useState(initialImgFile);
  const [profilePic, setProfilePic] = useState(initialImgFile);
  const [profilPhotoFile, setProfilPhotoFile] = useState(null);
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
  const [consultationTypes, setConsultationTypes] = useState([]);
// Par :
const [patientTypes, setPatientTypes] = useState(() => {
  const storedPatients = localStorage.getItem('patientTypes');
  return storedPatients ? JSON.parse(storedPatients) : [];
});

const [paymentMethods, setPaymentMethods] = useState(() => {
  const storedPayments = localStorage.getItem('paymentMethods');
  return storedPayments ? JSON.parse(storedPayments) : [];
});
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupération des données existantes depuis l'API
  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const resp = await axios.get(
          `${API_URL}/praticien/get-info-praticien`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resp.data.success) {
          const d = resp.data.data;
          setInitialData(d);
          // If no local selection, show server image
          if (!profilPhotoFile) {
            setProfilePic(d.profil_photo || initialImgFile);
          }
          setInitialData(d);
          setProfilePic(d.profil_photo || initialImgFile);
          setInitialData(d);
          setCivilite(d.situation || "Monsieur");
          setNom(d.lastname || "");
          setPrenom(d.firstname || "");
          setDateNaissance(d.birthdate || "");
          setEmail(d.mail || "");
          setTelephone(d.phone_number || "");
          setMobile(d.mobile_number || "");
          setAdresse(d.adress || "");
          setCodePostal(d.postal_code || "");
          setVille(d.city || "");
          setSiret(d.practitioner_info.siret || "");
          setLinkedinLink(d.practitioner_info.linkedin_link || "");
          setFacebookLink(d.practitioner_info.facebook_link || "");
          setDescription(d.practitioner_info.profil_description || "");
          setConsultationTypes([
            d.practitioner_info.is_office_consult && "Cabinet",
            d.practitioner_info.is_visio_consult && "Visio",
            d.practitioner_info.is_home_consult && "Domicile",
          ].filter(Boolean));
        }
      } catch (err) {
        console.error("Erreur chargement données :", err);
      }
    };
    fetchPractitioner();
  }, []);

  // Mise à jour du pourcentage de complétion
  useEffect(() => {
    const fields = [
      profilePic ? 1 : 0,
      civilite.trim() ? 1 : 0,
      nom.trim() ? 1 : 0,
      prenom.trim() ? 1 : 0,
      dateNaissance.trim() ? 1 : 0,
      email.trim() ? 1 : 0,
      mobile.replace(/\D/g, "").length === FR_PHONE_LENGTH ? 1 : 0,
      adresse.trim() ? 1 : 0,
      codePostal.trim() ? 1 : 0,
      ville.trim() ? 1 : 0,
      siret.trim() ? 1 : 0,
      description.trim() ? 1 : 0,
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

  // Formatage numéros FR: espaces tous les 2 chiffres
  const formatFRNumber = (num) => {
    return num.match(/.{1,2}/g)?.join(' ') || num;
  };

  // Handlers pour téléphone & mobile
  const handleTelephoneChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, FR_PHONE_LENGTH);
    setTelephone(formatFRNumber(digits));
  };
  const handleMobileChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, FR_PHONE_LENGTH);
    setMobile(formatFRNumber(digits));
  };

  // Validation des champs obligatoires
  const validateFields = () => {
    const newErrors = {};
    if (!profilePic) newErrors.profilePic = "La photo de profil est requise.";
    if (!civilite.trim()) newErrors.civilite = "La civilité est requise.";
    if (!nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!prenom.trim()) newErrors.prenom = "Le prénom est requis.";
    if (!dateNaissance.trim()) newErrors.dateNaissance = "La date de naissance est requise.";
    if (!email.trim()) newErrors.email = "L'email est requis.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Le format de l'email est invalide.";
    if (!mobile.trim()) newErrors.mobile = "Le numéro mobile est requis.";
    else if (mobile.replace(/\D/g, "").length !== FR_PHONE_LENGTH)
      newErrors.mobile = "Le numéro mobile doit comporter exactement 10 chiffres.";
    if (telephone.trim() && telephone.replace(/\D/g, "").length !== FR_PHONE_LENGTH)
      newErrors.telephone = "Le numéro de téléphone doit comporter exactement 10 chiffres.";
    if (!adresse.trim()) newErrors.adresse = "L'adresse est requise.";
    if (!codePostal.trim()) newErrors.codePostal = "Le code postal est requis.";
    if (!ville.trim()) newErrors.ville = "La ville est requise.";
    if (!siret.trim()) newErrors.siret = "Le numéro de Siret est requis.";
    if (!description.trim()) newErrors.description = "La description est requise.";
    if (consultationTypes.length === 0) newErrors.consultationTypes = "Veuillez sélectionner au moins un type de consultation.";
    if (patientTypes.length === 0) newErrors.patientTypes = "Veuillez sélectionner au moins un type de patient.";
    if (paymentMethods.length === 0) newErrors.paymentMethods = "Veuillez sélectionner au moins un moyen de paiement.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Toggle pour checkboxes
  const handleToggle = (option, state, setState) => {
    setState(
      state.includes(option)
        ? state.filter(item => item !== option)
        : [...state, option]
    );
  };

  const handleChangePhoto = e => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilPhotoFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setProfilPhotoFile(file);
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const profilePicRef = useRef();
  const getProfilePicSrc = () => {
    if (profilPhotoFile) {
      if (!profilePicRef.current || profilePicRef.current.file !== profilPhotoFile) {
        profilePicRef.current = {
          file: profilPhotoFile,
          url: URL.createObjectURL(profilPhotoFile)
        };
      }
      return profilePicRef.current.url;
    }
    if (profilePic) return `${API_URL}/image${profilePic}`;
    return undefined;
  };

  // Ajouter ce tableau constant en haut du composant
const EXAMPLE_DESCRIPTIONS = [
  "Ostéopathe D.O. diplômée de l'Institut Supérieur d'Ostéopathie, je propose des consultations adaptées à tous les publics avec une approche globale du corps. Spécialisée dans le traitement des douleurs chroniques et l'accompagnement des sportifs.",
  "Praticien en médecine douce avec 10 ans d'expérience, j'accompagne mes patients dans la gestion du stress et les troubles musculo-squelettiques. Certifié en posturologie et techniques myofasciales.",
  "Ostéopathe spécialisé en pédiatrie et périnatalité, j'accueille les nourrissons, femmes enceintes et jeunes mamans. Approche douce et respectueuse des spécificités de chaque patient."
];

// Ajouter cette fonction dans le composant
const generateRandomDescription = () => {
  const randomIndex = Math.floor(Math.random() * EXAMPLE_DESCRIPTIONS.length);
  setDescription(EXAMPLE_DESCRIPTIONS[randomIndex]);
};

  const handleDropZoneClick = () => fileInputRef.current?.click();
  const handleDragOver = e => e.preventDefault();
 

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateFields()) {
      alert("Veuillez corriger les erreurs avant de sauvegarder.");
      return;
    }
      // Ajoutez ces deux lignes ici
  localStorage.setItem('patientTypes', JSON.stringify(patientTypes));
  localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));

  setIsSubmitting(true);

    console.log('coucou'+ imgFile)
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const formPayload = new FormData();

      // Champs simples
      formPayload.append("firstname", prenom);
      formPayload.append("lastname", nom);
      formPayload.append("mail", email);
      formPayload.append("birthdate", dateNaissance);
      formPayload.append("situation", civilite);
      formPayload.append("mobile_number", mobile.replace(/\D/g, ''));  // envoi sans espaces
      formPayload.append("phone_number", telephone.replace(/\D/g, ''));  // envoi sans espaces
      formPayload.append("adress", adresse);
      formPayload.append("postal_code", codePostal);
      formPayload.append("city", ville);
      formPayload.append("siret", siret);
      formPayload.append("profil_description", description);
      formPayload.append("facebook_link", facebookLink);
      formPayload.append("linkedin_link", linkedinLink);

      // Consultations
      formPayload.append("is_office_consult", consultationTypes.includes("Cabinet"));
      formPayload.append("is_visio_consult", consultationTypes.includes("Visio"));
      formPayload.append("is_home_consult", consultationTypes.includes("Domicile"));

      // En mode création ou modification
      formPayload.append("isCompletion", (!initialData).toString());

      if (profilPhotoFile) {
        formPayload.append("profil_photo", profilPhotoFile);
      }
      const resp = await axios.post(
        `${API_URL}/praticien/complete-profil`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resp.data.success) {
        navigate("/profil", { state: { profileNow: profilePic } });
      }
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModifyProfile = () => navigate("/profil");

  return (
    <div className="relative">
      {/* En-tête */}
      <div className="flex items-center justify-between px-4 my-2 rounded">
        <div className="flex items-start space-x-4">
          <button
            type="button"
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
        <div className="flex items-center">
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
        </div>
      </div>

      {/* Section photo de profil */}
      <div className="flex items-center justify-between p-4 mx-5 mb-4 border rounded-md">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24 rounded ring-gray-300">
            <AvatarImage
              src={getProfilePicSrc()}
              alt="Photo de profil"
              className="object-cover w-full h-full rounded-none"
            />
            <AvatarFallback>
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
                <path d="M12 12c2.7 0 4.89-2.2..." />
              </svg>
            </AvatarFallback>
          </Avatar>
          {errors.profilePic && (
            <span className="text-xs text-red-600">{errors.profilePic}</span>
          )}
          <span className="text-xs font-semibold text-gray-700">
            Photo de profil
          </span>

          <div
            className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md cursor-pointer w-120"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            <img
              src={svg}
              alt="upload icon"
              className="w-5 h-5 mb-2 text-[#5DA781]"
              style={{ filter: 'invert(43%) sepia(77%) saturate(180%) hue-rotate(75deg)' }}
            />
            <label className="text-xs text-[#5DA781]">
              Cliquer ou glisser-déposer
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
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
        {/* Gauche: infos persos */}
        <div className="w-full md:w-1/2 rounded-md mr-4 space-y-4">
          {/* Civilité */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Civilité <span className="text-red-700">*</span>
            </label>
            <select
              value={civilite}
              onChange={e => setCivilite(e.target.value)}
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.civilite ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option>Monsieur</option>
              <option>Madame</option>
              <option>Mademoiselle</option>
            </select>
            {errors.civilite && <p className="text-red-600 text-xs">{errors.civilite}</p>}
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Nom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Dupont"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nom && <p className="text-red-600 text-xs">{errors.nom}</p>}
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Prénom <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              placeholder="Élise"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.prenom && <p className="text-red-600 text-xs">{errors.prenom}</p>}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Date de naissance <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              value={dateNaissance}
              onChange={e => setDateNaissance(e.target.value)}
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.dateNaissance ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dateNaissance && <p className="text-red-600 text-xs">{errors.dateNaissance}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Email <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="dupont@gmail.com"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Téléphone (facultatif)
            </label>
            <PhoneInput
              country="fr"
              localization="fr"
              onlyCountries={["fr"]}
              value={telephone}
              onChange={handleTelephoneChange}
              inputProps={{ name: "telephone", required: false }}
              inputStyle={{ width: "100%", fontSize: "12px", height: "32px" }}
              containerClass="phone-input"
              specialLabel=""
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Mobile <span className="text-red-700">*</span>
            </label>
            <PhoneInput
              country="fr"
              localization="fr"
              onlyCountries={["fr"]}
              value={mobile}
              onChange={setMobile}
              inputProps={{ name: "mobile", required: true }}
              inputStyle={{ width: "100%", fontSize: "12px", height: "32px" }}
              containerClass="phone-input"
              specialLabel=""
            />
            {errors.mobile && <p className="text-red-600 text-xs">{errors.mobile}</p>}
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Adresse <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              placeholder="15 Rue des Lilas"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.adresse ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.adresse && <p className="text-red-600 text-xs">{errors.adresse}</p>}
          </div>

          {/* Code Postal & Ville */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700">
                Code Postal <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={codePostal}
                onChange={e => setCodePostal(e.target.value)}
                placeholder="10015"
                className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                  errors.codePostal ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.codePostal && <p className="text-red-600 text-xs">{errors.codePostal}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium text-gray-700">
                Ville <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                value={ville}
                onChange={e => setVille(e.target.value)}
                placeholder="Versailles"
                className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                  errors.ville ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ville && <p className="text-red-600 text-xs">{errors.ville}</p>}
            </div>
          </div>

          {/* SIRET */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Numéro de Siret <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={siret}
              onChange={e => setSiret(e.target.value)}
              placeholder="802 345 678 00012"
              className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
                errors.siret ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.siret && <p className="text-red-600 text-xs">{errors.siret}</p>}
          </div>

          {/* Description */}
<div>
  <div className="flex justify-between items-center">
    <label className="block text-xs font-medium text-gray-700">
      Description <span className="text-red-700">*</span>
    </label>
    <button
      type="button"
      onClick={generateRandomDescription}
      className="text-xs text-[#5DA781] hover:text-[#5DA781] mb-1 underline"
    >
      Generer un exemple
    </button>
  </div>
  <textarea
    rows={4}
    value={description}
    onChange={e => setDescription(e.target.value)}
    placeholder="Décrivez votre pratique, votre parcours..."
    className={`mt-1 block w-full text-xs rounded border px-3 py-2 ${
      errors.description ? "border-red-500" : "border-gray-300"
    }`}
  />
  {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
</div>

          {/* Checkboxes: consultations */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Type de consultations <span className="text-red-700">*</span>
            </label>
            <div className="flex space-x-4 mt-1 text-xs">
              {["Cabinet", "Visio", "Domicile"].map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={consultationTypes.includes(opt)}
                    onChange={() => handleToggle(opt, consultationTypes, setConsultationTypes)}
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.consultationTypes && <p className="text-red-600 text-xs">{errors.consultationTypes}</p>}
          </div>

          {/* Checkboxes: patient types */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Type de patient <span className="text-red-700">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              {[
                "Tous publics",
                "Hommes",
                "Femmes",
                "Séniors",
                "Adolescentes",
                "Enfants",
                "Jeunes mamans"
              ].map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={patientTypes.includes(opt)}
                    onChange={() => handleToggle(opt, patientTypes, setPatientTypes)}
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.patientTypes && <p className="text-red-600 text-xs">{errors.patientTypes}</p>}
          </div>

          {/* Checkboxes: payment methods */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Moyens de paiement <span className="text-red-700">*</span>
            </label>
            <div className="flex space-x-4 mt-1 text-xs">
              {["Carte bancaire", "Chèque", "Espèce"].map(opt => (
                <label key={opt} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={paymentMethods.includes(opt)}
                    onChange={() => handleToggle(opt, paymentMethods, setPaymentMethods)}
                    className="mr-1"
                  />
                  {opt}
                </label>
              ))}
            </div>
            {errors.paymentMethods && <p className="text-red-600 text-xs">{errors.paymentMethods}</p>}
          </div>
        </div>

        {/* Droite: réseaux sociaux */}
        <div className="w-full md:w-1/2 border p-4 rounded mt-4 md:mt-0 space-y-4">
          <span className="text-sm font-semibold text-gray-900">Réseaux sociaux</span>
          <div className="flex items-center space-x-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              value={linkedinLink}
              onChange={e => setLinkedinLink(e.target.value)}
              placeholder="Lien LinkedIn (facultatif)"
              className="mt-1 block w-full text-xs rounded border px-3 py-2 border-gray-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Facebook className="w-5 h-5 text-blue-800" />
            <input
              type="text"
              value={facebookLink}
              onChange={e => setFacebookLink(e.target.value)}
              placeholder="Lien Facebook (facultatif)"
              className="mt-1 block w-full text-xs rounded border px-3 py-2 border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end p-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 text-white text-xs font-medium rounded bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};

export default CompleteProfile;

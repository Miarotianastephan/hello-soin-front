import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, Save } from 'lucide-react';
import { findAllSpeciality } from '@/services/speciality-services';
import { useQuery } from '@tanstack/react-query';

// Liste des établissements suggérés (exemple)
// const SUGGESTED_ESTABLISHMENTS = [
//   "Faculté de Médecine Paris Descartes",
//   "Faculté de Médecine Paris Diderot",
//   "Hôpital Cochin - Paris 14",
//   "Hôpital Necker-Enfants Malades - Paris 5",
// ];

// Liste des spécialités suggérées (exemple)
const SUGGESTED_SPECIALTIES = [
  "Formation praticien en EFT",
  "Médecine générale",
  "Chirurgie",
  "Pédiatrie",
];

const EditFormation = ({ onBack, onSave, initialFormation }) => {
  const [annee, setAnnee] = useState('');
  const [diplome, setDiplome] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [files, setFiles] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  // Suggestions pour établissement et spécialité
  const [etablissementSuggestions, setEtablissementSuggestions] = useState([]);
  const [specialiteSuggestions, setSpecialiteSuggestions] = useState([]);

  const [errors, setErrors] = useState({});

  // les specialites
  const { data: specialities = [], isLoading: isLoadingSpecialities, isError: isErrorSpecialities } = useQuery({
    queryKey: ['specialities'],
    queryFn: findAllSpeciality,
    staleTime: 1000 * 60 * 10, // données valides pendant 10 minutes
  });

  // EditFormation.js - useEffect
  useEffect(() => {
    if (initialFormation) {
      setAnnee(initialFormation.obtained_at || '');
      setDiplome(initialFormation.certification_name || '');
      setEtablissement(initialFormation.institution_name || '');
      setSpecialite(
        initialFormation.formation_specialities[0]?.pract_speciality.Speciality.id_speciality || ''
      );
    }
  }, [initialFormation]);


  // Fonction de validation des champs
  const validate = () => {
    const newErrors = {};
    if (!annee) newErrors.annee = "L'année est requise.";
    if (!diplome) newErrors.diplome = "Le diplôme est requis.";
    if (!specialite) newErrors.specialite = "La spécialité est requise.";
    if (!etablissement) newErrors.etablissement = "L'établissement est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des suggestions pour l'établissement
  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setEtablissement(value);
    // if (value.length > 1) {
    //   const suggestions = SUGGESTED_ESTABLISHMENTS.filter(item =>
    //     item.toLowerCase().includes(value.toLowerCase())
    //   );
    //   setEtablissementSuggestions(suggestions);
    // } else {
    //   setEtablissementSuggestions([]);
    // }
  };

  // Gestion des suggestions pour la spécialité
  const handleSpecialiteChange = (e) => {
    const value = e.target.value;
    setSpecialite(value);
    if (value.length > 1) {
      const suggestions = SUGGESTED_SPECIALTIES.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSpecialiteSuggestions(suggestions);
    } else {
      setSpecialiteSuggestions([]);
    }
  };

  // Sélection d'une suggestion pour établissement
  const handleEtablissementSuggestionClick = (suggestion) => {
    setEtablissement(suggestion);
    setEtablissementSuggestions([]);
  };

  // Sélection d'une suggestion pour spécialité
  const handleSpecialiteSuggestionClick = (suggestion) => {
    setSpecialite(suggestion);
    setSpecialiteSuggestions([]);
  };

  // Gestion de la sauvegarde avec validation
  const handleSave = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("obtained_at", annee);
    formData.append("certification_name", diplome);
    formData.append("id_pract_speciality", specialite); // Nom correct du champ
    formData.append("institution_name", etablissement);
    files.forEach((file, index) => {
      formData.append("support_docs", file); // nom du champ côté backend
    });

    try {
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const id_formation = initialFormation ? initialFormation.id_formation : null ;
      console.log(id_formation);
      onSave(formData, id_formation);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la formation:", error);
      alert("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  return (
    <div className="mb-4 mx-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold"></span>
        <Button
          onClick={onBack}
          className="text-xs font-semibold text-gray-700 bg-gray-200 rounded shadow-none hover:bg-gray-400 hover:text-gray-700"
        >
          <ArrowLeftCircle /> Retour
        </Button>
      </div>
      <div className="flex items-center justify-start pb-4 mt-4 border-b-2">
        <span className="text-sm font-semibold">Formation</span>
      </div>
      <div className="flex flex-col items-start justify-center pb-4 mt-4 border-b-2">
        {/* Champ Année */}
        <div className="w-full md:w-1/2 mt-2">
        <label className="block mb-1 text-xs font-medium text-gray-700">
          Année <span className='text-red-700'>*</span>
        </label>
        <select
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          className={`w-full px-3 py-2 text-xs border rounded ${errors.annee ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">-- Sélectionner une année --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.annee && (
          <p className="text-red-500 text-xs mt-1">{errors.annee}</p>
        )}
      </div>
        {/* Champ Diplôme */}
        <div className="w-full md:w-1/2 mt-2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Diplôme <span className='text-red-700'>*</span>
          </label>
          <input
            type="text"
            placeholder="ex: Master en Gestion"
            value={diplome}
            onChange={(e) => setDiplome(e.target.value)}
            className={`w-full px-3 py-2 text-xs border rounded ${errors.diplome ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.diplome && (
            <p className="text-red-500 text-xs mt-1">{errors.diplome}</p>
          )}
        </div>
        {/* Champ Spécialité avec suggestion */}
        <div className="w-full md:w-1/2 mt-2 relative">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Spécialité <span className="text-red-700">*</span>
          </label>
          <select
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            className={`w-full px-3 py-2 text-xs border rounded ${
              errors.specialite ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Choisir une spécialité --</option>
            {specialities.map((spec) => (
              <option key={spec.id_speciality} value={spec.id_speciality}>
                {spec.designation}
              </option>
            ))}
          </select>
          {errors.specialite && (
            <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>
          )}
        </div>
        {/* Champ Établissement avec autocomplétion */}
        <div className="w-full md:w-1/2 mt-2 relative">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Établissement <span className='text-red-700'>*</span>
          </label>
          <input
            type="text"
            placeholder="ex: Université Paris 2"
            value={etablissement}
            onChange={handleEtablissementChange}
            className={`w-full px-3 py-2 text-xs border rounded ${errors.etablissement ? 'border-red-500' : 'border-gray-300'}`}
          />
          {etablissementSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto">
              {etablissementSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleEtablissementSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {errors.etablissement && (
            <p className="text-red-500 text-xs mt-1">{errors.etablissement}</p>
          )}
        </div>
        {/* Pièces justificatives */}
        <div className="mt-3 mb-2 relative">
  <label className="block mb-1 text-xs font-medium text-gray-700">
    Télécharger une ou plusieurs pièces justificatives
  </label>

  <div className="relative">
    {/* Input transparent qui recouvre la div */}
    <input
      type="file"
      accept=".svg,.png,.jpg,.jpeg,.gif,.pdf"
      multiple
      onChange={(e) => setFiles(Array.from(e.target.files))}
      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
    />

    {/* Zone visuelle cliquable */}
    <div className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md w-full">
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
        SVG, PNG, JPG, GIF ou PDF
      </p>
    </div>
  </div>

  {/* Affichage des fichiers sélectionnés */}
  {files.length > 0 && (
    <ul className="mt-2 text-xs text-gray-700 list-disc list-inside">
      {files.map((file, index) => (
        <li key={index}>{file.name}</li>
      ))}
    </ul>
  )}
</div>
      </div>
      <div className="flex items-center justify-end w-full mt-4 space-x-2">
        <Button onClick={onBack} className="text-xs bg-red-700 rounded shadow-none">
          Annuler
        </Button>
        <Button onClick={handleSave} className="text-xs rounded shadow-none">
          <Save size={15} />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default EditFormation;
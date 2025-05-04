import React, { useState, useEffect, Fragment } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeftCircle, Save, ChevronDown, Check } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { findAllSpeciality } from '@/services/speciality-services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/services/api';
// Dropdown générique
const Dropdown = ({ options, selected, onChange, placeholder }) => (
  <Listbox value={selected} onChange={onChange}>
    <div className="relative bg-white ">
      <Listbox.Button className="w-full text-left px-3 py-2 text-xs border rounded-md flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-green-500">
        <span>{selected ? options.find(o => o.value === selected)?.label : placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-auto text-xs">
          {options.map(option => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active }) => `cursor-pointer select-none px-3 py-2 ${active ? 'bg-gray-100' : ''}`}
            >
              {({ selected }) => (
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selected && <Check className="w-4 h-4 text-green-500" />}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);

// Liste des établissements suggérés
const SUGGESTED_ESTABLISHMENTS = [
  "IMTC – Institut de Médecine Traditionnelle Chinoise",
  "CFA-MTC – Centre de Formation en Acupuncture et Médecine Chinoise",
  "Alderaan Formation - Organisme de formation en Médecine chinoise",
  "S.F.E.R.E. – Société Française d’Étude et de Recherche en Énergétique",
  "ISMC – Institut Shao Yang de Médecine Chinoise",
  "IEATC – Institut Européen d’Acupuncture Traditionnelle Chinoise",
  "Ling Dao – École de Médecine Chinoise",
  "I.M.E.C.O.F. – Institut de Médecine Chinoise et de Formation",
  "CFAE – Centre de Formation en Acupuncture Energétique",
  "I.D.E.M.C. – Institut de Développement de la Médecine Chinoise",
  "École Shao Yin",
  "ISUPNAT – Institut Supérieur de Naturopathie",
  "ADNR Formations",
  "CENATHO – Collège Européen de Naturopathie Traditionnelle Holistique",
  "EURONATURE",
  "ENA & MNC – École de Naturopathie Appliquée",
  "École Plantasanté",
  "Tapovan Open University of Yoga and Ayurveda",
  "Institut Européen d’Études Védiques (IEEV)",
  "AYURVANA Formations",
  "Gayaveda Académie",
  "École de Shiatsu Thérapeutique (EST Paris)",
  "École Angevine de Shiatsu",
  "École de Shiatsu Masunaga (Zen Shiatsu)",
  "Académie de Shiatsu Koho",
  "École Supérieure d’Ostéopathie (ESO)",
  "Institut Toulousain d’Ostéopathie (ITO)",
  "Collège Ostéopathique Européen (COE)",
  "Institut Supérieur d’Ostéopathie (ISOSTEO)",
  "ÉKTC – École de Kinésiologie et Techniques Complémentaires",
  "Institut Français de Kinésiologie Appliquée (IFKA)",
  "EKMA – École de Kinésiologie et Méthodes Associées",
  "Corps Mémoire Formation",
  "Institut Franco-Européen de Chiropraxie (IFEC)",
  "École Européenne de Toucher Psycho-Corporel (IFCC)",
  "École du Corps-Conscience",
  "Institut Cassiopée",
  "CERFPA – Centre d’Études et de Recherches en Fasciapulsologie Appliquée",
  "Université Fernando Pessoa (en partenariat avec Bernard Payrau)",
  "Centre de Formation en Fasciathérapie Intégrative",
  "École Azenday",
  "TEMANA – École des Métiers du Bien-Être",
  "Cassiopee Formation",
  "Biopulse",
  "Zemassage",
  "Institut de Formation à la Sophrologie (IFS)",
  "Académie de Sophrologie de Paris",
  "École Française Supérieure de Sophrologie (EFSS)",
  "Institut Cassiopée",
  "École de Sophrologie du Languedoc",
  "Académie de Sophrologie de Bourgogne",
  "Psynapse",
  "ARCHE - Académie de Recherche et Connaissances en Hypnose Ericksonienne",
  "Xtrëma Formation",
  "Institut Français d’Hypnose Humaniste et Ericksonienne (IFHE)",
  "Cassiopee Formation",
  "Institut Cassiopée",
  "IFRDP (Institut Francophone de la Relation d’Aide et de la Psychothérapie)",
  "IFPEC (Institut Français de Psychothérapie Émotionnelle et Cognitive)",
  "EFPP (École Française de Psychologie et de Psychanalyse)",
  "Institut Européen de Formation en Thérapies Psychocorporelles (IEFTP)",
  "Linkup Coaching",
  "MHD Formation",
  "Institut de Coaching International (ICI)",
  "Lunion Formation Coaching",
  "Académie Européenne de Coaching (AEC)"
];

// Liste des spécialités suggérées (exemple)
const SUGGESTED_SPECIALTIES = [
  "Formation praticien en EFT",
  "Médecine générale",
  "Chirurgie",
  "Pédiatrie",
];

const EditFormation = ({ onBack, onSave, initialFormation }) => {
  const queryClient = useQueryClient();
  const [annee, setAnnee] = useState('');
  const [diplome, setDiplome] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [etablissementSuggestions, setEtablissementSuggestions] = useState([]);
  const [specialiteSuggestions, setSpecialiteSuggestions] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const yearOptions = years.map(y => ({ value: y, label: y.toString() }));
  const [isNewSpeciality, setIsNewSpeciality] = useState(false);
  const [newSpeciality, setNewSpeciality] = useState('');
  const [isAddingSpeciality, setIsAddingSpeciality] = useState(false);
  const [newSpecialityError, setNewSpecialityError] = useState('');

  // les specialites
  const { data: specialities = [] } = useQuery({
    queryKey: ['specialities'],
    queryFn: findAllSpeciality,
    staleTime: 600000,
  });

  const specialOptions = specialities.map(spec => ({ value: spec.id_speciality, label: spec.designation }));


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

   // Fonction pour ajouter une nouvelle spécialité
   const handleAddSpeciality = async () => {
    if (!newSpeciality.trim()) {
      setNewSpecialityError('Veuillez entrer le nom de la spécialité.');
      return;
    }
    
    setIsAddingSpeciality(true);
    try {
      const response = await fetch(`${API_URL}/specs/addSpeciality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ designation: newSpeciality }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Erreur lors de la création');
      
      // Rafraîchir la liste des spécialités
      await queryClient.invalidateQueries('specialities');
      // Sélectionner la nouvelle spécialité
      setSpecialite(data.data.id_speciality);
      // Réinitialiser le formulaire
      setIsNewSpeciality(false);
      setNewSpeciality('');
    } catch (error) {
      console.error('Erreur:', error);
      setNewSpecialityError(error.message);
    } finally {
      setIsAddingSpeciality(false);
    }
  };


  // Gestion des suggestions pour l'établissement
  const handleEtablissementChange = (e) => {
    const value = e.target.value;
    setEtablissement(value);
    if (value.length > 1) {
      const suggestions = SUGGESTED_ESTABLISHMENTS.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setEtablissementSuggestions(suggestions);
    } else {
      setEtablissementSuggestions([]);
    }
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

  const validate = () => {
    const newErrors = {};
    if (!annee) newErrors.annee = "L'année est requise.";
    if (!diplome) newErrors.diplome = "Le diplôme est requis.";
    if (!specialite) newErrors.specialite = "La spécialité est requise.";
    if (!etablissement) newErrors.etablissement = "L'établissement est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const formData = new FormData();
    formData.append("obtained_at", annee);
    formData.append("certification_name", diplome);
    formData.append("id_pract_speciality", specialite);
    formData.append("institution_name", etablissement);
    files.forEach(file => formData.append("support_docs", file));
    const id_formation = initialFormation?.id_formation || null;
    onSave(formData, id_formation);
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
      <div className="mt-4 space-y-4">
        {/* Année */}
        <div className="w-full md:w-1/2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Année <span className="text-red-700">*</span>
          </label>
          <Dropdown
            options={yearOptions}
            selected={annee}
            onChange={setAnnee}
            placeholder="-- Sélectionner une année --"
            className=" text-gray-700"
          />
          {errors.annee && <p className="text-red-500 text-xs mt-1">{errors.annee}</p>}
        </div>

        {/* Diplôme */}
        <div className="w-full md:w-1/2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Diplôme <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            placeholder="Sophrologie"
            value={diplome}
            onChange={e => setDiplome(e.target.value)}
            className={`w-full px-3 py-2 text-xs border rounded ${errors.diplome ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.diplome && <p className="text-red-500 text-xs mt-1">{errors.diplome}</p>}
        </div>

        {/* Spécialité */}
        {/* Section Spécialité modifiée */}
      <div className="w-full md:w-1/2">
        <label className="flex items-center justify-between mb-1 text-xs font-medium text-gray-700">
         <span className='flex items-center justify-start'> Spécialité <span className="text-red-700">*</span></span>
          <label className="ml-2 inline-flex items-center">
            <input
              type="checkbox"
              checked={isNewSpeciality}
              onChange={(e) => {
                setIsNewSpeciality(e.target.checked);
                setNewSpecialityError('');
              }}
              className="form-checkbox h-3 w-3 text-green-500"
            />
            <span className="ml-1 text-xs text-gray-600">Ajouter une nouvelle spécialité</span>
          </label>
        </label>
        
        {isNewSpeciality ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom de la nouvelle spécialité"
                value={newSpeciality}
                onChange={(e) => {
                  setNewSpeciality(e.target.value);
                  setNewSpecialityError('');
                }}
                className={`w-full px-3 py-2 text-xs border rounded ${
                  newSpecialityError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                onClick={handleAddSpeciality}
                disabled={isAddingSpeciality || !newSpeciality.trim()}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAddingSpeciality ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
            {newSpecialityError && (
              <p className="text-red-500 text-xs mt-1">{newSpecialityError}</p>
            )}
          </div>
        ) : (
          <Dropdown
            options={specialOptions}
            selected={specialite}
            onChange={setSpecialite}
            placeholder="-- Choisir une spécialité --"
            className=" text-gray-700"
          />
        )}
        {!isNewSpeciality && errors.specialite && (
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
                  className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-200 z-100"
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
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
      <div className="flex items-center justify-start w-full mt-4 space-x-2">
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
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateFnsCalendar from './sidebarComponent/DateFnsCalendar';
import "../../../App.css";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AgendaSidebar = ({
  todayAppointments,
  currentDate,
  setCurrentDate,
  practiceFilter,
  togglePracticeFilter,
  specifiqueOnly,
  setSpecifiqueOnly,
  onSelectNextAvailabilityPractice,
}) => {
  // État pour afficher/masquer le dropdown de sélection de prochaine disponibilité
  const [showDropdown, setShowDropdown] = useState(false);
  // État pour la sélection de pratiques (aucune sélection par défaut)
  const [selectedPracticeForAvailability, setSelectedPracticeForAvailability] = useState([]);

  // Récupération des pratiques via l'API
  const [practices, setPractices] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8888/api/practices")
      .then(res => res.json())
      .then(data => setPractices(data))
      .catch(err => console.error("Erreur lors du fetch des pratiques", err));
  }, []);

  // Retourne la couleur associée à une pratique
  const getColorByPractice = (practiceType) => {
    const practice = practices.find(p => p.nom_discipline.toLowerCase() === practiceType.toLowerCase());
    return practice ? practice.code_couleur : '#000000';
  };

  // Modification de la sélection d'une pratique (multi‑select)
  const handlePracticeChange = (practice) => {
    let newValue = [];
    if (selectedPracticeForAvailability.includes(practice)) {
      newValue = selectedPracticeForAvailability.filter(p => p !== practice);
    } else {
      newValue = [...selectedPracticeForAvailability, practice];
    }
    setSelectedPracticeForAvailability(newValue);
    // Si aucune pratique n'est sélectionnée, on considère que tous doivent être affichés
    if (newValue.length === 0) {
      onSelectNextAvailabilityPractice(practices.map(p => p.nom_discipline));
    } else {
      onSelectNextAvailabilityPractice(newValue);
    }
  };

  return (
    <div className="w-42 flex flex-col gap-4 bg-[#BCE2D326] text-[#405969] text-xs relative">
      {/* Bouton d'accès aux prochaines disponibilités */}
      <Button
        className="mt-4 mx-4 bg-[#405969] shadow-none text-xs text-white"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Prochaine disponibilité <ChevronRight />
      </Button>
      {showDropdown && (
        <div className="absolute top-12 left-4 bg-white shadow-md border p-2 z-20">
          <p className="mb-2 font-bold">Sélectionnez une pratique</p>
          {practices.map((practice) => (
            <label key={practice.id_pratique} className="flex items-center mb-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPracticeForAvailability.includes(practice.nom_discipline)}
                onChange={() => handlePracticeChange(practice.nom_discipline)}
              />
              <span
                className="ml-2 inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getColorByPractice(practice.nom_discipline) }}
              ></span>
              <span className="ml-1">{practice.nom_discipline}</span>
            </label>
          ))}
          <button
            className="mt-2 text-xs text-blue-500 underline"
            onClick={() => setShowDropdown(false)}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Calendrier avec réduction de taille */}
      <div className="mx-4 overflow-hidden">
        <div className="transform scale-98 origin-top-left">
          <DateFnsCalendar
            selected={currentDate}
            onSelect={setCurrentDate}
            locale={fr}
            renderHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="flex items-center justify-between mb-2 text-xs text-[#405969]">
                <Button variant="ghost" size="sm" onClick={decreaseMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium text-[#405969] text-xs capitalize">
                  {format(date, 'LLLL yyyy', { locale: fr })}
                </span>
                <Button variant="ghost" size="sm" onClick={increaseMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </div>
      </div>

      {/* Filtres sur les types de rendez‑vous */}
      <div className="mx-4 border-b-2 pb-2 text-xs text-[#405969]">
        <div>
          <h4 className="font-bold mt-2 mb-4 text-xs">Types de rendez‑vous</h4>
        </div>
        {practices.map((practice) => (
          <label key={practice.id_pratique} className="flex items-center mb-4 text-xs">
            <input
              type="checkbox"
              checked={practiceFilter[practice.nom_discipline.toLowerCase()]}
              onChange={() => togglePracticeFilter(practice.nom_discipline.toLowerCase())}
            />
            <span
              className="ml-2 w-3 h-3 rounded-full"
              style={{ backgroundColor: getColorByPractice(practice.nom_discipline) }}
            ></span>
            <span className="ml-1">{practice.nom_discipline}</span>
          </label>
        ))}
      </div>

      {/* Légende */}
      <div className="mx-4 mt-4 text-xs text-[#405969]">
        <h4 className="font-bold mb-2 text-xs">Légende :</h4>
        <div className="flex items-center mb-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-gray-500"></span>
          <span className="ml-2 text-xs">Indisponible</span>
        </div>
        <div className="flex items-center mb-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-white"></span>
          <span className="ml-2 text-xs">Encore disponible</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="ml-2 text-xs">Heure actuelle</span>
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar;

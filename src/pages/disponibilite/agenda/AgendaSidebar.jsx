import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateFnsCalendar from './sidebarComponent/DateFnsCalendar';
import "../../../App.css";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import BASE_URL from '@/pages/config/baseurl';
const AgendaSidebar = ({
  todayAppointments,
  currentDate,
  setCurrentDate,
  practiceFilter,
  togglePracticeFilter,
  specifiqueOnly,
  setSpecifiqueOnly,
  selectedPractice,       // prop pour la pratique fixée
  setSelectedPractice,
  setIdPractice,
  setIDurationPractice    // fonction pour modifier la pratique fixée
}) => {
  // Récupération des pratiques via l'API
  const [practices, setPractices] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/practices`)
      .then(res => res.json())
      .then(data => setPractices(data))
      .catch(err => console.error("Erreur lors du fetch des pratiques", err));
  }, []);

  // Retourne la couleur associée à une pratique
  const getColorByPractice = (practiceType) => {
    const practice = practices.find(p => p.nom_discipline.toLowerCase() === practiceType.toLowerCase());
    return practice ? practice.code_couleur : '#000000';
  };

  // Nouvel état pour contrôler l'affichage du dropdown pour fixer la pratique
  const [showFixerDropdown, setShowFixerDropdown] = useState(false);

  return (
    <div className="w-42 flex flex-col gap-4 bg-[#BCE2D326] text-[#405969] text-xs relative">

        {/* Dropdown pour fixer la pratique à utiliser pour un rendez‑vous */}
        <div className="mx-4 mt-4 text-xs text-[#405969]">
        <Button
          variant="outline"
          className="flex items-center gap-1 text-xs w-full justify-between text-[#ffff] bg-[#0f2b3d]"
          onClick={() => setShowFixerDropdown(prev => !prev)}
        >
          {selectedPractice ? `${selectedPractice}` : 'Prochaine disponibilite'}
          <ChevronDown className="h-4 w-4" />
        </Button>
        {showFixerDropdown && (
          <div className="border p-2 mt-1 shadow-lg rounded bg-white absolute z-50 w-[calc(100%-1rem)]">
            {practices.map(practice => (
              <div
                key={practice.id_pratique}
                className={`flex items-center mb-2 cursor-pointer text-xs ${selectedPractice === practice.nom_discipline ? 'font-bold' : ''}`}
                onClick={() => {
                  setSelectedPractice(selectedPractice === practice.nom_discipline ? null : practice.nom_discipline);
                  setIdPractice(selectedPractice === practice.id_pratique ? null : practice.id_pratique);
                  setIDurationPractice(selectedPractice === practice.duree ? null : practice.duree);
                  setShowFixerDropdown(false);
                }}
              >
                <input
                  type="radio"
                  readOnly
                  checked={selectedPractice === practice.nom_discipline}
                  className="mr-2"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorByPractice(practice.nom_discipline) }}
                ></span>
                <span className="ml-2">{practice.nom_discipline}</span>
              </div>
            ))}
          </div>
        )}
      </div>

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

    

      {/* Filtres sur les types de rendez‑vous (déjà existants) */}
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

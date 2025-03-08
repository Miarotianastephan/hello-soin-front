import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DateFnsCalendar from './sidebarComponent/DateFnsCalendar';
import { getColorByType } from './utils/agendaUtils';
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
}) => {
  return (
    <div className="w-42 flex flex-col gap-4 bg-[#BCE2D326] text-[#405969] text-xs">
      {/* Bouton d'accès aux prochaines disponibilités */}
      <Button className="mt-4 mx-4 bg-[#405969] shadow-none text-xs text-white">
        Prochaine disponibilité <ChevronRight />
      </Button>

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

      {/* Filtres sur les pratiques */}
      <div className="mx-4 border-b-2 pb-2 text-xs text-[#405969]">
        <div>
          <h4 className="font-bold mt-2 mb-4 text-xs">Tous les pratiques</h4>
        </div>
        <label className="flex items-center mb-4 text-xs">
          <input
            type="checkbox"
            checked={practiceFilter.tous}
            onChange={() => togglePracticeFilter('tous')}
          />
          <span className="ml-1 text-xs">Toutes</span>
        </label>
        <label className="flex items-center mb-4 text-xs">
          <input
            type="checkbox"
            checked={practiceFilter.naturopathie}
            onChange={() => togglePracticeFilter('naturopathie')}
          />
          <span
            className="ml-2 w-3 h-3 rounded-full"
            style={{ backgroundColor: getColorByType('naturopathie') }}
          ></span>
          <span className="ml-1 text-xs">Naturopathie</span>
        </label>
        <label className="flex items-center mb-4 text-xs">
          <input
            type="checkbox"
            checked={practiceFilter.acuponcture}
            onChange={() => togglePracticeFilter('acuponcture')}
          />
          <span
            className="ml-2 w-3 h-3 rounded-full"
            style={{ backgroundColor: getColorByType('acuponcture') }}
          ></span>
          <span className="ml-1 text-xs">Acupuncture</span>
        </label>
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={practiceFilter.hypnose}
            onChange={() => togglePracticeFilter('hypnose')}
          />
          <span
            className="ml-2 w-3 h-3 rounded-full"
            style={{ backgroundColor: getColorByType('hypnose') }}
          ></span>
          <span className="ml-1 text-xs">Hypnose</span>
        </label>
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
          <span className="ml-2 text-xs">Déjà pris</span>
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar;

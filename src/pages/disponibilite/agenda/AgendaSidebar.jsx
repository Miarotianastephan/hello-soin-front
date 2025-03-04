import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { getColorByType } from './utils/agendaUtils';
import "../../../App.css";

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
    <div className="w-64 flex flex-col gap-4 bg-[#565D6D] text-white">
      {/* Calendrier avec header personnalisé */}
      <div>
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={setCurrentDate}
          locale={fr} // Ajout de la locale ici si le composant la supporte
          renderHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div className="flex items-center justify-between mb-2">
              <button onClick={decreaseMonth} className="p-2 text-white">
                &lt;
              </button>
              <span className="font-medium text-white">
                {format(date, 'LLLL yyyy', { locale: fr })}
              </span>
              <button onClick={increaseMonth} className="p-2 text-white">
                &gt;
              </button>
            </div>
          )}
          dayClassName={(date) =>
            currentDate &&
            date.toDateString() === currentDate.toDateString()
              ? 'bg-blue-500 text-white rounded-full'
              : ''
          }
        />
      </div>

      {/* Liste des rendez‑vous du jour */}
      <h3 className="font mb-2 px-4">
        Aujourd'hui ({format(new Date(), 'dd MMMM yyyy', { locale: fr })})
      </h3>
      <div className="px-2 h-[300px] overflow-auto scrollbar-custom">
        {todayAppointments.length === 0 ? (
          <p className='pl-2 text-gray-50'>Aucun rendez‑vous pour aujourd'hui.</p>
        ) : (
          <ul className="text-sm w-full">
            {todayAppointments.map((app, idx) => (
              <li 
                key={idx} 
                className="border-b p-2 mb-1 grid grid-cols-[1fr_3fr_3fr] items-start gap-2"
              >
                {/* Indicateur de couleur */}
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getColorByType(app.practice.type) }}
                  ></span>
                </div>

                {/* Informations sur la pratique et le patient */}
                <div className="text-left">
                  <div>{app.practice.start} - {app.practice.end}</div>
                  <div>{app.patient.nom}</div>
                  <div>{app.patient.numero}</div>
                </div>

                {/* Type de pratique */}
                <div className="text-center rounded-lg" style={{ backgroundColor: getColorByType(app.practice.type) }}>
                  <p>{app.practice.type}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filtres sur les pratiques */}
      <div className="px-4">
        <h4 className="font-bold mt-2 mb-1">Filtrer par pratique :</h4>
        <label className="flex items-center mb-1">
          <input
            type="checkbox"
            checked={practiceFilter.tous}
            onChange={() => togglePracticeFilter('tous')}
          />
          <span className="ml-1">Toutes</span>
        </label>
        <label className="flex items-center mb-1">
          <input
            type="checkbox"
            checked={practiceFilter.naturopathie}
            onChange={() => togglePracticeFilter('naturopathie')}
          />
          <span className="ml-1" style={{ color: getColorByType('naturopathie') }}>
            Naturopathie
          </span>
        </label>
        <label className="flex items-center mb-1">
          <input
            type="checkbox"
            checked={practiceFilter.acuponcture}
            onChange={() => togglePracticeFilter('acuponcture')}
          />
          <span className="ml-1" style={{ color: getColorByType('acuponcture') }}>
            Acuponcture
          </span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={practiceFilter.hypnose}
            onChange={() => togglePracticeFilter('hypnose')}
          />
          <span className="ml-1" style={{ color: getColorByType('hypnose') }}>
            Hypnose
          </span>
        </label>
      </div>
    </div>
  );
};

export default AgendaSidebar;

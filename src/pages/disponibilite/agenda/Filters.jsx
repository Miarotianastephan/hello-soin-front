// /src/components/Agenda/Filters.jsx
import { parseISO, isSameDay } from "date-fns";
import { Clock } from "lucide-react";
import { getColorByType } from "./utils/calendarUtils";

const Filters = ({ 
  selectedTypes, 
  setSelectedTypes, 
  selectedTimeRanges, 
  setSelectedTimeRanges, 
  PRACTICE_TYPES, 
  slotsData 
}) => {

  const handleTypeFilter = (type) => {
    if (type === 'all') {
      setSelectedTypes(['all']);
    } else {
      const newSelected = selectedTypes.includes(type) 
        ? selectedTypes.filter(t => t !== type && t !== 'all') 
        : [...selectedTypes.filter(t => t !== 'all'), type];
      setSelectedTypes(newSelected.length > 0 ? newSelected : ['all']);
    }
  };

  const handleTimeRangeFilter = (rangeId) => {
    if (rangeId === 'all') {
      setSelectedTimeRanges(['all']);
    } else {
      const newSelected = selectedTimeRanges.includes(rangeId)
        ? selectedTimeRanges.filter(r => r !== rangeId && r !== 'all')
        : [...selectedTimeRanges.filter(r => r !== 'all'), rangeId];
      setSelectedTimeRanges(newSelected.length > 0 ? newSelected : ['all']);
    }
  };

  return (
    <div className="w-64 pr-4 mt-5">
      <div className="space-y-6 w-full">
        <div className="mt-8 w-full">
          <h3 className="font-medium mb-3 flex flex-row items-center gap-4">
            <Clock color="#0B2839FF" /> Rendez-vous aujourd'hui
          </h3>
          <div className="max-h-64 overflow-y-auto">
            {slotsData
              .filter(slot => {
                const today = new Date();
                return isSameDay(parseISO(slot.date), today);
              })
              .flatMap(slot => slot.slots)
              .flatMap(slot => slot.pratiques)
              .flatMap(pratique => 
                (pratique.appointments || []).map((appt, index) => (
                  <div 
                    key={`${appt.start}_${index}`} 
                    className="mb-2 p-2 rounded" 
                    style={{
                      borderLeft: `4px solid ${getColorByType(pratique.type)}`
                    }}
                  >
                    <div className="text-sm font-medium">{appt.name}</div>
                    <div className="text-xs">{appt.start}</div>
                    <div className="text-xs">{PRACTICE_TYPES[pratique.type]}</div>
                  </div>
                ))
              )
            }
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Types de rendez-vous</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes('all')}
                onChange={() => handleTypeFilter('all')}
                className="form-checkbox h-4 w-4"
              />
              Toutes
            </label>
            {Object.entries(PRACTICE_TYPES).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(key)}
                  onChange={() => handleTypeFilter(key)}
                  className="form-checkbox h-4 w-4"
                />
                <span 
                  className="w-4 h-4 rounded-sm inline-block"
                  style={{ backgroundColor: getColorByType(key) }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

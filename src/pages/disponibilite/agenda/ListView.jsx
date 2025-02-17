// /src/components/Agenda/ListView.jsx

import { format, parseISO } from "date-fns";
import { getColorByType } from "./utils/calendarUtils";

const ListView = ({ slotsData, searchQuery, PRACTICE_TYPES }) => {
  const allAppointments = slotsData.flatMap(day => 
    day.slots.flatMap(slot => 
      slot.pratiques.flatMap(pratique => 
        (pratique.appointments || []).map(appointment => ({
          ...appointment,
          date: day.date,
          type: pratique.type,
          start: pratique.start,
          end: pratique.end
        }))
      )
    )
  );

  const filtered = allAppointments.filter(appt => 
    appt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.telephone.includes(searchQuery) ||
    appt.motif.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border p-4">
      <h3 className="font-bold mb-4">Liste de tous les rendez-vous</h3>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Nom</th>
            <th className="border p-2 text-left">Motif</th>
            <th className="border p-2 text-left">Téléphone</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Heure</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((appt, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2 flex items-center gap-2">
                <span 
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColorByType(appt.type) }}
                ></span>
                {PRACTICE_TYPES[appt.type]}
              </td>
              <td className="border p-2">{appt.name}</td>
              <td className="border p-2">{appt.motif}</td>
              <td className="border p-2">{appt.telephone}</td>
              <td className="border p-2">
                {format(parseISO(appt.date), 'dd/MM/yyyy')}
              </td>
              <td className="border p-2">{appt.start} {/*- {appt.end}-*/}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;

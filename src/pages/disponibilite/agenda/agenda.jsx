import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  format, addDays, subDays, startOfWeek, startOfMonth, 
  eachDayOfInterval, isSameDay, subWeeks, addWeeks, subMonths, addMonths, 
  endOfMonth, parseISO, addMinutes, isAfter
} from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, List, ChevronLeft, ChevronRight } from "lucide-react";

const colors = {
  naturopathie: "border-green-800", 
  acuponcture: "border-blue-800",
  hypnose: "border-yellow-800"
};

const backgroundColors = {
  naturopathie: "bg-green-800", 
  acuponcture: "bg-blue-800",
  hypnose: "bg-yellow-800"
};

const eventsData = {
  "2025-02-03": [
    { start: "13:00", type: "naturopathie", date: "2025-02-03", details: "Consultation de naturopathie avec Jean Dupont." },
    { start: "16:00", type: "acuponcture", date: "2025-02-03", details: "Séance d'acuponcture avec Marie Curie." },
    { start: "15:01", type: "acuponcture", date: "2025-02-03", details: "Séance d'acuponcture avec Lucie Martin." },
    { start: "10:00", type: "naturopathie", date: "2025-02-03", details: "Consultation de naturopathie avec Alice Durand." },
  ],
  "2025-02-04": [
    { start: "09:00", type: "hypnose", date: "2025-02-04", details: "Séance d'hypnose avec Paul Smith." },
  ],
};

const getDurationInMinutes = (type) => {
  switch (type) {
    case 'naturopathie':
      return 120;
    case 'acuponcture':
      return 30;
    case 'hypnose': 
      return 75;
    default:
      return 0;
  }
};

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [patientInfo, setPatientInfo] = useState({ name: "", details: "" });

  const handlePrev = () => {
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
    if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
    if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startOfWeekDate, end: addDays(startOfWeekDate, 6) });

  const startOfMonthDate = startOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: startOfMonthDate, end: endOfMonth(startOfMonthDate) });

  const getEventsForDay = (day) => {
    const dayString = format(day, "yyyy-MM-dd");
    return eventsData[dayString] || [];
  };

  const getEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes);
    endDate.setMinutes(endDate.getMinutes() + duration);
    return format(endDate, "HH:mm");
  };

  const handleCreateAppointment = () => {
    if (!selectedEvent) return;

    const newEvent = {
      ...selectedEvent,
      details: `Rendez-vous avec ${patientInfo.name}. ${patientInfo.details}`,
      isCreated: true
    };

    const dayString = selectedEvent.date;
    eventsData[dayString] = eventsData[dayString].map(event => 
      event.start === selectedEvent.start && event.type === selectedEvent.type ? newEvent : event
    );

    setSelectedEvent(newEvent);
    setIsCreatingAppointment(false);
    setPatientInfo({ name: "", details: "" });
  };

  const allEvents = Object.entries(eventsData)
    .flatMap(([date, events]) => 
      events.map(event => ({ 
        ...event, 
        datetime: parseISO(`${date}T${event.start}:00`),
        endTime: getEndTime(event.start, getDurationInMinutes(event.type))
      }))
    )
    .sort((a, b) => a.datetime - b.datetime)
    .filter(event => isAfter(event.datetime, new Date()));

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setView("day")} className={view === "day" ? "bg-green-500 text-white" : "bg-gray-600"}>
          <Clock className="mr-2" size={16} /> Jour
        </Button>
        <Button onClick={() => setView("week")} className={view === "week" ? "bg-green-500 text-white" : "bg-gray-600"}>
          <List className="mr-2" size={16} /> Semaine
        </Button>
        <Button onClick={() => setView("month")} className={view === "month" ? "bg-green-500 text-white" : "bg-gray-600"}>
          <Calendar className="mr-2" size={16} /> Mois
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrev}><ChevronLeft /></Button>
        <h2 className="text-xl font-bold">
          {view === "day" && format(currentDate, "EEEE dd/MM/yyyy", { locale: fr })}
          {view === "week" && `Semaine du ${format(startOfWeekDate, "dd/MM/yyyy", { locale: fr })}`}
          {view === "month" && format(currentDate, "MMMM yyyy", { locale: fr })}
        </h2>
        <Button onClick={handleNext}><ChevronRight /></Button>
        <Button onClick={handleToday} className="bg-blue-600 text-white ml-4">Aujourd’hui</Button>
      </div>

      <div className="flex gap-4">
        {/* Bloc principal (Agenda) */}
        <div className="flex-1">
          {view === "day" && (
            <div className="p-4 border rounded">
              <h3 className="text-lg font-bold mb-2">Événements du {format(currentDate, "EEEE dd/MM/yyyy", { locale: fr })}</h3>
              {getEventsForDay(currentDate).length > 0 ? (
                <ul>
                  {getEventsForDay(currentDate).map((event, idx) => (
                    <li 
                      key={idx} 
                      className={`p-2 mt-2 rounded ${event.isCreated ? backgroundColors[event.type] : `bg-gray-300 border-2 ${colors[event.type]}`} cursor-pointer hover:bg-gray-400`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.type} ({event.start} - {getEndTime(event.start, getDurationInMinutes(event.type))})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun événement pour ce jour.</p>
              )}
            </div>
          )}

          {view === "week" && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={index} className="p-2 border rounded text-center">
                  <div className="font-bold">{format(day, "EEEE", { locale: fr })}</div>
                  <div>{format(day, "dd", { locale: fr })}</div>
                  {getEventsForDay(day).map((event, idx) => (
                    <div 
                      key={idx} 
                      className={`p-1 mt-1 rounded text-sm ${event.isCreated ? backgroundColors[event.type] : `bg-gray-300 border-2 ${colors[event.type]}`} cursor-pointer hover:bg-gray-400`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.type} ({event.start} - {getEndTime(event.start, getDurationInMinutes(event.type))})
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {view === "month" && (
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="font-bold">{format(day, "dd")}</div>
                  {getEventsForDay(day).map((event, idx) => (
                    <div 
                      key={idx} 
                      className={`p-1 mt-1 rounded ${event.isCreated ? backgroundColors[event.type] : `bg-blue-100 border-2 ${colors[event.type]}`} cursor-pointer hover:bg-blue-200`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.type} ({event.start} - {getEndTime(event.start, getDurationInMinutes(event.type))})
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bloc de détails à droite */}
        {selectedEvent && (
          <div className="w-1/3 p-4 border-l">
            <h3 className="text-lg font-bold mb-2">Détails du créneau</h3>
            <p><strong>Type :</strong> {selectedEvent.type}</p>
            <p><strong>Date :</strong> {selectedEvent.date}</p>
            <p><strong>Heure :</strong> {selectedEvent.start} - {getEndTime(selectedEvent.start, getDurationInMinutes(selectedEvent.type))}</p>
            <p><strong>Détails :</strong> {selectedEvent.details}</p>

            {!selectedEvent.isCreated && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Créer un rendez-vous</h3>
                <input
                  type="text"
                  placeholder="Nom du patient"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Détails supplémentaires"
                  value={patientInfo.details}
                  onChange={(e) => setPatientInfo({ ...patientInfo, details: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <Button onClick={handleCreateAppointment} className="bg-green-500 text-white">
                  Créer le rendez-vous
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bloc des prochains rendez-vous en bas */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Prochains rendez-vous</h3>
        {allEvents.length > 0 ? (
          <ul>
            {allEvents.map((event, idx) => (
              <li key={idx} className="bg-gray-100 p-2 mt-2 rounded">
                <strong>{format(event.datetime, "dd/MM/yyyy HH:mm")}</strong> - {event.type} ({event.start} - {event.endTime})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun rendez-vous à venir.</p>
        )}
      </div>
    </div>
  );
};

export default Agenda;
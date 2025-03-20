// src/components/Agenda/Agenda.jsx
import React, { useState, useEffect } from 'react';
import { format, parse, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayNames, getColorByType, isValidTime } from './utils/agendaUtils';
import AgendaTable from './AgendaTable';
import AgendaSidebar from './AgendaSidebar';
import PracticeDialog from './PracticeDialog';
import AppointmentDialog from './AppointmentDialog';
import ReservedDialog from './ReservedDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import fr from 'date-fns/locale/fr';
import BASE_URL from '@/pages/config/baseurl';

// Helpers pour la gestion des horaires sans reformatage inutile
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Nouveaux fakePatients par défaut (nouvelle structure de l’API) avec dates au bon format
const defaultFakePatients = [
  {
    id_user: 2,
    id_role_utilisateur: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    motdepasse: "password123",
    numero: "0123456789",
    mobile: "0612345678",
    genre: "Homme",
    adresse: "12 rue de Paris",
    ville: "Paris",
    code_postal: "75001",
    dateNaissance: "1985-06-14", // Format corrigé
    dateInscri: "2025-03-18",    // Format corrigé
    photo_url: null
  }
];

const DEFAULT_DURATION = 20;

const Agenda = () => {
  // Initialisation des states en récupérant les données du localStorage (si existantes)
  const [fakePatientsData, setFakePatientsData] = useState(() => {
    const saved = localStorage.getItem('fakePatientsData');
    return saved ? JSON.parse(saved) : defaultFakePatients;
  });
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('schedule');
    return saved ? JSON.parse(saved) : { defaultGeneral: [], specific: [] };
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [idPractice, setIdPractice] = useState(null)
  const [durationPractice, setIDurationPractice] = useState(null)
  
  // Mise à jour du localStorage dès que les données changent
  useEffect(() => {
    localStorage.setItem('fakePatientsData', JSON.stringify(fakePatientsData));
  }, [fakePatientsData]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Autres états et dialogues
  const [createAppointmentDialog, setCreateAppointmentDialog] = useState(false);

  // Chargement des patients via l’API (nouvel endpoint)
  useEffect(() => {
    const fetchFakePatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/utilisateurs`);
        let data = await response.json();
        // Conversion des dates ISO en "yyyy-MM-dd"
        data = data.map(patient => ({
          ...patient,
          dateNaissance: new Date(patient.dateNaissance).toISOString().split('T')[0],
          dateInscri: new Date(patient.dateInscri).toISOString().split('T')[0]
        }));
        setFakePatientsData(data);
      } catch (error) {
        console.error('Erreur de chargement des patients', error);
        setFakePatientsData(defaultFakePatients);
      }
    };
    fetchFakePatients();
  }, []);

  // Chargement du planning via l’API (général et spécifique)
  const refreshSchedule = async () => {
    try {
      const generalRes = await fetch(`${BASE_URL}/planning`);
      let defaultGeneral = await generalRes.json();
      defaultGeneral = defaultGeneral.map(day => ({
        ...day,
        name: day.day_name,
        times: day.times
      }));
  
      const specificRes = await fetch(`${BASE_URL}/specificDates`);
      const specificRaw = await specificRes.json();
      const specific = specificRaw.map(item => {
        // On suppose que item.specific_date est déjà au format "dd-MM-yyyy"
        let parsedDate = parse(item.specific_date, 'dd-MM-yyyy', new Date());
        if (isNaN(parsedDate)) {
          console.error("specific_date invalide", item.specific_date);
          parsedDate = new Date();
        }
        return {
          ...item,
          date: format(parsedDate, 'dd-MM-yyyy'),
          timeSlots: item.timeSlots?.map(slot => ({
            ...slot,
            practices: slot.practices || []
          })) || []
        };
      });
      setSchedule({ defaultGeneral, specific });
    } catch (err) {
      console.error('Erreur de chargement du planning', err);
    }
  };

  useEffect(() => {
    refreshSchedule();
  }, []);

  // Chargement des rendez‑vous via l’API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/appointments`);
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error('Erreur de chargement des rendez‑vous', err);
      }
    };
    fetchAppointments();
  }, []);

  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month' ou 'list'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({ date: '', startTime: '' });

  // État pour le dialogue de pratique
  const [practiceDialog, setPracticeDialog] = useState({
    isOpen: false,
    date: null,
    slotIndex: null,
    sourceType: null,
    parentSlot: null,
    practices: [],
    newPractice: { 
      type: '', 
      start: '',
      end: '',
      error: '',
      motif: '',
      duration: DEFAULT_DURATION,
      id_pratique: null,
      createAppointment: false,
      isNewPatient: false,
      newPatient: {}
    },
    selectedPatientId: '',
    error: ''
  });

  // État pour le dialogue de rendez‑vous
  const [appointmentDialog, setAppointmentDialog] = useState({
    isOpen: false,
    daySchedule: null,
    slotIndex: null,
    practice: null,
    appointmentKey: '',
    selectedPatientId: '',
    motif: '',
    error: ''
  });
  const [reservedDialog, setReservedDialog] = useState({ isOpen: false, appointment: null });
  const [practiceFilter, setPracticeFilter] = useState(() => {
    const saved = localStorage.getItem('practiceFilter');
    if (saved) return JSON.parse(saved);
    
    // Valeur par défaut si rien en localStorage
    return { 
      tous: true,
      naturopathie: true,
      acupuncture: true,
      hypnose: true
    };
  });

  useEffect(() => {
    if (practiceFilter.length > 0) {
      const defaultFilter = practiceFilter.reduce((acc, practice) => {
        const key = practice.nom_discipline.toLowerCase();
        acc[key] = true;
        return acc;
      }, { tous: true });
  
      setPracticeFilter(prev => ({ ...defaultFilter, ...prev }));
    }
  }, [practiceFilter]);

  const [specifiqueOnly, setSpecifiqueOnly] = useState(false);

  // Fonctions de gestion de la navigation et des interactions

  const handleDayClick = (day) => {
    setCurrentDate(day);
    setViewMode('day');
  };

  // Ici, comme les horaires sont déjà formatés depuis le back, on utilise directement clickedSlot.start ou parentSlot.start
  const handleSlotClick = (daySchedule, slotIndex, sourceType, clickedSlot) => {
    const parentSlot = daySchedule.timeSlots[slotIndex];
    if (!parentSlot || !clickedSlot) {
      console.error('Slot information missing');
      return;
    }
    const defaultStart = clickedSlot.start || parentSlot.start;
    setPracticeDialog({
      isOpen: true,
      date: daySchedule.date,
      slotIndex,
      sourceType,
      parentSlot,
      practices: [],
      newPractice: {
        type: '',
        start: defaultStart,
        end: '',
        error: '',
        motif: '',
        duration: DEFAULT_DURATION,
        id_pratique: null,
        createAppointment: false,
        isNewPatient: false,
        newPatient: {}
      },
      selectedPatientId: '',
      error: ''
    });
  };

  const handlePracticeClick = (daySchedule, slotIndex, practice, appointmentKey) => {
    const defaultStartTime = practice?.start || daySchedule.timeSlots[slotIndex].start;
    const defaultEndTime = practice?.end || daySchedule.timeSlots[slotIndex].end;
    setAppointmentDialog({
      isOpen: true,
      daySchedule,
      slotIndex,
      practice: { ...practice, start: defaultStartTime, end: defaultEndTime },
      appointmentKey,
      selectedPatientId: '',
      motif: '',
      error: ''
    });
  };

  const handleReservedClick = (appointment) => {
    setReservedDialog({ isOpen: true, appointment });
  };

  // Modification de l'heure de fin en se basant sur la durée et en évitant le reformatage via date-fns
  const handlePracticeTypeChange = (e) => {
    const type = e.target.value;
    let newDuration = DEFAULT_DURATION;
    if (type === 'naturopathie') newDuration = 120;
    else if (type === 'acupuncture') newDuration = 30;
    else if (type === 'hypnose') newDuration = 90;
    setPracticeDialog(prev => {
      const newPractice = {
        ...prev.newPractice,
        type,
        duration: newDuration,
        start: prev.newPractice.start || prev.parentSlot.start
      };
      if (newPractice.start && !prev.newPractice.isEndManual) {
        const totalMinutes = timeToMinutes(newPractice.start) + newDuration;
        newPractice.end = minutesToTime(totalMinutes);
      }
      return { ...prev, newPractice };
    });
  };

  const handlePracticeStartChange = (e) => {
    const start = e.target.value;
    setPracticeDialog(prev => {
      const newPractice = { ...prev.newPractice, start };
      if (start && !prev.newPractice.isEndManual) {
        const totalMinutes = timeToMinutes(start) + prev.newPractice.duration;
        newPractice.end = minutesToTime(totalMinutes);
      }
      return { ...prev, newPractice };
    });
  };

  const handlePracticeEndChange = (e) => {
    const end = e.target.value;
    setPracticeDialog(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        end,
        isEndManual: true
      }
    }));
  };

  // Lors de la sauvegarde, on compare les horaires en convertissant les chaînes "HH:mm" en minutes
  const handleSavePractices = async () => {
    const { date, slotIndex, newPractice, parentSlot } = practiceDialog;
    if (!newPractice.start) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez saisir l'heure de début." }
      }));
      return;
    }
    if (!newPractice.type) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez sélectionner une pratique." }
      }));
      return;
    }
    if (!newPractice.motif) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez remplir le champ motif." }
      }));
      return;
    }
    const newStartMins = timeToMinutes(newPractice.start);
    let newEndMins;
    if (!newPractice.end) {
      newEndMins = newStartMins + DEFAULT_DURATION;
      newPractice.end = minutesToTime(newEndMins);
    } else {
      newEndMins = timeToMinutes(newPractice.end);
    }
    const parentStartMins = timeToMinutes(parentSlot.start);
    const parentEndMins = timeToMinutes(parentSlot.end);
    if (newStartMins < parentStartMins || newEndMins > parentEndMins) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "La pratique doit être dans la plage horaire sélectionnée." }
      }));
      return;
    }
    // Vérification des chevauchements dans le slot
    for (let p of practiceDialog.practices) {
      const existingStartMins = timeToMinutes(p.start);
      const existingEndMins = timeToMinutes(p.end);
      if (newStartMins < existingEndMins && newEndMins > existingStartMins) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Chevauchement d'horaires détecté dans ce slot." }
        }));
        return;
      }
    }
    const appointmentsForDate = appointments.filter(app => app.date === date);
    for (const app of appointmentsForDate) {
      const appStartMins = timeToMinutes(app.practice_start || app.practice_start);
      const appEndMins = timeToMinutes(app.practice_start || app.practice_end);
      if (newStartMins < appEndMins && newEndMins > appStartMins) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Chevauchement avec un rendez‑vous existant détecté." }
        }));
        return;
      }
    }
    // Conversion de la date en objet Date valide via parse
    const parsedDate = parse(practiceDialog.date, 'dd-MM-yyyy', new Date());
    // Construction de la clé avec le format HH:mm:ss et la date au format dd-MM-yyyy
    const appointmentKey = `${format(parsedDate, 'dd-MM-yyyy')}_${parentSlot.start}:00_${parentSlot.end}:00_${newPractice.start}:00_${newPractice.type}`;

    // Construction de l'objet appointment avec le formatage des heures et de la date
    let patient;
    if (newPractice.isNewPatient) {
      const { prenom, nom, email, numero, mobile, dateNaissance } = newPractice.newPatient;
      if (!prenom || !nom || !email || !numero || !mobile || !dateNaissance) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Veuillez remplir tous les champs." }
        }));
        return;
      }
      try {
        if (!patient?.id_user) {
          setPracticeDialog(prev => ({
            ...prev,
            error: "Patient non valide. Veuillez réessayer."
          }));
          return;
        }
        const patientRes = await fetch(`${BASE_URL}/utilisateurs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPractice.newPatient)
        });
        const patientData = await patientRes.json();
        patient = { ...newPractice.newPatient, id_user: patientData.id_user || patientData.id };
        setFakePatientsData(prev => [...prev, patient]);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du patient", error);
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Erreur lors de la sauvegarde du patient." }
        }));
        return;
      }
    } else {
      if (!practiceDialog.selectedPatientId) {
        setPracticeDialog(prev => ({ ...prev, error: 'Veuillez sélectionner un patient.' }));
        return;
      }
      patient = fakePatientsData.find(p => p.id_user === parseInt(practiceDialog.selectedPatientId, 10));
    }
    const newAppointment = {
      appointment_key: appointmentKey,
      date: format(parsedDate, 'dd-MM-yyyy'),
      slot_index: slotIndex,
      practice: {
        type: newPractice.type,
        start: `${newPractice.start}:00`,
        end: `${newPractice.end}:00`
      },
      motif: newPractice.motif,
      patient_id: patient.id_user,
      praticien_id: 3,
      id_pratique: newPractice.id_pratique
    };    
    try {
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
      await response.json();
      await refreshSchedule();
      const appointmentsRes = await fetch(`${BASE_URL}/appointments`);
      const updatedAppointments = await appointmentsRes.json();
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du rendez‑vous", error);
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Erreur lors de la sauvegarde du rendez‑vous." }
      }));
      return;
    }
    setPracticeDialog({
      isOpen: false,
      date: null,
      slotIndex: null,
      sourceType: null,
      parentSlot: null,
      practices: [],
      newPractice: { 
        type: '', 
        start: '',
        end: '', 
        error: '',
        motif: '',
        duration: DEFAULT_DURATION,
        id_pratique: null,
        createAppointment: false,
        isNewPatient: false,
        newPatient: {}
      },
      selectedPatientId: '',
      error: ''
    });
    console.log("OK")
  };

  // Ajout d’un rendez‑vous via le dialogue dédié
  const handleAddAppointment = async () => {
    if (!appointmentDialog.selectedPatientId) {
      setAppointmentDialog(prev => ({ ...prev, error: 'Veuillez sélectionner un patient.' }));
      return;
    }
    if (appointments.find(app => app.appointment_key === appointmentDialog.appointmentKey)) {
      setAppointmentDialog(prev => ({ ...prev, error: 'Ce créneau est déjà réservé.' }));
      return;
    }
    const patient = fakePatientsData.find(p => p.id_user === parseInt(appointmentDialog.selectedPatientId, 10));
    const newAppointment = {
      appointment_key: appointmentDialog.appointmentKey,
      date: appointmentDialog.daySchedule.date,
      slot_index: appointmentDialog.slotIndex,
      practice: {
        type: appointmentDialog.practice.type,
        start: appointmentDialog.practice.start,
        end: appointmentDialog.practice.end
      },
      motif: appointmentDialog.motif,
      patient_id: patient.id_user,
      praticien_id: 3,
      id_pratique: 1
    };
    try {
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
      await response.json();
      const appointmentsRes = await fetch(`${BASE_URL}/appointments`);
      const updatedAppointments = await appointmentsRes.json();
      setAppointments(updatedAppointments);
      setAppointmentDialog({
        isOpen: false,
        daySchedule: null,
        slotIndex: null,
        practice: null,
        appointmentKey: '',
        selectedPatientId: '',
        motif: '',
        error: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du rendez‑vous", error);
      setAppointmentDialog(prev => ({ ...prev, error: "Erreur lors de l'ajout du rendez‑vous." }));
    }
  };

  const goToday = () => setCurrentDate(new Date());
  const goPrev = () => {
    if (viewMode === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  const goNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  useEffect(() => {
    localStorage.setItem('practiceFilter', JSON.stringify(practiceFilter));
  }, [practiceFilter]);

  const togglePracticeFilter = (type) => {
    if (type === 'tous') {
      const newState = !practiceFilter.tous;
      const newFilter = practices.reduce((acc, practice) => {
        acc[practice.nom_discipline.toLowerCase()] = newState;
        return acc;
      }, { tous: newState });
      
      setPracticeFilter(newFilter);
    } else {
      const newFilter = {
        ...practiceFilter,
        [type]: !practiceFilter[type]
      };
      
      newFilter.tous = Object.keys(newFilter)
        .filter(k => k !== 'tous')
        .every(k => newFilter[k]);

      setPracticeFilter(newFilter);
    }
  };

  const todayStr = format(new Date(), 'dd-MM-yyyy');
  const todayAppointments = appointments.filter(app => app.date === todayStr);

  const handleClosePracticeDialog = () => {
    setPracticeDialog({
      isOpen: false,
      date: null,
      slotIndex: null,
      sourceType: null,
      parentSlot: null,
      practices: [],
      newPractice: { 
        type: '', 
        start: '',
        end: '', 
        error: '',
        motif: '',
        duration: DEFAULT_DURATION,
        id_pratique: null,
        createAppointment: false,
        isNewPatient: false,
        newPatient: {}
      },      
      selectedPatientId: '',
      error: ''
    });
  };

  return (
    <div className="p-4 flex gap-4 border">
      <AgendaSidebar
        todayAppointments={todayAppointments}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        practiceFilter={practiceFilter}
        togglePracticeFilter={togglePracticeFilter}
        specifiqueOnly={specifiqueOnly}
        setSpecifiqueOnly={setSpecifiqueOnly}
        selectedPractice={selectedPractice}       // transmission de la pratique fixée
        setSelectedPractice={setSelectedPractice}
        setIdPractice={setIdPractice}
        setIDurationPractice={setIDurationPractice}    // pour la modifier dans la Sidebar
      />
      <div className="flex-grow">
        <div className="flex-grow">
          <div className="flex items-center justify-between w-full mb-2 bg-gray-50 h-[40px]">
            <div className="flex items-center gap-1">
              <Button
                disabled={startOfDay(currentDate).getTime() <= startOfDay(new Date()).getTime()}
                className="flex items-center gap-2 border-none bg-[#F4F4F5] hover:bg-gray-200 text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2"
                onClick={goPrev}
              >
                <ChevronLeft />
              </Button>
              <Button
                className="flex items-center gap-2 border-none bg-[#F4F4F5] hover:bg-gray-200 text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2"
                onClick={goToday}
              >
                Aujourd'hui
              </Button>
              <Button
                className="flex items-center gap-2 border-none bg-[#F4F4F5] hover:bg-gray-200 text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2"
                onClick={goNext}
              >
                <ChevronRight />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${viewMode === 'day' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'}`}
                onClick={() => setViewMode('day')}
              >
                Jour
              </Button>
              <Button
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${viewMode === 'week' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'}`}
                onClick={() => setViewMode('week')}
              >
                Semaine
              </Button>
              <Button
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${viewMode === 'month' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'}`}
                onClick={() => setViewMode('month')}
              >
                Mois
              </Button>
            </div>
            <Button
              className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${viewMode === 'list' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'}`}
              onClick={() => setViewMode('list')}
            >
              Tous les Rendez‑vous
            </Button>
          </div>
        </div>

        <AgendaTable
          schedule={schedule}
          currentDate={currentDate}
          viewMode={viewMode}
          onSlotClick={handleSlotClick}
          appointments={appointments}
          onPracticeClick={handlePracticeClick}
          onReservedClick={handleReservedClick}
          practiceFilter={practiceFilter}
          specifiqueOnly={specifiqueOnly}
          refreshSchedule={refreshSchedule}
          onOpenCreateAppointment={(date, startTime) => {
            setCreateAppointmentDialog(true);
            setSelectedSlotInfo({ date, startTime });
          }}
          onDayClick={handleDayClick}
          selectedPractice={selectedPractice}
        />
      </div>

      <CreateAppointmentDialog
        isOpen={createAppointmentDialog}
        onClose={() => setCreateAppointmentDialog(false)}
        fakePatients={fakePatientsData}
        currentDate={currentDate}
        initialDate={selectedSlotInfo.date}
        initialStartTime={selectedSlotInfo.startTime}
        onSave={async () => {
          await refreshSchedule();
          try {
            const appointmentsRes = await fetch(`${BASE_URL}/appointments`);
            const updatedAppointments = await appointmentsRes.json();
            setAppointments(updatedAppointments);
          } catch (err) {
            console.error('Erreur lors du rafraîchissement des rendez‑vous', err);
          }
        }}
      />
      {practiceDialog.isOpen && (
        <PracticeDialog
          practiceDialog={practiceDialog}
          onClose={handleClosePracticeDialog}
          onTypeChange={handlePracticeTypeChange}
          onStartChange={handlePracticeStartChange}
          onSave={handleSavePractices}
          fakePatients={fakePatientsData}
          setPracticeDialog={setPracticeDialog}
          selectedPractice={selectedPractice}
          idPractice={idPractice}
          durationPractice={durationPractice}
        />
      )}
      {appointmentDialog.isOpen && (
        <AppointmentDialog
          appointmentDialog={appointmentDialog}
          setAppointmentDialog={setAppointmentDialog}
          onAddAppointment={handleAddAppointment}
          fakePatients={fakePatientsData}
        />
      )}
      {reservedDialog.isOpen && reservedDialog.appointment && (
        <ReservedDialog
          reservedDialog={reservedDialog}
          setReservedDialog={setReservedDialog}
          refreshSchedule={refreshSchedule}
        />
      )}
    </div>
  );
};

export default Agenda;

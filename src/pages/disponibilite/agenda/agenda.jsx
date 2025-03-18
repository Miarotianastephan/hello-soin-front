// src/components/Agenda/Agenda.js
import React, { useState, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, parse, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayNames, parseTime, getColorByType, isValidTime } from './utils/agendaUtils';
import AgendaTable from './AgendaTable';
import AgendaSidebar from './AgendaSidebar';
import PracticeDialog from './PracticeDialog';
import AppointmentDialog from './AppointmentDialog';
import ReservedDialog from './ReservedDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import fr from 'date-fns/locale/fr';
import BASE_URL from '@/pages/config/baseurl';

const Agenda = () => {
  // Données fictives par défaut
  const defaultFakePatients = [
    { id: '2', nom: 'Lemoine', prenom: 'Sophie', email: 'sophie.lemoine@example.com', numero: '07 98 76 54 32', age: 28, genre: 'Mme', adresse: '25 Avenue des Champs-Élysées, 75008 Paris', mobile: '06 01 02 03 04', dateNaissance: '1992-03-15', appointments: [] },
    { id: '3', nom: 'Martin', prenom: 'Luc', email: 'luc.martin@example.com', numero: '06 11 22 33 44', age: 45, genre: 'Mr', adresse: '5 Boulevard Haussmann, 75009 Paris', mobile: '06 02 03 04 05', dateNaissance: '1975-05-10', appointments: [] },
    { id: '30', nom: 'Rey', prenom: 'Eva', email: 'eva.rey@example.com', numero: '07 88 99 11 22', age: 26, genre: 'Mme', adresse: '19 Rue des Martyrs, 75009 Paris', mobile: '06 29 30 31 32', dateNaissance: '1990-03-03', appointments: [] }
  ];

  const DEFAULT_DURATION = 20;

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
  const [selectedPractice, setSelectedPractice] = useState(null);

  // Chargement des patients via l’API
  useEffect(() => {
    const fetchFakePatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/fakeUsers`);
        const data = await response.json();
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
      const specific = specificRaw.map(item => ({
        ...item,
        date: format(new Date(item.specific_date), 'dd-MM-yyyy'),
        timeSlots: item.timeSlots?.map(slot => ({
          ...slot,
          practices: slot.practices || []
        })) || []
      }));
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
      duration: '',
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
  const [practiceFilter, setPracticeFilter] = useState({
    tous: true,
    naturopathie: true,
    acupuncture: true,
    hypnose: true
  });
  const [specifiqueOnly, setSpecifiqueOnly] = useState(false);

  // Fonctions de gestion de la navigation et des interactions

  const handleDayClick = (day) => {
    setCurrentDate(day);
    setViewMode('day');
  };

  const handleSlotClick = (daySchedule, slotIndex, sourceType, clickedSlot) => {
    const parentSlot = daySchedule.timeSlots[slotIndex];
    if (!parentSlot || !clickedSlot) {
      console.error('Slot information missing');
      return;
    }
    let defaultStart;
    if (isValidTime(clickedSlot.start)) {
      const parsed = parseTime(clickedSlot.start);
      defaultStart = format(parsed, 'HH:mm');
    } else {
      defaultStart = parentSlot.start;
    }
    setPracticeDialog({
      isOpen: true,
      date: daySchedule.date,
      slotIndex,
      sourceType,
      parentSlot: parentSlot,
      practices: [],
      newPractice: {
        type: '',
        start: defaultStart,
        end: '',
        error: '',
        motif: '',
        duration: DEFAULT_DURATION,
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

  const handlePracticeTypeChange = (e) => {
    const type = e.target.value;
    let newDuration = DEFAULT_DURATION;
    if (type === 'naturopathie') {
      newDuration = 120;
    } else if (type === 'acupuncture') {
      newDuration = 30;
    } else if (type === 'hypnose') {
      newDuration = 90;
    }
    setPracticeDialog(prev => {
      const newPractice = { 
        ...prev.newPractice,
        type,
        duration: newDuration,
        start: prev.newPractice.start || prev.parentSlot.start 
      };
      if (newPractice.start && !prev.newPractice.isEndManual) {
        const startDate = parseTime(newPractice.start);
        const newEndDate = new Date(startDate.getTime() + newDuration * 60000);
        newPractice.end = format(newEndDate, 'HH:mm');
      }
      return { ...prev, newPractice };
    });
  };

  const handlePracticeStartChange = (e) => {
    const start = e.target.value;
    setPracticeDialog(prev => {
      const newPractice = { ...prev.newPractice, start };
      if (start && !prev.newPractice.isEndManual) {
        const startDate = parseTime(start);
        const duration = newPractice.duration;
        const newEndDate = new Date(startDate.getTime() + duration * 60000);
        newPractice.end = format(newEndDate, 'HH:mm');
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
    const newStart = parseTime(newPractice.start);
    let newEnd;
    if (!newPractice.end) {
      newEnd = new Date(newStart.getTime() + DEFAULT_DURATION * 60000);
      const newEndStr = format(newEnd, 'HH:mm');
      newPractice.end = newEndStr;
      newEnd = parseTime(newEndStr);
    } else {
      newEnd = parseTime(newPractice.end);
    }
    const parentStart = parseTime(parentSlot.start);
    const parentEnd = parseTime(parentSlot.end);
    if (newStart < parentStart || newEnd > parentEnd) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "La pratique doit être dans la plage horaire sélectionnée." }
      }));
      return;
    }
    // Vérification des chevauchements dans le slot
    for (let p of practiceDialog.practices) {
      const existingStart = parseTime(p.start);
      const existingEnd = parseTime(p.end);
      if (newStart < existingEnd && newEnd > existingStart) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Chevauchement d'horaires détecté dans ce slot." }
        }));
        return;
      }
    }
    const appointmentsForDate = appointments.filter(app => app.date === date);
    for (const app of appointmentsForDate) {
      const appStart = parseTime(app.practice_start);
      const appEnd = parseTime(app.practice_end);
      if (newStart < appEnd && newEnd > appStart) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Chevauchement avec un rendez‑vous existant détecté." }
        }));
        return;
      }
    }
    const appointmentKey = `${date}_${parentSlot.start}_${parentSlot.end}_${newPractice.start}_${newPractice.type}`;
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
        const patientRes = await fetch(`${BASE_URL}/fakeUsers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPractice.newPatient)
        });
        const patientData = await patientRes.json();
        patient = { ...newPractice.newPatient, id: patientData.id, appointments: [] };
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
      patient = fakePatientsData.find(p => p.id === practiceDialog.selectedPatientId);
    }
    // Construction de l'objet appointment
    const newAppointment = {
      appointment_key: appointmentKey,
      date,
      slot_index: slotIndex,
      practice: {
        type: newPractice.type,
        start: newPractice.start,
        end: newPractice.end
      },
      motif: newPractice.motif,
      fake_user_id: patient.id
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
        createAppointment: false,
        isNewPatient: false,
        newPatient: {}
      },
      selectedPatientId: '',
      error: ''
    });
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
    const patient = fakePatientsData.find(p => p.id === appointmentDialog.selectedPatientId);
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
      fake_user_id: patient.id
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

  const togglePracticeFilter = (type) => {
    if (type === 'tous') {
      setPracticeFilter(prev => ({
        tous: !prev.tous,
        naturopathie: !prev.tous,
        acupuncture: !prev.tous,
        hypnose: !prev.tous,
      }));
    } else {
      setPracticeFilter(prev => ({
        ...prev,
        [type]: !prev[type],
        tous: false
      }));
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
        onSelectNextAvailabilityPractice={setSelectedPractice}
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
          selectedPractice={selectedPractice}
          onDayClick={handleDayClick}
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
        />
      )}
    </div>
  );
};

export default Agenda;

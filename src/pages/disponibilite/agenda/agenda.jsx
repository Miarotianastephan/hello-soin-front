// src/components/Agenda/Agenda.js
import React, { useState, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, parse, differenceInYears, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayNames, parseTime, getColorByType, isValidTime } from './utils/agendaUtils'; // getDurationInMinutes supprimé
import AgendaTable from './AgendaTable';
import AgendaSidebar from './AgendaSidebar';
import PracticeDialog from './PracticeDialog';
import AppointmentDialog from './AppointmentDialog';
import ReservedDialog from './ReservedDialog';
import { ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import fr from 'date-fns/locale/fr';

const Agenda = () => {
  // Données fictives par défaut avec email, dateNaissance, mobile et propriété appointments ajoutée
  const defaultFakePatients = [
    { id: '2', nom: 'Lemoine', prenom: 'Sophie', email: 'sophie.lemoine@example.com', numero: '07 98 76 54 32', age: 28, genre: 'Mme', adresse: '25 Avenue des Champs-Élysées, 75008 Paris', mobile: '06 01 02 03 04', dateNaissance: '1992-03-15', appointments: [] },
    { id: '3', nom: 'Martin', prenom: 'Luc', email: 'luc.martin@example.com', numero: '06 11 22 33 44', age: 45, genre: 'Mr', adresse: '5 Boulevard Haussmann, 75009 Paris', mobile: '06 02 03 04 05', dateNaissance: '1975-05-10', appointments: [] },
    // ... autres patients
    { id: '30', nom: 'Rey', prenom: 'Eva', email: 'eva.rey@example.com', numero: '07 88 99 11 22', age: 26, genre: 'Mme', adresse: '19 Rue des Martyrs, 75009 Paris', mobile: '06 29 30 31 32', dateNaissance: '1990-03-03', appointments: [] }
  ];

  const DEFAULT_DURATION = 20;

  // Chargement des patients depuis le localStorage
  const [fakePatientsData, setFakePatientsData] = useState([]);
  const [createAppointmentDialog, setCreateAppointmentDialog] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);

  const handleDayClick = (day) => {
    setCurrentDate(day);
    setViewMode('day');
  };

  useEffect(() => {
    const storedFakeData = localStorage.getItem('fakedatauser');
    if (storedFakeData) {
      try {
        const parsed = JSON.parse(storedFakeData);
        setFakePatientsData(Array.isArray(parsed) ? parsed : defaultFakePatients);
      } catch (error) {
        console.error('Erreur de parsing de fakedatauser', error);
        setFakePatientsData(defaultFakePatients);
      }
    } else {
      localStorage.setItem('fakedatauser', JSON.stringify(defaultFakePatients));
      setFakePatientsData(defaultFakePatients);
    }
  }, []);

  const [schedule, setSchedule] = useState({ defaultGeneral: [], specific: [] });
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({ date: '', startTime: '' });
  
  // Fonction de rafraîchissement du planning
  const refreshSchedule = () => {
    let defaultGeneral = [];
    const generalStr = localStorage.getItem('general');
    if (generalStr) {
      try {
        defaultGeneral = JSON.parse(generalStr);
      } catch (err) {
        console.error('Erreur lors du parsing du planning général', err);
      }
    } else {
      defaultGeneral = [
        { name: 'Lundi', selected: false, times: [] },
        { name: 'Mardi', selected: false, times: [] },
        { name: 'Mercredi', selected: false, times: [] },
        { name: 'Jeudi', selected: false, times: [] },
        { name: 'Vendredi', selected: false, times: [] },
        { name: 'Samedi', selected: false, times: [] },
        { name: 'Dimanche', selected: false, times: [] }
      ];
    }
    let specific = [];
    const specificStr = localStorage.getItem('planning');
    if (specificStr) {
      try {
        const data = JSON.parse(specificStr);
        if (data.datesWithSlots) {
          specific = data.datesWithSlots;
        }
      } catch (err) {
        console.error('Erreur lors du parsing du planning spécifique', err);
      }
    }
    setSchedule({ defaultGeneral, specific });
  };

  useEffect(() => {
    // Initialisation du planning au montage du composant
    refreshSchedule();
  }, []);

  const [viewMode, setViewMode] = useState('week'); // 'day', 'week' ou 'month'
  const [currentDate, setCurrentDate] = useState(new Date());
  // Initialisation du state practiceDialog
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

  const [appointments, setAppointments] = useState([]);
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
  
  useEffect(() => {
    let defaultGeneral = [];
    const generalStr = localStorage.getItem('general');
    if (generalStr) {
      try {
        defaultGeneral = JSON.parse(generalStr);
      } catch (err) {
        console.error('Erreur lors du parsing du planning général', err);
      }
    } else {
      defaultGeneral = [
        { name: 'Lundi', selected: false, times: [] },
        { name: 'Mardi', selected: false, times: [] },
        { name: 'Mercredi', selected: false, times: [] },
        { name: 'Jeudi', selected: false, times: [] },
        { name: 'Vendredi', selected: false, times: [] },
        { name: 'Samedi', selected: false, times: [] },
        { name: 'Dimanche', selected: false, times: [] }
      ];
    }
    let specific = [];
    const specificStr = localStorage.getItem('planning');
    if (specificStr) {
      try {
        const data = JSON.parse(specificStr);
        if (data.datesWithSlots) {
          specific = data.datesWithSlots;
        }
      } catch (err) {
        console.error('Erreur lors du parsing du planning spécifique', err);
      }
    }
    setSchedule({ defaultGeneral, specific });
  }, []);

  useEffect(() => {
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      try {
        setAppointments(JSON.parse(storedAppointments));
      } catch(err) {
        console.error('Erreur lors du parsing des appointments', err);
      }
    }
  }, []); 

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
  
    // Réinitialisation complète du dialogue
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
        duration: 20,
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

  // Modification : conserver la durée déjà saisie si elle existe, sinon utiliser DEFAULT_DURATION
  const handlePracticeTypeChange = (e) => {
    const type = e.target.value;
    // Définition de la durée par défaut en fonction du type
    let newDuration = DEFAULT_DURATION; // Valeur par défaut (20 min)
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
        duration: newDuration, // On met à jour la durée par défaut ici
        start: prev.newPractice.start || prev.parentSlot.start 
      };
  
      // Si l'heure de début est renseignée et que l'heure de fin n'a pas été modifiée manuellement,
      // on recalcule l'heure de fin en fonction de la nouvelle durée
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
      
      // Si l'heure de fin n'a pas été modifiée manuellement, recalcule la fin par défaut
      if (start && !prev.newPractice.isEndManual) {
        const startDate = parseTime(start);
        const duration = newPractice.duration;
        const newEndDate = new Date(startDate.getTime() + duration * 60000);
        newPractice.end = format(newEndDate, 'HH:mm');
      }
      return { ...prev, newPractice };
    });
  };
  
  // Gestion du changement manuel de l'heure de fin
  const handlePracticeEndChange = (e) => {
    const end = e.target.value;
    setPracticeDialog(prev => ({
      ...prev,
      newPractice: {
        ...prev.newPractice,
        end,
        isEndManual: true // L'utilisateur a modifié manuellement l'heure de fin
      }
    }));
  };
  
  const handleSavePractices = () => {
    const { date, slotIndex, sourceType, newPractice, parentSlot } = practiceDialog;
  
    // Vérifier que l'heure de début est renseignée
    if (!newPractice.start) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez saisir l'heure de début." }
      }));
      return;
    }
  
    // Vérifier que le type de pratique est sélectionné
    if (!newPractice.type) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez sélectionner une pratique." }
      }));
      return;
    }

    // Vérifier que le type de pratique est sélectionné
    if (!newPractice.motif) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "Veuillez remplir le champ motif." }
      }));
      return;
    }
  
    // Calculer l'heure de début
    const newStart = parseTime(newPractice.start);
  
    // Si l'heure de fin n'est pas renseignée, calculer par défaut selon la durée par défaut (20 minutes)
    let newEnd;
    if (!newPractice.end) {
      newEnd = new Date(newStart.getTime() + DEFAULT_DURATION * 60000);
      const newEndStr = format(newEnd, 'HH:mm');
      newPractice.end = newEndStr;
      newEnd = parseTime(newEndStr);
    } else {
      newEnd = parseTime(newPractice.end);
    }
  
    // Calculer les heures du créneau parent
    const parentStart = parseTime(parentSlot.start);
    const parentEnd = parseTime(parentSlot.end);
  
    // La pratique doit être entièrement contenue dans le créneau parent
    if (newStart < parentStart || newEnd > parentEnd) {
      setPracticeDialog(prev => ({
        ...prev,
        newPractice: { ...prev.newPractice, error: "La pratique doit être dans la plage horaire sélectionnée." }
      }));
      return;
    }
  
    // Vérification des chevauchements avec les pratiques déjà ajoutées dans ce créneau
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
  
    // Vérification des chevauchements avec les rendez‑vous déjà existants pour cette date
    const appointmentsForDate = appointments.filter(app => app.date === date);
    for (const app of appointmentsForDate) {
      const appStart = parseTime(app.practice.start);
      const appEnd = parseTime(app.practice.end);
      if (newStart < appEnd && newEnd > appStart) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Chevauchement avec un rendez‑vous existant détecté." }
        }));
        return;
      }
    }
  
    // Création d'une clé unique pour le rendez‑vous
    const appointmentKey = `${date}_${parentSlot.start}_${parentSlot.end}_${newPractice.start}_${newPractice.type}`;
  
    // Récupérer les informations du patient
    let patient;
    if (newPractice.isNewPatient) {
      const { prenom, nom, email, numero, mobile, dateNaissance } = newPractice.newPatient;
    
      // Vérification des champs vides
      if (!prenom || !nom || !email || !numero || !mobile || !dateNaissance) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Veuillez remplir tous les champs." }
        }));
        return;
      }
    
      // Suppression des espaces et vérification de la longueur du numéro de téléphone
      const numeroSanitized = numero.replace(/\s+/g, "");
      const mobileSanitized = mobile.replace(/\s+/g, "");
    
      if (numeroSanitized.length !== 10 || mobileSanitized.length !== 10) {
        setPracticeDialog(prev => ({
          ...prev,
          newPractice: { ...prev.newPractice, error: "Le numéro de téléphone doit contenir exactement 10 caractères." }
        }));
        return;
      }
    
      // Calcul de l'âge
      const computedAge = differenceInYears(new Date(), new Date(dateNaissance));
    
      // Génération d'un nouvel ID
      const newId = (Math.max(...fakePatientsData.map(p => parseInt(p.id))) + 1).toString();
    
      // Création de l'objet patient
      patient = { ...newPractice.newPatient, id: newId, age: computedAge, appointments: [] };
    
      // Mise à jour des données
      const updatedFakePatients = [...fakePatientsData, patient];
      setFakePatientsData(updatedFakePatients);
      localStorage.setItem('fakedatauser', JSON.stringify(updatedFakePatients));
    }
    else {
      if (!practiceDialog.selectedPatientId) {
        setPracticeDialog(prev => ({ ...prev, error: 'Veuillez sélectionner un patient.' }));
        return;
      }
      patient = fakePatientsData.find(p => p.id === practiceDialog.selectedPatientId);
    }
  
    // Création du rendez‑vous
    const newAppointment = {
      key: appointmentKey,
      date,
      slotIndex,
      practice: { ...newPractice },
      patient,
      motif: newPractice.motif || ''
    };
  
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  
    // Mise à jour du planning spécifique pour la date concernée uniquement.
    setSchedule(prev => {
      const specificUpdated = [...prev.specific];
      const dateIndex = specificUpdated.findIndex(item => item.date === date);
      if (dateIndex !== -1) {
        // La date existe déjà dans le planning spécifique
        const existingSlot = specificUpdated[dateIndex].timeSlots.find(
          slot => slot.start === parentSlot.start && slot.end === parentSlot.end
        );
        if (existingSlot) {
          existingSlot.practices = [
            ...(existingSlot.practices || []),
            { ...newPractice, error: '' }
          ];
        } else {
          specificUpdated[dateIndex].timeSlots.push({
            ...parentSlot,
            practices: [{ ...newPractice, error: '' }]
          });
        }
      } else {
        // La date n'existe pas encore dans le planning spécifique
        let clonedTimeSlots = [];
        if (sourceType === 'general') {
          const dateParts = date.split('-');
          const appointmentDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
          const dayIndex = appointmentDate.getDay();
          const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
          const generalDay = prev.defaultGeneral[mappedIndex];
          if (generalDay && Array.isArray(generalDay.times)) {
            clonedTimeSlots = JSON.parse(JSON.stringify(generalDay.times));
          }
        }
        // Ajouter le créneau du rendez‑vous dans le planning cloné
        const existingSlotIndex = clonedTimeSlots.findIndex(
          slot => slot.start === parentSlot.start && slot.end === parentSlot.end
        );
        if (existingSlotIndex !== -1) {
          clonedTimeSlots[existingSlotIndex].practices.push({ ...newPractice, error: '' });
        } else {
          clonedTimeSlots.push({
            ...parentSlot,
            practices: [{ ...newPractice, error: '' }]
          });
        }
        specificUpdated.push({
          date,
          dayName: format(parse(date, 'dd-MM-yyyy', new Date()), 'EEEE', { locale: fr }),
          timeSlots: clonedTimeSlots
        });
      }
      localStorage.setItem('planning', JSON.stringify({ datesWithSlots: specificUpdated }));
      return { ...prev, specific: specificUpdated };
    });
  
    // Réinitialisation du dialogue
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
        isNewPatient: false, 
        newPatient: {} 
      },
      selectedPatientId: '',
      error: ''
    });
  };
  
  
  const handleAddAppointment = () => {
    if (!appointmentDialog.selectedPatientId) {
      setAppointmentDialog(prev => ({ ...prev, error: 'Veuillez sélectionner un patient.' }));
      return;
    }
    if (appointments.find(app => app.key === appointmentDialog.appointmentKey)) {
      setAppointmentDialog(prev => ({ ...prev, error: 'Ce créneau est déjà réservé.' }));
      return;
    }
    const patient = fakePatientsData.find(p => p.id === appointmentDialog.selectedPatientId);
    const newAppointment = {
      key: appointmentDialog.appointmentKey,
      date: appointmentDialog.daySchedule.date,
      slotIndex: appointmentDialog.slotIndex,
      practice: appointmentDialog.practice,
      patient,
      motif: appointmentDialog.motif
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
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
        duration: 20,
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
      <div className="flex-grow ">
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
        onSave={() => {
          refreshSchedule();
          const storedAppointments = localStorage.getItem('appointments');
          setAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);
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

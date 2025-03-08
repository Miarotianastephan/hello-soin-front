// src/components/Agenda/Agenda.js
import React, { useState, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, parse, differenceInYears, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayNames, parseTime, getColorByType, getDurationInMinutes, isValidTime } from './utils/agendaUtils';
import AgendaTable from './AgendaTable';
import AgendaSidebar from './AgendaSidebar';
import PracticeDialog from './PracticeDialog';
import AppointmentDialog from './AppointmentDialog';
import ReservedDialog from './ReservedDialog';
import { ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';

const Agenda = () => {
  // Données fictives par défaut avec email, dateNaissance, mobile et propriété appointments ajoutée
  const defaultFakePatients = [
    { id: '2', nom: 'Lemoine', prenom: 'Sophie', email: 'sophie.lemoine@example.com', numero: '07 98 76 54 32', age: 28, genre: 'Femme', adresse: '25 Avenue des Champs-Élysées, 75008 Paris', mobile: '06 01 02 03 04', dateNaissance: '1992-03-15', appointments: [] },
    { id: '3', nom: 'Martin', prenom: 'Luc', email: 'luc.martin@example.com', numero: '06 11 22 33 44', age: 45, genre: 'Homme', adresse: '5 Boulevard Haussmann, 75009 Paris', mobile: '06 02 03 04 05', dateNaissance: '1975-05-10', appointments: [] },
    // ... autres patients
    { id: '30', nom: 'Rey', prenom: 'Eva', email: 'eva.rey@example.com', numero: '07 88 99 11 22', age: 26, genre: 'Femme', adresse: '19 Rue des Martyrs, 75009 Paris', mobile: '06 29 30 31 32', dateNaissance: '1990-03-03', appointments: [] }
  ];

  // Chargement des patients depuis le localStorage
  const [fakePatientsData, setFakePatientsData] = useState([]);
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
  const [practiceDialog, setPracticeDialog] = useState({
    isOpen: false,
    date: null,
    slotIndex: null,
    sourceType: null,
    parentSlot: null,
    practices: [],
    newPractice: { 
      type: 'naturopathie', 
      start: '', 
      end: '', 
      error: '',
      motif: '',
      createAppointment: false,
      isNewPatient: false,
      newPatient: {} // Attendu : prenom, nom, email, numero, mobile, dateNaissance
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
    acuponcture: true,
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
        type: 'naturopathie',
        start: defaultStart,
        end: '',
        error: '',
        motif: '',
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
    setPracticeDialog(prev => {
      const newPractice = { 
        ...prev.newPractice,
        type,
        start: prev.newPractice.start || prev.parentSlot.start // Conserver le start du slot si vide
      };
      
      if (newPractice.start) {
        const startDate = parseTime(newPractice.start);
        const duration = getDurationInMinutes(type);
        const newEndDate = new Date(startDate.getTime() + duration * 60000);
        newPractice.end = format(newEndDate, 'HH:mm');
      }
      return { ...prev, newPractice };
    });
  };

  const handlePracticeStartChange = (e) => {
    const start = e.target.value;
    setPracticeDialog(prev => {
      const newPractice = { ...prev.newPractice, start };
      if (start) {
        const startDate = parseTime(start);
        const duration = getDurationInMinutes(newPractice.type);
        const newEndDate = new Date(startDate.getTime() + duration * 60000);
        newPractice.end = format(newEndDate, 'HH:mm');
      } else {
        newPractice.end = '';
      }
      return { ...prev, newPractice };
    });
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
    
    // Calculer les dates de début et de fin de la nouvelle pratique
    const parentStart = parseTime(parentSlot.start);
    const parentEnd = parseTime(parentSlot.end);
    const newStart = parseTime(newPractice.start);
    const newEnd = parseTime(newPractice.end);
    
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
    
    // Après
    const appointmentKey = `${date}_${parentSlot.start}_${parentSlot.end}_${newPractice.start}_${newPractice.type}`;
    
    // Récupérer les informations du patient
    let patient;
    if (newPractice.isNewPatient) {
      // Vérifier que les informations du nouveau patient sont complètes
      if (
        !newPractice.newPatient.prenom ||
        !newPractice.newPatient.nom ||
        !newPractice.newPatient.email ||
        !newPractice.newPatient.numero ||
        !newPractice.newPatient.mobile ||
        !newPractice.newPatient.dateNaissance
      ) {
        setPracticeDialog(prev => ({
          ...prev,
          error: 'Veuillez remplir les informations du nouveau patient (Prénom, Nom, Email, Téléphone, Mobile, Date de naissance).'
        }));
        return;
      }
      // Calculer l'âge à partir de la date de naissance
      const computedAge = differenceInYears(new Date(), new Date(newPractice.newPatient.dateNaissance));
      // Générer un nouvel id en se basant sur le maximum existant
      const newId = (Math.max(...fakePatientsData.map(p => parseInt(p.id))) + 1).toString();
      patient = { ...newPractice.newPatient, id: newId, age: computedAge, appointments: [] };
      const updatedFakePatients = [...fakePatientsData, patient];
      setFakePatientsData(updatedFakePatients);
      localStorage.setItem('fakedatauser', JSON.stringify(updatedFakePatients));
    } else {
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
    
    // Mise à jour UNIQUEMENT du planning spécifique
    setSchedule(prev => {
      const specificUpdated = [...prev.specific];
      const index = specificUpdated.findIndex(item => item.date === date);
      
      if (index !== -1) {
        // Si la date existe déjà
        const existingSlot = specificUpdated[index].timeSlots.find(
          slot => slot.start === parentSlot.start && slot.end === parentSlot.end
        );
        
        if (existingSlot) {
          // Ajouter la pratique au slot existant
          existingSlot.practices = [
            ...(existingSlot.practices || []),
            { ...newPractice, error: '' }
          ];
        } else {
          // Créer un nouveau slot dans la date existante
          specificUpdated[index].timeSlots.push({
            ...parentSlot,
            practices: [{ ...newPractice, error: '' }]
          });
        }
      } else {
        // Créer une nouvelle entrée de date
        specificUpdated.push({
          date,
          timeSlots: [{
            ...parentSlot,
            practices: [{ ...newPractice, error: '' }]
          }]
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
        type: newPractice.type, 
        start: '', 
        end: '', 
        error: '', 
        motif: '', 
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
        acuponcture: !prev.tous,
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
        type: 'naturopathie', 
        start: '', 
        end: '', 
        error: '',
        motif: '',
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
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${
                  viewMode === 'day' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('day')}
              >
                Jour
              </Button>
              <Button
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${
                  viewMode === 'week' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('week')}
              >
                Semaine
              </Button>
              <Button
                className={`flex items-center gap-2 border-none text-black shadow-none rounded-sm text-xs h-full py-2 font-bold px-2 ${
                  viewMode === 'month' ? 'bg-[#565D6D] text-white' : 'bg-[#F4F4F5] hover:bg-gray-200'
                }`}
                onClick={() => setViewMode('month')}
              >
                Tous les Rendez‑vous
              </Button>
            </div>
            <Button
              className="flex items-center gap-2 border-none bg-[#D9CAB3] hover:bg-gray-200 text-black shadow-none rounded-sm text-xs  py-2 font-bold px-2"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={specifiqueOnly}
                  onChange={() => setSpecifiqueOnly(!specifiqueOnly)}
                />
                <span className="ml-1">Spécifique uniquement</span>
              </label>
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
        />
      </div>
      {/* Dans le return() de Agenda */}
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

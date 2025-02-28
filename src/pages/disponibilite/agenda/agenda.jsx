// src/components/Agenda/Agenda.js
import React, { useState, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { dayNames, parseTime, getColorByType, getDurationInMinutes } from './utils/agendaUtils';
import AgendaTable from './AgendaTable';
import AgendaSidebar from './AgendaSidebar';
import PracticeDialog from './PracticeDialog';
import AppointmentDialog from './AppointmentDialog';
import ReservedDialog from './ReservedDialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Agenda = () => {
  // Données fictives par défaut (avec email ajouté)
  const defaultFakePatients = [
    { id: '2', nom: 'Lemoine', prenom: 'Sophie', email: 'sophie.lemoine@example.com', numero: '07 98 76 54 32', age: 28, genre: 'Femme', adresse: '25 Avenue des Champs-Élysées, 75008 Paris' },
    { id: '3', nom: 'Martin', prenom: 'Luc', email: 'luc.martin@example.com', numero: '06 11 22 33 44', age: 45, genre: 'Homme', adresse: '5 Boulevard Haussmann, 75009 Paris' },
    { id: '4', nom: 'Moreau', prenom: 'Claire', email: 'claire.moreau@example.com', numero: '07 55 66 77 88', age: 37, genre: 'Femme', adresse: '18 Rue Lafayette, 75010 Paris' },
    { id: '5', nom: 'Bernard', prenom: 'Antoine', email: 'antoine.bernard@example.com', numero: '06 44 55 66 77', age: 50, genre: 'Homme', adresse: '33 Rue du Faubourg Saint-Honoré, 75008 Paris' },
    { id: '6', nom: 'Dubois', prenom: 'Camille', email: 'camille.dubois@example.com', numero: '07 22 33 44 55', age: 29, genre: 'Femme', adresse: '2 Rue de Rivoli, 75004 Paris' },
    { id: '7', nom: 'Lefevre', prenom: 'Nicolas', email: 'nicolas.lefevre@example.com', numero: '06 88 99 77 66', age: 41, genre: 'Homme', adresse: '40 Avenue Victor Hugo, 75116 Paris' },
    { id: '8', nom: 'Leroy', prenom: 'Marie', email: 'marie.leroy@example.com', numero: '07 77 88 99 11', age: 35, genre: 'Femme', adresse: '14 Rue Saint-Dominique, 75007 Paris' },
    { id: '9', nom: 'Fournier', prenom: 'Julien', email: 'julien.fournier@example.com', numero: '06 55 44 33 22', age: 39, genre: 'Homme', adresse: '8 Rue des Abbesses, 75018 Paris' },
    { id: '10', nom: 'Girard', prenom: 'Elise', email: 'elise.girard@example.com', numero: '07 66 55 44 33', age: 31, genre: 'Femme', adresse: '22 Quai de la Mégisserie, 75001 Paris' },
    { id: '11', nom: 'Bonnet', prenom: 'Thomas', email: 'thomas.bonnet@example.com', numero: '06 99 88 77 66', age: 47, genre: 'Homme', adresse: '5 Place de la République, 75011 Paris' },
    { id: '12', nom: 'Garnier', prenom: 'Isabelle', email: 'isabelle.garnier@example.com', numero: '07 33 22 11 00', age: 26, genre: 'Femme', adresse: '19 Rue Montmartre, 75002 Paris' },
    { id: '13', nom: 'Chevalier', prenom: 'David', email: 'david.chevalier@example.com', numero: '06 77 55 44 22', age: 52, genre: 'Homme', adresse: '31 Rue de la Roquette, 75011 Paris' },
    { id: '14', nom: 'Lambert', prenom: 'Audrey', email: 'audrey.lambert@example.com', numero: '07 88 66 55 44', age: 38, genre: 'Femme', adresse: '7 Boulevard Saint-Michel, 75005 Paris' },
    { id: '15', nom: 'Rousseau', prenom: 'Matthieu', email: 'matthieu.rousseau@example.com', numero: '06 22 11 33 44', age: 34, genre: 'Homme', adresse: '10 Rue de Charonne, 75011 Paris' },
    { id: '16', nom: 'Benoit', prenom: 'Laurence', email: 'laurence.benoit@example.com', numero: '07 44 33 22 11', age: 42, genre: 'Femme', adresse: '16 Rue de Rennes, 75006 Paris' },
    { id: '17', nom: 'Lopez', prenom: 'Sébastien', email: 'sebastien.lopez@example.com', numero: '06 55 77 88 99', age: 30, genre: 'Homme', adresse: '28 Avenue de la Grande Armée, 75017 Paris' },
    { id: '18', nom: 'Morin', prenom: 'Caroline', email: 'caroline.morin@example.com', numero: '07 11 22 33 44', age: 27, genre: 'Femme', adresse: '14 Rue du Temple, 75004 Paris' },
    { id: '19', nom: 'Gauthier', prenom: 'Alexandre', email: 'alexandre.gauthier@example.com', numero: '06 88 99 00 11', age: 36, genre: 'Homme', adresse: '6 Rue du Bac, 75007 Paris' },
    { id: '20', nom: 'Perrin', prenom: 'Valérie', email: 'valerie.perrin@example.com', numero: '07 55 44 33 22', age: 48, genre: 'Femme', adresse: '21 Rue de Belleville, 75020 Paris' },
    { id: '21', nom: 'Dumont', prenom: 'François', email: 'francois.dumont@example.com', numero: '06 99 77 66 55', age: 44, genre: 'Homme', adresse: '12 Avenue de l’Opéra, 75001 Paris' },
    { id: '22', nom: 'Blanchard', prenom: 'Emilie', email: 'emilie.blanchard@example.com', numero: '07 33 44 55 66', age: 33, genre: 'Femme', adresse: '17 Boulevard Voltaire, 75011 Paris' },
    { id: '23', nom: 'Jacquet', prenom: 'Hugo', email: 'hugo.jacquet@example.com', numero: '06 55 44 77 99', age: 29, genre: 'Homme', adresse: '9 Rue du Faubourg Montmartre, 75009 Paris' },
    { id: '24', nom: 'Marchand', prenom: 'Chloé', email: 'chloe.marchand@example.com', numero: '07 22 33 55 66', age: 40, genre: 'Femme', adresse: '5 Rue des Rosiers, 75004 Paris' },
    { id: '25', nom: 'Berger', prenom: 'Vincent', email: 'vincent.berger@example.com', numero: '06 77 88 22 11', age: 50, genre: 'Homme', adresse: '11 Rue du Louvre, 75001 Paris' },
    { id: '26', nom: 'Bailly', prenom: 'Amandine', email: 'amandine.bailly@example.com', numero: '07 66 77 88 99', age: 31, genre: 'Femme', adresse: '8 Rue Oberkampf, 75011 Paris' },
    { id: '27', nom: 'Moulin', prenom: 'Benoît', email: 'benoit.moulin@example.com', numero: '06 99 11 22 33', age: 46, genre: 'Homme', adresse: '3 Rue Saint-Honoré, 75001 Paris' },
    { id: '28', nom: 'Collet', prenom: 'Manon', email: 'manon.collet@example.com', numero: '07 44 55 66 77', age: 37, genre: 'Femme', adresse: '20 Rue du Faubourg Saint-Antoine, 75012 Paris' },
    { id: '29', nom: 'Charpentier', prenom: 'Théo', email: 'theo.charpentier@example.com', numero: '06 22 33 44 55', age: 39, genre: 'Homme', adresse: '15 Avenue des Gobelins, 75013 Paris' },
    { id: '30', nom: 'Rey', prenom: 'Eva', email: 'eva.rey@example.com', numero: '07 88 99 11 22', age: 26, genre: 'Femme', adresse: '19 Rue des Martyrs, 75009 Paris' }
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
      createAppointment: false,
      // La propriété isNewPatient et newPatient seront gérées dans le PracticeDialog
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

  // Gestion des interactions
  const handleSlotClick = (daySchedule, slotIndex, sourceType) => {
    const parentSlot = daySchedule.timeSlots[slotIndex];
    setPracticeDialog({
      isOpen: true,
      date: daySchedule.date,
      slotIndex,
      sourceType,
      parentSlot,
      practices: parentSlot.practices || [],
      newPractice: { 
        type: 'naturopathie', 
        start: '', 
        end: '', 
        error: '', 
        createAppointment: false,
        isNewPatient: false,
        newPatient: {}
      },
      selectedPatientId: '',
      error: ''
    });
  };

  const handlePracticeClick = (daySchedule, slotIndex, practice, appointmentKey) => {
    setAppointmentDialog({
      isOpen: true,
      daySchedule,
      slotIndex,
      practice,
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
      const newPractice = { ...prev.newPractice, type };
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

  // Ajout d'une pratique ET, si l'option est activée, d'un rendez‑vous
  const handleAddPractice = () => {
    setPracticeDialog(prev => {
      const { newPractice, practices, parentSlot, selectedPatientId } = prev;
      if (!newPractice.start) {
        return { ...prev, newPractice: { ...newPractice, error: "Veuillez saisir l'heure de début." } };
      }
      const parentStart = parseTime(parentSlot.start);
      const parentEnd = parseTime(parentSlot.end);
      const newStart = parseTime(newPractice.start);
      const newEnd = parseTime(newPractice.end);
      if (newStart < parentStart || newEnd > parentEnd) {
        return { ...prev, newPractice: { ...newPractice, error: "La pratique doit être dans la plage horaire sélectionnée." } };
      }
      for (let p of practices) {
        const existingStart = parseTime(p.start);
        const existingEnd = parseTime(p.end);
        if (newStart < existingEnd && newEnd > existingStart) {
          return { ...prev, newPractice: { ...newPractice, error: "Chevauchement d'horaires détecté." } };
        }
      }
      const updatedPractices = [...practices, { ...newPractice, error: '' }];
      const appointmentKey = `${prev.date}_${prev.slotIndex}_${newPractice.start}_${newPractice.type}`;
      if (newPractice.createAppointment) {
        // Si aucun patient n'est sélectionné ET que la création d'un nouveau patient n'est pas activée, on affiche une erreur
        if (!selectedPatientId && !newPractice.isNewPatient) {
          return { ...prev, error: 'Veuillez sélectionner un patient.' };
        }
        // Vérifier que ce créneau n'est pas déjà réservé
        if (appointments.find(app => app.key === appointmentKey)) {
          return { ...prev, error: 'Ce créneau est déjà réservé.' };
        }
        let patient;
        if (newPractice.isNewPatient) {
          // Vérification minimale sur le formulaire du nouveau patient
          if (!newPractice.newPatient || !newPractice.newPatient.prenom || !newPractice.newPatient.nom) {
            return { ...prev, error: 'Veuillez remplir les informations du nouveau patient.' };
          }
          const newId = (Math.max(...fakePatientsData.map(p => parseInt(p.id))) + 1).toString();
          patient = { ...newPractice.newPatient, id: newId, appointments: [] };
          const updatedFakePatients = [...fakePatientsData, patient];
          setFakePatientsData(updatedFakePatients);
          localStorage.setItem('fakedatauser', JSON.stringify(updatedFakePatients));
        } else {
          patient = fakePatientsData.find(p => p.id === selectedPatientId);
        }
        const newAppointment = {
          key: appointmentKey,
          date: prev.date,
          slotIndex: prev.slotIndex,
          practice: { ...newPractice },
          patient,
          motif: newPractice.motif || ''
        };
        const updatedAppointments = [...appointments, newAppointment];
        setAppointments(updatedAppointments);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      }
      return { 
        ...prev, 
        practices: updatedPractices, 
        newPractice: { 
          type: newPractice.type, 
          start: '', 
          end: '', 
          error: '', 
          createAppointment: false,
          isNewPatient: false,
          newPatient: {}
        },
        selectedPatientId: '',
        error: ''
      };
    });
  };

  const handleRemovePractice = (index) => {
    setPracticeDialog(prev => {
      const updatedPractices = prev.practices.filter((_, i) => i !== index);
      return { ...prev, practices: updatedPractices };
    });
  };

  const handleSavePractices = () => {
    const { date, slotIndex, sourceType, practices } = practiceDialog;
    if (sourceType === 'specific') {
      setSchedule(prev => {
        const specificUpdated = [...prev.specific];
        const index = specificUpdated.findIndex(item => item.date === date);
        if (index !== -1) {
          specificUpdated[index].timeSlots[slotIndex].practices = practices;
        } else {
          specificUpdated.push({ date, timeSlots: [] });
        }
        localStorage.setItem('planning', JSON.stringify({ datesWithSlots: specificUpdated }));
        return { ...prev, specific: specificUpdated };
      });
    } else {
      setSchedule(prev => {
        const dayName = dayNames[parse(date, 'dd-MM-yyyy', new Date()).getDay()];
        const generalUpdated = [...prev.defaultGeneral];
        const index = generalUpdated.findIndex(item => item.name.toLowerCase() === dayName.toLowerCase());
        if (index !== -1) {
          generalUpdated[index].times[slotIndex].practices = practices;
        }
        localStorage.setItem('general', JSON.stringify(generalUpdated));
        return { ...prev, defaultGeneral: generalUpdated };
      });
    }
    setPracticeDialog({
      isOpen: false,
      date: null,
      slotIndex: null,
      sourceType: null,
      parentSlot: null,
      practices: [],
      newPractice: { type: 'naturopathie', start: '', end: '', error: '', createAppointment: false, isNewPatient: false, newPatient: {} },
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
      newPractice: { type: 'naturopathie', start: '', end: '', error: '', createAppointment: false, isNewPatient: false, newPatient: {} },
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
      <div className="flex-grow">
        <div className="flex items-center justify-between w-full mb-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <Button className="border-none bg-[#565D6D] text-white shadow-none rounded-none" onClick={goPrev}>
              <ArrowLeft />
            </Button>
            <Button className="border-none bg-[#565D6D] text-white shadow-none rounded-none" onClick={goToday}>
              Aujourd'hui
            </Button>
            <Button className="border-none bg-[#565D6D] text-white shadow-none rounded-none" onClick={goNext}>
              <ArrowRight />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className={`border-none text-white shadow-none rounded-none ${viewMode === 'day' ? 'bg-[#2b7a72]' : 'bg-[#565D6D]'}`}
              onClick={() => setViewMode('day')}
            >
              Jour
            </Button>
            <Button
              className={`border-none text-white shadow-none rounded-none ${viewMode === 'week' ? 'bg-[#2b7a72]' : 'bg-[#565D6D]'}`}
              onClick={() => setViewMode('week')}
            >
              Semaine
            </Button>
            <Button
              className={`border-none text-white shadow-none rounded-none ${viewMode === 'month' ? 'bg-[#2b7a72]' : 'bg-[#565D6D]'}`}
              onClick={() => setViewMode('month')}
            >
              Tous les Rendez‑vous
            </Button>
          </div>
          <Button className="flex items-center gap-2 border-none bg-[#565D6D] text-white shadow-none rounded-none h-full ">
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
        />
      </div>
      {practiceDialog.isOpen && (
        <PracticeDialog
          practiceDialog={practiceDialog}
          onClose={handleClosePracticeDialog}
          onTypeChange={handlePracticeTypeChange}
          onStartChange={handlePracticeStartChange}
          onAddPractice={handleAddPractice}
          onRemovePractice={handleRemovePractice}
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

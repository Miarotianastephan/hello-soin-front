import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Phone, CircleArrowRight, User, CalendarCheck, Calendar, Clock, Smartphone, History, PhoneOff } from 'lucide-react';
import BASE_URL from '@/pages/config/baseurl';

const ReservedDialog = ({ reservedDialog, setReservedDialog, refreshSchedule }) => {
  const [profileImg, setProfileImg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDate, setEditedDate] = useState(null);
  const [editedStartTime, setEditedStartTime] = useState(null);
  const [editedEndTime, setEditedEndTime] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);

  // Fake data pour l'historique des appels/messages
  const [callHistory, setCallHistory] = useState([
    {
      id: 1,
      number: "01 23 45 67 89",
      date: "15-03-2025 14:00",
      duree: "1:55",
      type: "appelle"
    },
    {
      id: 2,
      number: "09 87 65 43 21",
      date: "14-03-2025 09:30",
      duree: "", // durée laissée vide pour les messages
      type: "message"
    },
    {
      id: 3,
      number: "01 23 45 67 89",
      date: "13-03-2025 18:45",
      duree: "5:00",
      type: "appelle"
    },
  ]);

  useEffect(() => {
    // Génère une URL de photo de profil aléatoire au montage du composant
    setProfileImg(`https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`);
  }, []);

  if (!reservedDialog.isOpen) return null;

  // Calcule l'âge à partir de la date de naissance
  const calculateAge = (birthDateString) => {
    const birthDate = parse(birthDateString, 'dd-MM-yyyy', new Date());
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Formate une chaîne de date "dd-MM-yyyy" pour l'affichage
  const formatDate = (dateStr) => {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    if (isNaN(parsedDate.getTime())) return dateStr;
    return format(parsedDate, 'dd-MM-yyyy');
  };

  // Parse une chaîne "hh:mm" en objet Date (avec la date d'aujourd'hui)
  const parseTimeStringToDate = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj;
  };

  // Handler pour le bouton modifier / appliquer
  const handleModify = async () => {
    if (!isEditing) {
      // Passage en mode édition et initialisation des valeurs
      setEditedDate(parse(reservedDialog.appointment.date, 'dd-MM-yyyy', new Date()));
      setEditedStartTime(parseTimeStringToDate(reservedDialog.appointment.practice_start));
      setEditedEndTime(parseTimeStringToDate(reservedDialog.appointment.practice_end));
      setIsEditing(true);
    } else {
      // Construction de l'objet rendez‑vous mis à jour
      const updatedAppointment = {
        ...reservedDialog.appointment,
        date: format(editedDate, 'dd-MM-yyyy'),
        practice_start: format(editedStartTime, 'HH:mm'),
        practice_end: format(editedEndTime, 'HH:mm')
      };
      try {
        const response = await fetch(`${BASE_URL}/appointments`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAppointment)
        });
        const result = await response.json();
        if (response.ok) {
          console.log('Rendez‑vous mis à jour', result);
          // Mise à jour du rendez‑vous dans le state
          setReservedDialog({
            ...reservedDialog,
            appointment: updatedAppointment
          });
          // Rafraîchit le planning global
          refreshSchedule();
        } else {
          console.error('Erreur lors de la mise à jour:', result.error);
        }
      } catch (error) {
        console.error('Erreur lors de la requête de mise à jour:', error);
      }
      setIsEditing(false);
    }
  };

  // Handler pour annuler le rendez‑vous
  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/appointments/${reservedDialog.appointment.id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Rendez‑vous supprimé', result);
        // Fermer le dialogue après suppression
        setReservedDialog({ isOpen: false, appointment: null });
        // Rafraîchit le planning global
        refreshSchedule();
      } else {
        console.error('Erreur lors de la suppression:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la requête de suppression:', error);
    }
  };

  const handleCall = (number) => {
    console.log('Appeler le numéro', number);
    setCurrentCall(number);
    setIsCalling(true);
  };

  return (
    <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-6 z-50 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold">Détails du Rendez‑vous</h2>
        <button onClick={() => setReservedDialog({ isOpen: false, appointment: null })} className="font-bold">
          <CircleArrowRight size={25} className="mr-1" />
        </button>
      </div>
      <div className="p-4 rounded-lg shadow-none mb-6">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded" src={profileImg} alt="Profile" />
          <div className="flex flex-col">
            <div className="flex items-center">
              <User size={20} className="mr-2" />
              <h3 className="text-xl font-semibold">
                {reservedDialog.appointment.genre} {reservedDialog.appointment.prenom} {reservedDialog.appointment.nom}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Âge : {calculateAge(reservedDialog.appointment.dateNaissance)} ans
            </p>
          </div>
        </div>
      </div>

      {/* Informations individuelles */}
      <div className="px-4">
        <div className="flex items-center py-2 border-b gap-5">
          <label className="font-medium font-bold text-gray-700">Numéro :</label>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span
              className="text-green-500 cursor-pointer"
              onClick={() => handleCall(reservedDialog.appointment.numero)}
            >
              {reservedDialog.appointment.numero}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={16} />
            <span
              className="text-green-500 cursor-pointer"
              onClick={() => handleCall(reservedDialog.appointment.mobile)}
            >
              {reservedDialog.appointment.mobile}
            </span>
          </div>
        </div>
        <div className="flex items-center py-2 border-b gap-5">
          <label className="font-medium font-bold text-gray-700">Type de rendez‑vous :</label>
          <div className="flex items-center">
            <CalendarCheck size={16} className="mr-1" />
            <span>{reservedDialog.appointment.practice_type}</span>
          </div>
        </div>
        <div className="flex flex-col py-2 border-b">
          <label className="font-medium font-bold text-gray-700">Date & Heure :</label>
          <div className="flex w-full items-center justify-start my-2 gap-5">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="mr-1" />
              {isEditing ? (
                <DatePicker
                  selected={editedDate}
                  onChange={(date) => setEditedDate(date)}
                  dateFormat="dd-MM-yyyy"
                  className="border rounded p-1"
                />
              ) : (
                <span>{formatDate(reservedDialog.appointment.date)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="mr-1" />
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <DatePicker
                    selected={editedStartTime}
                    onChange={(date) => setEditedStartTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Début"
                    dateFormat="HH:mm"
                    className="border rounded p-1 w-20"
                  />
                  <span>-</span>
                  <DatePicker
                    selected={editedEndTime}
                    onChange={(date) => setEditedEndTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Fin"
                    dateFormat="HH:mm"
                    className="border rounded p-1 w-20"
                  />
                </div>
              ) : (
                <span>
                  {reservedDialog.appointment.practice_start} - {reservedDialog.appointment.practice_end}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center py-2 border-b gap-4 h-[40px]">
          <label className="font-medium text-gray-700 font-bold">Motif :</label>
          <div className="flex items-center">
            <span>{reservedDialog.appointment.motif}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 px-2">
        <Button variant="outline" onClick={handleModify}>
          {isEditing ? 'Appliquer' : (
            <>
              <Edit size={16} className="mr-1" />
              Modifier Rendez‑vous
            </>
          )}
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash size={16} className="mr-1" />
          Annuler Rendez‑vous
        </Button>
      </div>

      {/* Overlay d'appel */}
      {isCalling && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 flex flex-col justify-center items-center z-50">
          <p className="text-white text-2xl mb-4">Appel en cours vers {currentCall}</p>
          <Button variant="destructive" onClick={() => setIsCalling(false)}>
            <PhoneOff size={20} /> Raccrocher
          </Button>
        </div>
      )}

      {/* Section Historique d'appels/messages avec Fake Data */}
      <div className="mt-6 px-2">
        <h3 className="text-lg font-bold mb-2 flex items-center justify-start gap-4">
          <History size={20} /> Historique
        </h3>
        <div className="max-h-64 overflow-y-auto">
          {callHistory.map((call) => (
            <div key={call.id} className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-gray-600">{call.date}</span>
              {call.type === "appelle" && (
                <span className="text-sm text-left">Duree : {call.duree}</span>
              )}
              <span className={`text-sm ${call.type === "message" ? "text-blue-500" : "text-green-500"}`}>
                {call.type === "message" ? "Message" : "Appel"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservedDialog;

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Agenda.css'; // Fichier CSS pour le style
import { useEffect, useState } from 'react';

const localizer = momentLocalizer(moment);

const idPratiqueColors = {
  1: '#2196F3', // Bleu
  2: '#4CAF50', // Vert
  3: '#FF9800', // Orange
  9: '#9C27B0', // Violet
  8: '#795548', // Marron
};

const splitTimeSlots = (start, end, dureePratique) => {
  let slots = [];
  let current = moment(start);
  let finalEnd = moment(end);
  while (current.isBefore(finalEnd)) {
    let next = moment(current).add(dureePratique, 'minutes');
    if (next.isAfter(finalEnd)) next = finalEnd;
    slots.push({
      start: current.toDate(),
      end: next.toDate(),
    });
    current = next;
  }
  return slots;
};

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rendezvous, setRendezvous] = useState([]);
  const [formData, setFormData] = useState({
    date_rdv: '',
    heure_rdv: '',
    motif_rdv: '',
    status_rdv: 'confirmé',
    id_pratique: 2,
    id_users: 2,
    id_users_1: 2,
  });
  const [disponibilite, setDisponibilite] = useState({
    date_dispo: '',
    heure_debut_dispo: '',
    heure_fin_dispo: '',
    date_ajout_dispo: new Date().toISOString().split('T')[0],
    id_pratique: 2,
  });

  const isSlotBooked = (slotStart, slotEnd, rendezvous) => {
    return rendezvous.some((rdv) => {
      const rdvStart = moment(`${rdv.date_rdv} ${rdv.heure_rdv}`);
      const rdvEnd = moment(rdvStart).add(1, 'hour'); // Assuming each appointment is 1 hour long
      return (
        moment(slotStart).isBetween(rdvStart, rdvEnd, null, '[]') ||
        moment(slotEnd).isBetween(rdvStart, rdvEnd, null, '[]')
      );
    });
  };

  // Récupérer les rendez-vous depuis l'API
  useEffect(() => {
    fetch('http://192.168.137.1:3000/api/rdv/user/2')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRendezvous(data.data);
        }
      })
      .catch((error) => console.error('Erreur de chargement des rendez-vous :', error));
  }, []);

  // Récupérer les disponibilités depuis l'API
  useEffect(() => {
    fetch('http://192.168.137.1:3000/api/agenda/praticien/1')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let allSlots = [];
          data.data.forEach((item) => {
            const slots = splitTimeSlots(
              `${item.date_dispo} ${item.heure_debut_dispo}`,
              `${item.date_dispo} ${item.heure_fin_dispo}`,
              item.duree * 60 // Convertir la durée en minutes
            );
            slots.forEach((slot) => {
              const isBooked = isSlotBooked(slot.start, slot.end, rendezvous);

              allSlots.push({
                title: isBooked
                  ? `Rendez-vous (${item.nom_pratique})`
                  : `${item.nom_pratique} - ${item.nom_dsp}`,
                start: slot.start,
                end: slot.end,
                allDay: false,
                description: `Tarif: ${item.tarif} €\nAdresse: ${item.adresse}`,
                user_name: `${item.user_name} ${item.user_forname}`,
                backgroundColor: isBooked ? '#FF0000' : idPratiqueColors[item.id_pratique] || '#000',
                isBooked,
                id_pratique: item.id_pratique,
              });
            });
          });
          setEvents(allSlots);
        }
      })
      .catch((error) => console.error('Erreur de chargement des disponibilités :', error))
      .finally(() => setLoading(false));
  }, [rendezvous]);



  const handleSlotSelect = (slotInfo) => {
    if (slotInfo.isBooked) {
      alert('Ce créneau est déjà réservé.');
      return;
    }
  
    const selectedDate = moment(slotInfo.start).format('YYYY-MM-DD');
    const selectedTime = moment(slotInfo.start).format('HH:mm:ss');
  
    setFormData((prev) => ({
      ...prev,
      date_rdv: selectedDate,
      heure_rdv: selectedTime,
      id_pratique: slotInfo.id_pratique,
    }));
  
    setSelectedSlot(slotInfo);
    setOpenModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://192.168.137.1:3000/api/agenda/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disponibilite),
      });
      const result = await response.json();
      if (result.success) {
        alert('Disponibilité ajoutée avec succès !');
      } else {
        alert('Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur d\'envoi :', error);
    }
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://192.168.137.1:3000/api/rdv/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Rendez-vous pris avec succès !');
        setOpenModal(false);
      } else {
        alert('Erreur lors de la prise de rendez-vous.');
      }
    } catch (error) {
      console.error("Erreur d'envoi :", error);
    }
  };

  return (
    <div className="agenda-container">
      <div className="sidebar">
        <h2>Ajouter une Disponibilité</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>Date</label>
          <input
            type="date"
            required
            value={disponibilite.date_dispo}
            onChange={(e) => setDisponibilite({ ...disponibilite, date_dispo: e.target.value })}
          />
          <label>Heure de début</label>
          <input
            type="time"
            required
            value={disponibilite.heure_debut_dispo}
            onChange={(e) => setDisponibilite({ ...disponibilite, heure_debut_dispo: e.target.value })}
          />
          <label>Heure de fin</label>
          <input
            type="time"
            required
            value={disponibilite.heure_fin_dispo}
            onChange={(e) => setDisponibilite({ ...disponibilite, heure_fin_dispo: e.target.value })}
          />
          <label>ID Pratique</label>
          <select
            required
            value={disponibilite.id_pratique}
            onChange={(e) => setDisponibilite({ ...disponibilite, id_pratique: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 9, 8].map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <button type="submit">Ajouter</button>
        </form>
      </div>
      <div className="calendar-container">
        <h1>Agenda des Disponibilités</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '80vh' }}
          min={moment().set({ hour: 9, minute: 0 }).toDate()}
          max={moment().set({ hour: 19, minute: 0 }).toDate()}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.backgroundColor,
              color: 'white',
            },
          })}
          selectable
          onSelectEvent={handleSlotSelect}
        />
      </div>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Prendre un Rendez-vous</h2>
            <form onSubmit={handleSubmit2} className="form">
              <label>Motif du rendez-vous</label>
              <input
                type="text"
                required
                value={formData.motif_rdv}
                onChange={(e) => setFormData({ ...formData, motif_rdv: e.target.value })}
              />
              <button type="submit">Confirmer le RDV</button>
              <button type="button" onClick={() => setOpenModal(false)}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
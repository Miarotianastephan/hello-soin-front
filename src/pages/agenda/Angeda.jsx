import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Agenda.css';
import { useEffect, useState } from 'react';
import { API_URL } from '@/services/api';

const localizer = momentLocalizer(moment);

const idPratiqueColors = {
  1: '#2196F3', // Bleu
  2: '#4CAF50', // Vert
  3: '#FF9800', // Orange
  9: '#9C27B0', // Violet
  8: '#795548', // Marron
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

  const isSlotBooked = (slotStart, rendezvous) => {
    return rendezvous.some((rdv) => {
      const rdvStart = moment(`${rdv.date_rdv} ${rdv.heure_rdv}`);
      return moment(slotStart).isSame(rdvStart);
    });
  };

  useEffect(() => {
    fetch('http://192.168.137.1:3000/api/rdv/user/2')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRendezvous(data.data);
        }
      })
      .catch((error) => console.error('Erreur chargement RDV:', error));
  }, []);

  useEffect(() => {
    fetch('http://192.168.137.1:3000/api/agenda/praticien/1')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const allSlots = data.data.map((item) => {
            const isBooked = isSlotBooked(`${item.date_dispo} ${item.heure_debut_dispo}`, rendezvous);
            return {
              title: isBooked ? `RDV (${item.nom_pratique})` : `${item.nom_pratique} - ${item.nom_dsp}`,
              start: moment(`${item.date_dispo} ${item.heure_debut_dispo}`).toDate(),
              end: moment(`${item.date_dispo} ${item.heure_fin_dispo}`).toDate(),
              allDay: false,
              backgroundColor: isBooked ? '#FF0000' : idPratiqueColors[item.id_pratique] || '#000',
              isBooked,
              id_pratique: item.id_pratique,
            };
          });
          setEvents(allSlots);
        }
      })
      .catch((error) => console.error('Erreur chargement disponibilités:', error))
      .finally(() => setLoading(false));
  }, [rendezvous]);

  const handleSlotSelect = (slotInfo) => {
    if (slotInfo.isBooked) {
      alert('Ce créneau est déjà réservé.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      date_rdv: moment(slotInfo.start).format('YYYY-MM-DD'),
      heure_rdv: moment(slotInfo.start).format('HH:mm:ss'),
      id_pratique: slotInfo.id_pratique,
    }));
    setSelectedSlot(slotInfo);
    setOpenModal(true);
  };

  const handleSubmitDisponibilite = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://192.168.137.1:3000/api/agenda/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disponibilite),
      });
      const result = await response.json();
      alert(result.success ? 'Disponibilité ajoutée avec succès !' : result.message);
    } catch (error) {
      console.error('Erreur d\'ajout disponibilité:', error);
    }
  };

  const handleSubmitRdv = async (event) => {
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
        alert('Erreur prise RDV.');
      }
    } catch (error) {
      console.error('Erreur prise RDV:', error);
    }
  };

  return (
    <div className="agenda-container">
      <div className="sidebar">
        <h2>Ajouter une Disponibilité</h2>
        <form onSubmit={handleSubmitDisponibilite} className="form">
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
            style: { backgroundColor: event.backgroundColor, color: 'white' },
          })}
          selectable
          onSelectEvent={handleSlotSelect}
        />
      </div>

      {openModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Prendre un Rendez-vous</h2>
            <form onSubmit={handleSubmitRdv} className="form">
              <label>Motif</label>
              <input
                type="text"
                required
                value={formData.motif_rdv}
                onChange={(e) => setFormData({ ...formData, motif_rdv: e.target.value })}
              />
              <button type="submit">Confirmer</button>
              <button type="button" onClick={() => setOpenModal(false)}>Annuler</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;

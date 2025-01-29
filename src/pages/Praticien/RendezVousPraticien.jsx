import React, { useState } from 'react';
import './RendezVousPraticien.css';

const RendezVousPraticien = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' ou 'week'
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    backgroundColor: '#4A90E2',
    textColor: '#FFFFFF',
    isAllDay: false
  });

  // Fonction pour obtenir les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Ajouter les jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
  };

  // Gestionnaire pour l'ajout d'un événement
  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      start: new Date(newEvent.startDate),
      end: new Date(newEvent.endDate)
    };
    
    setEvents([...events, event]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      backgroundColor: '#4A90E2',
      textColor: '#FFFFFF',
      isAllDay: false
    });
  };

  // Fonction pour formatter la date en mois/année
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Navigation entre les mois
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1>Calendrier</h1>
        <div className="calendar-controls">
          <button className="today-button" onClick={() => setCurrentDate(new Date())}>
            Aujourd'hui
          </button>
          <div className="navigation">
            <button onClick={() => navigateMonth(-1)}>&lt;</button>
            <span>{formatMonthYear(currentDate)}</span>
            <button onClick={() => navigateMonth(1)}>&gt;</button>
          </div>
          <div className="view-controls">
            <button 
              className={`view-button ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              Mois
            </button>
            <button 
              className={`view-button ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Semaine
            </button>
          </div>
          <button 
            className="add-event-button"
            onClick={() => setShowAddModal(true)}
          >
            + Nouveau Rendez-vous
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="calendar-header-cell">{day}</div>
        ))}
        
        {getDaysInMonth(currentDate).map((dayObj, index) => (
          <div 
            key={index}
            className={`calendar-cell ${!dayObj.isCurrentMonth ? 'other-month' : ''}`}
            onClick={() => {
              setSelectedSlot(dayObj.date);
              setShowAddModal(true);
            }}
          >
            <div className="date-number">{dayObj.date.getDate()}</div>
            <div className="events-container">
              {events
                .filter(event => 
                  event.start.toDateString() === dayObj.date.toDateString()
                )
                .map(event => (
                  <div
                    key={event.id}
                    className="event-chip"
                    style={{
                      backgroundColor: event.backgroundColor,
                      color: event.textColor
                    }}
                  >
                    {event.title}
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ajouter un rendez-vous</h2>
            <input
              type="text"
              placeholder="Titre"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            />
            <div className="datetime-inputs">
              <input
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
              />
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
              />
            </div>
            <div className="color-picker">
              <label>Couleur de fond:</label>
              <div className="color-options">
                {['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#7ED321'].map(color => (
                  <div
                    key={color}
                    className={`color-option ${newEvent.backgroundColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewEvent({...newEvent, backgroundColor: color})}
                  />
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Annuler</button>
              <button onClick={handleAddEvent}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RendezVousPraticien;
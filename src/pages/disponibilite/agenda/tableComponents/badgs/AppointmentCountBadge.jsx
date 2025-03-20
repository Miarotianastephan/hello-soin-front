import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

// Composant qui récupère le nombre de rendez-vous pour un patient
const AppointmentCountBadge = ({ patientId }) => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8888/api/appointments/count/${patientId}`)
      .then(res => res.json())
      .then(data => setCount(data.appointmentCount))
      .catch(err => console.error("Erreur lors de la récupération du count", err));
  }, [patientId]);

  // Si appointmentCount vaut exactement 1, on affiche l'icône en haut à droite
  if (count === 1) {
    return (
      <div style={{ position: 'absolute', top: 2, right: 2 }}>
        <User size={16} color="red" strokeWidth={2.5} />
      </div>
    );
  }
  return null;
};

export default AppointmentCountBadge;

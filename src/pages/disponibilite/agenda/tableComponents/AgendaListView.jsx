// src/components/Agenda/AgendaListView.js
import React from 'react';
import AppointmentsList from './AppointmentsList';

const AgendaListView = ({ appointments }) => {
  return (
    <div>
      <AppointmentsList appointments={appointments} />
    </div>
  );
};

export default AgendaListView;

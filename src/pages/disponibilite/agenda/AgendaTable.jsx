// src/components/Agenda/AgendaTable.js
import React from 'react';
import AgendaDayView from './tableComponents/AgendaDayView';
import AgendaWeekView from './tableComponents/AgendaWeekView';
import AgendaMonthView from './tableComponents/AgendaMonthView';
import AgendaListView from './tableComponents/AgendaListView';

const AgendaTable = (props) => {
  const { viewMode } = props;

  if (viewMode === 'day') {
    return <AgendaDayView {...props} />;
  } else if (viewMode === 'week') {
    return <AgendaWeekView {...props} />;
  } else if (viewMode === 'month') {
    return <AgendaMonthView {...props} />;
  } else if (viewMode === 'list') {
    return <AgendaListView {...props} />;
  } else {
    return null;
  }
};

export default AgendaTable;

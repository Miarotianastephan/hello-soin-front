import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPraticien from '../pages/Praticien/DashboardPraticien';
import RendezVousPraticien from '../pages/Praticien/RendezVousPraticien';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Redirige la route racine vers /praticien/rendez-vous */}
        <Route path="/" element={<Navigate to="/praticien/rendez-vous" replace />} />
        <Route path="/praticien/dashboard" element={<DashboardPraticien />} />
        <Route path="/praticien/rendez-vous" element={<RendezVousPraticien />} />
        {/* Ajoutez d'autres routes ici */}
      </Routes>
    </Router>
  );
}

export default AppRouter;

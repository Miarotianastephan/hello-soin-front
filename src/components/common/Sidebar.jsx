// src/components/common/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LayoutDashboard, Users, Settings } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        <Link 
          to="/praticien/dashboard"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/praticien/rendez-vous"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <Calendar className="w-5 h-5" />
          <span>Rendez-vous</span>
        </Link>
        <Link 
          to="/praticien/patients"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <Users className="w-5 h-5" />
          <span>Patients</span>
        </Link>
        <Link 
          to="/praticien/parametres"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <Settings className="w-5 h-5" />
          <span>Paramètres</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
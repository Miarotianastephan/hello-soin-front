// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Medical App
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/praticien/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/praticien/rendez-vous" className="text-gray-600 hover:text-gray-900">
              Rendez-vous
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
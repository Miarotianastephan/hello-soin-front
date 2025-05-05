// TroubleManager.jsx
import React, { useState } from 'react';
import TableList from './TroubleEtSolution';
import TroubleConfig from './TroubleConfig';

const TroubleManager = () => {
  // "table" pour l'affichage de la liste, "config" pour l'édition/ajout
  const [currentView, setCurrentView] = useState('table');
  // On peut également passer le trouble sélectionné en cas d'édition
  const [selectedTrouble, setSelectedTrouble] = useState(null);

  // Callback pour éditer un trouble
  const handleEditTrouble = (trouble) => {
    setSelectedTrouble(trouble);
    setCurrentView('config');
  };


  const handleDeleteTrouble = (trouble) => {
    setSelectedTrouble(trouble);
  };

  // Callback pour ajouter un trouble
  const handleAddTrouble = () => {
    setSelectedTrouble(null);
    setCurrentView('config');
  };

  // Retour à la vue TableList
  const handleBack = () => {
    setCurrentView('table');
  };

  return (
    <div>
      {currentView === 'table' && (
        <TableList 
          onDeleteTrouble={handleDeleteTrouble}
          onEditTrouble={handleEditTrouble} 
          onAddTrouble={handleAddTrouble} 
        />
      )}
      {currentView === 'config' && (
        <TroubleConfig 
          onBack={handleBack} 
          initialTrouble={selectedTrouble} 
        />
      )}
    </div>
  );
};

export default TroubleManager;

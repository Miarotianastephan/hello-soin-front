// TroubleManager.jsx
import React, { useState } from 'react';
import TableList from './TroubleEtSolution';
import TroubleConfig from './TroubleConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTroubleApproche } from '@/services/trouble-solutions-services';

const TroubleManager = () => {
  const queryClient = useQueryClient();
  // "table" pour l'affichage de la liste, "config" pour l'édition/ajout
  const [currentView, setCurrentView] = useState('table');
  // On peut également passer le trouble sélectionné en cas d'édition
  const [selectedTrouble, setSelectedTrouble] = useState(null);

  // Callback pour ajouter un trouble
  const handleAddTrouble = () => {
    setSelectedTrouble(null);
    setCurrentView('config');
  };

  // Retour à la vue TableList
  const handleBack = () => {
    setCurrentView('table');
  };

  // Delete
  const useDeleteTroubleApproche = () => {
    return useMutation({
      mutationFn: deleteTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches supprimes avec succès :", data);
        queryClient.invalidateQueries(['praticien-approches']);
        handleBack();
      },
      onError: (error) => {
        console.error("Erreur pendant l'ajout :", error);
      },
    });
  };
  const { mutate: deleteApproche, isSaveLoading, isSaveSuccess, isSaveError, saveError } = useDeleteTroubleApproche();
  const handleDeleteTrouble = (trouble) => {
    console.log(trouble);
    deleteApproche(trouble);
    setSelectedTrouble(null);
  };

  // Update
  
  // Callback pour éditer un trouble
  const handleEditTrouble = (trouble) => {
    setSelectedTrouble(trouble);
    setCurrentView('config');
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

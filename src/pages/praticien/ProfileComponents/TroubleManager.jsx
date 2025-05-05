// TroubleManager.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import TableList from './TroubleEtSolution';
import TroubleConfig from './TroubleConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTroubleApproche } from '@/services/trouble-solutions-services';
// Ajoutez l'import de HeroUI Toast
import { addToast } from "@heroui/react";
import { TailSpin } from 'react-loader-spinner';
import { DialogDescription } from '@radix-ui/react-dialog';

const TroubleManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [troubleToDelete, setTroubleToDelete] = useState(null);
  const [currentView, setCurrentView] = useState('table');
  const [selectedTrouble, setSelectedTrouble] = useState(null);

  // Callback pour ajouter un trouble
  const handleAddTrouble = () => {
    setSelectedTrouble(null);
    setCurrentView('config');
  };

  // Retour à la vue TableList
  const handleBack = () => {
    setCurrentView('table')
    setIsUpdate(false);
  };

  // Delete
  const useDeleteTroubleApproche = () => {
    return useMutation({
      mutationFn: deleteTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches supprimes avec succès :", data);
        queryClient.invalidateQueries(['praticien-approches']);
        addToast({
          title: 'Suppression réussie de l’approche.',
          color: 'warning',
          duration: 3000
        });
        handleBack();
      },
      onError: (error) => {
        const err = error.response.data;
        console.error("Erreur pendant l'ajout :", err);
        addToast({
          title: `Erreur lors de la suppression: ${error.response.data.error}`,
          color: 'danger',
          duration: 5000
        });
      },
    });
  };
  const { mutate: deleteApproche, isLoading: isDeleteLoading, isSaveSuccess, isSaveError, saveError } = useDeleteTroubleApproche();
  const handleAskDelete = (trouble) => {
    setTroubleToDelete(trouble);
    setIsDialogOpen(true);
  };
  const confirmDelete = () => {
    if (troubleToDelete) {
      deleteApproche(troubleToDelete);
      setTroubleToDelete(null);
      setIsDialogOpen(false);
    }
  };

  // Update
  // Callback pour éditer un trouble
  const handleEditTrouble = (trouble) => {
    setSelectedTrouble(null);
    setIsUpdate(true);
    setCurrentView('config');
  };

  return (
    <div>
      {currentView === 'table' && (
        <TableList 
          onDeleteTrouble={handleAskDelete}
          onEditTrouble={handleEditTrouble} 
          onAddTrouble={handleAddTrouble} 
        />
      )}
      {currentView === 'config' && (
        <TroubleConfig 
          onBack={handleBack} 
          initialTrouble={selectedTrouble}
          isUpdate={isUpdate}
        />
      )}
      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-xs">
              Êtes-vous sûr de vouloir supprimer cette approche ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="text-xs rounded"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={isDeleteLoading}
              className="text-xs rounded"
            >
              {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TroubleManager;

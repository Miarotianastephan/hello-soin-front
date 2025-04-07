import React, { useState, useEffect } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import EditFormation from './EditFormation';

const Formation = () => {
  const [startDate, setStartDate] = useState('');
  const [experience, setExperience] = useState(0);
  const [formations, setFormations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);

  // Clé localStorage pour les formations
  const FORMATION_KEY = 'formations';

  // Chargement des formations depuis le localStorage ou initialisation par défaut
  useEffect(() => {
    const storedFormations = localStorage.getItem(FORMATION_KEY);
    if (storedFormations) {
      setFormations(JSON.parse(storedFormations));
    } else {
      const defaultFormations = [
        {
          id: 1,
          annee: '2021',
          diplome: 'Master en Gestion',
          specialite: 'Formation praticien en EFT',
          etablissement: 'Université Paris 2',
        },
        {
          id: 2,
          annee: '2019',
          diplome: 'Diplôme Universitaire en Psychologie',
          specialite: 'Thérapie Cognitive et Comportementale',
          etablissement: 'Université de Lyon',
        },
        {
          id: 3,
          annee: '2020',
          diplome: 'Certification en Hypnothérapie',
          specialite: 'Hypnose Ericksonienne',
          etablissement: 'Institut Français d’Hypnose',
        },
        {
          id: 4,
          annee: '2018',
          diplome: 'Formation en Coaching',
          specialite: 'Coaching de vie et développement personnel',
          etablissement: 'École Supérieure de Coaching Paris',
        },
        {
          id: 5,
          annee: '2022',
          diplome: 'Certification en Sophrologie',
          specialite: 'Gestion du stress et relaxation',
          etablissement: 'Institut de Sophrologie de Paris',
        },
      ];
      setFormations(defaultFormations);
      localStorage.setItem(FORMATION_KEY, JSON.stringify(defaultFormations));
    }
  }, []);

  // Chargement et calcul de l'expérience à partir de la date de début
  useEffect(() => {
    const storedDate = localStorage.getItem('startDate');
    if (storedDate) {
      setStartDate(storedDate);
      updateExperience(storedDate);
    }
  }, []);

  const updateExperience = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const start = new Date(year, month - 1, 1);
    const today = new Date();
    let diff = today.getFullYear() - start.getFullYear();
    if (
      today.getMonth() < start.getMonth() ||
      (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())
    ) {
      diff--;
    }
    setExperience(diff);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (window.confirm("Voulez-vous modifier la date ?")) {
      setStartDate(newDate);
      localStorage.setItem('startDate', newDate);
      updateExperience(newDate);
    }
  };

  // Sauvegarde dans le localStorage
  const saveFormationsToStorage = (updatedFormations) => {
    localStorage.setItem(FORMATION_KEY, JSON.stringify(updatedFormations));
  };

  // Passage en mode édition avec la formation à modifier
  const handleEdit = (id) => {
    const formationToEdit = formations.find((f) => f.id === id);
    setEditingFormation(formationToEdit);
    setIsEditing(true);
  };

  // Suppression d'une formation
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      const updated = formations.filter((f) => f.id !== id);
      setFormations(updated);
      saveFormationsToStorage(updated);
    }
  };

  // Passage en mode ajout (aucune formation sélectionnée)
  const handleAdd = () => {
    setEditingFormation(null);
    setIsEditing(true);
  };

  // Sauvegarde (ajout ou modification) d'une formation depuis le formulaire
  const handleSaveFormation = (formation) => {
    let updated;
    if (formation.id) {
      // Modification d'une formation existante
      updated = formations.map((f) => (f.id === formation.id ? formation : f));
    } else {
      // Ajout d'une nouvelle formation (génération d'un nouvel id)
      const newId = formations.length > 0 ? Math.max(...formations.map((f) => f.id)) + 1 : 1;
      formation.id = newId;
      updated = [...formations, formation];
    }
    setFormations(updated);
    saveFormationsToStorage(updated);
    setIsEditing(false);
    setEditingFormation(null);
  };

  // Retour depuis le formulaire vers l'affichage du tableau
  const handleBack = () => {
    setIsEditing(false);
    setEditingFormation(null);
  };

  return (
    <div className="mb-4 space-y-4">
      {isEditing ? (
        <EditFormation
          onBack={handleBack}
          onSave={handleSaveFormation}
          initialFormation={editingFormation}
        />
      ) : (
        <>
          {/* Section supérieure : Expérience et date de début */}
          <div className="flex items-start justify-between p-4 bg-white border rounded">
            <div className="flex items-start w-1/4">
              <span className="text-xl font-bold text-[#5DA781]">
                {experience} ans <span className="text-xs font-semibold text-gray-700">d'expérience</span>
              </span>
            </div>
            <div className="flex flex-col items-start w-1/2">
              <span className="text-xs font-semibold text-gray-700">Début d'expérience</span>
              <input 
                type="month" 
                value={startDate}
                onChange={handleDateChange}
                className="w-full px-3 py-1 mt-2 text-xs border-2 border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Section Inférieure : Tableau des formations */}
          <div className="p-4 bg-white border rounded">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">Formation</h2>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2">
                  <th className="px-4 py-2">Année</th>
                  <th className="px-4 py-2">Diplôme</th>
                  <th className="px-4 py-2">Spécialité</th>
                  <th className="px-4 py-2">Établissement</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="space-y-4 border-b-2">
                {formations.map((formation) => (
                  <tr key={formation.id} className="space-y-4 hover:bg-gray-50">
                    <td className="px-4 py-2">{formation.annee}</td>
                    <td className="px-4 py-2">{formation.diplome}</td>
                    <td className="px-4 py-2">{formation.specialite}</td>
                    <td className="px-4 py-2">{formation.etablissement}</td>
                    <td className="flex px-4 py-2 space-x-2">
                      <button onClick={() => handleEdit(formation.id)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(formation.id)} className="text-red-500 hover:text-red-700">
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={handleAdd} 
              className="mt-4 inline-flex items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Ajouter plus de formation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Formation;

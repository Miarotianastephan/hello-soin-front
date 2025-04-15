import React, { useState, useEffect } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import EditFormation from './EditFormation';

const Formation = () => {
  const [startDate, setStartDate] = useState('');
  const [experience, setExperience] = useState(0);
  const [formations, setFormations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [expandedFormationIds, setExpandedFormationIds] = useState([]);

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

  // Retour depuis le formulaire vers l'affichage
  const handleBack = () => {
    setIsEditing(false);
    setEditingFormation(null);
  };

  // Gestion de l'ouverture/fermeture de l'accordéon sur mobile
  const toggleExpand = (id) => {
    setExpandedFormationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="mb-4 space-y-4 px-2">
      {isEditing ? (
        <EditFormation
          onBack={handleBack}
          onSave={handleSaveFormation}
          initialFormation={editingFormation}
        />
      ) : (
        <>
          {/* Section supérieure : Expérience et date de début */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded">
            <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
              <span className="text-xl font-bold text-[#5DA781]">
                {experience} ans <span className="text-xs font-semibold text-gray-700">d'expérience</span>
              </span>
            </div>
            <div className="w-full sm:w-1/2">
              <span className="text-xs font-semibold text-gray-700">Début d'expérience</span>
              <input 
                type="month" 
                value={startDate}
                onChange={handleDateChange}
                className="w-full px-3 py-1 mt-2 text-xs border-2 border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Affichage pour grand écran : Tableau classique */}
          <div className="hidden sm:block p-4 bg-white border rounded">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">Formation</h2>
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b-2">
                  <th className="px-4 py-2">Année</th>
                  <th className="px-4 py-2">Diplôme</th>
                  <th className="px-4 py-2">Spécialité</th>
                  <th className="px-4 py-2">Établissement</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="border-b-2">
                {formations.map((formation) => (
                  <tr key={formation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{formation.annee}</td>
                    <td className="px-4 py-2">{formation.diplome}</td>
                    <td className="px-4 py-2">{formation.specialite}</td>
                    <td className="px-4 py-2">{formation.etablissement}</td>
                    <td className="flex items-center space-x-2 px-4 py-2">
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

          {/* Affichage pour mobile : Système dropdown/accordéon */}
          <div className="block sm:hidden">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">Formation</h2>
            {formations.map((formation) => (
              <div key={formation.id} className="border rounded mb-4">
                <div 
                  className="flex justify-between items-center p-2 bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(formation.id)}
                >
                  <div>
                    <div className="font-bold">{formation.annee}</div>
                    <div className="text-xs">{formation.diplome}</div>
                  </div>
                  <div className="text-xl">
                    {expandedFormationIds.includes(formation.id) ? '−' : '+'}
                  </div>
                </div>
                {expandedFormationIds.includes(formation.id) && (
                  <div className="p-2">
                    <div className="mb-1">
                      <span className="font-semibold">Spécialité :</span> {formation.specialite}
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold">Établissement :</span> {formation.etablissement}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button onClick={() => handleEdit(formation.id)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(formation.id)} className="text-red-500 hover:text-red-700">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button 
              onClick={handleAdd} 
              className="mt-4 inline-flex items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white w-full"
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

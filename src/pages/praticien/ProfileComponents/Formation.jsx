import React, { useState, useEffect } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import EditFormation from './EditFormation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchFormations = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_URL}/praticien/getall-formations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Erreur');
  return response.json();
};


const Formation = () => {
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState('');
  const [experience, setExperience] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [expandedFormationIds, setExpandedFormationIds] = useState([]);

  // les formations
  const { data: formations = [], isLoading, isError, error } = useQuery({
    queryKey: ['formations'],
    queryFn: fetchFormations,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // --- Mutations ---
  const addOrEditMutation = useMutation({
    mutationFn: async ({ formData, id }) => {
      const token = localStorage.getItem('authToken');
  
      const url = id
        ? `${API_URL}/praticien/update-formation/${id}`
        : `${API_URL}/praticien/add-formations`;
  
      const response = await axios({
        method: id ? 'put' : 'post',
        url,
        data: formData, // ✅ ici on utilise 'data' au lieu de 'body'
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // ✅ important pour FormData
        },
      });
  
      return response.data;
    },
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      setIsEditing(false);
      setEditingFormation(null);
    },
  
    onError: (error) => {
      console.error('Erreur lors de l’enregistrement de la formation :', error);
      alert("Une erreur est survenue. Veuillez vérifier les champs ou réessayer.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id_formation) => {
      const token = localStorage.getItem('authToken');
  
      const response = await axios.post(`${API_URL}/praticien/delete-formation`, 
        { id_formation },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
    },
  
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    },
  });

  // --- Experience ---
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
    if (today.getMonth() < start.getMonth() || (today.getMonth() === start.getMonth() && today.getDate() < start.getDate())) {
      diff--;
    }
    setExperience(diff);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (window.confirm('Voulez-vous modifier la date ?')) {
      setStartDate(newDate);
      localStorage.setItem('startDate', newDate);
      updateExperience(newDate);
    }
  };

  const handleEdit = (id) => {
    const formationToEdit = formations.data?.find((f) => f.id_formation === id);
    setEditingFormation(formationToEdit);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setEditingFormation(null);
    setIsEditing(true);
  };

  const handleSaveFormation = (formation, id_formation) => {
    addOrEditMutation.mutate({ formData: formation, id: id_formation });
  };

  const handleBack = () => {
    setIsEditing(false);
    setEditingFormation(null);
  };

  const toggleExpand = (id) => {
    setExpandedFormationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (isLoading) return <p>Chargement des formations...</p>;
  if (isError) return <p>Erreur : {error.message}</p>;

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
                {formations.data?.map((formation) => (
                  <tr key={formation.id_formation} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(formation.obtained_at).getFullYear()}</td>
                    <td className="px-4 py-2">{formation.certification_name}</td>
                    <td className="px-4 py-2">
                      {formation.formation_specialities
                        ? formation.formation_specialities.pract_speciality.Speciality.designation
                        : 'Aucune'}
                    </td>
                    <td className="px-4 py-2">{formation.institution_name}</td>
                    <td className="flex items-center space-x-2 px-4 py-2">
                      <button onClick={() => handleEdit(formation.id_formation)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(formation.id_formation)} className="text-red-500 hover:text-red-700">
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
            {formations?.data?.map((formation) => (
          <div key={formation.id_formation} className="border rounded mb-4">
            <div
              className="flex justify-between items-center p-2 bg-gray-50 cursor-pointer"
              onClick={() => toggleExpand(formation.id_formation)}
            >
              <div>
                <div className="font-bold">{new Date(formation.obtained_at).getFullYear()}</div>
                <div className="text-xs">{formation.certification_name}</div>
              </div>
              <div className="text-xl">
                {expandedFormationIds.includes(formation.id_formation) ? '−' : '+'}
              </div>
            </div>
            {expandedFormationIds.includes(formation.id_formation) && (
              <div className="p-2 text-xs">
                <div className="mb-1">
                  <span className="font-semibold text-[#5DA781]">Spécialité :</span>{' '}
                  {formation.formation_specialities.length > 0
                    ? formation.formation_specialities.map((spec) => spec.name).join(', ')
                    : 'Aucune'}
                </div>
                <div className="mb-1">
                  <span className="font-semibold text-[#5DA781]">Établissement :</span> {formation.institution_name}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => handleEdit(formation.id_formation)} className="text-blue-500 hover:text-blue-700">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(formation.id_formation)} className="text-red-500 hover:text-red-700">
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

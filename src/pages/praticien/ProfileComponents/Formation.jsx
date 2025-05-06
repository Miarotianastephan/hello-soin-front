import React, { useState, useEffect } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import EditFormation from './EditFormation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import SpecialityDesignation from './SpecialityDesignation';
import { TailSpin } from 'react-loader-spinner';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';
import { Fragment } from 'react';

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

// Regroupe les formations par année, diplôme et établissement
const groupFormations = (list) => {
  const map = new Map();
  list.forEach(f => {
    const year = new Date(f.obtained_at).getFullYear();
    const key = `${year}|${f.certification_name}|${f.institution_name}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        year,
        diplome: f.certification_name,
        etablissement: f.institution_name,
        entries: []
      });
    }
    map.get(key).entries.push(f);
  });
  return Array.from(map.values());
};


const Dropdown = ({ options, selected, onChange, placeholder }) => (
  <Listbox value={selected} onChange={onChange}>
    <div className="relative bg-white z-50">
      <Listbox.Button className="w-full text-left px-3 py-2 text-xs border rounded-md flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-green-500">
        <span>{selected ? options.find(o => o.value === selected)?.label : placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-auto text-xs">
          {options.map(option => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active }) => `cursor-pointer select-none px-3 py-2 ${active ? 'bg-gray-100' : ''}`}
            >
              {({ selected }) => (
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selected && <Check className="w-4 h-4 text-green-500" />}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);

const Formation = () => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [expandedFormationIds, setExpandedFormationIds] = useState([]);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [newExperienceDate, setNewExperienceDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [experience, setExperience] = useState(0);
  // Récupération de l'expérience
  const fetchExperience = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/praticien/get-experience`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const { data: experienceData } = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
  });

  // Mutation pour mettre à jour l'expérience
  const updateExperienceMutation = useMutation({
    mutationFn: (start_date) => {
      const token = localStorage.getItem('authToken');
      return axios.put(
        `${API_URL}/praticien/update-experience`,
        { start_date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['experience']);
      setIsEditingExperience(false);
    },
  });

  const handleSaveExperience = async () => {
    if (!newExperienceDate) {
      alert('Veuillez sélectionner une date');
      return;
    }

    try {
      await updateExperienceMutation.mutateAsync(newExperienceDate);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };


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
    if (diff < 0){
      diff = 0
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

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/praticien/delete-formation`,
        { id_formation: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['formations']);
    }
  });

  const handleDeleteGroup = (entries) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer toutes ces formations ?')) return;
    entries.forEach(f => deleteMutation.mutate(f.id_formation));
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

  const months = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1985 + 1 }, (_, index) => currentYear - index);
    // ------- Desktop table grouping -------
    const grouped = groupFormations(formations.data || []);

  if (isLoading) return<div className="p-4 text-center w-full flex items-center justify-center h-full"><TailSpin
      height="40"
      width="40"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
    /></div>;
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
        <div className="p-4 bg-white border rounded">
          <h2 className="mb-4 text-sm font-semibold text-gray-800">Expérience</h2>
          {isEditing ? (
        <EditFormation
          onBack={handleBack}
          onSave={handleSaveFormation}
          initialFormation={editingFormation}
        />
      ) : (
        <>
          
            {isEditingExperience ? (
             <div className="sm:flex-row md:flex-row flex-col space-y-3 items-center gap-2">
             <div className="flex gap-2">
               <div className="w-32">
                 <Dropdown
                   options={months}
                   selected={newExperienceDate?.split('-')[1] || ''}
                   onChange={(month) => {
                     const year = newExperienceDate?.split('-')[0] || currentYear;
                     setNewExperienceDate(`${year}-${month}`);
                   }}
                   placeholder="Mois"
                 />
               </div>
<div className="w-32">
  <Dropdown 
    options={years.map(y => ({ 
      value: y.toString(), // Conversion en string ici
      label: y.toString() 
    }))}
    selected={newExperienceDate?.split('-')[0] || ''}
    onChange={(year) => {
      const month = newExperienceDate?.split('-')[1] || '01';
      setNewExperienceDate(`${year}-${month}`);
    }}
    placeholder="Année"
  />
</div>
             </div>
             <button
               onClick={handleSaveExperience}
               className="px-2 py-1 text-white mr-2 bg-green-900 hover:bg-green-600 text-xs rounded"
             >
               Enregistrer
             </button>
             <button
               onClick={() => setIsEditingExperience(false)}
               className="px-2 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs rounded"
             >
               Annuler
             </button>
           </div>
            ) : (
              <div className="flex items-center gap-4 w-full justify-start">
                <span className="text-2xl font-bold text-[#5DA781]">
                  {experienceData?.data?.experiences_years} ans
                  <span className="text-xs font-semibold text-gray-700"> d'expériences</span>
                </span>
                <button
                  onClick={() => {
                    setNewExperienceDate(experienceData?.data?.start_date || '');
                    setIsEditingExperience(true);
                  }}
                  className="text-white rounded bg-[#0f2b3d] px-2 py-1   hover:text-[#14384f] flex items-center justify-center gap-2 text-xs"
                >
                  <Edit size={13} /> Mettre à jour
                </button>
              </div>
            )}
        </>
      )}
        </div>

          {/* Affichage pour grand écran : Tableau classique */}
           {/* Table Desktop */}
           <div className="hidden sm:block p-4 bg-white border rounded">
              <h2 className="mb-4 text-sm font-semibold text-gray-800 text-left">Formation</h2>
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left border-2">
                    <th className="px-4 py-2">Année</th>
                    <th className="px-4 py-2">Diplôme</th>
                    <th className="px-4 py-2">Spécialité</th>
                    <th className="px-4 py-2">Établissement</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map(group => (
                    group.entries.map((f, idx) => (
                      <tr key={f.id_formation} className="border-b border-l border-r">
                        {idx === 0 && (
                          <td rowSpan={group.entries.length} className="px-4 py-2 align-top text-left">{group.year}</td>
                        )}
                        {idx === 0 && (
                          <td rowSpan={group.entries.length} className="px-4 py-2 align-top text-left">{group.diplome}</td>
                        )}
                        <td className="px-4 py-2 text-left border-l border-r">
                          <SpecialityDesignation id={f.formation_specialities.id_pract_speciality} />
                        </td>
                        {idx === 0 && (
                          <td rowSpan={group.entries.length} className="px-4 py-2 align-top text-left">{group.etablissement}</td>
                        )}
                        {idx === 0 && (
                          <td rowSpan={group.entries.length} className="px-4 py-2 align-top text-left">
                            <button
                              onClick={() => handleDeleteGroup(group.entries)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm px-4 py-2 hover:bg-[#14384f] hover:text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2 inline-block" />Ajouter une formation
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
                <div className="mb-1 ">
                  <span className="font-semibold text-[#5DA781] ">Spécialité :</span>{' '}
                  <SpecialityDesignation className="border" id={formation.formation_specialities?.id_pract_speciality} />
                </div>
                <div className="mb-1">
                  <span className="font-semibold text-[#5DA781]">Établissement :</span> {formation.institution_name}
                </div>
                <div className="flex space-x-2 mt-2">
                  
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
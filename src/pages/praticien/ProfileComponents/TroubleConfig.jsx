// TroubleConfig.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, PlusCircle, Save, XCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTroubleSolutions, 
  saveTroubleApproche,
  updateTroubleApproche
} from '@/services/trouble-solutions-services';
import { TailSpin } from 'react-loader-spinner';
import { addToast } from "@heroui/react";

const TroubleConfig = (props) => {
  const queryClient = useQueryClient();
  const [troubles, setTroubles] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [newSolutionSpecialty, setNewSolutionSpecialty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(
        props.isUpdate && props.initialTrouble
       ? props.initialTrouble.name
       : ''
   );
   const [selectedTrouble, setSelectedTrouble] = useState(
     props.isUpdate && props.initialTrouble
       ? {
           ...props.initialTrouble,
           solutions: props.initialTrouble.solutions || []
         }
       : null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addSolutionChecked, setAddSolutionChecked] = useState(false);
  const [newSolution, setNewSolution] = useState('');
  const dropdownRef = useRef(null);
  const [isUpdate, setIsUpdate] = useState(props.isUpdate || false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['trouble-solutions'],
    queryFn: fetchTroubleSolutions,
  });


  useEffect(() => {
    if (!data) return;
  
    // initialisation habituelle des specialties & troubles  
    const mappedSpecialties = data.speciality.map(s => ({ id: s.id_speciality, name: s.designation }));
    setSpecialties(mappedSpecialties);
    setTroubles(data.troubleSolutions);
    if (mappedSpecialties.length) setNewSolutionSpecialty(mappedSpecialties[0].id);
  
   // ⬅️ on ne touche pas cette partie, elle vient écraser si besoin à partir des données serveur
   if (isUpdate && props.initialTrouble) {
       const found = data.troubleSolutions.find(tr => tr.id === props.initialTrouble.id);
       if (found) {
          setSelectedTrouble(found);
          setSearchTerm(found.name);
        }
      }
  }, [data, isUpdate, props.initialTrouble]);
  

  // Remplacer navigate par la fonction onBack passée en props
  const handleBack = () => {
    setIsUpdate(false)
    props.onBack();
  };

  // Filtrer les troubles (insensible à la casse)
  const filteredTroubles = troubles.filter(trouble =>
    trouble.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteSolution = (solutionToDelete) => {
    if (!selectedTrouble) return;
    const updatedSolutions = selectedTrouble.solutions.filter(sol => sol.name !== solutionToDelete.name);
    const updatedTroubles = troubles.map(trouble => {
      if (trouble.id === selectedTrouble.id) {
        return { ...trouble, solutions: updatedSolutions };
      }
      return trouble;
    });
    setTroubles(updatedTroubles);
    setSelectedTrouble({ ...selectedTrouble, solutions: updatedSolutions });
  };

  const handleAddSolution = () => {
    if (!selectedTrouble || newSolution.trim() === '') return;
    const newSol = { name: newSolution.trim(), specialty: newSolutionSpecialty };
    const updatedSolutions = [...selectedTrouble.solutions, newSol];
    const updatedTroubles = troubles.map(trouble => {
      if (trouble.id === selectedTrouble.id) {
        return { ...trouble, solutions: updatedSolutions };
      }
      return trouble;
    });
    setTroubles(updatedTroubles);
    setSelectedTrouble({ ...selectedTrouble, solutions: updatedSolutions });
    setNewSolution('');
    setNewSolutionSpecialty(specialties[0].id);
  };

  const useSaveTroubleApproche = () => {
    return useMutation({
      mutationFn: saveTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches ajoutées avec succès :", data);
        queryClient.invalidateQueries(['praticien-approches']);
        addToast({
          title: 'Ajout réussie de l’approche.',
          color: 'success',
          duration: 3000
        });
        props.onBack();
      },
      onError: (error) => {
        console.error("Erreur pendant l'ajout :", error);
        addToast({
          title: `Erreur lors d'insertion: ${error.response.data.error}`,
          color: 'danger',
          duration: 5000
        });
      },
    });
  };
  const { mutate: saveApproche, isSaveLoading, isSaveSuccess, isSaveError, saveError } = useSaveTroubleApproche();
  const handleSubmitPraticienApproches = () => {
    console.log(selectedTrouble);
    saveApproche(selectedTrouble);
  }

  const useUpdateTroubleApproche = () => {
    return useMutation({
      mutationFn: updateTroubleApproche,
      onSuccess: (data) => {
        console.log("Approches ajoutées avec succès :", data);
        queryClient.invalidateQueries(['praticien-approches']);
        addToast({
          title: 'Mise a jour réussie de l’approche.',
          color: 'success',
          duration: 3000
        });
        props.onBack();
      },
      onError: (error) => {
        console.error("Erreur pendant la mise a jour :", error);
        addToast({
          title: error.message,
          color: 'danger',
          duration: 5000
        });
      },
    });
  };
  const { mutate: updateApproche, isUpdateLoading, isUpdateSuccess, isUpdateError, UpdateError } = useUpdateTroubleApproche();
  const handleUpdatePraticienApproches = () => {
    updateApproche(selectedTrouble);
  }

  const getSpecialtyName = (id) => {
    const spec = specialties.find(s => s.id === id);
    return spec ? spec.name : '';
  };
  
  if (isLoading) return<div className="p-4 text-center w-full flex items-center justify-center h-full"><TailSpin
      height="40"
      width="40"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      visible={true}
  /></div>;
  if (isError) return <div>Erreur : {error.message}</div>;

  return (
    <div className='mx-4 mb-9'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-semibold'> 
        <span className="text-[#5DA781] text-sm">
  {isUpdate ? (
    <>
      Mettre à jour vos approches{' '}
      <span className='text-gray-700 font-normal text-xs'></span>
    </>
  ) : (
    'Ajouter vos approches'
  )}
</span>

        </span>
        <Button 
          onClick={handleBack} 
          className="text-xs font-semibold text-gray-700 bg-gray-200 rounded shadow-none hover:bg-gray-400 hover:text-gray-700"
        >
          <ArrowLeftCircle /> Retour
        </Button>
      </div>
      
      <div className='flex flex-col md:flex-row items-start justify-between w-full gap-4 mt-4 text-xs'>
        {/* Colonne Troubles */}
        <div className='w-full md:w-1/2 px-4 '>
          <div className='w-full py-2 text-gray-700 border-b-2 border-gray-700'>
            <span>Selectionner un trouble</span>
          </div>
          <div className="relative mt-2" ref={dropdownRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Rechercher un trouble..."
              className="w-full p-2 border border-gray-300 rounded"
            />
            {isDropdownOpen && filteredTroubles.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 max-h-60">
                {filteredTroubles.map(trouble => (
                  <li
                    key={trouble.id}
                    onClick={() => {
                      setSelectedTrouble(trouble);
                      setSearchTerm(trouble.name);
                      setIsDropdownOpen(false);
                      setAddSolutionChecked(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {trouble.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colonne Solutions */}
        <div className='w-full md:w-1/2 px-4 '>
          <div className='w-full py-2 text-gray-700 border-b-2 border-gray-700'>
            <span>Présentez vos solutions</span>
          </div>
          <div className='mt-2'>
            {selectedTrouble ? (
              <>
                <div className="mt-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      checked={addSolutionChecked} 
                      onChange={(e) => setAddSolutionChecked(e.target.checked)}
                      className="form-checkbox"
                    />
                    <span className="ml-2 text-sm">Ajouter une nouvelle solution</span>
                  </label>
                  {addSolutionChecked && (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="text"
                        value={newSolution}
                        onChange={(e) => setNewSolution(e.target.value)}
                        placeholder="Nouvelle solution"
                        className="p-2 border border-gray-300 rounded"
                      />
                      <select
                        value={newSolutionSpecialty}
                        onChange={(e) => setNewSolutionSpecialty(parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded"
                      >
                        {specialties.map(spec => (
                          <option key={spec.id} value={spec.id}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                      <Button 
                        onClick={handleAddSolution} 
                        className="text-xs font-semibold text-white bg-[#20273e] w-1/2 self-end rounded shadow-none hover:bg-blue-600"
                      >
                        <PlusCircle size={15}/> Ajouter
                      </Button>
                    </div>
                  )}
                </div>
                <ul className='list-disc list-inside'>
                  {selectedTrouble.solutions.map((solution, index) => (
                    <li key={index} className="flex text-white font-bold items-center justify-between p-4 my-1 border rounded bg-[#5DA781]">
                      <span>
                        {solution.name}
                        <span className="ml-2 text-xs font-normal">
                          ({getSpecialtyName(solution.specialty)})
                        </span>
                      </span>
                      <button 
                        onClick={() => handleDeleteSolution(solution)}
                        className="ml-2"
                      >
                        <XCircle size={15} color='white'/>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              isUpdate ? (
                <p className='text-helloSoin'>
                  Vous êtes en modes edition  ...
                </p>
              ) : (
                <p className='text-gray-500'>
                  Veuillez sélectionner un trouble pour voir et modifier ses solutions.
                </p>
              )

            )}
          </div>
        </div>
      </div>
      <Button 
        onClick={ isUpdate ?  handleUpdatePraticienApproches : handleSubmitPraticienApproches}
        className="mt-6 ml-4 text-xs font-bold text-white rounded shadow-none"
      >
        <Save size={15}/> {isUpdate ? "Modifier" : "Enregistrer"}
      </Button>
    </div>
  );
};

export default TroubleConfig;

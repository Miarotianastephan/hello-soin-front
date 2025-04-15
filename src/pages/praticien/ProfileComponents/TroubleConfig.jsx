// TroubleConfig.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { ArrowLeftCircle, PlusCircle, Save, XCircle } from "lucide-react";

// JSON des spécialités
const specialties = [
  { id: 1, name: "Cardiologie" },
  { id: 2, name: "Dermatologie" },
  { id: 3, name: "Neurologie" }
];

// Données initiales avec solutions
const initialTroubles = [
  { 
    id: 1, 
    name: "Trouble A", 
    solutions: [
      { text: "Solution A1", specialty: 1 },
      { text: "Solution A2", specialty: 2 }
    ] 
  },
  { 
    id: 2, 
    name: "Trouble B", 
    solutions: [
      { text: "Solution B1", specialty: 2 },
      { text: "Solution B2", specialty: 3 }
    ] 
  },
  { 
    id: 3, 
    name: "Trouble C", 
    solutions: [
      { text: "Solution C1", specialty: 1 },
      { text: "Solution C2", specialty: 3 }
    ] 
  },
];

const TroubleConfig = (props) => {
  const [troubles, setTroubles] = useState(initialTroubles);
  const [searchTerm, setSearchTerm] = useState('');
  // Si un trouble est passé en prop pour édition, on l'utilise dès le départ
  const [selectedTrouble, setSelectedTrouble] = useState(props.initialTrouble || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addSolutionChecked, setAddSolutionChecked] = useState(false);
  const [newSolution, setNewSolution] = useState('');
  const [newSolutionSpecialty, setNewSolutionSpecialty] = useState(specialties[0].id);
  const dropdownRef = useRef(null);

  // Remplacer navigate par la fonction onBack passée en props
  const handleBack = () => {
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
    const updatedSolutions = selectedTrouble.solutions.filter(sol => sol.text !== solutionToDelete.text);
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
    const newSol = { text: newSolution.trim(), specialty: newSolutionSpecialty };
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

  const getSpecialtyName = (id) => {
    const spec = specialties.find(s => s.id === id);
    return spec ? spec.name : '';
  };

  return (
    <div className='mx-4 mb-9'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-semibold'>Troubles et solutions</span>
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
            <span>Troubles</span>
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
            <span>Solutions</span>
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
                        className="text-xs font-semibold text-white bg-[#5DA781] rounded shadow-none hover:bg-blue-600"
                      >
                        <PlusCircle size={15}/>
                      </Button>
                    </div>
                  )}
                </div>
                <ul className='list-disc list-inside'>
                  {selectedTrouble.solutions.map((solution, index) => (
                    <li key={index} className="flex text-white font-bold items-center justify-between p-4 my-1 border rounded bg-[#5DA781]">
                      <span>
                        {solution.text} 
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
              <p className='text-gray-500'>
                Veuillez sélectionner un trouble pour voir et modifier ses solutions.
              </p>
            )}
          </div>
        </div>
      </div>
      <Button className="mt-6 ml-4 text-xs font-bold text-white rounded shadow-none">
        <Save size={15}/> Enregistrer
      </Button> 
    </div>
  );
};

export default TroubleConfig;

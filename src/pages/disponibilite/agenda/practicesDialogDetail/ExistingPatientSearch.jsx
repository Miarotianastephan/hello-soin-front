import React from 'react';
import { Search } from 'lucide-react';

const ExistingPatientSearch = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  setPracticeDialog,
  practiceDialog,
}) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-col items-start w-full">
        <div className="w-2/3 rounded-lg flex items-center h-[30px] text-xs border p-2">
          <Search size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none p-1 rounded ml-2 w-full outline-none"
            placeholder="Filtre par : Nom, Prénom, email ou N° de téléphone"
          />
        </div>
        {searchTerm && (
          <div className="absolute z-10 w-full max-h-40 overflow-y-auto border p-2 bg-white shadow-lg mt-8">
            {suggestions.length === 0 ? (
              <span>Aucun patient trouvé.</span>
            ) : (
              suggestions.map((patient) => (
                <div
                  key={patient.id}
                  className={`cursor-pointer p-1 ${
                    practiceDialog.selectedPatientId === patient.id ? 'bg-blue-100' : ''
                  } border-b flex items-center hover:bg-gray-200`}
                  onClick={() => {
                    setPracticeDialog((prev) => ({
                      ...prev,
                      selectedPatientId: patient.id,
                      error: '',
                    }));
                    setSearchTerm('');
                  }}
                >
                  <span className="font-bold text-left flex-1 text-xs text-gray-700 truncate">
                    {patient.prenom}
                  </span>
                  <div className="text-left flex-1 text-xs text-gray-700 truncate">
                    {patient.numero}
                  </div>
                  <div className="text-left flex-1 text-xs text-gray-700 truncate">
                    {patient.email || patient.adresse}
                  </div>
                  <div className="text-right flex-1 text-xs text-gray-700">
                    {patient.age} ans
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExistingPatientSearch;

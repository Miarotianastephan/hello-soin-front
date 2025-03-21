import React from 'react';

const ExistingPatientDisplay = ({ selectedPatient, practiceDialog, setPracticeDialog }) => {
  return (
    <div className="space-y-2 mt-4">
      {/* Ligne 1 : Nom et Prénom */}
      <div className="flex gap-4">
        <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700">
              <i className="fas fa-venus-mars mr-1"></i>Civilité 
            </label>
            <input
              type="text"
              value={selectedPatient?.genre || ''}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
            />
          </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-user mr-1"></i>Nom
          </label>
          <input
            type="text"
            value={selectedPatient?.nom || ''}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
          />
        </div>
       
      </div>

      {/* Ligne 2 : Genre et Date de naissance */}
      <div className="flex gap-4">
      <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-user mr-1"></i>Prénom
          </label>
          <input
            type="text"
            value={selectedPatient?.prenom || ''}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-birthday-cake mr-1"></i>Date de naissance
          </label>
          <input
            type="date"
            value={selectedPatient?.dateNaissance || ''}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
          />
        </div>
      </div>

      {/* Ligne 3 : Téléphone et Mobile */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-phone mr-1"></i>Téléphone
          </label>
          <input
            type="text"
            value={selectedPatient?.numero || ''}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-mobile-alt mr-1"></i>Mobile
          </label>
          <input
            type="text"
            value={selectedPatient?.mobile || ''}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
          />
        </div>
      </div>

      {/* Ligne 4 : Email */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          <i className="fas fa-envelope mr-1"></i>Email
        </label>
        <input
          type="email"
          value={selectedPatient?.email || ''}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[35px] text-xs"
        />
      </div>


      {/* Ligne 6 : Motif (champ éditable) */}
      <div>
        <label className="block text-xs font-medium text-gray-700">
          <i className="fas fa-info-circle mr-1"></i>Motif (obligatoire)
        </label>
        <textarea
          type="text"
          value={practiceDialog.newPractice.motif || ''}
          onChange={(e) =>
            setPracticeDialog((prev) => ({
              ...prev,
              newPractice: {
                ...prev.newPractice,
                motif: e.target.value,
              },
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[40px] text-xs"
          required
        />
      </div>
    </div>
  );
};

export default ExistingPatientDisplay;

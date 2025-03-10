import React from 'react';

const NewPatientForm = ({ practiceDialog, setPracticeDialog }) => {
  return (
    <div className="space-y-4">
      {/* Ligne 1 : Nom et Prénom */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-user mr-1"></i>Nom
          </label>
          <input
            type="text"
            value={practiceDialog.newPractice.newPatient?.nom || ''}
            onChange={(e) =>
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    nom: e.target.value,
                  },
                },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            placeholder="Nom"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-user mr-1"></i>Prénom
          </label>
          <input
            type="text"
            value={practiceDialog.newPractice.newPatient?.prenom || ''}
            onChange={(e) =>
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    prenom: e.target.value,
                  },
                },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            placeholder="Prénom"
            required
          />
        </div>
      </div>

      {/* Ligne 2 : Genre et Date de naissance */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-venus-mars mr-1"></i>Genre
          </label>
          <select
            value={practiceDialog.newPractice.newPatient?.genre || ''}
            onChange={(e) =>
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    genre: e.target.value,
                  },
                },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            required
          >
            <option value="">Sélectionner</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-birthday-cake mr-1"></i>Date de naissance
          </label>
          <input
            type="date"
            value={practiceDialog.newPractice.newPatient?.dateNaissance || ''}
            onChange={(e) =>
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    dateNaissance: e.target.value,
                  },
                },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            required
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
            value={practiceDialog.newPractice.newPatient?.numero || ''}
            onChange={(e) => {
              const formatted =
                e.target.value
                  .replace(/\D/g, '')
                  .substring(0, 10)
                  .match(/.{1,2}/g)?.join(' ') || '';
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    numero: formatted,
                  },
                },
              }));
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            placeholder="Téléphone"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700">
            <i className="fas fa-mobile-alt mr-1"></i>Mobile
          </label>
          <input
            type="text"
            value={practiceDialog.newPractice.newPatient?.mobile || ''}
            onChange={(e) => {
              const formatted =
                e.target.value
                  .replace(/\D/g, '')
                  .substring(0, 10)
                  .match(/.{1,2}/g)?.join(' ') || '';
              setPracticeDialog((prev) => ({
                ...prev,
                newPractice: {
                  ...prev.newPractice,
                  newPatient: {
                    ...prev.newPractice.newPatient,
                    mobile: formatted,
                  },
                },
              }));
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
            placeholder="Mobile"
            required
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
          value={practiceDialog.newPractice.newPatient?.email || ''}
          onChange={(e) =>
            setPracticeDialog((prev) => ({
              ...prev,
              newPractice: {
                ...prev.newPractice,
                newPatient: {
                  ...prev.newPractice.newPatient,
                  email: e.target.value,
                },
              },
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[30px] text-xs"
          placeholder="Email"
          required
        />
      </div>

      {/* Ligne 5 : Motif */}
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-none p-2 h-[60px] text-xs"
          placeholder="Remplir motif"
          required
        />
      </div>
    </div>
  );
};

export default NewPatientForm;

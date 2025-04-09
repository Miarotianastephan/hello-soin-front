import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeftCircle, Save } from 'lucide-react';

const EditFormation = ({ onBack, onSave, initialFormation }) => {
  // Les valeurs initiales proviennent de la formation à éditer (si elle existe) sinon elles sont vides
  const [annee, setAnnee] = useState('');
  const [diplome, setDiplome] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [etablissement, setEtablissement] = useState('');

  useEffect(() => {
    if (initialFormation) {
      setAnnee(initialFormation.annee);
      setDiplome(initialFormation.diplome);
      setSpecialite(initialFormation.specialite);
      setEtablissement(initialFormation.etablissement);
    } else {
      // Réinitialisation pour une nouvelle formation
      setAnnee('');
      setDiplome('');
      setSpecialite('');
      setEtablissement('');
    }
  }, [initialFormation]);

  // Sauvegarde : création ou modification d'une formation
  const handleSave = () => {
    // Vérification simple : vous pouvez ajouter d'autres validations ici
    if (!annee || !diplome || !specialite || !etablissement) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const formation = {
      id: initialFormation ? initialFormation.id : null,
      annee,
      diplome,
      specialite,
      etablissement,
    };
    onSave(formation);
  };

  return (
    <div className="mb-4 mx-28">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold"></span>
        <Button
          onClick={onBack}
          className="text-xs font-semibold text-gray-700 bg-gray-200 rounded shadow-none hover:bg-gray-400 hover:text-gray-700"
        >
          <ArrowLeftCircle /> Retour
        </Button>
      </div>
      <div className="flex items-center justify-start pb-4 mt-4 border-b-2">
        <span className="text-sm font-semibold">Formation</span>
      </div>
      <div className="flex flex-col items-start justify-center pb-4 mt-4 border-b-2">
        <div className="w-1/2 mt-2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Année *
          </label>
          <input
            type="text"
            placeholder="ex: 2021"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
          />
        </div>
        <div className="w-1/2 mt-2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Diplôme *
          </label>
          <input
            type="text"
            placeholder="ex: Master en Gestion"
            value={diplome}
            onChange={(e) => setDiplome(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
          />
        </div>
        <div className="w-1/2 mt-2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Spécialité *
          </label>
          <input
            type="text"
            placeholder="ex: Formation praticien en EFT"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
          />
        </div>
        <div className="w-1/2 mt-2">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Établissement *
          </label>
          <input
            type="text"
            placeholder="ex: Université Paris 2"
            value={etablissement}
            onChange={(e) => setEtablissement(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
          />
        </div>
        <div className="mt-3 mb-2">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Télecharger une ou plusieurs pièce justificatives
            </label>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-[#5DA781] border-dashed rounded-md cursor-pointer w-full">
              <svg
                className="w-5 h-5 mb-2 text-[#5DA781]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5V7.125A2.625 2.625 0 015.625 4.5h12.75A2.625 2.625 0 0121 7.125V16.5M3 16.5l3.75-3.75M21 16.5l-3.75-3.75M8.25 8.25h7.5M12 8.25v7.5"
                />
              </svg>
              <p className="text-xs text-[#5DA781]">Cliquer pour ajouter ou glisser-déposer</p>
              <p className="mt-1 text-xs text-[#5DA781]">
                SVG, PNG, JPG ou GIF (max. 400 x 400px)
              </p>
            </div>
          </div>
      </div>
      <div className="flex items-center justify-end w-full mt-4 space-x-2">
        <Button onClick={onBack} className="text-xs bg-red-700 rounded shadow-none">
          Annuler
        </Button>
        <Button onClick={handleSave} className="text-xs rounded shadow-none">
          <Save size={15} />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default EditFormation;

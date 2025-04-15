// TableList.jsx
import React, { useState } from 'react';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Exemple de données imbriquées
const data = [
  {
    id: 1,
    categorie: "Catégorie 1",
    troubles: [
      {
        id: 1,
        name: "Trouble 1",
        duree: "2h",
        tarif: "50€",
        solutions: [
          { id: 1, name: "Solution 1", specialite: "Spécialité B" },
          { id: 2, name: "Solution 2", specialite: "Spécialité A" },
          { id: 3, name: "Solution 3", specialite: "Spécialité B" },
        ],
      },
      {
        id: 2,
        name: "Trouble 2",
        duree: "1h30",
        tarif: "40€",
        solutions: [
          { id: 3, name: "Solution 3", specialite: "Spécialité B" },
          { id: 4, name: "Solution 4", specialite: "Spécialité A" },
          { id: 1, name: "Solution 1", specialite: "Spécialité B" },
        ],
      },
      {
        id: 3,
        name: "Trouble 3",
        duree: "3h",
        tarif: "75€",
        solutions: [
          { id: 5, name: "Solution 5", specialite: "Spécialité C" },
          { id: 6, name: "Solution 6", specialite: "Spécialité C" },
          { id: 2, name: "Solution 2", specialite: "Spécialité C" },
        ],
      },
    ],
  },
];

// Fonction pour regrouper les solutions par spécialité
const groupSolutionsBySpecialite = (solutions) => {
  const groupsObj = solutions.reduce((acc, solution) => {
    if (!acc[solution.specialite]) {
      acc[solution.specialite] = [];
    }
    acc[solution.specialite].push(solution);
    return acc;
  }, {});
  
  const order = [];
  solutions.forEach((solution) => {
    if (!order.includes(solution.specialite)) {
      order.push(solution.specialite);
    }
  });
  
  return order.map(specialite => ({
    specialite,
    solutions: groupsObj[specialite]
  }));
};

const TableList = (props) => {
  // État pour gérer l'accordéon sur mobile
  const [expandedTroubleIds, setExpandedTroubleIds] = useState([]);

  const toggleTroubleExpansion = (id) => {
    setExpandedTroubleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Construction des lignes pour le tableau (affichage grand écran)
  const rows = [];
  data.forEach((category) => {
    // Calcul du nombre total de lignes pour la catégorie (pour gérer rowSpan)
    const totalRowsCategory = category.troubles.reduce(
      (acc, trouble) => acc + trouble.solutions.length,
      0
    );
    let categoryRendered = false;

    category.troubles.forEach((trouble) => {
      const specialiteGroups = groupSolutionsBySpecialite(trouble.solutions);
      const totalRowsTrouble = trouble.solutions.length;
      let troubleRendered = false;

      specialiteGroups.forEach((group) => {
        let groupRendered = false;
        group.solutions.forEach((solution, solIndex) => {
          rows.push(
            <tr
              key={`cat-${category.id}-trouble-${trouble.id}-specialite-${group.specialite}-sol-${solution.id}`}
              className="divide-y divide-gray-200"
            >
              {/* Colonne Catégorie */}
              {!categoryRendered && (
                <td rowSpan={totalRowsCategory} className="px-4 py-2 align-top border whitespace-nowrap">
                  {category.categorie}
                </td>
              )}
              {/* Colonne Trouble */}
              {!troubleRendered && (
                <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                  {trouble.name}
                </td>
              )}
              {/* Colonne Solution */}
              <td className="px-4 py-2 border whitespace-nowrap">
                {solution.name}
              </td>
              {/* Colonne Spécialité */}
              {!groupRendered && (
                <td rowSpan={group.solutions.length} className="px-4 py-2 align-top border whitespace-nowrap">
                  {group.specialite}
                </td>
              )}
              {/* Colonnes Durée, Tarif et Action (affichées une seule fois par Trouble) */}
              {!troubleRendered && solIndex === 0 && (
                <>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    {trouble.duree}
                  </td>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    {trouble.tarif}
                  </td>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    <button 
                      onClick={() => props.onEditTrouble(trouble)}
                      className="mr-2 text-blue-600 hover:text-blue-900" 
                      title="Modifier"
                    >
                      <Edit className="inline-block w-5 h-5" size={15} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Supprimer">
                      <Trash className="inline-block w-5 h-5" size={15} />
                    </button>
                  </td>
                </>
              )}
            </tr>
          );
          categoryRendered = true;
          troubleRendered = true;
          groupRendered = true;
        });
      });
    });
  });

  return (
    <>
      {/* Vue tableau pour grand écran */}
      <div className="hidden sm:block mb-4 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Catégorie</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Trouble</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Solution</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Spécialité</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Durée</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Tarif</th>
              <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {rows}
          </tbody>
        </table>
        <div className="flex items-center justify-start w-full mt-4">
          <Button 
            onClick={props.onAddTrouble} 
            className="inline-flex bg-white items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
          >
            <PlusCircle size={15} /> Ajouter une spécialité
          </Button>
        </div>
      </div>

      {/* Vue accordéon pour mobile */}
      <div className="block sm:hidden">
        {data.map((category) => (
          <div key={category.id} className="mb-4 border rounded">
            <div className="bg-gray-100 px-4 py-2 font-bold">
              {category.categorie}
            </div>
            {category.troubles.map((trouble) => (
              <div key={trouble.id} className="border-t">
                <div 
                  className="flex justify-between items-center px-4 py-2 cursor-pointer" 
                  onClick={() => toggleTroubleExpansion(trouble.id)}
                >
                  <div>
                    <div className="font-semibold">{trouble.name}</div>
                    <div className="text-xs text-gray-600">
                      Durée : {trouble.duree} — Tarif : {trouble.tarif}
                    </div>
                  </div>
                  <div className="text-xl">
                    {expandedTroubleIds.includes(trouble.id) ? '−' : '+'}
                  </div>
                </div>
                {expandedTroubleIds.includes(trouble.id) && (
                  <div className="px-4 py-2">
                    {groupSolutionsBySpecialite(trouble.solutions).map((group) => (
                      <div key={group.specialite} className="mb-2">
                        <div className="text-sm font-bold">{group.specialite}</div>
                        <ul>
                          {group.solutions.map((solution) => (
                            <li key={solution.id} className="text-sm pl-4">
                              {solution.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex space-x-2 mt-2">
                      <button 
                        onClick={() => props.onEditTrouble(trouble)} 
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="inline-block w-5 h-5" size={15} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Supprimer">
                        <Trash className="inline-block w-5 h-5" size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center justify-start w-full mt-4">
          <Button 
            onClick={props.onAddTrouble} 
            className="inline-flex bg-white items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
          >
            <PlusCircle size={15} /> Ajouter une spécialité
          </Button>
        </div>
      </div>
    </>
  );
};

export default TableList;

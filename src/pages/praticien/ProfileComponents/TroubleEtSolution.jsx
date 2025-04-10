// TableList.jsx
import React from 'react';
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
  const rows = [];

  // Remplacer la navigation par l'appel de la fonction onAddTrouble
  const handleAddTrouble = () => {
    props.onAddTrouble();
  };

  data.forEach((category) => {
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
              {/* Colonnes Durée, Tarif et Action */}
              {!troubleRendered && solIndex === 0 && (
                <>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    {trouble.duree}
                  </td>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    {trouble.tarif}
                  </td>
                  <td rowSpan={totalRowsTrouble} className="px-4 py-2 align-top border whitespace-nowrap">
                    {/* Bouton Modifier avec callback onEditTrouble */}
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
    <div className="mb-4 overflow-x-auto">
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
        <tbody className='text-xs'>{rows}</tbody>
      </table>
      <div className='flex items-center justify-start w-full mt-4 text-white'>
        <Button 
          onClick={handleAddTrouble} 
          className="mt-4 inline-flex bg-white items-center px-4 py-2 text-xs font-bold text-[#0f2b3d] border-2 border-[#0f2b3d] rounded-sm hover:bg-[#14384f] hover:text-white"
        >
          <PlusCircle size={15} /> Ajouter une spécialité
        </Button>
      </div>
    </div>
  );
};

export default TableList;

import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const SpecialityDesignation = ({ id }) => {
  // Toujours travailler sur un tableau d'ids
  const ids = Array.isArray(id) ? id : [id];

  // Lancer une requête par id
  const results = useQueries({
    queries: ids.map(specId => ({
      queryKey: ['specialityDesignation', specId],
      queryFn: async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `${API_URL}/specs/specialities/${specId}/designation`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      enabled: !!specId,
    })),
  });

  // Tant que l'une des requêtes charge
  if (results.some(r => r.isLoading)) return <span>…</span>;
  // S’il y a au moins une erreur
  if (results.some(r => r.isError)) return <span>Erreur</span>;

  // Extraire toutes les désignations (ou 'Aucune')
  const designations = results.map(r => r.data?.data?.designation || 'Aucune');

  // Les afficher séparées par des virgules
  return <span>{designations.join(', ')}</span>;
};

export default SpecialityDesignation;

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const SpecialityDesignation = ({ id }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['specialityDesignation', id],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_URL}/specs/specialities/${id}/designation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!id, // Ne lance la requête que si l'ID existe
  });

  if (isLoading) return <span>...</span>;
  if (isError) return <span>Erreur</span>;

  return <span>{data?.data?.designation || 'Aucune'}</span>;
};

export default SpecialityDesignation;
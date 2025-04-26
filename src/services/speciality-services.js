// services/speciality-services.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

// speciality-services.js
export const findAllSpeciality = async () => {
    const res = await axios.get(`${API_URL}/specs/specialities`);
    return res.data.data; // Déjà correct si l'API retourne { data: [...] }
  };
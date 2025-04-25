// src/services/profile-service.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

// src/services/profile-service.js
export const getPraticienInfo = async () => {
    const token = localStorage.getItem('token');
  
    // Si le token est manquant, lancez une erreur
    if (!token) {
      throw new Error("Token non trouvé. Connectez-vous.");
    }
  
    const response = await axios.get(
      `${API_URL}/praticien/get-info-praticien`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Format correct : "Bearer <token>"
        },
      }
    );
  
    return response.data.data;
  };
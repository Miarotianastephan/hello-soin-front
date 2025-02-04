import axios from 'axios';

const API_URL = 'http://192.168.137.1:3000/api';
// const API_URL = 'https://passion-vins.fr/api';

export {
  API_URL
}

export const api_login = async (user_mail, mot_de_passe) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      user_mail,
      mot_de_passe
    });

    return response.data; // Retourne la réponse du serveur
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    throw error; // Propager l'erreur pour la gérer ailleurs
  }
};

// localStorage
export const setLocalData = (name,value) => {
    localStorage.setItem(name, JSON.stringify(value));
};
  
export const getLocalData = (name) => {
    return JSON.parse(localStorage.getItem(name));
};
  
export const removeLocalData = (name) => {
localStorage.removeItem(name);
};
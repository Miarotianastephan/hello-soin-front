import axios from 'axios';

const API_URL = 'http://192.168.137.1:3000/api';
// const API_URL = 'https://passion-vins.fr/api';

export {
  API_URL
}
// Login API
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

// Getting Data User 
// {
//   id_users: undefined,
//   user_name: "Jean",
//   user_forname: "Bosco",
//   adresse: "Ambiatibe",
//   code_postal: "12344",
//   ville: "Tsy hay",
//   user_created_at: "05-02-2025",
//   user_date_naissance: "01-08-2002",
//   user_mail: "jean@mail.jean",
//   user_password: "xxxxxxx",
//   user_phone: "34 21 245 21",
//   user_photo_url: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
//   id_type_user: undefined,
//   mot_de_passe: ""
// }
export const getProfilPraticien = () =>{

  const data_user = {
    user_name: "Jean",
    user_forname: "Bosco",
    user_phone: "+1 (555) 123-22222",
    user_mail: "jean@mail.jean",
    photo_url: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    siret_number: "12345678",
    ville: "Tananarive",
    xp: 10,
    specialite:["Dermatologue", "Acuponcture", "Massage traditionnelle"],
    consultation: ["Au cabinet", "Domicile"],
    total_rdv: 22, 
  }

  // Appel axiosa implementer
  return data_user;
} 
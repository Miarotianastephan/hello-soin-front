import axios from 'axios';
import { user_test } from '@/components/common/constant';

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

export const api_login_test = async (user_mail, mot_de_passe) => {
  try {
    console.log({
      test: user_mail,
      Ttest: user_test.user_mail,
    })
    if( user_mail == user_test.user_mail ){
      if( mot_de_passe == user_test.mot_de_passe ){
        return {
          message: "Connexion reussi !",
          token: "fake_token_21353wgoi42sqp",
          user: user_test
        }
      }
      throw {
        message: "Mot de passe incorrect !",
      }
    }
    throw {
      message: "Adresse email incorrect !",
    }
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    throw error;
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
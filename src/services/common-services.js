import { jwtDecode } from 'jwt-decode';

// Fonction pour le local storage
export const setLocalData = (name,value) => {
    localStorage.setItem(name, JSON.stringify(value));
};
  
export const getLocalData = (name) => {
    return JSON.parse(localStorage.getItem(name));
};
  
export const removeLocalData = (name) => {
localStorage.removeItem(name);
};

export const decodedToken = () => {
  const token = getLocalData('token');
  const payloadData = jwtDecode(token);
  return payloadData;
}
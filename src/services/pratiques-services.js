import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;
import { getLocalData } from './common-services';

export const findDisciplines = async () => {
    try {
        const response = await axios.get(`${API_URL}/discipline`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la connexion", error);
        throw error;
    }
}

export const findPratiques = async () => {
    const token = getLocalData('token');
    const api = axios.create({
        baseURL: API_URL, 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.get('/pratiques');
        console.log('Pratiques récupérées:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la récupération des pratiques:',
            error.response ? error.response.data : error.message
        );
    }
}

export const savePratique = async (pratique) => {
    const token = getLocalData('token');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.post('/pratiques', pratique);
        console.log('Pratique sauvegardée:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la sauvegarde de la pratique:',
            error.response ? error.response.data : error.message
        );
    }
}

export const updatePratique = async (pratique) => {
    const token = getLocalData('token');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.put('/pratiques', pratique);
        console.log('Pratique updater:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors de la modification de la pratique:',
            error.response ? error.response.data : error.message
        );
    }
}

export const deletePratique = async (pratique) => {    
    const token = getLocalData('token');
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    
    try {
        const response = await api.delete('/pratiques', pratique);
        console.log('Pratique supprimer:', response.data);
        return response.data;
    } catch (error) {
        console.error(
            'Erreur lors du suppression de la pratique:',
            error.response ? error.response.data : error.message
        );
    }
}
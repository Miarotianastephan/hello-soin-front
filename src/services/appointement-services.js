import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const findAppointements = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointments`);
        return response.data;
    } catch (error) {
        console.error("Erreur de récupération des appoointements", error);
        throw error;
    }
}
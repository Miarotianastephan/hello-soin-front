import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const findAllSpeciality = async() => {
    try {
        
        const token = localStorage.getItem('authToken');
        const reponse = await axios.get(`${API_URL}/praticien/get-speciality-praticien`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return reponse.data.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
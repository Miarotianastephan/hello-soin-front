export const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const heures = Array.from({ length: 10 }, (_, i) => 8 + i); // Plages horaires entre 8h et 17h

export const pratiques = {
  naturopathie: 120,
  acuponcture: 30,
  hypnose: 90,
};

// Les constantes de manipulation des CLEs des donnees
export const AVALAIBLE_DAYS_KEYS = "avalaible_days";
export const SELECTED_DAYS_KEYS = "selected_days";

export const defaultSelectedDays = [];


export const initialSlotsData = JSON.parse(localStorage.getItem('programmedDays')) || []
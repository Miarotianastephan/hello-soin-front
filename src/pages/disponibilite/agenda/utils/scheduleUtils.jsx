// utils/scheduleUtils.js
import { format, parse, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

export function createPlageHoraire(date, heureDebut, heureFin) {
  // Récupérer et valider le planning existant
  let planning;
  try {
    const existingData = localStorage.getItem('planning');
    planning = existingData ? JSON.parse(existingData) : null;
  } catch (error) {
    planning = null;
  }
  // Si le planning n'existe pas ou est mal formé, on initialise l'objet
  if (!planning || typeof planning !== 'object' || !Array.isArray(planning.datesWithSlots)) {
    planning = { datesWithSlots: [] };
  }

  // Vérifier le format des heures
  const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeFormat.test(heureDebut)) throw new Error("Format d'heure début invalide (HH:mm)");
  if (!timeFormat.test(heureFin)) throw new Error("Format d'heure fin invalide (HH:mm)");

  // Convertir les heures en objets Date pour la comparaison
  const start = getDateFromTime(heureDebut);
  const end = getDateFromTime(heureFin);
  
  if (isBefore(end, start)) throw new Error("L'heure de fin doit être après l'heure de début");

  // Trouver ou créer l'entrée pour la date
  let dateEntry = planning.datesWithSlots.find(d => d.date === date);
  if (!dateEntry) {
    dateEntry = {
      date,
      dayName: format(parse(date, 'dd-MM-yyyy', new Date()), 'EEEE', { locale: fr }),
      timeSlots: [] // Initialisation explicite de timeSlots
    };
    planning.datesWithSlots.push(dateEntry);
  } else {
    // S'assurer que timeSlots est bien un tableau
    if (!Array.isArray(dateEntry.timeSlots)) {
      dateEntry.timeSlots = [];
    }
  }

  // Vérifier les chevauchements avec les créneaux existants
  const hasOverlap = dateEntry.timeSlots.some(slot => {
    const slotStart = getDateFromTime(slot.start);
    const slotEnd = getDateFromTime(slot.end);
    return (start < slotEnd && end > slotStart);
  });

  if (hasOverlap) throw new Error("Chevauchement avec un créneau existant");

  // Ajouter le nouveau créneau horaire
  dateEntry.timeSlots.push({
    start: heureDebut,
    end: heureFin,
    practices: [],
    errors: { start: false, end: false }
  });

  // Sauvegarder le planning mis à jour dans le localStorage
  localStorage.setItem('planning', JSON.stringify(planning));
}

// Helper function pour convertir une heure au format HH:mm en objet Date
export function getDateFromTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

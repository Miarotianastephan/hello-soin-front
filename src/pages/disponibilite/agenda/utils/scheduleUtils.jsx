import { format, parse, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import BASE_URL from '@/pages/config/baseurl';
/**
 * Crée une nouvelle plage horaire spécifique pour une date donnée.
 * Au lieu d'utiliser le localStorage, cette fonction fait appel à l'API addSpecificTimeSlots.
 *
 * @param {string} date - La date au format "dd-MM-yyyy"
 * @param {string} heureDebut - Heure de début au format "HH:mm"
 * @param {string} heureFin - Heure de fin au format "HH:mm"
 * @returns {Promise<Object>} La réponse de l'API en cas de succès.
 * @throws {Error} En cas d'erreur de format ou d'appel API.
 */
export async function createPlageHoraire(date, heureDebut, heureFin) {
  // Vérifier le format des heures
  const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeFormat.test(heureDebut))
    throw new Error("Format d'heure début invalide (HH:mm)");
  if (!timeFormat.test(heureFin))
    throw new Error("Format d'heure fin invalide (HH:mm)");

  // Convertir les heures en objets Date pour la comparaison
  const start = getDateFromTime(heureDebut);
  const end = getDateFromTime(heureFin);
  if (isBefore(end, start))
    throw new Error("L'heure de fin doit être après l'heure de début");

  // Calculer le nom du jour à partir de la date (ex: 'lundi')
  const dayName = format(parse(date, 'dd-MM-yyyy', new Date()), 'EEEE', { locale: fr });

  // Préparer la nouvelle plage horaire à ajouter
  const newTimeSlot = {
    start: heureDebut,
    end: heureFin,
    practices: [] // On peut ajouter des pratiques ultérieurement si besoin
  };

  // Appel de l'API addSpecificTimeSlots
  const response = await fetch(`${BASE_URL}/addSpecificTimeSlots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date, // Format "dd-MM-yyyy"
      newTimeSlots: [newTimeSlot]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de l'ajout de la plage horaire");
  }

  const data = await response.json();
  return data;
}

/**
 * Helper function pour convertir une heure au format "HH:mm" en objet Date.
 *
 * @param {string} timeStr - L'heure au format "HH:mm"
 * @returns {Date} L'objet Date correspondant à l'heure indiquée (la date du jour est utilisée).
 */
export function getDateFromTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

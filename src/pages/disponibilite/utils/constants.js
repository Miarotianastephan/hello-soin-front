export const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const heures = Array.from({ length: 10 }, (_, i) => 8 + i); // Plages horaires entre 8h et 17h

export const pratiques = {
  naturopathie: 120,
  acuponcture: 30,
  hypnose: 92,
};

// Les constantes de manipulation des CLEs des donnees
export const AVALAIBLE_DAYS_KEYS = "avalaible_days";
export const SELECTED_DAYS_KEYS = "selected_days";

export const defaultSelectedDays = [];

// Rendez-vous enregistrer
// export const initialSlotsData = [
//   {
//     date: "2025-02-16",
//     day: "Dimanche",
//     slots: [
//       {
//         start: 14,
//         end: 18,
//         pratiques: [] // Pas de rendez-vous ce jour-là
//       }
//     ]
//   },
//   {
//     date: "2025-02-18",
//     day: "Mardi",
//     slots: [
//       {
//         start: 9,
//         end: 11,
//         pratiques: [
//           {
//             start: "9:00",
//             type: "naturopathie",
//             date: "2025-02-17",
//             appointments: [ // pour mon heure de travail de 9/11h voici les redndev-vous prise pour telle pratique
//               {
//                 name: "Alice Dupont",
//                 age: 30,
//                 telephone: "0123456789",
//                 motif: "Consultation initiale",
//                 start: "9:00", // heure debut du rendez-vous
//                 end: "10:00" // heure fin doit etre dynamique
//               },
//               {
//                 name: "Jean Dupont",
//                 age: 25,
//                 telephone: "0123456789",
//                 motif: "Consultation initiale",
//                 start: "10:00", // heure debut du rendez-vous
//                 end: "11:00" // heure fin doit etre dynamique
//               },
//             ]
//           }
//         ]
//       },
//       {
//         start: 14,
//         end: 16,
//         pratiques: [
//           {
//             start: "14:15",
//             type: "acuponcture",
//             date: "2025-02-17",
//             appointments: [
//               {
//                 name: "Bob Martin",
//                 age: 45,
//                 telephone: "0987654321",
//                 motif: "Suivi traitement",
//                 start: "14:15",
//                 end: "14:45"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     date: "2025-02-17",
//     day: "Lundi",
//     slots: [
//       {
//         start: 10,
//         end: 12,
//         pratiques: [
//           {
//             start: "10:00",
//             type: "acuponcture",
//             date: "2025-02-18",
//             appointments: [] // Créneau sans rendez-vous
//           },
//           {
//             start: "11:00",
//             type: "hypnose",
//             date: "2025-02-18",
//             appointments: [
//               {
//                 name: "Charlie Leblanc",
//                 age: 37,
//                 telephone: "0147258369",
//                 motif: "Gestion stress",
//                 start: "11:00",
//                 end: "12:30"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];

// export const initialSlotsData = JSON.parse(localStorage.getItem('programmedDays')) || []

export const initialSlotsData = [
  {
    date: "2025-02-14",
    day: "Vendredi",
    slots: [
      {
        start: 15,
        end: 18,
        pratiques: [
          {
            start: "15:00",
            type: "hypnose",
            date: "2025-02-14",
            appointments: [
              {
                name: "Claire Dupont",
                start: "16:30",
                duration: "1h"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-17",
    day: "Lundi",
    slots: [
      {
        start: 9,
        end: 12,
        pratiques: [
          {
            start: "9:00",
            type: "naturopathie",
            date: "2025-02-17",
            appointments: []
          },
        ]
      }
    ]
  },
  {
    date: "2025-02-18",
    day: "Mardi",
    slots: [
      {
        start: 13,
        end: 17,
        pratiques: [
          {
            start: "13:00",
            type: "hypnose",
            date: "2025-02-18",
            appointments: []
          },
          {
            start: "15:00",
            type: "naturopathie",
            date: "2025-02-18",
            appointments: []
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-19",
    day: "Mercredi",
    slots: [
      {
        start: 10,
        end: 13,
        pratiques: [
          {
            start: "10:30",
            type: "hypnose",
            date: "2025-02-19",
            appointments: []
          },
          {
            start: "12:15",
            type: "acuponcture",
            date: "2025-02-19",
            appointments: []
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-21",
    day: "Vendredi",
    slots: [
      {
        start: 15,
        end: 18,
        pratiques: [
          {
            start: "15:00",
            type: "hypnose",
            date: "2025-02-21",
            appointments: []
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-24",
    day: "Lundi",
    slots: [
      {
        start: 9,
        end: 12,
        pratiques: [
          {
            start: "9:00",
            type: "naturopathie",
            date: "2025-02-17",
            appointments: []
          },
        ]
      }
    ]
  },
  {
    date: "2025-02-25",
    day: "Mardi",
    slots: [
      {
        start: 13,
        end: 17,
        pratiques: [
          {
            start: "13:00",
            type: "hypnose",
            date: "2025-02-18",
            appointments: []
          },
          {
            start: "15:00",
            type: "naturopathie",
            date: "2025-02-18",
            appointments: []
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-26",
    day: "Mercredi",
    slots: [
      {
        start: 10,
        end: 13,
        pratiques: [
          {
            start: "10:30",
            type: "hypnose",
            date: "2025-02-19",
            appointments: []
          },
          {
            start: "12:15",
            type: "acuponcture",
            date: "2025-02-19",
            appointments: []
          }
        ]
      }
    ]
  },
  {
    date: "2025-02-28",
    day: "Vendredi",
    slots: [
      {
        start: 15,
        end: 17,
        pratiques: [
          {
            start: "15:00",
            type: "hypnose",
            date: "2025-02-28",
            appointments: []
          }
        ]
      }
    ]
  }
];


// Correction 
export const DEFAULT_SLOT_TIME = {
  time_start : 8,
  time_end : 10,
}

export function calculerHeureFin(heureDebut, dureeMinutes) {
  let heures = Math.floor(dureeMinutes / 60);
  let minutes = dureeMinutes % 60;
  
  let heureFin = heureDebut + heures;
  let minuteFin = minutes;

  // Formatage de l'affichage (ex: "8:00" au lieu de "8:0")
  let heureDebutFormat = `${heureDebut}:00`;
  let heureFinFormat = `${heureFin}:${minuteFin.toString().padStart(2, '0')}`;

  return {
      heure_debut: heureDebutFormat,
      heure_fin: heureFinFormat
  };
}

export function comparerHeures(heure1, heure2) {
  // Convertir "8:00" en heures et minutes
  const [h1, m1] = heure1.split(":").map(Number);
  const [h2, m2] = heure2.split(":").map(Number);

  // Convertir en minutes depuis minuit
  const totalMinutes1 = h1 * 60 + m1;
  const totalMinutes2 = h2 * 60 + m2;
  if (totalMinutes1 == totalMinutes2) {
    return "equal"
  }else if (totalMinutes1 < totalMinutes2){
    return "inf";
  }else if (totalMinutes1 > totalMinutes2){
    return "sup";
  }
}

function showOverLapTest(val1, val2, val3, testMessage){
  console.log(val1 + " "+ testMessage + ". Detail: start:" + val2 + " end:" + val3)
}
// Test 1
export function isStartOverLapIn(newPratique, pratique) {
  const newStart = newPratique.start;
  const pratStart = pratique.start;
  const pratEnd = pratique.end;

  if ( (comparerHeures(newStart, pratStart)==="equal" || comparerHeures(newStart, pratStart)==="sup")  && (comparerHeures(newStart, pratEnd)==="inf") ){
    showOverLapTest(newStart, pratStart, pratEnd, "start inside");
    return true;
  }
  showOverLapTest(newStart, pratStart, pratEnd, "start OK");
  return false;
}
// Test 2
export function isEndOverLapIn(newPratique, pratique) {
  const newEnd = newPratique.end;
  const pratStart = pratique.start;
  const pratEnd = pratique.end;

  if ( (comparerHeures(newEnd, pratStart)==="sup") && (comparerHeures(newEnd, pratEnd)==="inf" || comparerHeures(newEnd, pratEnd)==="equal" )){
    showOverLapTest(newEnd, pratStart, pratEnd, "end inside");
    return true;
  }
  showOverLapTest(newEnd, pratStart, pratEnd, "end OK");
  return false;
}
// Test 3
export function isFullOverLap(newPratique, pratique) {
  const newStart = newPratique.start;
  const newEnd = newPratique.end;
  const pratStart = pratique.start;
  const pratEnd = pratique.end;

  if ((comparerHeures(newStart, pratStart)==="inf") && (comparerHeures(newEnd, pratEnd)==="sup") || 
      (comparerHeures(newStart, pratStart)==="equal") && (comparerHeures(newEnd, pratEnd)==="equal") ||
      (comparerHeures(newStart, pratStart)==="sup") && (comparerHeures(newEnd, pratEnd)==="inf")){
    console.log("full overlap")
    return true;
  }
  console.log("Time not full overlap")
  return false;
}
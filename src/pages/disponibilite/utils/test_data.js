
// COMPARAISON

// Test donnees A
// {
//   "date": "2025-02-19T00:00:00.000Z",
//   "day": "Mercredi",
//   "slots": [
//       {
//           "start": 8,
//           "end": 10,
//           "pratiques": []
//       }
//   ]
// }

// Test donnees C :
// ===> date tsy mitovy format amle originale sisa!!!
// ===> Heure Efa OKE
// {
//   "date": "2025-02-25T00:00:00.000Z",
//   "day": "Mardi",
//   "slots": [
//       {
//           "start": 8,
//           "end": 14,
//           "pratiques": [
//               {
//                   "start": "9:00",
//                   "type": "acuponcture",
//                   "appointments": []
//               },
//               {
//                   "start": "10:00",
//                   "type": "naturopathie",
//                   "appointments": []
//               }
//           ]
//       },
//       {
//           "start": 14,
//           "end": 16,
//           "pratiques": [
//               {
//                   "start": "14:00",
//                   "type": "acuponcture",
//                   "appointments": []
//               },
//               {
//                   "start": "15:00",
//                   "type": "acuponcture",
//                   "appointments": []
//               }
//           ]
//       }
//   ]
// }

// Test donnees D
// ===> date EFA OKE
// ===> Heure Efa OKE
// ===> Apina date par pratique sisa
// {
//   "date": "2025-02-25",
//   "day": "Mardi",
//   "slots": [
//       {
//           "start": 8,
//           "end": 17,
//           "pratiques": [
//               {
//                   "start": "8:00",
//                   "type": "naturopathie",
//                   "appointments": []
//               },
//               {
//                   "start": "10:00",
//                   "type": "acuponcture",
//                   "appointments": []
//               }
//           ]
//       }
//   ]
// }

// Test donnees B : 
// ===> date tsy mitovy format amle originale !!!
// ===> heure tsy mitovy format amle originale !!!
// {
//   "date": "2025-02-19T00:00:00.000Z",
//   "day": "Mercredi",
//   "slots": [
//       {
//           "start": 10,
//           "end": 13,
//           "pratiques": [
//               {
//                   "start": 10,
//                   "type": "hypnose",
//                   "appointments": []
//               },
//               {
//                   "start": 12,
//                   "type": "acuponcture",
//                   "appointments": []
//               }
//           ]
//       }
//   ]
// }



// Test donnees E donnees a tester
// {
//     "date": "2025-02-25",
//     "day": "Mardi",
//     "slots": [
//         {
//             "start": 8,
//             "end": 13,
//             "pratiques": [
//                 {
//                     "start": "10:00",
//                     "type": "naturopathie",
//                     "date": "2025-02-25",
//                     "appointments": []
//                 }
//             ]
//         }
//     ]
// }

// Donnees ORIGINALE
// {
//   date: "2025-02-19",
//   day: "Mercredi",
//   slots: [
//     {
//       start: 10,
//       end: 13,
//       pratiques: [
//         {
//           start: "10:30",
//           type: "hypnose",
//           date: "2025-02-19",
//           appointments: []
//         },
//         {
//           start: "12:15",
//           type: "acuponcture",
//           date: "2025-02-19",
//           appointments: []
//         }
//       ]
//     }
//   ]
// },
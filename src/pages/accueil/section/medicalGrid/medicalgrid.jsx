import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

const practices = [
  {
    id: 1,
    image: "https://img.freepik.com/free-vector/cardiologist-concept-illustration_114360-6847.jpg?t=st=1740077421~exp=1740081021~hmac=b51cbbfb90f847bf3e1b00498108fd380eba7b7f216f8a9ae540576e6d0018df&w=740",
    type: "Cardiologie",
    description: "Spécialité médicale dédiée aux maladies du cœur et des vaisseaux."
  },
  {
    id: 2,
    image: "https://img.freepik.com/free-vector/cartoon-medical-person-taking-xray-patient_778687-2648.jpg?t=st=1740077575~exp=1740081175~hmac=647ecc1f2368cccf06aa1b94bee272eeca9c2d9c429c4e605d5960e31edb5d13&w=740",
    type: "Radiologie",
    description: "Utilisation de l'imagerie médicale pour diagnostiquer des maladies."
  },
  {
    id: 3,
    image: "https://img.freepik.com/free-vector/surgeons-team-surrounding-patient-operation-table-flat-vector-illustration-cartoon-medical-workers-preparing-surgery-medicine-technology-concept_74855-8596.jpg?t=st=1740077696~exp=1740081296~hmac=d6437e81e9ce4190c547cdbd994dbd757e158dcdcf7b9c48199ec313655a818e&w=996",
    type: "Chirurgie générale",
    description: "Intervention manuelle et instrumentale sur le corps humain."
  },
  {
    id: 4,
    image: "https://img.freepik.com/free-vector/physical-therapy-exercise-concept-illustration_114360-9011.jpg?t=st=1740077702~exp=1740081302~hmac=911f5c7d9b08a387c69d724463aa1efe54b8fc4d66e342334f95e769695feb10&w=740",
    type: "Physiothérapie",
    description: "Méthode de traitement basée sur des exercices et des manipulations."
  },
  {
    id: 5,
    image: "https://img.freepik.com/free-vector/psychotherapy-abstract-concept-illustration-non-pharmacological-intervention-verbal-counseling-psychotherapy-service-behavioral-cognitive-therapy-private-session_335657-554.jpg?t=st=1740077904~exp=1740081504~hmac=fd825e31e455c448f827ef0c385d45f1605f1c439dae7afd65b9b6cd337e1dc1&w=740",
    type: "Psychiatrie",
    description: "Branche de la médecine traitant des troubles mentaux."
  },
  {
    id: 6,
    image: "https://img.freepik.com/free-vector/candle-aromatherapy-oil_603843-839.jpg?t=st=1740078016~exp=1740081616~hmac=eea6cf0e7e46fc799fc1e58d261b5d16ee464108906bb5a8aebe90e7e1e6167e&w=740",
    type: "Naturopathie",
    description: "Médecine alternative utilisant des méthodes naturelles pour la guérison."
  },
  {
    id: 7,
    image: "https://img.freepik.com/free-vector/acupuncture-concept-illustration_114360-19114.jpg?t=st=1740078161~exp=1740081761~hmac=4d295efbc59ec2bf752da0eb89f507f649d4294af2765f67a87a68ba2d14e6a6&w=740",
    type: "Acupuncture",
    description: "Méthode traditionnelle chinoise utilisant des aiguilles pour rééquilibrer l'énergie corporelle."
  },
  {
    id: 8,
    image: "https://img.freepik.com/free-vector/bodybuilder-with-sports-nutrition-plastic-containers-with-protein-powder-sports-nutrition-sports-supplements-ergogenic-aids-use-concept_335657-651.jpg?t=st=1740078328~exp=1740081928~hmac=ca60b1c4e3fad3adac75be0f66822c6f68c21093b0fb06ddc5a34c386dc57271&w=996",
    type: "Homéopathie",
    description: "Médecine douce basée sur des substances diluées pour stimuler l'autoguérison."
  }
];

const MedicalGrid = () => {
  return (
    <div>
        <h1 className="flex items-center justify-center w-full mt-6 mb-6 text-2xl font-bold text-center text-gray-900">
            Les types de rendez-vous
        </h1>
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {practices.map((practice) => (
                <Card key={practice.id} className="overflow-hidden shadow-lg rounded-2xl">
                    <img src={practice.image} alt={practice.type} className="object-cover w-full h-48" />
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{practice.type}</h3>
                        <p className="mt-2 text-gray-600">{practice.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>

  );
};

export default MedicalGrid;
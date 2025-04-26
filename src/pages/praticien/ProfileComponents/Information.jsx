import React,{useState} from 'react'
import { InfoIcon, MapPinHouse, Star, CreditCard} from 'lucide-react'
const Information = ({practitionerData}) => {
  const typePatient = JSON.parse(localStorage.getItem('patientTypes') || '[]');
    const cabinetImages = [
    "https://cdn.studiometa.fr/https://www.be-mydesk.com/img/cms/Cabinet%20m%C3%A9dical/Cab/17278.jpg?twic=v1/max=1680",
    "https://www.manohisoa-medical.com/wp-content/uploads/bfi_thumb/Slide-cabinet-medical-manohisoa-accueil-34ze9ftb74bqorb1ej0jy8.jpg","https://media.istockphoto.com/id/1171739282/fr/photo/salle-dexamen-m%C3%A9dical.jpg?s=612x612&w=0&k=20&c=tu2X2NssRW_Xu8__973BZeSQsOiJnfR5rxvMB9qLXHQ=" // Image supplémentaire pour tester la grille
    // Ajoutez d'autres images si nécessaire
  ];

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Supprimer tous les caractères non numériques
    let cleaned = phone.replace(/\D/g, '');
    // Remplacer le préfixe international par 0
    if (cleaned.startsWith('33')) {
      cleaned = '0' + cleaned.slice(2);
    }
    // Diviser en groupes de 2 chiffres
    return cleaned.match(/.{1,2}/g)?.join(' ') || cleaned;
  };
  

  const formatSIRET = (siret) => {
    if (!siret) return '';
    // Supprimer tous les caractères non numériques
    const cleaned = siret.replace(/\D/g, '');
    // Diviser en groupes de 3 chiffres
    return cleaned.match(/.{1,3}/g)?.join(' ') || cleaned;
  };
  
  
  return (
<div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            {/* Colonne 1 */}
            <div className="p-4 space-y-4 bg-white border rounded">
  <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
    <InfoIcon size={17} /> Informations professionnelles
  </h2>

  <div className="space-y-4">
  {/* Ligne Description */}
  <div className="flex flex-col md:flex-row mb-1 text-xs text-gray-700">
    <div className="w-full md:w-1/3 pr-2 font-semibold text-left md:text-right">
      Description :
    </div>
    <div className="w-full md:w-2/3 text-left">
      {practitionerData.practitioner_info.profil_description}
    </div>
  </div>

  {/* Autres informations */}
  <div className="space-y-4 text-xs text-gray-700">
    <div className="flex flex-col md:flex-row mb-1">
      <div className="w-full md:w-1/3 pr-2 font-semibold text-left md:text-right">
        Civilité :
      </div>
      <div className="w-full md:w-2/3 text-left">
        {practitionerData.situation}
      </div>
    </div>

    <div className="flex flex-col md:flex-row mb-1">
      <div className="w-full md:w-1/3 pr-2 font-semibold text-left md:text-right">
        Type de patient :
      </div>
      <div className="w-full md:w-2/3 text-left overflow-hidden">
        {typePatient.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {typePatient.map((type, index) => (
              <p key={index}>{type} |</p>
            ))}
          </div>
        ) : (
          <span>Aucun type de patient défini.</span>
        )}
      </div>
    </div>

    <div className="flex flex-col md:flex-row mb-1">
      <div className="w-full md:w-1/3 pr-2 font-semibold text-left md:text-right">
        Téléphone :
      </div>
      <div className="w-full md:w-2/3 text-left">
        {formatPhoneNumber(practitionerData.mobile_number)}
      </div>
    </div>

    <div className="flex flex-col md:flex-row mb-1">
      <div className="w-full md:w-1/3 pr-2 font-semibold text-left md:text-right">
        SIRET :
      </div>
      <div className="w-full md:w-2/3 text-left">
        {formatSIRET(practitionerData.practitioner_info.siret)}
      </div>
    </div>
  </div>
</div>
</div>

            {/* Colonne 2 */}
            <div className="p-4 bg-white border rounded">
      <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
        <MapPinHouse size={17} /> Cabinet
      </h2>
      {cabinetImages.length > 1 ? (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {cabinetImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Cabinet ${idx + 1}`}
              className="object-cover w-full h-40 rounded"
            />
          ))}
        </div>
      ) : (
        <img
          src={cabinetImages[0]}
          alt="Cabinet"
          className="object-cover w-full h-40 mb-2 rounded"
        />
      )}
      <p className="text-xs text-gray-600">
        Votre cabinet peut être décrit ici : son ambiance, son équipement, sa localisation, etc.
      </p>
    </div>

            {/* Ligne 2 : Spécialités & Moyens de paiement */}
            <div className="p-4 bg-white border rounded">
  <div className="overflow-y-auto max-h-60">
    <table className="w-full text-xs">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-2 py-1 text-left text-[#5DA781]">Spécialité</th>
          <th className="px-2 py-1 text-left text-[#5DA781]">Durée</th>
          <th className="px-2 py-1 text-left text-[#5DA781]" >Tarif</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-white">
          <td className="px-2 py-3 text-gray-700">Énergétique Traditionnelle Chinoise</td>
          <td className="px-2 py-1">45min</td>
          <td className="px-2 py-1">80€</td>
        </tr>
        <tr className="bg-gray-100">
          <td className="px-2 py-3 text-gray-700">Hypnothérapie</td>
          <td className="px-2 py-1">45min</td>
          <td className="px-2 py-1">80€</td>
        </tr>
        <tr className="bg-white">
          <td className="px-2 py-3 text-gray-700">Reiki</td>
          <td className="px-2 py-1">45min</td>
          <td className="px-2 py-1">80€</td>
        </tr>
        <tr className="bg-gray-100">
          <td className="px-2 py-3 text-gray-700">Réflexologie</td>
          <td className="px-2 py-1">45min</td>
          <td className="px-2 py-1">80€</td>
        </tr>
        <tr className="bg-white">
          <td className="px-2 py-3 text-gray-700">Tuina</td>
          <td className="px-2 py-1">45min</td>
          <td className="px-2 py-1">80€</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


            <div className="p-4 bg-white border rounded">
            <h2 className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#5DA781]">
        <CreditCard size={17} /> Moyen de paiement
      </h2>
      <ul className="space-y-1 text-xs text-gray-700">
  <li className="flex items-center">
    <span className="inline-block w-2 h-2 mr-2 bg-[#405969] rounded-full"></span>
    Carte bancaire
  </li>
  <li className="flex items-center">
    <span className="inline-block w-2 h-2 mr-2 bg-[#405969] rounded-full"></span>
    Chèque
  </li>
  <li className="flex items-center">
    <span className="inline-block w-2 h-2 mr-2 bg-[#405969] rounded-full"></span>
    Espèces
  </li>
</ul>


              {/* Note et avis */}
              <div className="flex flex-col items-center mt-4 md:flex-row md:items-start">
  {/* Bloc de note et nombre d'avis (à gauche) */}
  <div className="flex flex-col items-start">
    <div className="flex items-center space-x-1">
      <span className="text-xl font-semibold text-gray-800">4.4/5</span>
      <div className="flex">
        <Star className="w-4 h-4 text-yellow-400"  fill = "currentColor" />
        <Star className="w-4 h-4 text-yellow-400"  fill = "currentColor"/>
        <Star className="w-4 h-4 text-yellow-400"  fill = "currentColor"  />
        <Star className="w-4 h-4 text-yellow-400"  fill = "currentColor" />
        <Star className="w-4 h-4 text-gray-300" />
      </div>
    </div>
    <p className="text-xs text-gray-600">120 avis</p>
  </div>

  {/* Bloc de détails des avis (progress bars) à droite */}
  <div className="flex-1 mt-4 md:mt-0 md:ml-6">
    <div className="space-y-2">
      {/* 5 étoiles */}
      <div className="flex items-center text-xs">
        <span className="w-6">5</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: "60%" }}
          ></div>
        </div>
        <span className="w-8 text-right">72</span>
      </div>
      {/* 4 étoiles */}
      <div className="flex items-center text-xs">
        <span className="w-6">4</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: "20%" }}
          ></div>
        </div>
        <span className="w-8 text-right">24</span>
      </div>
      {/* 3 étoiles */}
      <div className="flex items-center text-xs">
        <span className="w-6">3</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: "10%" }}
          ></div>
        </div>
        <span className="w-8 text-right">12</span>
      </div>
      {/* 2 étoiles */}
      <div className="flex items-center text-xs">
        <span className="w-6">2</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: "5%" }}
          ></div>
        </div>
        <span className="w-8 text-right">6</span>
      </div>
      {/* 1 étoile */}
      <div className="flex items-center text-xs">
        <span className="w-6">1</span>
        <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: "5%" }}
          ></div>
        </div>
        <span className="w-8 text-right">6</span>
      </div>
    </div>
  </div>
</div>

            </div>
          </div>
  )
}

export default Information

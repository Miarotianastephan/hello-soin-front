import React from "react"
import { useNavigate } from "react-router-dom"


const PremierPas = () => {

  // Exemple de gestion des clics sur les cartes
  const handleProfileClick = () => {
    console.log('Coucou') // Redirige vers la page de profil
  }
  const handleAvailabilityClick = () => {
    console.log('Coucou') // Redirige vers la page de disponibilités
  }
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/completeProfile')
  }

  return (
    <div className="flex flex-col items-center w-full px-4 py-10 md:px-6">
      {/* En-tête avec le message de bienvenue */}
      <div className="mb-8 text-center space-y-2">
        <p >
          <span className="text-2xl">🎉</span> <span className="font-bold text-xl">Bienvenue sur</span> <span className="text-[#5DA781] text-xl font-bold">Hellosoins</span> <span className="text-2xl">🎉</span>
        </p>
        <p className="text-sm md:text-sm text-muted-foreground">
          Nous sommes ravis de vous compter parmi nous&nbsp;!
          <br className="hidden md:block" />
          Votre espace praticien est maintenant prêt.
        </p>
      </div>

      {/* Cartes pour guider l’utilisateur */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Carte 1 : Compléter le profil */}
        <div 
          className="w-full max-w-sm shadow-none flex items-center justify-center cursor-pointer hover:border-[#5DA781] border py-6 px-4 rounded" 
          onClick={handleNavigate}
        >
            <div className="w-full text-sm p text-gray-900 text-center">
				<span className="text-[#5DA781] text-sm font-bold">Compléter votre profil</span> pour mieux vous présenter à vos patients
			</div>
		</div>

        {/* Carte 2 : Ajouter vos disponibilités */}
        <div 
          className="w-full max-w-sm shadow-none flex items-center justify-center cursor-pointer hover:border-[#5DA781] border py-6 px-4 rounded" 
          onClick={handleProfileClick}
        >
            <div className="w-full text-sm p text-gray-900 text-center">
				<span className="text-[#5DA781] text-sm font-bold">Ajouter les disponibilités</span> pour recevoir des rendez-vous
			</div>
		</div>
      </div>
    </div>
  )
}

export default PremierPas;

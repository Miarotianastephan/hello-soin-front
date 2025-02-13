import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { Phone,MailIcon,Calendar } from "lucide-react";
import {getProfilPraticien} from '@/services/api.js';
import { useEffect, useState } from "react";

const PraticienProfil = () => {
  
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfilPraticien();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      } finally{
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
        { isLoading ? 
        (<p>Chargement en cours...</p>)
        : (
          user ? (
          <div className="flex flex-1 flex-col gap-4 p-2 bg-gray-100 rounded-xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm max-w-4xl w-full p-6 transition-all duration-300 animate-fade-in">
              <div className="flex flex-col items-start md:flex-row gap-6">
                <div className="md:w-1/3 w-full text-center mb-8 md:mb-0">
                  <img
                    src="https://i.pravatar.cc/300"
                    alt="Profile Picture"
                    className="rounded-full w-48 h-48 mx-auto mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <div className="mt-4 flex flex-col">
                    <Button className="bg-helloSoin" size="sm">
                      Modifier profil
                    </Button>
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h5" className="mt-1 font-bold">
                    {user.user_forname && user.user_name ? (
                      <p>{user.user_name} {user.user_forname}</p>
                    ) : (
                      <p>Aucune infromation trouvée</p>
                    )}
                    </Typography>
                    <Chip
                      variant="ghost"
                      color="green"
                      size="sm"
                      value="Active"
                      icon={
                        <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                      }
                      className="w-max h-max"
                    />
                  </div>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <Phone className="h-5 w-5"/>
                      {user.user_phone ? (
                        user.user_phone
                      ) : (
                        <p>Aucune infromation trouvée</p>
                      )}
                    </li>
                    <li className="flex items-center gap-2">
                      <MailIcon className="h-5 w-5"/>
                      {user.user_mail ? (
                        user.user_mail
                      ) : (
                        <p>Aucune infromation trouvée</p>
                      )}
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <div className="flex items-start gap-1 rounded-lg p-2 border  max-w-max min-h-[50px]">
                        <Calendar className="w-5 h-5"/>
                        <div className="flex flex-col font-bold">22<span className="font-normal">Total des rendez-vous</span></div>
                    </div>
                    <div className="flex items-start gap-1 rounded-lg p-2 border  max-w-max min-h-[50px]">
                        <Calendar className="w-5 h-5"/>
                        <div className="flex flex-col font-bold">3<span className="font-normal">Nombre de pratiques</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section pour l'info complet */}
            <div className="bg-white w-full rounded-xl min-h-5 p-6">
              
              <Typography variant="h5" className="mt-1 font-bold">
              Informations Professionnelles
              </Typography>
              <div className="mt-3">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {/* les pratiques */}
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Type de pratiques (Specialités):</strong> 
                    {user && user.specialite ? (
                      user.specialite.join(", ")
                    ) : (
                      <p>Aucune spécialité trouvée</p>
                    )}
                  </li>
                  {/* numero de telephone */}
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Téléphone:</strong> 
                    {user.user_phone ? (
                      user.user_phone
                    ) : (
                      <p>Numero telephone non trouvée</p>
                    )}
                  </li>
                  {/* Ville */}
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Ville:</strong> 
                    {user.ville ? (
                      user.ville
                    ) : (
                      <p>Aucune ville trouvée</p>
                    )}
                  </li>
                  {/* Numero de siret */}
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Numero de Siret:</strong> 
                    {user.siret_number ? (
                      user.siret_number
                    ) : (
                      <p>Aucun numero de siret trouvée</p>
                    )}
                  </li>
                  {/* Nombre */}
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Experiences:</strong> 
                    {user.xp ? (
                       <p>{user.xp} ans</p>
                    ) : (
                      <p>Experience non confirme</p>
                    )}
                  </li>
                  <li className="flex justify-between px-2 py-1 hover:bg-gray-200 rounded-lg">
                    <strong>Type de consultation:</strong>
                    {user && user.consultation ? (
                      user.consultation.join(", ")
                    ) : (
                      <p>Aucune type de consultation trouvée</p>
                    )}
                  </li>
                </ul>
              </div>
            </div>
        </div>) : (<p>Utilisateur introuvable ou erreur de connexion</p>)
        )}
    </>
  );
};

export default PraticienProfil;

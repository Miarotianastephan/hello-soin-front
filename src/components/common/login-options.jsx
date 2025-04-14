import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button";
import Logo from './icone/googleIcon.png';

const LoginOptions = () => {
  // Définition de la fonction de connexion via le hook useGoogleLogin
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // La réponse contient un token JWT dans tokenResponse.credential (à vérifier selon la configuration)
      console.log('Connexion réussie avec Google :', tokenResponse);
      // Vous pouvez ici envoyer ce token à votre backend pour vérification et récupération des infos utilisateur.
    },
    onError: (error) => {
      console.error('Erreur lors de la connexion avec Google :', error);
    },
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="text-sm w-full rounded-full border-2 border-gray-700 flex items-center justify-center"
          onClick={() => login()} // Déclenche la fonction login au clic sur le bouton
        >
          <img src={Logo} alt="Google Icon" className="mr-2 w-6 h-6" />
          <span>Continuer avec Google</span>
        </Button>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-sm text-muted-foreground">
          Ou
        </span>
      </div>
    </>
  );
};

// Wrapper qui intègre le Provider afin d'encapsuler le contexte Google
const LoginOptionsWrapper = () => {
  return (
    <GoogleOAuthProvider clientId="1032870874107-dnof9g1hpr6nfucib3a2lhgreqnr8dod.apps.googleusercontent.com">
      <LoginOptions />
    </GoogleOAuthProvider>
  );
};

export default LoginOptionsWrapper;

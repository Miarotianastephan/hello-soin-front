import React, { useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import Logo from './icone/googleIcon.png';

import { login_by_email } from '@/services/api';
import { setLocalData } from '@/services/common-services';
import { useNavigate } from 'react-router-dom';

const LoginOptions = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  // Nouveaux états pour le dialogue de succès
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { access_token } = tokenResponse;
        const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        }).then(res => res.json());
        const email = profile.email;

        const result = await login_by_email(email);
        await setLocalData('token', result.token);
        await setLocalData('user', JSON.stringify(result.user));

        // Afficher le dialogue de succès au lieu de rediriger directement
        setUserEmail(result.user.email || email);
        setSuccessDialogOpen(true);
      } catch (err) {
        console.error('Erreur login sans mot de passe :', err);
        setDialogOpen(true);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la connexion avec Google :', error);
    },
  });

  return (
    <>
       <Dialog
        open={successDialogOpen}
        onOpenChange={(open) => {
          setSuccessDialogOpen(open);
          if (!open) navigate('/praticien/premierPas');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bienvenue {userEmail}</DialogTitle>
            <DialogDescription className="text-xs">
              Vous êtes connecté avec succès via Google.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="text-xs bg-green-600 rounded">Continuer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'erreur existant */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Compte introuvable</DialogTitle>
            <DialogDescription className="text-xs">
              Nous n'avons pas trouvé de compte associé à cet e-mail. Veuillez vérifier votre adresse e-mail ou créer un compte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button className="text-xs bg-red-800">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="text-sm w-full rounded-full border-2 border-gray-700 flex items-center justify-center"
          onClick={() => login()}
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

export default () => (
  <GoogleOAuthProvider clientId="1032870874107-dnof9g1hpr6nfucib3a2lhgreqnr8dod.apps.googleusercontent.com">
    <LoginOptions />
  </GoogleOAuthProvider>
);
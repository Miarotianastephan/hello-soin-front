import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "./signin-form";
import CodeVerification from "./CodeVerification";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { API_URL } from "@/services/api";
const AccountCreationContainer = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // États pour le dialog d'erreur
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");
    const contentValue =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    if (viewport) {
      viewport.setAttribute("content", contentValue);
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = contentValue;
      document.head.appendChild(meta);
    }
  }, []);

  const handleAccountCreated = async (formData) => {
    try {
      setIsLoading(true);
      // Envoi du code de validation
      const sendCodeResponse = await fetch(
        `${API_URL}/validation/send-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            mail: formData.mail, 
            numero: formData.phone_number 
          })
        }
      );

      if (!sendCodeResponse.ok) {
        throw new Error("Échec de l'envoi du code");
      }

      setFormData(formData);
      setShowVerification(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du code :", error);
      setDialogMessage("Échec : vérifiez votre email.");
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (userMail) => {
    try {
      setIsLoading(true);
      // Envoi du code de validation
      const sendCodeResponse = await fetch(
        `${API_URL}/validation/send-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            mail: formData.mail, 
            numero: formData.phone_number 
          })
        }
      );

      if (!sendCodeResponse.ok) {
        throw new Error("Échec de l'envoi du code");
      }

      setFormData(formData);
      setShowVerification(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du code :", error);
      setDialogMessage("Échec : vérifiez votre email.");
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async (verificationCode) => {
    try {
      // Vérification du code
      const verifyResponse = await fetch(
        `${API_URL}/validation/verify-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mail: formData.mail,
            code: verificationCode,
          }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("Code invalide ou expiré");
      }

      // Enregistrement après vérification réussie
      const registerResponse = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: formData.prenom,
            lastname: formData.nom,
            mail: formData.mail,
            password: formData.new_mot_de_passe,
            mobile_number: formData.phone_number,
            situation: formData.devise,
            postal_code: formData.code_postale,
            city: formData.ville,
            id_speciality: parseInt(formData.echence.split("_")[1], 10),
          }),
        }
      );

      if (!registerResponse.ok) {
        throw new Error("Échec de l'inscription");
      }

      const result = await registerResponse.json();
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
      console.log("Inscription réussie :", result);
      navigate("/praticien/premierPas");
    } catch (error) {
      console.error("Erreur lors de la vérification :", error);
      setDialogMessage("Échec : vérifiez votre email ou votre code de validation.");
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Erreur</DialogTitle>
            <DialogDescription className="text-xs">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn text-red-700 text-sm">Fermer</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showVerification ? (
        <CodeVerification
          resendCode={resendCode}
          onVerify={handleCodeVerification}
          userEmail={formData?.mail}
          phoneNumber={formData?.phone_number}
          isLoadingresend={isLoading}
        />
      ) : (
        <SignInForm onAccountCreated={handleAccountCreated} isLoading={isLoading} />
      )}
    </>
  );
};

export default AccountCreationContainer;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "./signin-form";
import CodeVerification from "./CodeVerification";

const AccountCreationContainer = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  const handleAccountCreated = async (formData) => {
    try {
      // Envoi du code de validation
      const sendCodeResponse = await fetch(
        "http://192.168.88.193:3000/validation/send-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mail: formData.mail }),
        }
      );

      if (!sendCodeResponse.ok) throw new Error("Échec de l'envoi du code");

      setFormData(formData);
      setShowVerification(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du code :", error);
      alert("Échec : vérifiez votre email.");
    }
  };

  const handleCodeVerification = async (verificationCode) => {
    try {
      // Vérification du code
      const verifyResponse = await fetch(
        "http://192.168.88.193:3000/validation/verify-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mail: formData.mail,
            code: verificationCode,
          }),
        }
      );

      if (!verifyResponse.ok) throw new Error("Code invalide ou expiré");

      // Enregistrement après vérification réussie
      const registerResponse = await fetch(
        "http://192.168.88.193:3000/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: formData.prenom,
            lastname: formData.nom,
            mail: formData.mail,
            password: formData.new_mot_de_passe,
            mobile_number: formData.phone_number.replace(/\D/g, "").slice(-9),
            situation: "libre",
            postal_code: formData.code_postale,
            city: formData.ville,
            id_speciality: parseInt(formData.echence.split("_")[1], 10),
          }),
        }
      );

      if (!registerResponse.ok) throw new Error("Échec de l'inscription");

      const result = await registerResponse.json();
      console.log("Inscription réussie :", result);
      navigate("/praticien/premierPas");
    } catch (error) {
      console.error("Erreur lors de la vérification :", error.message);
      alert("Échec : vérifiez votre email ou votre code de validation.");
    }
  };

  return (
    <> 
      {showVerification ? (
        <CodeVerification
          onVerify={handleCodeVerification}
          userEmail={formData?.mail}
        />
      ) : (
        <SignInForm onAccountCreated={handleAccountCreated} />
      )}
    </>
  );
};

export default AccountCreationContainer;

import { useState } from "react";
import SignInForm from "./signin-form";
import CodeVerification from "./CodeVerification";

const AccountCreationContainer = () => {
  const [showVerification, setShowVerification] = useState(false);

  // Callback déclenché lorsque la création de compte est validée dans SignInForm
  const handleAccountCreated = (formData) => {
    console.log("Compte créé avec succès :", formData);
    setShowVerification(true);
  };

  // Callback déclenché lors de la vérification du code
  const handleCodeVerification = (verificationCode) => {
    console.log("Code vérifié :", verificationCode);
    // Vous pouvez ajouter ici la logique de vérification du code
  };

  return (
    <>
      {showVerification ? (
        <CodeVerification onVerify={handleCodeVerification} />
      ) : (
        <SignInForm onAccountCreated={handleAccountCreated} />
      )}
    </>
  );
};

export default AccountCreationContainer;

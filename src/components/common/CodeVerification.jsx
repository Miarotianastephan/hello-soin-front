import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";

const CodeVerification = ({ onVerify }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const inputRefs = useRef([]);

  const onSubmit = (data) => {
    // Concatène les six chiffres pour obtenir le code complet.
    const code =
      data.code1 +
      data.code2 +
      data.code3 +
      data.code4 +
      data.code5 +
      data.code6;
    console.log("Code de vérification saisi :", code);
    if (onVerify) {
      onVerify(code);
    }
  };

  // Gère le changement dans chaque case et passe le focus sur la suivante.
  const handleInput = (e, index) => {
    const { value } = e.target;
    // On limite la saisie à un seul caractère par case.
    if (value.length > 1) return;
    // Si une valeur est saisie et qu'il existe une case suivante, passe le focus.
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white flex justify-center items-center flex-col rounded-md px-6 pt-4">
        <div className="text-center mb-4 w-full  flex justify-center items-center ">
          <div className="text-md mt-4 font-bold text-gray-900 mb-8">
            Confirmation du compte
          </div>
        </div>
        <div className="text-sm mt-4 font-medium text-gray-500 my-8 w-full">
          <p className="flex flex-col items-center justify-center gap-4 w-full">
            Un code de validation vous à été envoyé à l'adresse mail 
            <span className="underline text-[#5DA781]">tokiramanitra@gmail.com</span>
            <span>Saisir le code si-dessous pour valider votre compte </span>
          </p>
        </div>
        <div className="w-full flex justify-center items-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-6 pt-8">
              <div  className="w-full flex flex-col justify-center items-center gap-4">
                <Label className="text-sm text-gray-900 mb-1 font-semibold">
                    Code confirmation
                </Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6].map((item, index) => (
                    <input
                      key={item}
                      type="text"
                      maxLength="1"
                      className="w-10 h-10 text-center border rounded"
                      {...register(`code${item}`, {
                        required: "Chiffre requis",
                        pattern: { value: /^[0-9]$/, message: "Doit être un chiffre" },
                      })}
                      onChange={(e) => handleInput(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      placeholder="-"
                    />
                  ))}
                </div>
                {(errors.code1 ||
                  errors.code2 ||
                  errors.code3 ||
                  errors.code4 ||
                  errors.code5 ||
                  errors.code6) && (
                  <p className="text-red-500 text-xs mt-1">
                    Chaque case doit contenir un chiffre valide.
                  </p>
                )}
              </div>
              <span className="underline text-[#4a4949] text-xs flex justify-center items-center w-full my-2 ">Renvoyer le code</span>
              <div className="flex justify-center w-full items-center">
                <Button
                  type="submit"
                  className="w-full sm:w-[300px] bg-helloBlue hover:bg-helloBlue/90 rounded-full text-xs"
                >
                  Valider le compte
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;

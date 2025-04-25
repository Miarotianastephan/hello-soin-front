import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import logo from "../../assets/hs2.svg";

const CodeVerification = ({ onVerify, userEmail, resendCode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  // State to manage resend cooldown (in seconds)
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Setup viewport for mobile
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

  // Countdown effect for resend timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const code = Object.values(data).join('');
      await onVerify(code);
    } catch (error) {
      console.error("Échec de la vérification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) return;
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle resend click
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setIsLoading(true);
      await resendCode(userEmail);
      // Start 10-minute (600s) cooldown
      setResendTimer(600);
    } catch (error) {
      console.error("Erreur lors du renvoi du code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
        <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]" />
      </div>
      <div className="w-full max-w-md bg-white flex justify-center items-center flex-col rounded-md px-6 pt-4">
        <div className="text-center mb-4 w-full flex justify-center items-center">
          <div className="text-md mt-4 font-bold text-gray-900 mb-8">
            Confirmation du compte
          </div>
        </div>
        <div className="text-sm mt-4 font-medium text-gray-500 my-8 w-full">
          <p className="flex flex-col items-center justify-center gap-4 w-full">
            Un code de validation vous a été envoyé à l'adresse mail
            <span className="underline text-[#5DA781]">{userEmail}</span>
            <span>Saisir le code ci-dessous pour valider votre compte</span>
          </p>
        </div>
        <div className="w-full flex justify-center items-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5, 6].map((item, index) => {
                const reg = register(`code${item}`, {
                  required: "Chiffre requis",
                  pattern: { value: /^[0-9]$/, message: "Doit être un chiffre" },
                });

                return (
                  <input
                    key={item}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center border rounded"
                    name={reg.name}
                    onChange={(e) => {
                      reg.onChange(e);
                      handleInput(e, index);
                    }}
                    onBlur={reg.onBlur}
                    ref={(el) => {
                      reg.ref(el);
                      inputRefs.current[index] = el;
                    }}
                    placeholder="-"
                    disabled={isLoading}
                  />
                );
              })}
            </div>
            {(errors.code1 || errors.code2 || errors.code3 || errors.code4 || errors.code5 || errors.code6) && (
              <p className="text-red-500 text-xs text-center">
                Chaque case doit contenir un chiffre valide.
              </p>
            )}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                className="underline text-xs text-gray-600 mb-4"
                disabled={isLoading || resendTimer > 0}
              >
                {resendTimer > 0
                  ? `Renvoi possible dans ${formatTimer(resendTimer)}`
                  : "Renvoie du code"}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-helloBlue hover:bg-helloBlue/90 text-white rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "...chargement" : "Valider le compte"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;

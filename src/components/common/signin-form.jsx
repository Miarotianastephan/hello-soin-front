import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import logo from "../../assets/hs2.svg";
import FormProgressBar from "./FormProgressBar";

// Tableau des étapes (deux étapes)
const steps = [
  { id: 1, title: "Informations Personnelles", icon: User },
  { id: 2, title: "Informations de connexion", icon: Lock },
];

const SignInForm = ({ onAccountCreated }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm();

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← état de chargement

  // Champs requis pour l'étape 1 incluant code postal et ville
  const requiredFieldsStep1 = ["nom", "mail", "phone_number", "devise", "echence", "code_postale", "ville"];
  // Pour l'étape 2, seule la création du mot de passe est comptée
  const requiredFieldsStep2 = ["new_mot_de_passe"];
  const totalRequiredFields = requiredFieldsStep1.length + requiredFieldsStep2.length;

  // Observation des valeurs
  const step1Values = watch(requiredFieldsStep1);
  const passwordValue = watch("new_mot_de_passe", "");

  // Validation dynamique du mot de passe
  const validatePassword = (password) => {
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&-*]/.test(password),
    };
    setCriteria(newCriteria);
  };

  // Génère un mot de passe aléatoire respectant les critères
const generatePassword = () => {
  const upper     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower     = 'abcdefghijklmnopqrstuvwxyz';
  const numbers   = '0123456789';
  const specials  = '!@#$%^&*';
  const allChars  = upper + lower + numbers + specials;
  let pwd = '';
  // Assurer la présence d’au moins un de chaque
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += specials[Math.floor(Math.random() * specials.length)];
  // Compléter jusqu’à une longueur aléatoire entre 8 et 12 caractères
  const targetLen = 8 + Math.floor(Math.random() * 5);
  for (let i = pwd.length; i < targetLen; i++) {
    pwd += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return pwd;
};


  const handleGenerate = () => {
    const pwd = generatePassword();
    setValue('new_mot_de_passe', pwd, { shouldValidate: true });
    setValue('confirm_mot_de_passe', pwd, { shouldValidate: true });
    validatePassword(pwd);
  };

  useEffect(() => {
    validatePassword(passwordValue);
  }, [passwordValue]);

  // Calcul du pourcentage global de complétion
  useEffect(() => {
    let filled = step1Values.filter(Boolean).length;
    if (step === 2 && passwordValue) {
      filled += 1;
    }
    setProgress(Math.round((filled / totalRequiredFields) * 100));
  }, [step, step1Values, passwordValue, totalRequiredFields]);

  const onSubmit = async (data) => {
    try {
      // Validation supplémentaire avant envoi
      const isStep1Valid = await trigger(requiredFieldsStep1);
      const isStep2Valid = await trigger(requiredFieldsStep2);
      
      if (!(isStep1Valid && isStep2Valid)) return;

      // Appel du callback avec les données
      await onAccountCreated(data);

    } catch (error) {
      console.error("Erreur de soumission:", error);
    }
  };

    const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(requiredFieldsStep1);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["new_mot_de_passe", "confirm_mot_de_passe"]);
      if (isValid) {
        handleSubmit(onSubmit)(); // Déclenche la soumission finale
      }
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Composant de checkbox personnalisé pour les critères du mot de passe
  const CustomCheckbox = ({ checked }) => (
    <div className={`w-4 h-4 flex items-center justify-center border rounded-sm ${checked ? "bg-green-500 border-green-500" : "bg-white border-red-500"}`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );

  // Affichage des critères de vérification du mot de passe
  const CriteriaComponent = ({ criteria }) => (
    <ul className="text-xs space-y-4">
      <li className="flex items-center gap-2">
        <CustomCheckbox checked={criteria.length} />
        <span className={criteria.length ? "text-green-500" : "text-red-500"}>
          8 et 20 caractères (sans accents)
        </span>
      </li>
      <li className="flex items-center gap-2">
        <CustomCheckbox checked={criteria.uppercase} />
        <span className={criteria.uppercase ? "text-green-500" : "text-red-500"}>
          Au moins une lettre majuscule
        </span>
      </li>
      <li className="flex items-center gap-2">
        <CustomCheckbox checked={criteria.lowercase} />
        <span className={criteria.lowercase ? "text-green-500" : "text-red-500"}>
          Au moins une lettre minuscule
        </span>
      </li>
      <li className="flex items-center gap-2">
        <CustomCheckbox checked={criteria.number} />
        <span className={criteria.number ? "text-green-500" : "text-red-500"}>
          Au moins un chiffre
        </span>
      </li>
      <li className="flex items-center gap-2">
        <CustomCheckbox checked={criteria.specialChar} />
        <span className={criteria.specialChar ? "text-green-500" : "text-red-500"}>
          Au moins un caractère spécial (!@#$%^&*)
        </span>
      </li>
    </ul>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
        <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]"/>
      </div>
      <div className="w-full max-w-xl bg-white rounded-md px-6 my-6 pt-4">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-md mt-4 font-bold text-gray-900">
            Créer mon compte praticien
          </CardTitle>
          <FormProgressBar progress={progress} />
         
          <div className="hidden md:flex items-center pt-2 gap-4 justify-center">
            {steps.map(({ id, title }) => (
              <div key={id} className="flex items-center gap-2">
                <div className={cn("border w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold", step >= id ? "border-helloSoin text-helloSoin" : "border-helloGray text-helloGray")}>
                  {id}
                </div>
                <span className={step >= id ? "text-helloSoin text-xs" : "text-helloGray text-xs"}>{title}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="flex flex-col space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">
                      Nom<span className="text-red-500">*</span>
                    </Label>
                    <Input {...register("nom", { required: "Veuillez renseigner votre nom" })} placeholder="Entrer votre nom." className="text-xs placeholder:text-xs" />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">Prénom</Label>
                    <Input {...register("prenom")} placeholder="Entrer votre prénom." type="text" className="text-xs placeholder:text-xs" />
                  </div>
                </div>
                {/* Email et téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">
                      Adresse email<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("mail", {
                        required: "Vous devez remplir ce champ",
                        pattern: {
                          message: "Veuillez entrer un email valide",
                        },
                        maxLength: { value: 254, message: "L'email est trop long" },
                      })}
                      placeholder="Entrer votre adresse email."
                      className="text-xs placeholder:text-xs"
                    />
                    {errors.mail && <p className="text-red-500 text-xs mt-1">{errors.mail.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">
                      Numéro de téléphone<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="phone_number"
                      control={control}
                      rules={{ required: "Veuillez renseigner votre numéro de téléphone" }}
                      render={({ field: { onChange, value, ref } }) => (
                        <PhoneInput
                        country="fr"
                        localization="fr"
                        onlyCountries={["fr", "de", "be", "it", "lu", "ch"]}
                        value={value}
                        onChange={(phone) => onChange(`+${phone}`)}
                        inputProps={{
                          name: "phone_number",
                          required: true,
                          ref: ref,
                        }}
                        inputStyle={{ width: "100%", height: "20px", fontSize: "12px", border: "1px solid #e5e5e5" }}
                        containerClass="phone-input"
                        specialLabel=""
                      />
                      
                      )}
                    />
                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
                  </div>
                </div>
                {/* Civilité, spécialité, Code postal et Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col text-xs">
                    <Label className="text-xs text-gray-700 mb-1">
                      Civilité<span className="text-red-500">*</span>
                    </Label>
                    <select
                      {...register("devise", { required: "Veuillez renseigner votre civilité" })}
                      onChange={(e) => setValue("devise", e.target.value, { shouldValidate: true })}
                      value={watch("devise") || ""}
                      className="border text-gray-500 h-[35px] rounded px-2 py-1 text-xs w-full"
                    >
                      <option value="">Sélectionnez votre civilité</option>
                      <option value="Mr">Monsieur</option>
                      <option value="Mme">Madame</option>
                      <option value="Mlle">Mademoiselle</option>
                    </select>
                    {errors.devise && <p className="text-red-500 text-xs mt-1">{errors.devise.message}</p>}
                  </div>
                  <div className="flex flex-col text-xs">
                    <Label className="text-xs text-gray-700 mb-1">
                      Spécialité principale<span className="text-red-500">*</span>
                    </Label>
                    <select
                      {...register("echence", { required: "Veuillez renseigner votre spécialité principale" })}
                      onChange={(e) => setValue("echence", e.target.value, { shouldValidate: true })}
                      value={watch("echence") || ""}
                      className="border text-gray-500 h-[35px] rounded px-2 py-1 text-xs w-full"
                    >
                      <option value="">Spécialité principale</option>
                      <option value="meditation">Méditation</option>
                      <option value="yoga">Yoga</option>
                      <option value="sophrologie">Sophrologie</option>
                      <option value="naturopathie">Naturopathie</option>
                      <option value="reiki">Reiki</option>
                      <option value="massage">Massage bien-être</option>
                      <option value="aromatherapie">Aromathérapie</option>
                      <option value="reflexologie">Réflexologie</option>

                    </select>
                    {errors.echence && <p className="text-red-500 text-xs mt-1">{errors.echence.message}</p>}
                  </div>
                </div>
                {/* Code postal et Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">
                      Code postal<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("code_postale", { required: "Veuillez renseigner votre code postal" })}
                      placeholder="Entrer votre code postal"
                      className="text-xs placeholder:text-xs"
                    />
                    {errors.code_postale && <p className="text-red-500 text-xs mt-1">{errors.code_postale.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-gray-700 mb-1">
                      Ville<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("ville", { required: "Veuillez renseigner votre ville" })}
                      placeholder="Entrer une ville"
                      className="text-xs placeholder:text-xs"
                    />
                    {errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville.message}</p>}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={nextStep} type="button" className="w-full sm:w-[300px] bg-helloBlue hover:bg-helloBlue/90 rounded-full text-xs">
                    Suivant
                  </Button>
                </div>
              </div>
            )}

{step === 2 && (
    <div className="flex flex-col space-y-6">
      {/* Champ mot de passe */}
      <div>
        <Label className="text-xs text-gray-700 mb-1">
          Créer un mot de passe<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            {...register("new_mot_de_passe", { required: "Saisissez votre mot de passe" })}
            type={showPassword ? "text" : "password"}
            placeholder="Choisissez votre mot de passe"
            className="text-xs placeholder:text-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        {/* Lien de génération */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleGenerate(); }}
          className="ml-auto text-xs underline text-helloSoin float-right mt-1"
        >
          Générer un mot de passe
        </a>
        <div className="mt-6">
          <CriteriaComponent criteria={criteria} />
        </div>
      </div>

      {/* Champ confirmation */}
      <div>
        <Label className="text-xs text-gray-700 mb-1">
          Confirmer le mot de passe<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            {...register("confirm_mot_de_passe", {
              required: "Confirmer votre mot de passe !",
              validate: (v) => v === watch("new_mot_de_passe") || "Les mots ne correspondent pas",
            })}
            type={showPasswordConf ? "text" : "password"}
            placeholder="Confirmer votre mot de passe"
            className="text-xs placeholder:text-xs"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConf((p) => !p)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPasswordConf ? <Eye /> : <EyeOff />}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={prevStep} type="button" className="w-full sm:w-[300px] border-2 border-helloBlue bg-white text-helloBlue hover:bg-helloBlue hover:text-white rounded-full text-xs">
                    Retour
                  </Button>
                  <Button  onClick={nextStep} type="button" className="w-full sm:w-[300px] bg-helloBlue hover:bg-helloBlue/90 rounded-full text-xs">
                    {isLoading ? "Confirmer" : "...chargement"}
                  </Button>
                </div>
    </div>
  )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

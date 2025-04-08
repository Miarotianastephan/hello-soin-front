import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { User, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/style.css';
import 'react-phone-input-2/lib/material.css'
import { Option, Select } from "@material-tailwind/react";
import logo from "../../assets/hs2.svg";

const steps = [
  { id: 1, title: "Informations Personnelles", icon: User },
  { id: 2, title: "Information de connexion", icon: Lock },
];

// Checkbox perso
const CustomCheckbox = ({ checked }) => {
  return (
    <div
      className={`w-4 h-4 flex items-center justify-center border rounded-sm ${
        checked ? 'bg-green-500 border-green-500' : 'bg-white border-red-500'
      }`}
    >
      {checked && (
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
};


// Composant pour le critère de vérification
const CriteriaComponent = ({criteria}) => {
  return(
    <>
      <ul className="text-sm">
        <li className="flex items-center gap-2 w-full">
          <CustomCheckbox checked={criteria.length} />
          <span className={`${criteria.length ? 'text-green-500' : 'text-red-500'}`}>
            Avoir une longueur entre 8 et 20 caractères alphanumériques (sans accents)
          </span>
        </li>
        <li className="flex items-center gap-2">
          <CustomCheckbox checked={criteria.uppercase} />
          <span className={`${criteria.uppercase ? 'text-green-500' : 'text-red-500'}`}>Contenir au moins une lettre majuscule</span>
        </li>
        <li className="flex items-center gap-2">
          <CustomCheckbox checked={criteria.lowercase} />
          <span className={`${criteria.lowercase ? 'text-green-500' : 'text-red-500'}`}>Contenir au moins une lettre minuscule</span>
        </li>
        <li className="flex items-center gap-2">
          <CustomCheckbox checked={criteria.number} />
          <span className={`${criteria.number ? 'text-green-500' : 'text-red-500'}`}>Contenir au moins un chiffre</span>
        </li>
        <li className="flex items-center gap-2">
          <CustomCheckbox checked={criteria.specialChar} />
          <span className={`${criteria.specialChar ? 'text-green-500' : 'text-red-500'}`}>
            Contenir au moins un caractère spécial (!@#$%^&*)
          </span>
        </li>
      </ul>
    </>
  );
}

const SignInForm = () => {
  const navigate = useNavigate();
  const { control, register, handleSubmit, watch, formState: { errors }, trigger, setValue, } = useForm();
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [step, setStep] = useState(1);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  
  const password = watch('new_mot_de_passe', '');

  const validatePassword = (password) => {
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
    setCriteria(newCriteria);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const onSubmit = async (data) => {
    console.log("Données soumises :", data);
    // Ajout du fonction pour l'inscription
    try {
      const insertUser = "";
      console.log(insertUser);
    } catch (error) {
      console.error(error);
    }
    // navigate("/praticien/dashboard");
    // alert("Inscription réussie !");  
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["nom", "mail", "phone_number", "ville", "code_postale"]);
      if (isValid) setStep(2)
    } 
    else if (step === 2) {
      const isValid = await trigger([ "new_mot_de_passe", "confirm_mot_de_passe"]);
      if (isValid) setStep(3)
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Card className="max-w-3xl mx-auto w-full sm:p-6 md:p-8 relative">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-normal">
          Créer mon compte praticien
        </CardTitle>
        <div className="w-[300px] p-3 flex rounded-md shadow justify-center self-center">
          <Progress
            value={(step / steps.length) * 100}
            className="w-[60%]"
          />
        </div>
        <div className="flex flex-col items-center justify-center mb-3 gap-2">
          <div className="text-center text-sm">
            <Link
              to="/"
              className="fixed top-4 left-4 underline underline-offset-4"
            >
              <img src={logo} alt="Logo" className="h-6" />
              {/* Retour à l'accueil{" "} */}
            </Link>
          </div>
        </div>

        {/* Indicateur des étapes - Visible seulement sur écrans larges */}
        <div className="hidden md:flex items-center pt-2 gap-4">
          {steps.map(({ id, title }) => (
            <div key={id} className="flex flex-row items-center justify-center flex-1">
              <div
                className={cn(
                  "flex-none border w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold",
                  step >= id
                    ? "border-helloSoin text-helloSoin"
                    : "text-helloGray border-helloGray"
                )}
              >
                {id}
              </div>
              <span
                className={cn(
                  "text-sm ml-2 mr-2",
                  step >= id ? "text-helloSoin" : "text-helloGray"
                )}
              >
                {title}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/* Étape 1 */}
          {step === 1 && (
            <div className="flex flex-col space-y-4">
              {/* Nom et Prenom */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="grid gap-2">
                  <Label>Nom<span className="text-red-500">*</span></Label>
                  <Input
                    {...register("nom", {
                      required: "Veuillez renseigner votre nom",
                    })}
                    placeholder="Entrer votre nom."
                    className="w-full"
                  />
                  {errors.nom && (
                    <p className="m-0 text-balance text-left text-xs text-destructive">
                      {errors.nom.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Prénom</Label>
                  <Input
                    {...register("prenom")}
                    placeholder="Entrer votre prénom."
                    type="text"
                    className="w-full"
                  />
                </div>
              </div>
              {/* Email et Numero telephone */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <Label>Adresse email<span className="text-red-500">*</span></Label>
                  <Input
                    {...register("mail",{
                      required: 'Vous devez remplir ce champ',
                      pattern: {
                        // Expression régulière standard pour valider le format d'un email
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Veuillez entrer un email valide (ex: hellosoin@gmail.com)',
                      },
                      maxLength: {
                        value: 254,
                        message: "L'email est trop long"
                      },
                    })}
                    placeholder="Entrer votre adresse email."
                    className="w-full py-8"
                  />
                  {errors.mail && (
                    <p className="text-destructive text-xs">
                      {errors.mail.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Numéro de téléphone<span className="text-red-500">*</span></Label>
                  <Controller
                    name="phone_number"
                    control={control}
                    rules={{ required: "Veuillez renseigner votre numero de téléphone" }}
                    render={({ field: { onChange, value, ref } }) => (
                      <PhoneInput
                        country={'fr'}
                        localization={'fr'}
                        onlyCountries={['fr']}
                        value={value}
                        onChange={onChange}
                        inputProps={{
                          name: 'phone_number',
                          required: true,
                          ref: ref
                        }}
                        inputStyle={{ width: '100%'}}
                        specialLabel=""
                      />
                    )}
                  />
                  {errors.phone_number && (
                    <p className="text-destructive text-xs">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Civilite et  Specialite principale */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="flex flex-col gap-2">
                  <Label>Civilité<span className="text-red-500">*</span></Label>
                  <Select
                    variant="outlined"
                    label="Entrer votre civilité"
                    onChange={(value) =>
                      setValue("devise", value, { shouldValidate: true })
                    }
                    value={watch("devise")}
                  >
                    <Option value="devise_1">Euro</Option>
                  </Select>
                  <p className="text-balance text-left text-xs text-destructive">
                    {errors.devise?.message}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Specilité principale<span className="text-red-500">*</span></Label>
                  <Select
                    variant="outlined"
                    label="Duree d'echeance'"
                    onChange={(value) =>
                      setValue("echence", value, { shouldValidate: true })
                    }
                    value={watch("echence")}
                  >
                    <Option value="echence_1">1</Option>
                    <Option value="echence_2">2</Option>
                    <Option value="echence_3">3</Option>
                  </Select>
                  <p className="text-balance text-left text-xs text-destructive">
                    {errors.echence?.message}
                  </p>
                </div>
              </div>
              {/* Code postal et Ville */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <Label>Code postal</Label>
                  <Input
                    {...register("code_postale")}
                    placeholder="Entrer votre code postal"
                    className="w-full"
                  />
                  {errors.code_postale && (
                    <p className="text-red-500 text-sm">
                      {errors.code_postale.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Ville</Label>
                  <Input
                    {...register("ville")}
                    placeholder="Entrer une ville"
                    className="w-full"
                  />
                  {errors.ville && (
                    <p className="text-red-500 text-sm">
                      {errors.ville.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div className="grid gap-2">
                <Label>Date de naissance</Label>
                <Input
                  {...register("date_naissance")}
                  type="date"
                  className="w-full"
                />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="profile_image_input" className="cursor-pointer w-max p-3 border border-helloGray rounded-lg text-center">Choisir un photo de profil</Label>
                <input
                  id="profile_image_input"
                  type="file"
                  accept="image/*"
                  {...register("profile_image")}
                  onChange={(e) => {
                    handleImageChange(e);
                    register("profile_image").onChange(e);
                  }}
                  className="hidden"
                />
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Aperçu de la photo de profil"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div  className="h-24 w-24 rounded-lg border-2 border-dashed border-helloBlue flex items-center justify-center">
                    <span className="text-helloBlue text-sm font-bold">Photo vide</span>
                  </div>
                )}
              </div> */}
              <Button
                onClick={nextStep}
                type="button"
                className="w-[300px]  bg-helloBlue rounded-full"
              >
                Suivant
              </Button>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col gap-4 mb-2">
                <div>
                  <Label>Créer un mot de passe<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      {...register("new_mot_de_passe", {
                        required: "Saisissez votre mot de passe",
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Choisissez votre mot de passe"
                      className="w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <Eye className="h-4 w-4 bg-gray-100" /> : <EyeOff className="h-4 w-4 bg-gray-100" />}
                    </button>
                    {errors.new_mot_de_passe && (
                      <p className="text-destructive text-xs">
                        {errors.new_mot_de_passe.message}
                      </p>
                    )}
                  </div>
                  <a href="#" className="ml-auto text-sm underline-offset-2 underline text-helloSoin float-right">
                    Générer un mot de passe
                  </a>
                  {/* Vérification des critères */}
                  <div className="mt-8">
                    <CriteriaComponent criteria={criteria} />
                  </div>
                </div>
                <div>
                  <Label>Confirmer le mot de passe<span className="text-red-500">*</span></Label>
                  <div className="relative">
                  <Input
                    {...register("confirm_mot_de_passe", {
                      required: "Confirmer votre mot de passe !",
                      validate: value =>
                        value === watch("new_mot_de_passe") || "Les mots de passe ne correspondent pas",
                    })}
                    type={showPasswordConf ? "text" : "password"}
                    placeholder="Confirmer votre mot de passe"
                    className="w-full"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordConf(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswordConf ? <Eye className="h-4 w-4 bg-gray-100" /> : <EyeOff className="h-4 w-4 bg-gray-100" />}
                  </button>
                  {errors.confirm_mot_de_passe && (
                    <p className="text-destructive text-xs">
                      {errors.confirm_mot_de_passe.message}
                    </p>
                  )}
                  </div>
                </div>
              </div>
              <div className="flex justify-around gap-4">
                <Button
                  onClick={prevStep}
                  type="button"
                  className="w-[300px] border-2 bg-white text-helloBlue border-helloBlue hover:bg-helloBlue hover:text-white rounded-full"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="w-[300px] bg-helloBlue rounded-full"
                >
                  Confirmer
                </Button>
              </div>
            </div>
          )}
          
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;

import { useState } from "react";
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

const steps = [
  { id: 1, title: "Infos Personnelles", icon: User },
  { id: 2, title: "Coordonnees", icon: Lock },
  { id: 3, title: "Securite et Authetification", icon: CheckCircle },
  { id: 4, title: "Finalisation", icon: CheckCircle },
];

const SignInForm = () => {
  const { control, register, handleSubmit, watch, formState: { errors }, trigger, setValue, } = useForm();
  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Données soumises :", data);
    // Ajout du fonction pour l'inscriptionj
    navigate("/praticien/dashboard");
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
      const isValid = await trigger(["nom", "prenom", "date_naissance"]);
      if (isValid) setStep(2)
    } 
    else if (step === 2) {
      const isValid = await trigger(["adresse", "ville", "code_postale", "phone_number"]);
      if (isValid) setStep(3)
    }
    else if (step === 3) {
      const isValid = await trigger(["mail", "new_mot_de_passe", "confirm_mot_de_passe"]);
      if (isValid) setStep(4)
    }
  };


  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Card className="max-w-3xl mx-auto w-full sm:p-6 md:p-8 relative">
      <CardHeader className="text-center text-2xl font-normal">
        <CardTitle className="">Inscription</CardTitle>
        <div className="flex flex-col items-center justify-center mb-3 gap-2">
          <div className="text-center text-sm">
            <Link
              to="/"
              className="absolute bottom-4 left-4 underline underline-offset-4"
            >
              Retour à l'accueil{" "}
            </Link>
          </div>
          <div className="text-center text-sm">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Log In
            </Link>
          </div>
        </div>
        <Progress
          value={(step / steps.length) * 100}
          className="sm:hidden mt-2"
        />

        {/* Indicateur des étapes - Visible seulement sur écrans larges */}
        <div className="hidden md:flex justify-between items-center pt-2 gap-4">
          {steps.map(({ id, title }) => (
            <div key={id} className="flex flex-row items-center flex-1">
              <div
                onClick={() => {
                  setStep(id);
                }}
                className={cn(
                  "flex-none border-2 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full ",
                  step >= id
                    ? "border-helloBlue text-helloBlue"
                    : "text-helloGray border-helloGray"
                )}
              >
                {id}
              </div>
              <span
                className={cn(
                  "text-sm ml-2 mr-2",
                  step >= id ? "text-helloBlue" : "text-helloGray"
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
            <div className="flex flex-col space-y-3">
              <div className="grid gap-2">
                <Label>Nom*</Label>
                <Input
                  {...register("nom", {
                    required: "Veuillez renseigner votre nom",
                  })}
                  placeholder="Nom"
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
                  placeholder="Email"
                  type="text"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label>Date de naissance</Label>
                <Input
                  {...register("date_naissance")}
                  type="date"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
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
                  <div  className="h-24 w-24 rounded-lg border border-dashed border-helloGray flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Photo vide</span>
                  </div>
                )}
              </div>
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
              <div className="grid gap-2">
                <Label>Adresse</Label>
                <Input
                  {...register("adresse")}
                  placeholder="Entrer votre adresse"
                  className="w-full"
                />
                {errors.adresse && (
                  <p className="text-red-500 text-sm">
                    {errors.adresse.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ville</Label>
                  <Input
                    {...register("ville")}
                    placeholder="Entrer votre ville"
                    className="w-full"
                  />
                  {errors.ville && (
                    <p className="text-red-500 text-sm">
                      {errors.ville.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Code Postale</Label>
                  <Input
                    {...register("code_postale")}
                    placeholder="Entrer votre code postale"
                    className="w-full"
                  />
                  {errors.code_postale && (
                    <p className="text-red-500 text-sm">
                      {errors.code_postale.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Numéro de téléphone*</Label>
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
              <div className="flex justify-around gap-4">
                <Button
                  onClick={prevStep}
                  type="button"
                  className="w-[300px] border-2 bg-white text-helloBlue border-helloBlue hover:bg-helloBlue hover:text-white rounded-full"
                >
                  Retour
                </Button>
                <Button
                  onClick={nextStep}
                  type="button"
                  className="w-[300px] bg-helloBlue rounded-full"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
          {/* Étape 3 */}
          {step === 3 && (
            <div className="flex flex-col space-y-3">
              <div className="grid gap-2">
                <Label>Email*</Label>
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
                  placeholder="Entrer votre mail"
                  className="w-full"
                />
                {errors.mail && (
                  <p className="text-destructive text-xs">
                    {errors.mail.message}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Creer un mot de passe*</Label>
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
                </div>
                <div>
                  <Label>Confirmer le mot de passe*</Label>
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
                    {showPassword ? <Eye className="h-4 w-4 bg-gray-100" /> : <EyeOff className="h-4 w-4 bg-gray-100" />}
                  </button>
                  {errors.confirm_mot_de_passe && (
                    <p className="text-destructive text-xs">
                      {errors.confirm_mot_de_passe.message}
                    </p>
                  )}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Numero de CIRET</Label>
                <Input
                  {...register("ciret_number")}
                  type="number"
                  placeholder="Entrer votre adresse"
                  className="w-full"
                />
                {errors.ciret_number && (
                  <p className="text-destructive text-xs">
                    {errors.ciret_number.message}
                  </p>
                )}
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
                  onClick={nextStep}
                  type="button"
                  className="w-[300px] bg-helloBlue rounded-full"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Étape 4 */}
          {step === 4 && (
            <div className="flex flex-col space-y-3">
              
              {/* type de devise */}
              <div className="flex flex-col gap-1">
                <Select
                  variant="outlined"
                  label="Type de devise"
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
              <div className="flex flex-col gap-1">
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
              <div className="flex justify-between">
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

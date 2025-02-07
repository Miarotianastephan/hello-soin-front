import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { User, Lock, CheckCircle } from "lucide-react";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";

const steps = [
  { id: 1, title: "Infos Personnelles", icon: User },
  { id: 2, title: "Coordonnees", icon: Lock },
  { id: 3, title: "Securite et Authetification", icon: CheckCircle },
  { id: 4, title: "Finalisation", icon: CheckCircle },
];

const SignInForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);

  const onSubmit = (data) => {
    console.log("Données soumises :", data);
    alert("Inscription réussie !");
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Card className="max-w-3xl mx-auto w-full p-4 sm:p-6 md:p-8">
      <CardHeader className="text-center text-2xl font-bold">
        <CardTitle >Creer un compte - Étape {step}/{steps.length}</CardTitle>
        <Progress value={(step / steps.length) * 100} className="sm:hidden mt-2" />
        <div className="text-center text-sm mt-4">
            Vous avez deja un compte?{" "}
            <Link to="/login" className="underline underline-offset-4">
                Connectez-vous
            </Link>
        </div>
      
      {/* Indicateur des étapes - Visible seulement sur écrans larges */}
      <div className="hidden md:flex justify-between items-center mt-2 p-6  gap-4">
        {steps.map(({ id, title }) => (
          <div key={id} className="flex flex-col items-center">
            <div
                onClick={() => {setStep(id)}} 
                className={cn(
                    "cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white font-bold",
                    step >= id ? "bg-blue-500" : "bg-gray-400"
                )}
            >
              {id}
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                step >= id ? "text-blue-500" : "text-gray-400"
              )}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
      </CardHeader>

      <CardContent >
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/* Étape 1 */}
          {step === 1 && (
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-bold text-blue-500">Infos Personnelles</h2>
              <div className="grid gap-2">
                <Label>Nom</Label>
                <Input {...register("nom", { required: "Nom requis" })} placeholder="Nom" className="w-full" />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Prenom</Label>
                <Input {...register("prenom", { required: "Email requis" })} placeholder="Email" type="text" className="w-full" />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Date de naissance</Label>
                <Input {...register("date_naissance", { required: "Email requis" })} type="date" className="w-full" />
                {errors.date_naissance && <p className="text-red-500 text-sm">{errors.date_naissance.message}</p>}
              </div>
              <Button onClick={nextStep} type="button" className="w-max">Suivant</Button>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-bold text-blue-500">Coordonnees</h2>
              
              <div className="grid gap-2">
              <Label>Adresse</Label>
                <Input {...register("adresse", { required: "Information requise" })} placeholder="Entrer votre adresse" className="w-full" />
                {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Ville</Label>
                    <Input {...register("ville", { required: "Information requise" })} placeholder="Entrer votre ville" className="w-full" />
                    {errors.ville && <p className="text-red-500 text-sm">{errors.ville.message}</p>}
                </div>
                <div>
                    <Label>Code Postale</Label>
                    <Input {...register("code_postale", { required: "Information requise" })} placeholder="Entrer votre code postale" className="w-full" />
                    {errors.code_postale && <p className="text-red-500 text-sm">{errors.code_postale.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
              <Label>Numero telephone</Label>
                <Input {...register("phone_number", { required: "Information requise" })} type="number" placeholder="Entrer votre adresse" className="w-full" />
                {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
              </div>
              <div className="flex justify-between">
                <Button onClick={prevStep} type="button">Retour</Button>
                <Button onClick={nextStep} type="button">Suivant</Button>
              </div>
            </div>
          )}
          {/* Étape 3 */}
          {step === 3 && (
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-bold text-blue-500">Securite et Authetification</h2>
              
              <div className="grid gap-2">
              <Label>Email*</Label>
                <Input {...register("mail", { required: "Information requise" })} placeholder="Entrer votre mail" className="w-full" />
                {errors.mail && <p className="text-red-500 text-sm">{errors.adresse.message}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Creer un mot de passe*</Label>
                    <Input {...register("new_mot_de_passe", { required: "Information requise" })} type="password" placeholder="Choisissez votre mot de passe" className="w-full" />
                    {errors.new_mot_de_passe && <p className="text-red-500 text-sm">{errors.ville.message}</p>}
                </div>
                <div>
                    <Label>Confirmer le mot de passe*</Label>
                    <Input {...register("confirm_mot_de_passe", { required: "Information requise" })} type="password" placeholder="Confirmer votre mot de passe" className="w-full" />
                    {errors.confirm_mot_de_passe && <p className="text-red-500 text-sm">{errors.confirm_mot_de_passe.message}</p>}
                </div>
              </div>
              <div className="grid gap-2">
              <Label>Numero de CIRET*</Label>
                <Input {...register("ciret_number", { required: "Information requise" })} type="number" placeholder="Entrer votre adresse" className="w-full" />
                {errors.ciret_number && <p className="text-red-500 text-sm">{errors.ciret_number.message}</p>}
              </div>
              <div className="flex justify-between">
                <Button onClick={prevStep} type="button">Retour</Button>
                <Button onClick={nextStep} type="button">Suivant</Button>
              </div>
            </div>
          )}

          {/* Étape 4 */}
          {step === 4 && (
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-bold text-blue-500">✅ Confirmation</h2>
              <p><strong>Nom :</strong> {watch("nom")}</p>
              <p><strong>Email :</strong> {watch("email")}</p>
              <p><strong>Nom d'utilisateur :</strong> {watch("username")}</p>
              <div className="flex justify-between">
                <Button onClick={prevStep} type="button">Retour</Button>
                <Button type="submit">Confirmer</Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;

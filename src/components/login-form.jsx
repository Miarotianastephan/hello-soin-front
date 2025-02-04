import logo_login from '@/assets/login_illu.jpg'
import LoginOptions from "./login-options"
import { api_login, setLocalData } from "@/services/api"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"

import { useState } from "react"
import { useForm  } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

export const LoginForm = ({ className, ...props }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, } = useForm();
  const resetForm = () => {} // a completer
  const onSubmit =  (data) => { 
    console.log(data) 
    // alert("Login submited !!");
    // setLoading(true);
    // try {
    //   const response = await api_login(data);
    //   setMessage(response.message);

    //   setTimeout(() => {
    //     setLocalData("token",response.token);
    //     setLocalData("user_data",response.user);
    //     setLoading(false);
    //     navigate("/"); // page d'acceuil
    //   }, 1000);
      

    // } catch (error) {
    //   setMessage(error);
    //   setLoading(false);
    // } finally {
    //   resetForm();
    //   console.log(message);
    // }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="">
          {/* LOGIN section */}
          <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Hello Soin Space</h1>
                  <p className="text-balance text-muted-foreground">
                      Connexion avec votre compte Hello Soin !
                  </p>
                </div>
                <LoginOptions />
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                      {...register("user_mail",{
                        required: 'Vous devez remplir ce champ'
                      })}
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                  />
                  <p className="text-balance text-left text-xs text-muted-foreground">{errors.user_mail?.message}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Mot de passe oublié ?
                    </a>
                  </div>
                    <Input 
                      {...register("mot_de_passe",{
                        required: 'Vous devez remplir ce champ',
                        minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                        maxLength: { value: 20, message: "Le mot de passe ne peut pas dépasser 20 caractères" },
                      })} 
                      id="password" 
                      type="password" 
                    />
                    <p className="text-balance text-left text-xs text-muted-foreground">{errors.mot_de_passe?.message}</p>
                </div>
                <Button type="submit" className="w-full">
                  {loading ? '...Connexion' : 'Se connecter' }
                </Button>
            </div>
            <div className="text-center text-sm mt-4">
                Vous n&apos;avez pas de compte?{" "}
                <Link to="/signin" className="underline underline-offset-4">
                    Inscrivez-vous
                </Link>
            </div>
          </form>
          {/* Fin section Login */}
        </CardContent>
      </Card>
    </div>
  );
}

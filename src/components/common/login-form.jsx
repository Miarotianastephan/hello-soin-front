import logo_login from '@/assets/login_illu.jpg'
import LoginOptions from "./login-options"
import { setLocalData } from '@/services/common-services'
import { login_user } from "@/services/api"
import { AlertCircle, X } from "lucide-react"
import Logo from './icone/googleIcon.png'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Checkbox } from '../ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'

export const LoginForm = ({ className, ...props }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);

  const onSubmit = async (data) => { 
    setLoading(true);
    try {
      const response = await login_user(data.user_mail, data.mot_de_passe);
      console.log(response);
      setTimeout(() => {
        setLocalData("token", response.token);
        setLoading(false);
        navigate("/praticien/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(error);
      setVisible(true);
      setLoading(false);
    } 
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setVisible(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <AlertTitle className="text-xl font-bold">Erreur d'authentification</AlertTitle>
              <button onClick={() => setVisible(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <AlertDescription className="text-destructive">
              {message}
            </AlertDescription>
          </div>
        </div>
      )}
      <div className="overflow-hidden">
        <div className="">
          {/* LOGIN section */}
          <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="p-6 md:p-8 relative"
          >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg text-gray-900 font-bold">Mon éspace praticien</h1>
                </div>
                <LoginOptions />
                <div className="grid gap-2 text-xs text-gray-700">
                  <Label htmlFor="email">Adresse email <span className="text-red-700">*</span></Label>
                  <Input 
                      {...register("user_mail",{
                        required: 'Vous devez remplir ce champ',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Veuillez entrer un email valide (ex: hellosoin@gmail.com)',
                        },
                        maxLength: {
                          value: 254,
                          message: "L'email est trop long"
                        },
                      })}
                      id="email" 
                      type="email"
                      placeholder="email"
                      className="text-sm"
                  />
                  <p className="text-balance text-left text-xs text-destructive">{errors.user_mail?.message}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center text-gray-700">
                    <Label htmlFor="password">Mot de passe  <span className="text-red-700">*</span></Label>
                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline text-helloSoin">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative text-xs">
                    <Input 
                      {...register("mot_de_passe", {
                        required: 'Vous devez remplir ce champ',
                        minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                        maxLength: { value: 20, message: "Le mot de passe ne peut pas dépasser 20 caractères" },
                      })}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      className="text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <Eye className="h-4 w-4 bg-gray-100" /> : <EyeOff className="h-4 w-4 bg-gray-100" />}
                    </button>
                  </div>
                  <p className="text-balance text-left text-xs text-destructive">{errors.mot_de_passe?.message}</p>
                </div>
                <div className="flex items-center space-x-2"> 
                  <Checkbox id="terms" className="checked:bg-red-500" />
                  <label
                    htmlFor="terms"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <Button type="submit" className="w-full rounded-lg shadow-none hover:bg-green-400 bg-[#5DA781]">
                  {loading ? '...Connexion' : 'Se connecter' }
                </Button>
            </div>
            <div className='flex flex-col items-center justify-center mt-2 gap-2'>
              <div className="text-center text-sm">
                Vous n&apos;avez pas de compte?{" "}
                <Link to="/signin" className="text-helloSoin">
                  Inscrivez-vous{" "}
                </Link>
              </div>
            </div>
          </form>
          {/* Fin section Login */}
        </div>
      </div>
    </div>
  );
}

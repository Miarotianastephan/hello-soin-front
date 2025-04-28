import React, { useState, useEffect } from 'react'
import logo_login from '@/assets/login_illu.jpg'
import LoginOptions from './login-options'
import { setLocalData } from '@/services/common-services'
import { login_user } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/Checkbox'
import { Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'

export const LoginForm = ({ className, ...props }) => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  // Nouveaux états pour le dialogue de succès
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await login_user(data.user_mail, data.mot_de_passe)
      await setLocalData('token', response.token)
      await setLocalData('user', JSON.stringify(response.user))
      // Préparer le dialogue de bienvenue
      setUserEmail(response.user.email || data.user_mail)
      setSuccessDialogOpen(true)
    } catch (error) {
      // Affiche le dialogue si le compte est introuvable
      setMessage(error.message || 'Une erreur est survenue')
      setDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]")
    const contentValue =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    if (viewport) {
      viewport.setAttribute("content", contentValue)
    } else {
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = contentValue
      document.head.appendChild(meta)
    }
  }, [])

  return (
    <>
      {/* Dialogue de bienvenue après connexion réussie */}
      <Dialog
        open={successDialogOpen}
        onOpenChange={(open) => {
          setSuccessDialogOpen(open)
          if (!open) navigate('/praticien/premierPas')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bienvenue {userEmail}</DialogTitle>
            <DialogDescription className="text-xs">
              Vous êtes connecté avec succès.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="text-xs bg-green-600 rounded">Continuer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog ShadCN pour compte introuvable */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Compte introuvable</DialogTitle>
            <DialogDescription className="text-xs">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="text-xs bg-red-800 rounded">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 relative">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-lg text-gray-900 font-bold">Mon espace praticien</h1>
            </div>

            <LoginOptions />

            <div className="grid gap-2 text-xs text-gray-700">
              <Label htmlFor="email">
                Adresse email <span className="text-red-700">*</span>
              </Label>
              <Input
                {...register('user_mail', {
                  required: 'Vous devez remplir ce champ',
                  pattern: {
                    message: 'Veuillez entrer un email valide (ex: hellosoin@gmail.com)',
                  },
                  maxLength: { value: 254, message: "L'email est trop long" },
                })}
                id="email"
                type="email"
                placeholder="email"
                className="text-sm"
              />
              <p className="text-left text-xs text-destructive">
                {errors.user_mail?.message}
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center text-gray-700">
                <Label htmlFor="password">
                  Mot de passe <span className="text-red-700">*</span>
                </Label>
              </div>
              <div className="relative text-xs">
                <Input
                  {...register('mot_de_passe', {
                    required: 'Vous devez remplir ce champ',
                    minLength: { value: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
                    maxLength: { value: 20, message: 'Le mot de passe ne peut pas dépasser 20 caractères' },
                  })}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  className="text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-left text-xs text-destructive">
                {errors.mot_de_passe?.message}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-xs font-medium leading-none">
                Se souvenir de moi
              </label>
            </div>

            <Button type="submit" className="w-full rounded-lg bg-[#5DA781]">
              {loading ? '...Connexion' : 'Se connecter'}
            </Button>

            <div className="flex items-center justify-center mt-2 gap-2 text-sm">
              Vous n'avez pas de compte?{' '}
              <Link to="/signin" className="text-helloSoin">
                Inscrivez-vous
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

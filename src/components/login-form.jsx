import { cn } from "@/lib/utils"
import { useNavigate} from "react-router-dom"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo_login from '@/assets/login_illu.jpg'
import { api_login, setLocalData } from "@/services/api"
import LoginOptions from "./login-options"

export const LoginForm = ({ className, ...props }) => {
  // Pour manipuler le formulaire de login
  const formRef = useRef();
  // Pour eviter cliquer deux fois bouton login
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    user_mail: '',
    mot_de_passe: '',
  })

  const initForm = () => {
    setForm({
      user_mail: '',
      mot_de_passe: ''
    })
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({ ...form, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api_login(form.user_mail, form.mot_de_passe);
      setMessage(response.message);

      setTimeout(() => {
        setLocalData("token",response.token);
        setLocalData("user_data",response.user);
        setLoading(false);
        navigate("/"); // page d'acceuil
      }, 1000);
      

    } catch (error) {
      setMessage(error);
      setLoading(false);
    } finally {
      initForm();
      console.log(message);
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form 
            ref={formRef} 
            onSubmit={handleSubmit} 
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Hello Soin Space</h1>
                <p className="text-balance text-muted-foreground">
                  Connexion avec votre compte Hello Soin !
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  name="user_mail" 
                  value={form.user_mail} 
                  onChange={handleChange} 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
                <Input 
                  name="mot_de_passe" 
                  value={form.mot_de_passe} 
                  onChange={handleChange} 
                  id="password" 
                  type="password" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                {loading ? '...Connexion' : 'Se connecter' }
              </Button>
              <LoginOptions />
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={logo_login}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div
        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        En créant votre compte, vous acceptez nos règles  <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

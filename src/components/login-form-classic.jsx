import { Button } from "./ui/button";
import { useNavigate} from "react-router-dom"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api_login, setLocalData } from "@/services/api"
import LoginOptions from "./login-options"


const LoginClassic = () => {
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
      alert("Login submited !!");
      // setLoading(true);
      // try {
      //   const response = await api_login(form.user_mail, form.mot_de_passe);
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
      //   initForm();
      //   console.log(message);
      // }
    }

    return(
        <>
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
                <LoginOptions />
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
            </div>
            <div className="text-center text-sm mt-4">
                Vous n&apos;avez pas de compte?{" "}
                <a href="#" className="underline underline-offset-4">
                    Inscrivez-vous
                </a>
            </div>
            </form>
        </>
    );
}
export default LoginClassic;
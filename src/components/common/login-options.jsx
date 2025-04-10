import { Button } from "@/components/ui/button";
import Logo from './icone/googleIcon.png';

const LoginOptions = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <Button variant="outline" className="text-sm w-full rounded-full border-2 border-gray-700 flex items-center justify-center">
          <img src={Logo} alt="Google Icon" className="mr-2 w-6 h-6" />
          <span>Continuer avec Google</span>
        </Button>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-sm text-muted-foreground">
          Ou 
        </span>
      </div>
    </>
  );
};

export default LoginOptions;

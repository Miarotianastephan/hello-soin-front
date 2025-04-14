import { LoginForm } from "@/components/common/login-form"
import logo from "../../assets/hs2.svg";

export default function LoginPage() {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-white">
        <div className="fixed top-0 w-full flex items-center justify-start bg-white z-50">
          <img src={logo} className="mt-2 px-4 w-[130px] h-[40px]"/>
        </div>
      <div className="w-full max-w-sm md:max-w-lg">
        <LoginForm className=""/>
      </div>
    </div>
  );
}

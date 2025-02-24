import { LoginForm } from "@/components/common/login-form"

export default function LoginPage() {
  return (
    <div className="flex w-full min-h-svh flex-col items-center justify-center gap-6 bg-gray-100">
      <div className="w-full max-w-sm md:max-w-lg">
        <LoginForm className=""/>
      </div>
    </div>
  );
}

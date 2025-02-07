//SignInPage
import SignInForm from "@/components/common/signin-form";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="max-w-sm md:max-w-3xl">
        <SignInForm className=""/>
      </div>
    </div>
  );
}

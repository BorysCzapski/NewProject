import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Phoenix
          </Link>
          <p className="mt-2 text-foreground-muted">Załóż konto i wybierz swój poziom</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

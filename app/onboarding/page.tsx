import { OnboardingForm } from "@/components/auth/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Jaki jest Twój poziom?</h1>
          <p className="mt-2 text-foreground-muted">
            Dopasujemy słówka, gramatykę i teksty do Ciebie. Poziom możesz później zmienić w
            profilu.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}

// ============================================================================
// app/schola/brak-dostepu/page.tsx
// Reached when someone is authenticated (usually via an existing Phoenix
// account, since auth.users is shared — see supabase/migrations/
// 0009_schola.sql) but has no schola_members row yet. Distinct from "not
// logged in at all", which goes to /schola/logowanie instead — see
// lib/schola/get-member.ts's requireScholaMember().
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JoinScholaForm } from "@/components/schola/join-form";
import { scholaLogout } from "@/lib/schola/auth-actions";
import { Button } from "@/components/ui/button";

export default async function ScholaNoAccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/schola/logowanie");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-primary">Schola</span>
          <p className="mt-2 text-foreground-muted">
            Jesteś zalogowany jako <strong>{user.email}</strong>, ale to konto nie należy jeszcze do
            Scholi. Podaj swoje imię i nazwisko, żeby dołączyć.
          </p>
        </div>
        <JoinScholaForm />
        <form action={scholaLogout} className="mt-4">
          <Button type="submit" variant="ghost" className="w-full">
            Wyloguj
          </Button>
        </form>
      </div>
    </div>
  );
}

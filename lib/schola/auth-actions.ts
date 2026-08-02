"use server";
// ============================================================================
// lib/schola/auth-actions.ts
// Server Actions backing the Schola login/register/join forms. Mirrors
// lib/actions/auth.ts's ActionState/useActionState pattern (not
// ActionResult) since these back plain progressive-enhancement forms.
//
// Schola is a separate realm from Phoenix but shares the same Supabase Auth
// (auth.users) — see supabase/migrations/0009_schola.sql's header comment.
// A Schola signup also silently creates an unused Phoenix `profiles` row
// via 0001_init.sql's handle_new_user() trigger; deliberately not touched,
// it's shared, live, working Phoenix infra and the side effect is inert.
// ============================================================================
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ScholaActionState {
  error?: string;
}

export async function scholaRegister(
  _prevState: ScholaActionState,
  formData: FormData
): Promise<ScholaActionState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (displayName.length < 2) {
    return { error: "Podaj swoje imię i nazwisko (co najmniej 2 znaki)." };
  }
  if (!email.includes("@")) {
    return { error: "Podaj prawidłowy adres e-mail." };
  }
  if (password.length < 8) {
    return { error: "Hasło musi mieć co najmniej 8 znaków." };
  }
  if (password !== passwordConfirm) {
    return { error: "Hasła nie są identyczne." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { schola_display_name: displayName, schola_pending_member: true } },
  });

  if (error) {
    return {
      error: error.message.includes("already registered")
        ? "Konto z tym adresem e-mail już istnieje. Zaloguj się zamiast rejestracji."
        : "Nie udało się utworzyć konta. Spróbuj ponownie.",
    };
  }
  if (!data.user) {
    return { error: "Nie udało się utworzyć konta. Spróbuj ponownie." };
  }

  if (!data.session) {
    return {
      error: "Konto utworzone! Sprawdź swoją skrzynkę e-mail i potwierdź adres, aby się zalogować.",
    };
  }

  const { error: memberError } = await supabase
    .from("schola_members")
    .insert({ id: data.user.id, display_name: displayName });
  if (memberError) {
    console.error("[schola] member insert on register failed:", memberError);
    return {
      error: "Konto utworzone, ale nie udało się dołączyć do Scholi. Spróbuj się zalogować ponownie.",
    };
  }

  redirect("/schola");
}

export async function scholaLogin(
  _prevState: ScholaActionState,
  formData: FormData
): Promise<ScholaActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectToRaw = String(formData.get("redirectTo") ?? "/schola");
  // Only ever redirect back within /schola/* — a stray "/login" or an
  // absolute external URL must never end up here.
  const redirectTo = redirectToRaw.startsWith("/schola") ? redirectToRaw : "/schola";

  if (!email || !password) {
    return { error: "Podaj e-mail i hasło." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: "Nieprawidłowy e-mail lub hasło." };
  }

  // Lazy-provision: closes the gap where signUp() didn't return a session
  // yet (email confirmation required) and so no schola_members row was
  // created at registration time. Only accounts created via
  // scholaRegister ever carry this metadata flag, so this can never
  // silently promote an arbitrary Phoenix-only account.
  if (data.user.user_metadata?.schola_pending_member === true) {
    const { data: existing } = await supabase
      .from("schola_members")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!existing) {
      const displayName =
        (data.user.user_metadata?.schola_display_name as string | undefined) ||
        data.user.email?.split("@")[0] ||
        "Członek scholi";
      await supabase.from("schola_members").insert({ id: data.user.id, display_name: displayName });
    }
    await supabase.auth.updateUser({ data: { schola_pending_member: false } });
  }

  redirect(redirectTo);
}

/** For an already-authenticated (typically Phoenix) user who isn't a
 * Schola member yet — see app/schola/brak-dostepu/page.tsx. No signUp/
 * signIn here at all, just linking membership to the current session. */
export async function joinScholaAsExistingUser(
  _prevState: ScholaActionState,
  formData: FormData
): Promise<ScholaActionState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (displayName.length < 2) {
    return { error: "Podaj swoje imię i nazwisko (co najmniej 2 znaki)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/schola/logowanie");

  const { error } = await supabase
    .from("schola_members")
    .insert({ id: user.id, display_name: displayName });
  if (error) {
    console.error("[schola] joinScholaAsExistingUser failed:", error);
    return { error: "Nie udało się dołączyć do Scholi. Spróbuj ponownie." };
  }

  redirect("/schola");
}

/** Not a reuse of lib/actions/auth.ts's logout() — that one hardcodes
 * redirect("/login"), which would dump a Schola-only user onto a Phoenix
 * login page for an app they've never used. */
export async function scholaLogout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/schola/logowanie");
}

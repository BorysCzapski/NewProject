"use server";

// ============================================================================
// lib/actions/auth.ts
// Server Actions backing the login/register/onboarding/profile forms. Kept
// as actions (not route handlers) so forms can progressively enhance via
// useActionState and rely on Next.js's built-in redirect().
// ============================================================================
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserLevel } from "@/lib/types/database";

export interface ActionState {
  error?: string;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,24}$/;

/** Resolves a login "identifier" (email or username) to an email address. */
async function resolveEmail(identifier: string): Promise<{ email: string | null; debug?: string }> {
  if (identifier.includes("@")) return { email: identifier };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("email")
    .eq("username", identifier)
    .maybeSingle();

  if (error) return { email: null, debug: `lookup error: ${error.message}` };
  return { email: data?.email ?? null };
}

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!identifier || !password) {
    return { error: "Podaj login/e-mail i hasło." };
  }

  const { email, debug } = await resolveEmail(identifier);
  if (!email) {
    // TEMPORARY: surfaces the real cause instead of a generic message, to
    // diagnose a production-only login failure. Revert once resolved.
    return {
      error: debug
        ? `[DEBUG] ${debug}`
        : "Nie znaleziono konta o podanym loginie lub adresie e-mail.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // TEMPORARY: same as above — show the real Supabase error + status.
    return { error: `[DEBUG] ${error.message} (status: ${error.status ?? "?"})` };
  }

  redirect(redirectTo || "/");
}

export async function register(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!USERNAME_PATTERN.test(username)) {
    return {
      error: "Nazwa użytkownika: 3-24 znaki (litery, cyfry, kropka, myślnik, podkreślnik).",
    };
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

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (existing) {
    return { error: "Ta nazwa użytkownika jest już zajęta." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    return { error: error.message.includes("already registered")
      ? "Konto z tym adresem e-mail już istnieje."
      : "Nie udało się utworzyć konta. Spróbuj ponownie." };
  }

  if (!data.session) {
    return {
      error:
        "Konto utworzone! Sprawdź swoją skrzynkę e-mail i potwierdź adres, aby się zalogować.",
    };
  }

  redirect("/onboarding");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function completeOnboarding(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const level = String(formData.get("level") ?? "") as UserLevel;
  if (!["A1", "A2", "B1", "B2"].includes(level)) {
    return { error: "Wybierz poziom, aby kontynuować." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ level })
    .eq("id", user.id);
  if (profileError) {
    return { error: "Nie udało się zapisać poziomu. Spróbuj ponownie." };
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { onboarding_completed: true },
  });
  if (metaError) {
    return { error: "Nie udało się zapisać poziomu. Spróbuj ponownie." };
  }

  redirect("/");
}

export async function updateLevel(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const level = String(formData.get("level") ?? "") as UserLevel;
  if (!["A1", "A2", "B1", "B2"].includes(level)) {
    return { error: "Nieprawidłowy poziom." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("profiles").update({ level }).eq("id", user.id);
  if (error) return { error: "Nie udało się zaktualizować poziomu." };

  revalidatePath("/profil");
  return {};
}

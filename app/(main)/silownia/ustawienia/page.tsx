// ============================================================================
// app/(main)/silownia/ustawienia/page.tsx
// Profil "Siłowni": waga/wzrost/cel — jedyny wkład, jakiego potrzebuje
// kalkulator nawodnienia. Patrz components/silownia/profile-settings-form.tsx.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getGymProfile } from "@/lib/silownia/queries";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileSettingsForm } from "@/components/silownia/profile-settings-form";

export default async function SilowniaUstawieniaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const gymProfile = await getGymProfile(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Ustawienia" subtitle="Waga, wzrost i cel treningowy" />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <ProfileSettingsForm profile={gymProfile} />
      </div>
    </div>
  );
}

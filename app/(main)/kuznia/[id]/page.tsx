// ============================================================================
// app/(main)/kuznia/[id]/page.tsx
// One Kuźnia session: the builder chat and the live prompt draft it's
// writing, ready to be copied into a fresh chat session once it's done.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { ForgeWorkspace } from "@/components/prompt-forge/forge-workspace";
import type { PromptSession } from "@/lib/types/database";

export default async function KuzniaSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("prompt_sessions")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!session) notFound();

  return (
    <div>
      <PageHeader title="Kuźnia" subtitle={session.title} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/kuznia"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie sesje
        </Link>

        <ForgeWorkspace session={session as PromptSession} />
      </div>
    </div>
  );
}

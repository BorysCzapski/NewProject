// ============================================================================
// app/(main)/matma/dowody/[problemId]/page.tsx
// Single proof-problem practice screen, reached from the "Trener dowodów"
// list. Reuses ProblemSolver as-is — problem.is_proof already switches it
// to the multi-line "tok rozumowania" textarea framing.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getProblemById } from "@/lib/matma/content";
import { PageHeader } from "@/components/layout/page-header";
import { ProblemSolver } from "@/components/matma/problem/problem-solver";

export default async function ProofProblemPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  await requireProfile();
  const supabase = await createClient();

  const problem = await getProblemById(supabase, problemId);
  if (!problem || !problem.is_proof) notFound();

  return (
    <div>
      <PageHeader title="Trener dowodów" subtitle="Oceniamy tok rozumowania" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <ProblemSolver problem={problem} />
      </div>
    </div>
  );
}

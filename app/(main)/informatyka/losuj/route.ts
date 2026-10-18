// ============================================================================
// app/(main)/informatyka/losuj/route.ts
// "Losuj zadanie": redirects to a random problem, preferring ones not done yet.
// ?zakres= is optional — an exam slug (2026-maj), a kind (program, sql, …) or a
// topic (rekurencja, …); without it the pool is every problem.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/lib/informatyka/content";
import { getProgressMap } from "@/lib/informatyka/progress";

export async function GET(request: NextRequest) {
  const profile = await requireProfile();
  const supabase = await createClient();
  const scope = request.nextUrl.searchParams.get("zakres");

  const [all, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);
  const pool = scope ? all.filter((p) => p.exam.slug === scope || p.kind === scope || p.topic === scope) : all;
  const open = pool.filter((p) => progress.get(p.id)?.status !== "done");
  const candidates = open.length > 0 ? open : pool;

  const target = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  const path = target ? `/informatyka/zadanie/${target.id}` : "/informatyka";
  return NextResponse.redirect(new URL(path, request.url));
}

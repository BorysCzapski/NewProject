// ============================================================================
// lib/informatyka/data-files-client.ts
// Browser-side fetch of an exam's data files (liczby.txt, klienci.txt, …)
// straight from Supabase (RLS `select` for signed-in users) — kept out of the
// RSC payload because a few files are hundreds of KB.
// ============================================================================
import { createClient } from "@/lib/supabase/client";

export interface LoadedFile {
  name: string;
  content: string;
}

const cache = new Map<string, Promise<LoadedFile[]>>();

export function loadDataFiles(examId: string, names: string[]): Promise<LoadedFile[]> {
  const key = `${examId}:${[...names].sort().join(",")}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = (async () => {
      if (names.length === 0) return [];
      const { data, error } = await createClient()
        .from("informatyka_data_files")
        .select("name, content")
        .eq("exam_id", examId)
        .in("name", names);
      if (error) throw new Error(error.message);
      return (data ?? []) as LoadedFile[];
    })();
    hit.catch(() => cache.delete(key));
    cache.set(key, hit);
  }
  return hit;
}

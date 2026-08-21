"use client";

// ============================================================================
// components/matura/next-of-type-button.tsx
// "Kolejne zadanie tego typu" — the loop that makes a task type practisable
// rather than finishable. Shown on a task screen only when the student got
// there from a type hub (the ?typ= marker), so a task opened from a direct
// link or a mock exam is unaffected.
//
// Same form-not-link reasoning as components/practice/type-card.tsx, and
// the same pending state: the click may have to generate a task.
// ============================================================================
import { useFormStatus } from "react-dom";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" className="w-full" isLoading={pending}>
      {!pending && <Shuffle className="h-4 w-4" />}
      {pending ? "Przygotowuję…" : "Kolejne zadanie tego typu"}
    </Button>
  );
}

export function NextOfTypeButton({
  action,
  fields,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
}) {
  return (
    <form action={action} className="mt-4">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Submit />
    </form>
  );
}

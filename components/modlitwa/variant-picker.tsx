// ============================================================================
// components/modlitwa/variant-picker.tsx
// Wybór formularza (obchodu) na dany dzień. Brewiarz często daje kilka opcji:
// dzień powszedni albo wspomnienie dowolne świętego, a w niektórych diecezjach
// dodatkowo święto własne. ILG numeruje je „p”, „w1”, „w2”… — my pokazujemy
// ich nazwy i pozwalamy przełączyć, zamiast po cichu wybierać za użytkownika.
// ============================================================================
import Link from "next/link";
import type { BreviaryVariant } from "@/lib/modlitwa/breviary-source";

export function VariantPicker({
  variants,
  currentVariant,
  hourId,
  dateKey,
  isToday,
}: {
  variants: BreviaryVariant[];
  currentVariant: string;
  hourId: string;
  dateKey: string;
  isToday: boolean;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-(--radius-card) border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-foreground">Obchód do wyboru</h2>
      <ul className="flex flex-col gap-1.5">
        {variants.map((variant) => {
          const isCurrent = variant.id === currentVariant;
          const params = new URLSearchParams();
          if (!isToday) params.set("data", dateKey);
          params.set("obchod", variant.id);

          return (
            <li key={variant.id}>
              <Link
                href={`/modlitwa/liturgia/${hourId}?${params.toString()}`}
                aria-current={isCurrent ? "true" : undefined}
                className={[
                  "flex items-center gap-2 rounded-(--radius-control) border px-3 py-2.5 text-sm",
                  isCurrent
                    ? "border-primary bg-primary-soft font-medium text-foreground"
                    : "border-border text-foreground active:opacity-80",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${isCurrent ? "bg-primary" : "bg-border"}`}
                />
                {variant.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

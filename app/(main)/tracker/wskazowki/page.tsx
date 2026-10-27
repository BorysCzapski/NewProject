// ============================================================================
// app/(main)/tracker/wskazowki/page.tsx
// "Lock in": protokół skupienia (przed / w trakcie / po bloku) i wskazówki
// dobrej nauki. Treść statyczna w lib/tracker/tips.ts.
// ============================================================================
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LOCK_IN_PROTOCOL, STUDY_TIPS, type TipGroup } from "@/lib/tracker/tips";

function TipSection({ group }: { group: TipGroup }) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h2 className="text-base font-semibold text-foreground">{group.title}</h2>
        {group.intro && <p className="mt-0.5 text-sm text-foreground-muted">{group.intro}</p>}
      </div>
      {group.items.map((item) => (
        <Card key={item.title} className="p-3">
          <CardTitle className="text-sm">{item.title}</CardTitle>
          <CardDescription className="mt-1 leading-relaxed">{item.text}</CardDescription>
        </Card>
      ))}
    </section>
  );
}

export default function TrackerTipsPage() {
  return (
    <div>
      <PageHeader title="Lock in" subtitle="Skupienie i dobra nauka" />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        <Card className="flex items-start gap-3 border-primary/40 bg-primary-soft/40">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <CardTitle>Tryb lock in w skrócie</CardTitle>
            <CardDescription className="mt-1 leading-relaxed">
              Jeden cel, telefon poza zasięgiem, timer na 50 minut i nic więcej na ekranie. Po bloku zapisz dzień
              w Trackerze — wykres pokaże, czy to naprawdę działa.
            </CardDescription>
          </div>
        </Card>

        {LOCK_IN_PROTOCOL.map((group) => (
          <TipSection key={group.title} group={group} />
        ))}
        {STUDY_TIPS.map((group) => (
          <TipSection key={group.title} group={group} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// components/matura/section-list.tsx
// The 4 CKE exam parts with this student's mastery. Only sections in
// MATURA_BUILT_SECTION_SLUGS are clickable — the rest render as disabled
// "wkrótce" rows, same visual language as Phoenix's comingSoon app tiles.
// ============================================================================
import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MATURA_BUILT_SECTION_SLUGS } from "@/lib/matura/sections";
import type { SectionWithProgress } from "@/lib/matura/progress";
import type { MasteryStatus } from "@/lib/types/database";

const STATUS_LABELS: Record<MasteryStatus, string> = {
  new: "Nowy",
  learning: "W trakcie",
  mastered: "Opanowany",
};

const STATUS_BADGE_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-surface-muted text-foreground-muted",
  learning: "bg-warning-soft text-warning",
  mastered: "bg-accent-soft text-accent",
};

const STATUS_BAR_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-border",
  learning: "bg-warning",
  mastered: "bg-accent",
};

export function SectionList({ sections }: { sections: SectionWithProgress[] }) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => {
        const isBuilt = MATURA_BUILT_SECTION_SLUGS.includes(section.slug);
        const body = (
          <Card className={cn("transition-transform", isBuilt && "active:scale-[0.99]", !isBuilt && "opacity-70")}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle>{section.title}</CardTitle>
                <CardDescription className="mt-0.5 line-clamp-2">{section.description}</CardDescription>
              </div>
              {isBuilt ? (
                <Badge className={STATUS_BADGE_CLASSES[section.status]}>{STATUS_LABELS[section.status]}</Badge>
              ) : (
                <Badge className="flex items-center gap-1 bg-surface-muted text-foreground-muted">
                  <Lock className="h-3 w-3" /> wkrótce
                </Badge>
              )}
            </div>
            {isBuilt && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", STATUS_BAR_CLASSES[section.status])}
                    style={{ width: `${Math.min(100, Math.max(0, section.masteryScore))}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
                  {section.masteryScore}%
                </span>
              </div>
            )}
          </Card>
        );

        return isBuilt ? (
          <Link key={section.id} href={`/matura/nauka/${section.slug}`}>
            {body}
          </Link>
        ) : (
          <div key={section.id}>{body}</div>
        );
      })}
    </div>
  );
}

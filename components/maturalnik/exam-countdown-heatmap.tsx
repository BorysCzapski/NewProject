// ============================================================================
// components/maturalnik/exam-countdown-heatmap.tsx
// GitHub-contributions-style grid counting down to the matura exam date:
// one column per week, 7 rows (Mon-Sun), colored by how many problems the
// student marked done that day. No new CSS tokens — just opacity steps
// against the existing theme-aware --primary (app/globals.css), so it's
// correct in both light and dark automatically. Pure server-rendered markup,
// no client JS needed (native `title` attributes stand in for tooltips).
// ============================================================================
import { cn } from "@/lib/utils";
import { toDateKey } from "@/lib/utils";

const DAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function intensityClass(count: number): string {
  if (count <= 0) return "bg-surface-muted";
  if (count === 1) return "bg-primary/25";
  if (count <= 3) return "bg-primary/50";
  if (count <= 5) return "bg-primary/75";
  return "bg-primary";
}

export function ExamCountdownHeatmap({
  examDate,
  activityCounts,
}: {
  examDate: string;
  activityCounts: Map<string, number>;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(`${examDate}T00:00:00`);
  const daysUntilExam = Math.round((exam.getTime() - today.getTime()) / 86_400_000);

  if (daysUntilExam < 0) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-4 text-center">
        <p className="text-sm text-foreground-muted">Data matury, którą ustawiłeś, już minęła.</p>
      </div>
    );
  }

  const gridStart = startOfWeekMonday(today);
  const gridEnd = new Date(exam);
  gridEnd.setDate(gridEnd.getDate() + (7 - ((gridEnd.getDay() + 6) % 7) - 1)); // round up to the exam week's Sunday

  const days: Date[] = [];
  for (let d = new Date(gridStart); d <= gridEnd; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  const weekCount = Math.ceil(days.length / 7);

  const todayKey = toDateKey(today);
  const examKey = toDateKey(exam);

  return (
    <div className="rounded-(--radius-card) border border-border bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-2xl font-bold text-foreground">
          {daysUntilExam} {daysUntilExam === 1 ? "dzień" : "dni"}
        </p>
        <p className="text-sm text-foreground-muted">do matury ({exam.toLocaleDateString("pl-PL")})</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex shrink-0 flex-col justify-between gap-[3px] py-[1px] text-[10px] text-foreground-muted">
          {DAY_LABELS.map((label) => (
            <span key={label} className="h-[13px] leading-[13px]">
              {label}
            </span>
          ))}
        </div>
        <div
          className="grid shrink-0 grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weekCount}, 13px)` }}
        >
          {days.map((day) => {
            const key = toDateKey(day);
            const isFuture = day.getTime() > today.getTime();
            const isToday = key === todayKey;
            const isExamDay = key === examKey;
            const count = activityCounts.get(key) ?? 0;

            return (
              <div
                key={key}
                title={`${day.toLocaleDateString("pl-PL")}${isFuture ? "" : ` — ${count} zrobionych`}${isExamDay ? " — dzień matury" : ""}`}
                className={cn(
                  "h-[13px] w-[13px] rounded-[3px]",
                  isFuture ? "bg-surface-muted/60" : intensityClass(count),
                  isToday && "ring-1 ring-foreground-muted",
                  isExamDay && "ring-2 ring-danger"
                )}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-foreground-muted">
        <span>mniej</span>
        <span className="h-[11px] w-[11px] rounded-[2px] bg-surface-muted" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/25" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/50" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary/75" />
        <span className="h-[11px] w-[11px] rounded-[2px] bg-primary" />
        <span>więcej</span>
      </div>
    </div>
  );
}

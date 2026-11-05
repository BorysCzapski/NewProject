"use client";

// ============================================================================
// components/habits/habit-board.tsx
// Tabela nawyków × 7 dni (bez celu), wykres liniowy "% nawyków dziennie"
// i wskaźnik regularności. Odhaczenia są optymistyczne: stan zmienia się od
// razu, zapis leci w tle, a przy błędzie wracamy do poprzedniej wartości.
// Dni z przyszłości są wyszarzone — nie da się ich odhaczyć.
// ============================================================================
import { useMemo, useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addHabit, deleteHabit, setHabitCheck } from "@/lib/habits/actions";
import { consistencyScore, dayStats } from "@/lib/habits/stats";
import { dayMonthLabel, weekdayLabel } from "@/lib/habits/dates";
import type { Habit } from "@/lib/types/database";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function HabitBoard({
  habits,
  days,
  initialChecks,
  today,
}: {
  habits: Habit[];
  days: string[];
  initialChecks: string[];
  today: string;
}) {
  const [checks, setChecks] = useState(() => new Set(initialChecks));
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Wartości z serwera są źródłem prawdy po przejściu na inne okno / revalidacji.
  const windowKey = days[0] + habits.map((h) => h.id).join();
  const [lastKey, setLastKey] = useState(windowKey);
  if (lastKey !== windowKey) {
    setLastKey(windowKey);
    setChecks(new Set(initialChecks));
  }

  const habitIds = useMemo(() => habits.map((h) => h.id), [habits]);
  const stats = useMemo(() => dayStats(days, habitIds, checks, today), [days, habitIds, checks, today]);
  const score = consistencyScore(stats);
  const chartData = stats.map((s) => ({
    day: s.day,
    label: weekdayLabel(s.day),
    pct: s.pct,
  }));

  function toggle(habitId: string, day: string) {
    const key = `${habitId}|${day}`;
    const next = !checks.has(key);
    setError(null);
    setChecks((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(key);
      else copy.delete(key);
      return copy;
    });
    startTransition(async () => {
      const res = await setHabitCheck(habitId, day, next);
      if (!res.ok) {
        setError(res.error);
        setChecks((prev) => {
          const copy = new Set(prev);
          if (next) copy.delete(key);
          else copy.add(key);
          return copy;
        });
      }
    });
  }

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await addHabit(name);
      if (!res.ok) setError(res.error);
      else setName("");
    });
  }

  function onDelete(habit: Habit) {
    if (!window.confirm(`Usunąć nawyk „${habit.name}” razem z historią?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteHabit(habit.id);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
      <Card className="min-w-0 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-muted text-xs uppercase tracking-wide text-foreground-muted">
                <th className="px-4 py-3 text-left font-semibold">Nawyk</th>
                {days.map((day) => (
                  <th
                    key={day}
                    className={cn("px-1 py-2 text-center font-semibold", day === today && "text-primary")}
                  >
                    <div>{weekdayLabel(day)}</div>
                    <div className="text-[10px] font-normal normal-case">{dayMonthLabel(day)}</div>
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold">Razem</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {habits.length === 0 && (
                <tr>
                  <td colSpan={days.length + 3} className="px-4 py-8 text-center text-foreground-muted">
                    Nie masz jeszcze żadnych nawyków. Dodaj pierwszy poniżej.
                  </td>
                </tr>
              )}
              {habits.map((habit) => {
                const total = days.filter((d) => d <= today && checks.has(`${habit.id}|${d}`)).length;
                return (
                  <tr key={habit.id} className="border-t border-border/70">
                    <td className="px-4 py-2.5 font-medium text-foreground">{habit.name}</td>
                    {days.map((day) => {
                      const future = day > today;
                      const done = checks.has(`${habit.id}|${day}`);
                      return (
                        <td key={day} className={cn("px-1 py-1.5 text-center", day === today && "bg-primary-soft/40")}>
                          <button
                            type="button"
                            disabled={future}
                            onClick={() => toggle(habit.id, day)}
                            aria-pressed={done}
                            aria-label={`${habit.name}, ${dayMonthLabel(day)}: ${done ? "zrobione" : "niezrobione"}`}
                            className={cn(
                              "mx-auto flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
                              done
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-surface hover:border-primary/50",
                              future && "cursor-not-allowed opacity-30 hover:border-border"
                            )}
                          >
                            {done && <Check className="h-4 w-4" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center font-semibold tabular-nums text-primary">{total}</td>
                    <td className="pr-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDelete(habit)}
                        aria-label={`Usuń nawyk ${habit.name}`}
                        className="text-foreground-muted hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <form onSubmit={onAdd} className="flex gap-2 border-t border-border/70 p-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nowy nawyk, np. Czytanie 10 stron"
            maxLength={60}
            aria-label="Nazwa nowego nawyku"
          />
          <Button type="submit" disabled={isPending || !name.trim()} aria-label="Dodaj nawyk">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Dodaj</span>
          </Button>
        </form>
      </Card>

      <Card className="flex flex-col items-center justify-center gap-3 py-6">
        <CardTitle>Regularność</CardTitle>
        <ScoreRing score={score} />
        <p className="text-center text-xs text-foreground-muted">
          Odhaczone pola w widocznych dniach do dziś włącznie
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <CardTitle>Twój tydzień w skrócie</CardTitle>
        <p className="mb-3 text-sm text-foreground-muted">% nawyków zrobionych każdego dnia</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-foreground-muted)" tickLine={false} fontSize={12} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tickFormatter={(v) => `${v}%`}
                stroke="var(--color-foreground-muted)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                formatter={(v) => [`${v}%`, "Zrobione"]}
                labelFormatter={(_, p) => (p?.[0] ? dayMonthLabel((p[0].payload as { day: string }).day) : "")}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="pct"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-primary)" }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-danger lg:col-span-2">
          {error}
        </p>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number | null }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = score ?? 0;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`Regularność: ${score ?? "brak danych"}`}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-foreground">{score ?? "—"}</span>
        <span className="text-xs text-foreground-muted">/100</span>
      </div>
    </div>
  );
}

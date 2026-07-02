// ============================================================================
// components/homework/format-deadline.ts
// Formats a homework deadline (ISO timestamp) as Polish date+time text.
// ============================================================================
const formatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDeadline(deadline: string): string {
  return formatter.format(new Date(deadline));
}

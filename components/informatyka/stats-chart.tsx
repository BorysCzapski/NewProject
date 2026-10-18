"use client";

// Cumulative points over time (recharts) for the statistics page.
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StatsChart({ data }: { data: { day: string; cumulative: number; points: number }[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--foreground-muted)" }} tickFormatter={(d: string) => d.slice(5)} minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: "var(--foreground-muted)" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: "var(--foreground)" }}
            formatter={(value, name) => [value, name === "cumulative" ? "Łącznie pkt" : "Tego dnia"]}
          />
          <Line type="monotone" dataKey="cumulative" stroke="var(--primary)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

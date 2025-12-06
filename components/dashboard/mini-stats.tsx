"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { day: "Mon", value: 8200 },
  { day: "Tue", value: 10400 },
  { day: "Wed", value: 9800 },
  { day: "Thu", value: 12300 },
  { day: "Fri", value: 11500 },
  { day: "Sat", value: 14200 },
  { day: "Sun", value: 13400 },
]

export function MiniAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis width={40} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
          contentStyle={{
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
          }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
        />
        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#fillPrimary)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

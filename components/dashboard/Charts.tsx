"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#6366f1", "#ec4899"];

export function CategoryPieChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data</div>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} kg CO2e`, "Emissions"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ScopeBarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} kg`, "CO2e"]} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data }: { data: { month: string; total: number; scope1?: number; scope2?: number; scope3?: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} name="Total" />
        {data[0]?.scope1 !== undefined && <Line type="monotone" dataKey="scope1" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Scope 1" />}
        {data[0]?.scope2 !== undefined && <Line type="monotone" dataKey="scope2" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Scope 2" />}
        {data[0]?.scope3 !== undefined && <Line type="monotone" dataKey="scope3" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Scope 3" />}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBarChart({ data }: { data: { name: string; current: number; previous: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="current" fill="#0d9488" name="Current" radius={[4, 4, 0, 0]} />
        <Bar dataKey="previous" fill="#94a3b8" name="Previous" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function FinancesChartInner({ data }: { data: { label: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data ?? []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <XAxis dataKey="label" tickLine={false} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v} €`} width={60} />
        <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: any) => [`${v} €`, 'Encaissé']} />
        <Bar dataKey="total" fill="#111111" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

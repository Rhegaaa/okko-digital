'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./finances-chart-inner').then((m) => m.FinancesChartInner), { ssr: false, loading: () => <div className="h-[280px] animate-pulse rounded-[4px] bg-[#F7F7F5]" /> });

export function FinancesChart({ data }: { data: { label: string; total: number }[] }) {
  return (
    <div className="h-[280px] w-full">
      <Chart data={data ?? []} />
    </div>
  );
}

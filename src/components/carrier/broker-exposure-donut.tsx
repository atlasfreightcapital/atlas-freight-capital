import { formatCurrency } from "@/lib/utils";

interface BrokerExposure {
  broker: string;
  amount: number;
  color: string;
}

export function BrokerExposureDonut({ exposures }: { exposures: BrokerExposure[] }) {
  const total = exposures.reduce((sum, item) => sum + item.amount, 0);
  let cursor = 0;
  const gradientStops = exposures
    .map((item) => {
      const start = cursor;
      const size = total > 0 ? (item.amount / total) * 100 : 0;
      cursor += size;
      return `${item.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full shadow-sm">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: total > 0 ? `conic-gradient(${gradientStops})` : "#e7ecea" }}
        />
        <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[#d1dad6] bg-white text-center shadow-sm">
          <p className="text-xs uppercase tracking-wide text-[#62737a]">Open invoices</p>
          <p className="mt-1 text-2xl font-semibold text-[#162026]">{formatCurrency(total)}</p>
          <p className="mt-1 text-xs text-[#62737a]">by broker</p>
        </div>
      </div>
      <div className="grid content-center gap-3">
        {exposures.map((item) => (
          <div key={item.broker} className="flex items-center justify-between gap-3 rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-semibold text-[#162026]">{item.broker}</span>
            </div>
            <span className="text-sm text-[#40515a]">{formatCurrency(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

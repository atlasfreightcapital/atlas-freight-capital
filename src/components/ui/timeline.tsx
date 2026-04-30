import { StatusChip } from "@/components/ui/status-chip";

interface TimelineEvent {
  label: string;
  status: string;
  timestamp: string;
  note?: string;
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={`${event.label}-${event.timestamp}`} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#162026]">{event.label}</p>
            <StatusChip status={event.status} />
          </div>
          <p className="mt-1 text-xs text-[#62737a]">{event.timestamp}</p>
          {event.note ? <p className="mt-2 text-xs text-[#40515a]">{event.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}

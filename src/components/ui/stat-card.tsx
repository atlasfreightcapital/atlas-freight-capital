import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  note?: string;
}

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <Card className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-[#62737a]">{label}</p>
      <p className="text-2xl font-semibold text-[#162026]">{value}</p>
      {note ? <p className="text-xs text-[#62737a]">{note}</p> : null}
    </Card>
  );
}

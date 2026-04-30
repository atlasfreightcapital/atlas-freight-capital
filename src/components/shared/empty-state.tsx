import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  body: string;
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <Card className="border-dashed text-center">
      <p className="text-lg font-semibold text-[#162026]">{title}</p>
      <p className="mt-2 text-sm text-[#40515a]">{body}</p>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";

const statusVariantMap: Record<string, "default" | "info" | "warning" | "success" | "danger"> = {
  submitted: "info",
  reviewing: "warning",
  approved: "success",
  funded: "success",
  paid: "success",
  processing: "info",
  pending: "warning",
  needs_attention: "warning",
  rejected: "danger",
  need_documents: "warning",
  closed: "default",
};

export function StatusChip({ status }: { status: string }) {
  return <Badge variant={statusVariantMap[status] ?? "default"}>{status.replaceAll("_", " ")}</Badge>;
}

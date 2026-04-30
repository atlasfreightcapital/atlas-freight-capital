import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/types/domain";

const variantByRisk: Record<RiskLevel, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  blocked: "danger",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={variantByRisk[level]}>{level}</Badge>;
}

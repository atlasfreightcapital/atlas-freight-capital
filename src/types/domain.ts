export type AppRole =
  | "carrier_owner"
  | "carrier_staff"
  | "atlas_admin"
  | "atlas_underwriter"
  | "atlas_operations"
  | "partner_admin"
  | "partner_reviewer"
  | "super_admin";

export const APP_ROLES: AppRole[] = [
  "carrier_owner",
  "carrier_staff",
  "atlas_admin",
  "atlas_underwriter",
  "atlas_operations",
  "partner_admin",
  "partner_reviewer",
  "super_admin",
];

export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_atlas_review",
  "more_info_needed",
  "compliance_review",
  "ucc_review",
  "partner_review",
  "approved",
  "declined",
  "onboarded",
] as const;

export const LOAD_STATUSES = [
  "draft",
  "submitted",
  "atlas_review",
  "missing_documents",
  "broker_verification_pending",
  "broker_verified",
  "sent_to_funding_partner",
  "partner_review",
  "approved_for_advance",
  "funded",
  "rejected",
  "broker_paid",
  "closed",
  "chargeback",
  "dispute",
] as const;

export const CARRIER_VISIBLE_LOAD_STATUSES = [
  "submitted",
  "reviewing",
  "approved",
  "funded",
  "need_documents",
] as const;

export const RISK_LEVELS = ["low", "medium", "high", "blocked"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type LoadStatus = (typeof LOAD_STATUSES)[number];
export type CarrierVisibleLoadStatus = (typeof CARRIER_VISIBLE_LOAD_STATUSES)[number];
export type RiskLevel = (typeof RISK_LEVELS)[number];

export interface AtlasKpi {
  label: string;
  value: string;
  hint?: string;
}

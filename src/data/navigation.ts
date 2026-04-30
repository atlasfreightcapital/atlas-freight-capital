import { AppRole } from "@/types/domain";

type NavItem = {
  label: string;
  href: string;
};

export const marketingNav: NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Freight Factoring", href: "/freight-factoring" },
  { label: "New MC", href: "/new-mc-factoring" },
  { label: "Small Fleet", href: "/small-fleet-factoring" },
  { label: "Broker Credit Check", href: "/broker-credit-check" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const roleHome: Record<AppRole, string> = {
  carrier_owner: "/carrier/dashboard",
  carrier_staff: "/carrier/dashboard",
  atlas_admin: "/admin/dashboard",
  atlas_underwriter: "/admin/dashboard",
  atlas_operations: "/admin/dashboard",
  partner_admin: "/partner/dashboard",
  partner_reviewer: "/partner/dashboard",
  super_admin: "/super/dashboard",
};

export const carrierNav: NavItem[] = [
  { label: "Dashboard", href: "/carrier/dashboard" },
  { label: "Invoices", href: "/carrier/invoices" },
  { label: "Submit Load", href: "/carrier/loads/new" },
  { label: "Broker Checks", href: "/carrier/broker-checks" },
  { label: "Messages", href: "/carrier/messages" },
  { label: "Settings", href: "/carrier/settings" },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Carriers", href: "/admin/carriers" },
  { label: "Loads", href: "/admin/loads" },
  { label: "Brokers", href: "/admin/brokers" },
  { label: "Partners", href: "/admin/partners" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Reserves", href: "/admin/reserves" },
  { label: "Risk", href: "/admin/risk" },
  { label: "Compliance", href: "/admin/compliance" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Audit", href: "/admin/audit" },
];

export const partnerNav: NavItem[] = [
  { label: "Dashboard", href: "/partner/dashboard" },
  { label: "Assigned Loads", href: "/partner/assigned-loads" },
  { label: "Review Queue", href: "/partner/review-queue" },
];

export const superNav: NavItem[] = [{ label: "Super Dashboard", href: "/super/dashboard" }];

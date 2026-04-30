import { z } from "zod";

export const carrierApplicationSchema = z.object({
  legal_business_name: z.string().min(2),
  dba: z.string().optional(),
  owner_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  mc_number: z.string().min(2),
  dot_number: z.string().optional(),
  ein: z.string().min(2),
  business_address: z.string().min(5),
  entity_type: z.string().optional(),
  state_of_registration: z.string().optional(),
  years_in_business: z.coerce.number().min(0).optional(),
  number_of_trucks: z.coerce.number().min(0).optional(),
  trailer_types: z.string().optional(),
  average_monthly_gross_revenue: z.coerce.number().min(0).optional(),
  estimated_factoring_volume: z.coerce.number().min(0).optional(),
  current_factoring_company: z.string().optional(),
  active_ucc: z.enum(["yes", "no"]),
  needs_release_letter: z.enum(["yes", "no"]),
  bank_name: z.string().optional(),
  preferred_funding_method: z.string().optional(),
  factoring_type_requested: z.enum(["recourse", "non_recourse", "not_sure"]),
  broker_customer_list: z.string().optional(),
  notes: z.string().optional(),
});

export const loadSubmissionSchema = z.object({
  broker_name: z.string().min(2),
  broker_mc: z.string().optional(),
  broker_email: z.string().email(),
  broker_phone: z.string().optional(),
  broker_address: z.string().optional(),
  load_number: z.string().min(2),
  invoice_number: z.string().min(2),
  rate_amount: z.coerce.number().min(0),
  accessorials: z.coerce.number().min(0).optional(),
  lumper_amount: z.coerce.number().min(0).optional(),
  detention_amount: z.coerce.number().min(0).optional(),
  total_invoice_amount: z.coerce.number().min(0),
  pickup_date: z.string(),
  delivery_date: z.string(),
  origin: z.string().min(2),
  destination: z.string().min(2),
  commodity: z.string().optional(),
  notes: z.string().optional(),
});

export const brokerCheckSchema = z.object({
  broker_name: z.string().min(2),
  mc_number: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  load_amount: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export const adminStatusUpdateSchema = z.object({
  load_submission_id: z.string().uuid(),
  new_status: z.string().min(2),
  note: z.string().optional(),
});

export const partnerAssignmentSchema = z.object({
  load_submission_id: z.string().uuid(),
  partner_id: z.string().uuid(),
  assignment_reason: z.string().optional(),
  manual_override: z.boolean().optional(),
});

export const pricingUpdateSchema = z.object({
  load_submission_id: z.string().uuid(),
  carrier_rate_percent: z.coerce.number().min(0),
  backend_buy_rate_percent: z.coerce.number().min(0),
  advance_percent: z.coerce.number().min(0).max(100),
  invoice_amount: z.coerce.number().min(0),
  fee_timing: z.enum(["upfront", "after_payment"]),
});

export const brokerVerificationSchema = z.object({
  load_submission_id: z.string().uuid(),
  action: z.enum(["send", "confirm", "deny", "no_response", "manual"]),
  broker_response: z.string().optional(),
  email_thread_reference: z.string().optional(),
});

export const partnerReviewSchema = z.object({
  load_submission_id: z.string().uuid(),
  decision: z.enum(["approve", "reject", "need_info", "funded", "broker_paid"]),
  approved_advance_amount: z.coerce.number().min(0).optional(),
  backend_buy_rate_percent: z.coerce.number().min(0).optional(),
  funding_date: z.string().optional(),
  rejection_reason: z.string().optional(),
  partner_note: z.string().optional(),
});

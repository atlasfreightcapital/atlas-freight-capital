-- Atlas Freight Capital seed data
-- Run this after 20260429_atlas_initial.sql.
-- Create auth users in Supabase first, then add their auth.users IDs to profiles.

insert into public.funding_partners (
  company_name,
  contact_name,
  email,
  phone,
  status,
  buy_rate_min,
  buy_rate_max,
  max_invoice_amount,
  supported_states,
  accepts_new_mc,
  accepts_active_ucc,
  avg_approval_hours
)
values
  (
    'Atlas Backend Capital Pool',
    'Partner Desk',
    'partnerdesk@example.com',
    '(555) 010-1100',
    'active',
    1.65,
    2.25,
    50000,
    array['CA','TX','AZ','NV','OR','WA'],
    true,
    false,
    6
  ),
  (
    'Strategic Receivables Group',
    'Underwriting Desk',
    'underwriting@example.com',
    '(555) 010-2200',
    'active',
    1.85,
    2.75,
    150000,
    array['CA','TX','FL','GA','IL','PA','OH'],
    false,
    true,
    10
  )
on conflict do nothing;

insert into public.brokers (
  broker_name,
  broker_mc,
  email,
  phone,
  payment_terms,
  average_days_to_pay,
  credit_score_internal,
  credit_limit,
  risk_level,
  notes
)
values
  (
    'Blue River Logistics',
    '103998',
    'ap@blueriver.example.com',
    '(555) 010-3300',
    'Net 30',
    27,
    82,
    250000,
    'low',
    'Strong payment history in seed dataset.'
  ),
  (
    'Southline Brokers',
    '998832',
    'billing@southline.example.com',
    '(555) 010-4400',
    'Net 45',
    48,
    41,
    75000,
    'high',
    'Requires manual review before approval.'
  )
on conflict do nothing;

insert into public.settings(key, value)
values ('show_partner_name_to_carrier', '{"enabled": false}'::jsonb)
on conflict (key) do update set value = excluded.value;

-- Example profile insert after creating a Supabase Auth user:
-- insert into public.profiles (user_id, role, full_name, email)
-- values ('00000000-0000-0000-0000-000000000000', 'super_admin', 'Atlas Super Admin', 'admin@example.com');

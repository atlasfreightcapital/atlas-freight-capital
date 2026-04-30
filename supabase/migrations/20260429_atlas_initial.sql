-- Atlas Freight Capital initial schema
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('carrier_owner','carrier_staff','atlas_admin','atlas_underwriter','atlas_operations','partner_admin','partner_reviewer','super_admin')),
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role::text from public.profiles p where p.user_id = auth.uid();
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('atlas_admin','atlas_underwriter','atlas_operations','super_admin'), false);
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'super_admin', false);
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role, full_name, email, phone)
  values (
    new.id,
    'carrier_owner',
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (user_id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
        phone = coalesce(nullif(public.profiles.phone, ''), excluded.phone),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id),
  legal_name text not null,
  dba_name text,
  mc_number text,
  dot_number text,
  ein text,
  phone text,
  email text,
  address text,
  entity_type text,
  state text,
  years_in_business integer,
  truck_count integer,
  estimated_monthly_volume numeric(12,2),
  current_factor text,
  active_ucc boolean default false,
  status text default 'active',
  risk_score integer default 0,
  risk_level text default 'low' check (risk_level in ('low','medium','high','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carrier_staff (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'staff',
  created_at timestamptz not null default now(),
  unique(carrier_id, user_id)
);

create table if not exists public.carrier_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  carrier_id uuid references public.carriers(id),
  legal_business_name text not null,
  dba text,
  owner_name text,
  email text,
  phone text,
  mc_number text,
  dot_number text,
  ein text,
  business_address text,
  entity_type text,
  state_of_registration text,
  years_in_business integer,
  number_of_trucks integer,
  trailer_types text,
  average_monthly_gross_revenue numeric(12,2),
  estimated_factoring_volume numeric(12,2),
  current_factoring_company text,
  active_ucc text,
  needs_release_letter text,
  bank_name text,
  preferred_funding_method text,
  factoring_type_requested text,
  broker_customer_list text,
  notes text,
  status text not null default 'draft' check (status in ('draft','submitted','under_atlas_review','more_info_needed','compliance_review','ucc_review','partner_review','approved','declined','onboarded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.funding_partners (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  status text default 'active',
  buy_rate_min numeric(5,2),
  buy_rate_max numeric(5,2),
  max_invoice_amount numeric(12,2),
  supported_states text[] default '{}',
  accepts_new_mc boolean default false,
  accepts_active_ucc boolean default false,
  avg_approval_hours integer,
  created_at timestamptz not null default now()
);

create table if not exists public.partner_users (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.funding_partners(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('partner_admin','partner_reviewer')),
  created_at timestamptz not null default now(),
  unique(partner_id, user_id)
);

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  broker_name text not null,
  broker_mc text,
  broker_dot text,
  email text,
  phone text,
  address text,
  payment_terms text,
  average_days_to_pay integer,
  credit_score_internal integer,
  credit_limit numeric(12,2),
  total_invoices_submitted integer default 0,
  total_paid numeric(12,2) default 0,
  disputes_count integer default 0,
  chargebacks_count integer default 0,
  risk_level text default 'low' check (risk_level in ('low','medium','high','blocked')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(email)
);

create table if not exists public.broker_credit_checks (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  broker_name text not null,
  mc_number text,
  contact_email text,
  load_amount numeric(12,2),
  notes text,
  status text not null default 'pending_review' check (status in ('pending_review','approved','approved_with_caution','declined','blocked_broker')),
  internal_notes text,
  requested_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.load_submissions (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  broker_id uuid references public.brokers(id),
  assigned_partner_id uuid references public.funding_partners(id),
  load_number text not null,
  invoice_number text not null,
  rate_amount numeric(12,2),
  accessorial_amount numeric(12,2) default 0,
  total_invoice_amount numeric(12,2) not null,
  pickup_date date,
  delivery_date date,
  origin text,
  destination text,
  commodity text,
  status text not null default 'draft' check (status in ('draft','submitted','atlas_review','missing_documents','broker_verification_pending','broker_verified','sent_to_funding_partner','partner_review','approved_for_advance','funded','rejected','broker_paid','closed','chargeback','dispute')),
  risk_score integer default 0,
  risk_level text default 'low' check (risk_level in ('low','medium','high','blocked')),
  admin_notes text,
  created_by uuid references auth.users(id),
  extracted_broker_name text,
  extracted_load_number text,
  extracted_rate_amount numeric(12,2),
  extracted_pickup_date date,
  extracted_delivery_date date,
  extraction_confidence numeric(5,4),
  extraction_status text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(carrier_id, invoice_number)
);

create table if not exists public.partner_assignments (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null references public.load_submissions(id) on delete cascade,
  partner_id uuid not null references public.funding_partners(id) on delete cascade,
  assigned_by uuid references auth.users(id),
  assignment_reason text,
  manual_override boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.carrier_documents (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete cascade,
  application_id uuid references public.carrier_applications(id) on delete cascade,
  document_type text not null,
  file_name text,
  storage_bucket text not null,
  storage_path text not null,
  status text not null default 'uploaded' check (status in ('uploaded','accepted','rejected','needs_replacement','sent_to_partner')),
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.load_documents (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null references public.load_submissions(id) on delete cascade,
  document_type text not null,
  file_name text,
  storage_bucket text not null,
  storage_path text not null,
  status text not null default 'uploaded' check (status in ('uploaded','accepted','rejected','needs_replacement','sent_to_partner')),
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.load_status_history (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null references public.load_submissions(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid references auth.users(id),
  changed_by_role text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.broker_verifications (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null unique references public.load_submissions(id) on delete cascade,
  status text not null default 'not_sent' check (status in ('not_sent','sent','confirmed','denied','no_response','manual_verification')),
  verification_sent_at timestamptz,
  verification_confirmed_at timestamptz,
  verified_by uuid references auth.users(id),
  broker_response text,
  email_thread_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.load_pricing (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null unique references public.load_submissions(id) on delete cascade,
  carrier_rate_percent numeric(5,2) not null,
  backend_buy_rate_percent numeric(5,2),
  advance_percent numeric(5,2) not null,
  invoice_amount numeric(12,2) not null,
  gross_fee numeric(12,2) not null,
  backend_cost numeric(12,2),
  atlas_net_revenue numeric(12,2),
  advance_amount numeric(12,2) not null,
  reserve_amount numeric(12,2) not null,
  net_payout_estimate numeric(12,2) not null,
  fee_timing text not null check (fee_timing in ('upfront','after_payment')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reserves (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  load_submission_id uuid references public.load_submissions(id) on delete set null,
  amount numeric(12,2) not null,
  status text not null default 'held' check (status in ('held','released','applied_to_fee','applied_to_chargeback','pending_release')),
  release_date date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null references public.load_submissions(id) on delete cascade,
  broker_id uuid references public.brokers(id),
  expected_payment_date date,
  actual_payment_date date,
  payment_amount numeric(12,2),
  payment_method text,
  payment_reference text,
  short_pay_amount numeric(12,2),
  dispute_reason text,
  status text not null default 'expected' check (status in ('expected','received','short_paid','disputed','applied','closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  load_submission_id uuid not null references public.load_submissions(id) on delete cascade,
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  invoice_number text not null,
  amount numeric(12,2) not null,
  status text not null default 'open',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete cascade,
  load_submission_id uuid references public.load_submissions(id) on delete cascade,
  partner_id uuid references public.funding_partners(id) on delete cascade,
  message_type text not null check (message_type in ('carrier','internal','partner')),
  body text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  role text,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_flags (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete cascade,
  load_submission_id uuid references public.load_submissions(id) on delete cascade,
  risk_factor text not null,
  score_impact integer not null default 0,
  flagged_by uuid references auth.users(id),
  override_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.compliance_reviews (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.carriers(id) on delete cascade,
  status text not null default 'needs_review' check (status in ('clear','needs_review','hold','blocked')),
  notes text,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.settings(key, value)
values ('show_partner_name_to_carrier', '{"enabled": false}'::jsonb)
on conflict (key) do nothing;

create table if not exists public.document_access_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  bucket text not null,
  storage_path text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_carriers_owner on public.carriers(owner_user_id);
create index if not exists idx_load_submissions_carrier on public.load_submissions(carrier_id);
create index if not exists idx_load_submissions_partner on public.load_submissions(assigned_partner_id);
create index if not exists idx_load_submissions_status on public.load_submissions(status);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_load_status_history_load on public.load_status_history(load_submission_id);

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_carriers_updated before update on public.carriers for each row execute function public.set_updated_at();
create trigger trg_apps_updated before update on public.carrier_applications for each row execute function public.set_updated_at();
create trigger trg_brokers_updated before update on public.brokers for each row execute function public.set_updated_at();
create trigger trg_checks_updated before update on public.broker_credit_checks for each row execute function public.set_updated_at();
create trigger trg_loads_updated before update on public.load_submissions for each row execute function public.set_updated_at();
create trigger trg_ldocs_updated before update on public.load_documents for each row execute function public.set_updated_at();
create trigger trg_cdocs_updated before update on public.carrier_documents for each row execute function public.set_updated_at();
create trigger trg_verifications_updated before update on public.broker_verifications for each row execute function public.set_updated_at();
create trigger trg_pricing_updated before update on public.load_pricing for each row execute function public.set_updated_at();
create trigger trg_payments_updated before update on public.payments for each row execute function public.set_updated_at();
create trigger trg_invoices_updated before update on public.invoices for each row execute function public.set_updated_at();
create trigger trg_compliance_updated before update on public.compliance_reviews for each row execute function public.set_updated_at();
create trigger trg_settings_updated before update on public.settings for each row execute function public.set_updated_at();
alter table public.profiles enable row level security;
alter table public.carriers enable row level security;
alter table public.carrier_staff enable row level security;
alter table public.carrier_applications enable row level security;
alter table public.carrier_documents enable row level security;
alter table public.funding_partners enable row level security;
alter table public.partner_users enable row level security;
alter table public.brokers enable row level security;
alter table public.broker_credit_checks enable row level security;
alter table public.load_submissions enable row level security;
alter table public.load_documents enable row level security;
alter table public.load_status_history enable row level security;
alter table public.broker_verifications enable row level security;
alter table public.load_pricing enable row level security;
alter table public.reserves enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.risk_flags enable row level security;
alter table public.compliance_reviews enable row level security;
alter table public.partner_assignments enable row level security;
alter table public.settings enable row level security;
alter table public.document_access_logs enable row level security;

create policy "profiles_read" on public.profiles for select using (user_id = auth.uid() or public.is_admin_user());
create policy "profiles_write" on public.profiles for all using (user_id = auth.uid() or public.is_super_admin()) with check (user_id = auth.uid() or public.is_super_admin());

create policy "carriers_admin" on public.carriers for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "carriers_owner_read" on public.carriers for select using (
  owner_user_id = auth.uid()
  or exists (select 1 from public.carrier_staff cs where cs.carrier_id = carriers.id and cs.user_id = auth.uid())
);
create policy "carriers_owner_update" on public.carriers for update using (
  owner_user_id = auth.uid()
  or exists (select 1 from public.carrier_staff cs where cs.carrier_id = carriers.id and cs.user_id = auth.uid())
) with check (
  owner_user_id = auth.uid()
  or exists (select 1 from public.carrier_staff cs where cs.carrier_id = carriers.id and cs.user_id = auth.uid())
);

create policy "carrier_staff_admin" on public.carrier_staff for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "carrier_staff_read" on public.carrier_staff for select using (user_id = auth.uid() or public.is_admin_user());

create policy "carrier_apps_submit" on public.carrier_applications for insert with check (true);
create policy "carrier_apps_read" on public.carrier_applications for select using (user_id = auth.uid() or public.is_admin_user());
create policy "carrier_apps_admin_update" on public.carrier_applications for update using (public.is_admin_user()) with check (public.is_admin_user());

create policy "carrier_docs_admin" on public.carrier_documents for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "carrier_docs_owner" on public.carrier_documents for select using (
  exists (
    select 1 from public.carriers c where c.id = carrier_documents.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
  or exists (select 1 from public.carrier_applications a where a.id = carrier_documents.application_id and a.user_id = auth.uid())
);
create policy "carrier_docs_insert" on public.carrier_documents for insert with check (uploaded_by = auth.uid() or public.is_admin_user());

create policy "partners_admin" on public.funding_partners for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "partners_read_assigned" on public.funding_partners for select using (
  exists (select 1 from public.partner_users pu where pu.partner_id = funding_partners.id and pu.user_id = auth.uid())
);

create policy "partner_users_admin" on public.partner_users for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "partner_users_self" on public.partner_users for select using (user_id = auth.uid());

create policy "brokers_admin" on public.brokers for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "brokers_partner" on public.brokers for select using (
  exists (
    select 1
    from public.load_submissions ls
    join public.partner_users pu on pu.partner_id = ls.assigned_partner_id
    where ls.broker_id = brokers.id and pu.user_id = auth.uid()
  )
);

create policy "broker_checks_admin" on public.broker_credit_checks for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "broker_checks_carrier" on public.broker_credit_checks for all using (
  exists (
    select 1 from public.carriers c
    where c.id = broker_credit_checks.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
) with check (
  exists (
    select 1 from public.carriers c
    where c.id = broker_credit_checks.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);

create policy "loads_admin" on public.load_submissions for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "loads_carrier_read" on public.load_submissions for select using (
  exists (
    select 1 from public.carriers c
    where c.id = load_submissions.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);
create policy "loads_carrier_insert" on public.load_submissions for insert with check (
  exists (
    select 1 from public.carriers c
    where c.id = load_submissions.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);
create policy "loads_partner_read" on public.load_submissions for select using (
  exists (select 1 from public.partner_users pu where pu.partner_id = load_submissions.assigned_partner_id and pu.user_id = auth.uid())
);
create policy "loads_partner_update" on public.load_submissions for update using (
  exists (select 1 from public.partner_users pu where pu.partner_id = load_submissions.assigned_partner_id and pu.user_id = auth.uid())
) with check (
  exists (select 1 from public.partner_users pu where pu.partner_id = load_submissions.assigned_partner_id and pu.user_id = auth.uid())
);

create policy "load_docs_admin" on public.load_documents for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "load_docs_carrier_read" on public.load_documents for select using (
  exists (
    select 1 from public.load_submissions ls
    join public.carriers c on c.id = ls.carrier_id
    where ls.id = load_documents.load_submission_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);
create policy "load_docs_partner_read" on public.load_documents for select using (
  exists (
    select 1 from public.load_submissions ls
    join public.partner_users pu on pu.partner_id = ls.assigned_partner_id
    where ls.id = load_documents.load_submission_id and pu.user_id = auth.uid()
  )
);
create policy "load_docs_carrier_insert" on public.load_documents for insert with check (uploaded_by = auth.uid() or public.is_admin_user());

create policy "history_admin" on public.load_status_history for select using (public.is_admin_user());
create policy "history_related" on public.load_status_history for select using (
  exists (
    select 1 from public.load_submissions ls
    where ls.id = load_status_history.load_submission_id and (
      exists (select 1 from public.carriers c where c.id = ls.carrier_id and (c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())))
      or exists (select 1 from public.partner_users pu where pu.partner_id = ls.assigned_partner_id and pu.user_id = auth.uid())
    )
  )
);
create policy "history_insert" on public.load_status_history for insert with check (changed_by = auth.uid() or public.is_admin_user());
create policy "broker_verifications_admin" on public.broker_verifications for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "broker_verifications_partner" on public.broker_verifications for select using (
  exists (
    select 1 from public.load_submissions ls
    join public.partner_users pu on pu.partner_id = ls.assigned_partner_id
    where ls.id = broker_verifications.load_submission_id and pu.user_id = auth.uid()
  )
);

create policy "pricing_admin" on public.load_pricing for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "pricing_partner" on public.load_pricing for select using (
  public.is_super_admin() or exists (
    select 1 from public.load_submissions ls
    join public.partner_users pu on pu.partner_id = ls.assigned_partner_id
    where ls.id = load_pricing.load_submission_id and pu.user_id = auth.uid()
  )
);
create policy "pricing_carrier_block" on public.load_pricing for select using (false);

create policy "reserves_admin" on public.reserves for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "reserves_carrier" on public.reserves for select using (
  exists (
    select 1 from public.carriers c
    where c.id = reserves.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);

create policy "payments_admin" on public.payments for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "payments_related" on public.payments for select using (
  exists (
    select 1 from public.load_submissions ls
    where ls.id = payments.load_submission_id and (
      exists (select 1 from public.carriers c where c.id = ls.carrier_id and (c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())))
      or exists (select 1 from public.partner_users pu where pu.partner_id = ls.assigned_partner_id and pu.user_id = auth.uid())
    )
  )
);

create policy "invoices_admin" on public.invoices for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "invoices_carrier" on public.invoices for select using (
  exists (
    select 1 from public.carriers c
    where c.id = invoices.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);

create policy "messages_admin" on public.messages for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "messages_carrier" on public.messages for select using (
  message_type = 'carrier' and exists (
    select 1 from public.carriers c
    where c.id = messages.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);
create policy "messages_partner" on public.messages for select using (
  message_type = 'partner' and exists (
    select 1 from public.partner_users pu where pu.partner_id = messages.partner_id and pu.user_id = auth.uid()
  )
);

create policy "notifications_own" on public.notifications for all using (user_id = auth.uid() or public.is_admin_user()) with check (user_id = auth.uid() or public.is_admin_user());
create policy "audit_admin_read" on public.audit_logs for select using (public.is_admin_user());
create policy "audit_insert" on public.audit_logs for insert with check (user_id = auth.uid() or public.is_admin_user());
create policy "risk_admin" on public.risk_flags for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "compliance_admin" on public.compliance_reviews for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "compliance_carrier" on public.compliance_reviews for select using (
  exists (
    select 1 from public.carriers c
    where c.id = compliance_reviews.carrier_id and (
      c.owner_user_id = auth.uid() or exists (select 1 from public.carrier_staff cs where cs.carrier_id = c.id and cs.user_id = auth.uid())
    )
  )
);
create policy "partner_assignments_admin" on public.partner_assignments for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "partner_assignments_partner" on public.partner_assignments for select using (
  exists (select 1 from public.partner_users pu where pu.partner_id = partner_assignments.partner_id and pu.user_id = auth.uid())
);
create policy "settings_super" on public.settings for all using (public.is_super_admin()) with check (public.is_super_admin());
create policy "settings_admin_read" on public.settings for select using (public.is_admin_user());
create policy "doc_access_admin_read" on public.document_access_logs for select using (public.is_admin_user());
create policy "doc_access_insert" on public.document_access_logs for insert with check (user_id = auth.uid() or public.is_admin_user());

insert into storage.buckets (id, name, public)
values
  ('carrier-documents', 'carrier-documents', false),
  ('load-documents', 'load-documents', false),
  ('partner-documents', 'partner-documents', false),
  ('compliance-documents', 'compliance-documents', false)
on conflict (id) do nothing;

create policy "storage_admin_full" on storage.objects
for all
using (bucket_id in ('carrier-documents','load-documents','partner-documents','compliance-documents') and public.is_admin_user())
with check (bucket_id in ('carrier-documents','load-documents','partner-documents','compliance-documents') and public.is_admin_user());

create policy "storage_carrier_read" on storage.objects
for select
using (
  bucket_id in ('carrier-documents','load-documents') and (
    split_part(name, '/', 2) in (select c.id::text from public.carriers c where c.owner_user_id = auth.uid())
    or exists (select 1 from public.carrier_staff cs where cs.user_id = auth.uid() and split_part(name, '/', 2) = cs.carrier_id::text)
  )
);

create policy "storage_carrier_insert" on storage.objects
for insert
with check (
  bucket_id in ('carrier-documents','load-documents') and (
    split_part(name, '/', 2) in (select c.id::text from public.carriers c where c.owner_user_id = auth.uid())
    or exists (select 1 from public.carrier_staff cs where cs.user_id = auth.uid() and split_part(name, '/', 2) = cs.carrier_id::text)
  )
);

create policy "storage_partner_read" on storage.objects
for select
using (
  bucket_id in ('load-documents','partner-documents') and exists (
    select 1
    from public.partner_users pu
    join public.load_submissions ls on ls.assigned_partner_id = pu.partner_id
    where pu.user_id = auth.uid() and split_part(name, '/', 3) = ls.id::text
  )
);

comment on table public.load_pricing is 'Carrier-facing app must not expose backend_buy_rate_percent or atlas_net_revenue unless privileged roles.';

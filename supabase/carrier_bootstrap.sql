-- Atlas demo carrier bootstrap
-- Auth user was created for:
-- Email: carrier@atlasdemo.com
-- Password: 123456
--
-- Run this after the main schema and seed SQL.
-- It confirms the auth user, assigns the carrier_owner role, and creates a demo carrier file.

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where lower(email) = lower('carrier@atlasdemo.com');

insert into public.profiles (user_id, role, full_name, email, phone)
select
  id,
  'carrier_owner',
  'Mountain Line Express Owner',
  'carrier@atlasdemo.com',
  '(559) 410-8821'
from auth.users
where lower(email) = lower('carrier@atlasdemo.com')
on conflict (user_id) do update
set
  role = 'carrier_owner',
  full_name = 'Mountain Line Express Owner',
  email = 'carrier@atlasdemo.com',
  phone = '(559) 410-8821',
  updated_at = now();

insert into public.brokers (
  broker_name,
  broker_mc,
  broker_dot,
  email,
  phone,
  address,
  payment_terms,
  average_days_to_pay,
  credit_score_internal,
  credit_limit,
  total_invoices_submitted,
  total_paid,
  disputes_count,
  chargebacks_count,
  risk_level,
  notes
)
values (
  'Blue River Logistics',
  '443991',
  '1882041',
  'ap@blueriver.example.com',
  '(312) 555-7800',
  '1800 W Fulton Market, Chicago, IL 60612',
  'Net 30',
  18,
  82,
  250000,
  142,
  1280000,
  1,
  0,
  'low',
  'Strong payment history. Auto-approve under $45k when POD is clean.'
)
on conflict (email) do update
set
  broker_name = excluded.broker_name,
  broker_mc = excluded.broker_mc,
  broker_dot = excluded.broker_dot,
  phone = excluded.phone,
  address = excluded.address,
  payment_terms = excluded.payment_terms,
  average_days_to_pay = excluded.average_days_to_pay,
  credit_score_internal = excluded.credit_score_internal,
  credit_limit = excluded.credit_limit,
  risk_level = excluded.risk_level,
  notes = excluded.notes,
  updated_at = now();

do $$
declare
  v_user_id uuid;
  v_carrier_id uuid;
  v_broker_id uuid;
  v_load_id uuid;
begin
  select id into v_user_id
  from auth.users
  where lower(email) = lower('carrier@atlasdemo.com')
  limit 1;

  if v_user_id is null then
    raise exception 'Auth user carrier@atlasdemo.com was not found. Create it first in Authentication > Users or use the signup page.';
  end if;

  select id into v_carrier_id
  from public.carriers
  where owner_user_id = v_user_id
  limit 1;

  if v_carrier_id is null then
    insert into public.carriers (
      owner_user_id,
      legal_name,
      dba_name,
      mc_number,
      dot_number,
      ein,
      phone,
      email,
      address,
      entity_type,
      state,
      years_in_business,
      truck_count,
      estimated_monthly_volume,
      current_factor,
      active_ucc,
      status,
      risk_score,
      risk_level
    )
    values (
      v_user_id,
      'Mountain Line Express LLC',
      'Mountain Line Express',
      '884210',
      '3017742',
      '88-4410291',
      '(559) 410-8821',
      'carrier@atlasdemo.com',
      '2148 W Shaw Ave, Fresno, CA 93711',
      'LLC',
      'CA',
      3,
      8,
      185000,
      'None',
      false,
      'active',
      58,
      'medium'
    )
    returning id into v_carrier_id;
  end if;

  insert into public.carrier_applications (
    user_id,
    carrier_id,
    legal_business_name,
    dba,
    owner_name,
    email,
    phone,
    mc_number,
    dot_number,
    ein,
    business_address,
    entity_type,
    state_of_registration,
    years_in_business,
    number_of_trucks,
    trailer_types,
    average_monthly_gross_revenue,
    estimated_factoring_volume,
    current_factoring_company,
    active_ucc,
    needs_release_letter,
    preferred_funding_method,
    factoring_type_requested,
    broker_customer_list,
    notes,
    status
  )
  select
    v_user_id,
    v_carrier_id,
    'Mountain Line Express LLC',
    'Mountain Line Express',
    'Mountain Line Express Owner',
    'carrier@atlasdemo.com',
    '(559) 410-8821',
    '884210',
    '3017742',
    '88-4410291',
    '2148 W Shaw Ave, Fresno, CA 93711',
    'LLC',
    'CA',
    3,
    8,
    'Dry van, reefer',
    185000,
    150000,
    'None',
    'no',
    'no',
    'ACH',
    'recourse',
    'Blue River Logistics, Delta Produce Network, Northstar Retail Freight',
    'Demo carrier application for testing carrier login and admin profile drill-down.',
    'approved'
  where not exists (
    select 1 from public.carrier_applications
    where user_id = v_user_id and legal_business_name = 'Mountain Line Express LLC'
  );

  select id into v_broker_id
  from public.brokers
  where lower(email) = lower('ap@blueriver.example.com')
  limit 1;

  insert into public.load_submissions (
    carrier_id,
    broker_id,
    load_number,
    invoice_number,
    rate_amount,
    accessorial_amount,
    total_invoice_amount,
    pickup_date,
    delivery_date,
    origin,
    destination,
    commodity,
    status,
    risk_score,
    risk_level,
    admin_notes,
    created_by
  )
  select
    v_carrier_id,
    v_broker_id,
    'LD-90322',
    'INV-448201',
    4200,
    0,
    4200,
    current_date - interval '2 days',
    current_date - interval '1 day',
    'Fresno, CA',
    'Phoenix, AZ',
    'Dry goods',
    'atlas_review',
    52,
    'medium',
    'Demo load package for carrier dashboard testing.',
    v_user_id
  where not exists (
    select 1 from public.load_submissions
    where carrier_id = v_carrier_id and load_number = 'LD-90322'
  )
  returning id into v_load_id;

  if v_load_id is null then
    select id into v_load_id
    from public.load_submissions
    where carrier_id = v_carrier_id and load_number = 'LD-90322'
    limit 1;
  end if;

  insert into public.load_status_history (
    load_submission_id,
    old_status,
    new_status,
    changed_by,
    changed_by_role,
    note
  )
  select
    v_load_id,
    'submitted',
    'atlas_review',
    v_user_id,
    'carrier_owner',
    'Demo load submitted and moved into Atlas review.'
  where v_load_id is not null
    and not exists (
      select 1 from public.load_status_history
      where load_submission_id = v_load_id and new_status = 'atlas_review'
    );

  insert into public.reserves (
    carrier_id,
    load_submission_id,
    amount,
    status,
    notes
  )
  select
    v_carrier_id,
    v_load_id,
    420,
    'held',
    'Demo reserve held until broker payment posts.'
  where v_load_id is not null
    and not exists (
      select 1 from public.reserves
      where carrier_id = v_carrier_id and load_submission_id = v_load_id
    );

  insert into public.notifications (
    user_id,
    type,
    title,
    body
  )
  select
    v_user_id,
    'carrier',
    'Welcome to Atlas Freight Capital',
    'Your demo carrier account is ready. You can submit loads, request broker checks, and track funding from the carrier portal.'
  where not exists (
    select 1 from public.notifications
    where user_id = v_user_id and title = 'Welcome to Atlas Freight Capital'
  );
end $$;

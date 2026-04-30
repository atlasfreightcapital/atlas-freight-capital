-- Safe broker directory for carrier submit-load dropdown
-- Run this after the main schema.
-- It exposes only carrier-safe broker fields and hides internal notes, internal risk scoring, disputes, and margins.

create or replace view public.carrier_broker_directory as
select
  id,
  broker_name,
  broker_mc,
  email,
  phone,
  address,
  payment_terms,
  case
    when risk_level = 'low' then 'Approved'
    when risk_level = 'medium' then 'Use caution'
    when risk_level = 'high' then 'Atlas review required'
    else 'Not available'
  end as carrier_result
from public.brokers
where risk_level <> 'blocked';

grant select on public.carrier_broker_directory to authenticated;

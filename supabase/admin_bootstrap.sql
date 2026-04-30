-- Atlas Admin bootstrap
-- First create this user in Supabase Dashboard:
-- Authentication > Users > Add user
-- Email: jtoor779@gmail.com
-- Password: 123456
-- Auto Confirm User: enabled
--
-- Then run this SQL to make the auth user an Atlas Admin.

insert into public.profiles (user_id, role, full_name, email)
select
  id,
  'atlas_admin',
  'Atlas Admin',
  'jtoor779@gmail.com'
from auth.users
where lower(email) = lower('jtoor779@gmail.com')
on conflict (user_id) do update
set
  role = 'atlas_admin',
  full_name = 'Atlas Admin',
  email = 'jtoor779@gmail.com',
  updated_at = now();

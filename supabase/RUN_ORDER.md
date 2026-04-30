# Supabase SQL Run Order

Run these in the Supabase SQL Editor in this order:

1. `supabase/migrations/20260429_atlas_initial.sql`
2. `supabase/seed.sql`
3. Create admin auth user in Supabase Dashboard, then run `supabase/admin_bootstrap.sql`
4. Optional carrier demo login: create/sign up `carrier@atlasdemo.com`, then run `supabase/carrier_bootstrap.sql`
5. Optional carrier broker dropdown: run `supabase/carrier_broker_directory.sql`

The seed file depends on tables from the schema file. If the schema fails, the seed will fail with errors like:

```text
relation "public.funding_partners" does not exist
```

If the schema was previously run only up to the first function error, rerun the fixed schema file from the beginning. The first failed version stopped before creating the application tables.

For the requested admin account:

1. Go to `Authentication > Users > Add user`
2. Email: `jtoor779@gmail.com`
3. Password: `123456`
4. Enable auto-confirm
5. Run `supabase/admin_bootstrap.sql`

For the demo carrier account:

1. Email: `carrier@atlasdemo.com`
2. Password: `123456`
3. The user can be created through the app signup page or Supabase Dashboard.
4. Run `supabase/carrier_bootstrap.sql` to confirm the user and attach a demo carrier profile.

For the carrier submit-load broker dropdown:

1. Run `supabase/carrier_broker_directory.sql`
2. Carriers will see a safe broker directory with broker name, MC, contact, address, payment terms, and carrier-safe result only.

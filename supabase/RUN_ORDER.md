# Supabase SQL Run Order

Run these in the Supabase SQL Editor in this order:

1. `supabase/migrations/20260429_atlas_initial.sql`
2. `supabase/seed.sql`
3. Create admin auth user in Supabase Dashboard, then run `supabase/admin_bootstrap.sql`

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

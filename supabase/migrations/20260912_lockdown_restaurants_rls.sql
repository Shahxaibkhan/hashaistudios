-- Lock down `restaurants` SELECT and introduce a public-safe view.
--
-- Today `restaurants` SELECT is `using (true)` — fully public — which lets
-- anyone with the anon key (shipped in every page load) read every tenant's
-- owner_email, online_payment_details, and subscription status/plan/expiry
-- with no login at all. Customer-facing pages only ever need a safe subset
-- of columns, so we drop the open policy and serve those pages from a view
-- instead.

-- 1. Drop the fully-public SELECT policy on restaurants.
drop policy if exists "Public can view restaurants" on restaurants;

-- 2. Owners can still read their own restaurant row (all columns).
create policy "Owners can view their restaurant"
  on restaurants for select
  using (owner_email = auth.jwt() ->> 'email');

-- 3. Public-safe view: only columns the customer-facing menu/checkout/
--    confirmation/receipt pages actually need. Excludes owner_email and
--    all subscription_* columns.
create or replace view restaurants_public as
select
  id,
  slug,
  name,
  tagline,
  logo_url,
  whatsapp_number,
  is_open,
  opening_time,
  closing_time,
  city_lat,
  city_lng,
  delivery_base_fee,
  delivery_fee_per_km,
  delivery_radius_km,
  delivery_enabled,
  pickup_enabled,
  pickup_address,
  card_on_delivery_enabled,
  online_payment_details,
  tax_enabled,
  tax_cod_percent,
  tax_online_percent,
  created_at
from restaurants;

grant select on restaurants_public to anon, authenticated;

comment on view restaurants_public is
  'Public-safe subset of restaurants for customer-facing pages. Excludes owner_email and subscription_* — service-role (admin routes) and the owner-scoped RLS policy above are the only ways to read those.';

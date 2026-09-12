-- Add owner_id (FK to auth.users) alongside the existing owner_email.
--
-- owner_email stays as-is (display / WhatsApp-contact convenience, and the
-- existing owner-scoped RLS policies still key off it) — owner_id is the
-- authoritative link for new self-serve signups, mirroring CarPect's
-- auth.uid()-based ownership pattern. Existing rows are backfilled
-- best-effort by matching email; a NULL owner_id just means "predates
-- self-serve signup," not an error.

alter table restaurants
  add column if not exists owner_id uuid references auth.users(id);

create index if not exists idx_restaurants_owner_id on restaurants(owner_id);

update restaurants r
set owner_id = u.id
from auth.users u
where r.owner_id is null
  and r.owner_email is not null
  and u.email = r.owner_email;

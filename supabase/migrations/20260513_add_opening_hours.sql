-- Add opening_time and closing_time to restaurants
-- Format: "HH:MM" in 24-hour PKT time, e.g. "09:00", "23:00"
alter table restaurants
  add column if not exists opening_time text default null,
  add column if not exists closing_time text default null;

-- Example: update a restaurant's hours
-- update restaurants set opening_time = '09:00', closing_time = '23:00' where slug = 'beirut-xpress';

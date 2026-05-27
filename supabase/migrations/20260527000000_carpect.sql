-- CarPect AI Car Inspection — Supabase Tables & RLS

create table if not exists public.carpect_vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  make text not null,
  model text not null,
  year integer not null,
  license_plate text unique not null,
  color text not null,
  vin text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.carpect_inspections (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.carpect_vehicles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  status text not null default 'PENDING',
  renter_name text,
  renter_phone text,
  renter_email text,
  rental_start timestamptz,
  rental_end timestamptz,
  notes text,
  ai_report text,
  pre_inspection_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.carpect_inspection_images (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.carpect_inspections(id) on delete cascade not null,
  url text not null,
  angle text not null,
  created_at timestamptz default now()
);

create table if not exists public.carpect_damages (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references public.carpect_inspections(id) on delete cascade not null,
  type text not null,
  severity text not null,
  location text not null,
  description text not null,
  image_url text,
  is_new boolean default false,
  estimated_cost numeric,
  created_at timestamptz default now()
);

-- RLS
alter table public.carpect_vehicles enable row level security;
alter table public.carpect_inspections enable row level security;
alter table public.carpect_inspection_images enable row level security;
alter table public.carpect_damages enable row level security;

create policy "carpect_vehicles_owner" on public.carpect_vehicles
  for all using (auth.uid() = owner_id);

create policy "carpect_inspections_owner" on public.carpect_inspections
  for all using (auth.uid() = user_id);

create policy "carpect_images_owner" on public.carpect_inspection_images
  for all using (
    inspection_id in (select id from public.carpect_inspections where user_id = auth.uid())
  );

create policy "carpect_damages_owner" on public.carpect_damages
  for all using (
    inspection_id in (select id from public.carpect_inspections where user_id = auth.uid())
  );

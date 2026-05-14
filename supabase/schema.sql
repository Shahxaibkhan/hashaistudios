-- =============================================================================
-- HungerAI Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =============================================================================

-- Enable UUID extension (usually enabled by default)
create extension if not exists "pgcrypto";

-- =============================================================================
-- TABLES
-- =============================================================================

-- Restaurants (one row per tenant)
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                    -- e.g. "burger-point"
  name text not null,
  tagline text,                                 -- e.g. "Authentic Lebanese Cuisine"
  logo_url text,
  whatsapp_number text not null,                -- e.g. 923001234567 (no + or spaces)
  delivery_base_fee integer default 50,         -- Rs flat base fee
  delivery_fee_per_km integer default 20,       -- Rs per km
  delivery_radius_km integer default 10,        -- max delivery distance
  city_lat double precision default 31.5204,    -- for map center (default Lahore)
  city_lng double precision default 74.3587,
  is_open boolean default true,
  owner_email text,
  online_payment_details text,                  -- bank account, JazzCash number, etc.
  card_on_delivery_enabled boolean default false,
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,                           -- e.g. "Burgers", "Deals", "Drinks"
  sort_order integer default 0
);

-- Menu items
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price integer not null,                       -- in PKR, integers only, no floats
  image_url text,
  is_available boolean default true,
  sort_order integer default 0
);

-- Item customizations (sizes, add-ons)
create table item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid references menu_items(id) on delete cascade,
  label text not null,                          -- e.g. "Extra Cheese"
  price_delta integer default 0                 -- additional Rs (can be 0)
);

-- Orders (saved at point of placement, before customer sends WA message)
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,
  restaurant_id uuid references restaurants(id),
  customer_name text not null,
  customer_whatsapp text not null,              -- captured at checkout
  items jsonb not null,                         -- snapshot: [{name, qty, price, options}]
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  delivery_lat double precision,
  delivery_lng double precision,
  delivery_address text,                        -- house #, street, area, city
  payment_method text default 'cod',            -- 'cod', 'online', or 'card'
  wa_sent boolean default false,                -- true once customer redirected to WA
  created_at timestamptz default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

create index idx_restaurants_slug on restaurants(slug);
create index idx_categories_restaurant on categories(restaurant_id);
create index idx_menu_items_restaurant on menu_items(restaurant_id);
create index idx_menu_items_category on menu_items(category_id);
create index idx_item_options_menu_item on item_options(menu_item_id);
create index idx_orders_restaurant on orders(restaurant_id);
create index idx_orders_created_at on orders(created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table restaurants enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table item_options enable row level security;
alter table orders enable row level security;

-- Public read access to restaurants, categories, menu_items, item_options
create policy "Public can view restaurants"
  on restaurants for select
  using (true);

create policy "Public can view categories"
  on categories for select
  using (true);

create policy "Public can view menu items"
  on menu_items for select
  using (true);

create policy "Public can view item options"
  on item_options for select
  using (true);

-- Public can create orders
create policy "Public can create orders"
  on orders for insert
  with check (true);

-- Restaurant owners can manage their own data
-- (Requires auth.uid() to match restaurants.owner_email via auth.users)

create policy "Owners can update their restaurant"
  on restaurants for update
  using (owner_email = auth.jwt() ->> 'email');

create policy "Owners can manage their categories"
  on categories for all
  using (
    restaurant_id in (
      select id from restaurants where owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "Owners can manage their menu items"
  on menu_items for all
  using (
    restaurant_id in (
      select id from restaurants where owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "Owners can manage their item options"
  on item_options for all
  using (
    menu_item_id in (
      select mi.id from menu_items mi
      join restaurants r on mi.restaurant_id = r.id
      where r.owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "Owners can view their orders"
  on orders for select
  using (
    restaurant_id in (
      select id from restaurants where owner_email = auth.jwt() ->> 'email'
    )
  );

-- =============================================================================
-- SEED DATA (Test Restaurant)
-- =============================================================================

-- Insert test restaurant
insert into restaurants (slug, name, whatsapp_number, owner_email, online_payment_details, city_lat, city_lng)
values (
  'burger-point',
  'Burger Point',
  '923001234567',
  'shahzzaib.khan@gmail.com',
  'JazzCash: 0300-1234567\nBank: HBL 1234567890123\nAccount Title: Burger Point',
  31.5204,
  74.3587
);

-- Get the restaurant ID for seeding
do $$
declare
  restaurant_uuid uuid;
  burgers_cat uuid;
  deals_cat uuid;
  drinks_cat uuid;
  zinger_id uuid;
  beef_id uuid;
begin
  select id into restaurant_uuid from restaurants where slug = 'burger-point';

  -- Insert categories
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Burgers', 1) returning id into burgers_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Deals', 2) returning id into deals_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Drinks', 3) returning id into drinks_cat;

  -- Insert menu items
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, burgers_cat, 'Zinger Burger', 'Crispy fried chicken fillet with lettuce, mayo, and our special sauce', 550, 1)
  returning id into zinger_id;

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, burgers_cat, 'Beef Burger', 'Juicy beef patty with cheese, lettuce, tomato, and pickles', 450, 2)
  returning id into beef_id;

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, burgers_cat, 'Chicken Tikka Burger', 'Grilled chicken tikka with mint chutney and onions', 500, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, deals_cat, 'Zinger Deal', '1x Zinger Burger + Fries + Drink', 750, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, deals_cat, 'Family Deal', '2x Zinger + 2x Beef + Large Fries + 1.5L Drink', 1800, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Pepsi', '250ml can', 80, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Masala Fries', 'Crispy fries with special masala seasoning', 180, 2);

  -- Insert options for Zinger
  insert into item_options (menu_item_id, label, price_delta) values (zinger_id, 'Extra Cheese', 50);
  insert into item_options (menu_item_id, label, price_delta) values (zinger_id, 'Extra Patty', 150);
  insert into item_options (menu_item_id, label, price_delta) values (zinger_id, 'No Mayo', 0);

  -- Insert options for Beef Burger
  insert into item_options (menu_item_id, label, price_delta) values (beef_id, 'Extra Cheese', 50);
  insert into item_options (menu_item_id, label, price_delta) values (beef_id, 'Double Patty', 200);
  insert into item_options (menu_item_id, label, price_delta) values (beef_id, 'Add Bacon', 100);
end $$;

-- =============================================================================
-- Fatman Burgers Seed Data for Supabase
-- Run this in the Supabase SQL Editor AFTER the main schema
-- =============================================================================

insert into restaurants (
  slug, name, tagline, whatsapp_number, owner_email,
  online_payment_details, city_lat, city_lng,
  opening_time, closing_time,
  subscription_status
)
values (
  'fatman-burgers',
  'Fatman Burgers',
  '100% Angus Beef Smashed Burgers',
  '923219327334',
  'shahzzaib.khan@gmail.com',
  'Contact restaurant for payment details',
  31.4504,
  74.3587,
  '16:00',
  '03:00',
  'trial'
)
on conflict (slug) do nothing;

do $$
declare
  restaurant_uuid uuid;
  beef_cat        uuid;
  chicken_cat     uuid;
  wraps_cat       uuid;
  fries_cat       uuid;
  sides_cat       uuid;
  drinks_cat      uuid;
  addons_cat      uuid;
  dips_cat        uuid;
  item_id         uuid;
begin
  select id into restaurant_uuid from restaurants where slug = 'fatman-burgers';

  if restaurant_uuid is null then
    raise exception 'Restaurant not found';
  end if;

  -- ── CATEGORIES ──────────────────────────────────────────────────────────────
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Beef Burgers',     1) returning id into beef_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Chicken Burgers',  2) returning id into chicken_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Wraps',            3) returning id into wraps_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Fries',            4) returning id into fries_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Sides',            5) returning id into sides_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Drinks',           6) returning id into drinks_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Add Ons',          7) returning id into addons_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Dips',             8) returning id into dips_cat;

  -- ── BEEF BURGERS ────────────────────────────────────────────────────────────
  -- Classic Burger (Single/Double/Triple)
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, beef_cat, 'Classic Burger', 'Smashed Beef Patty, Onion, Lettuce, Tomato, Cheese, Pickle, Mayo, Ketchup, French Mustard with Potato Bun.', 730, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 260);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Triple', 520);

  -- Double the Best (Beef)
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, beef_cat, 'Double the Best', 'Smashed Beef Patty, Onions, Lettuce, Cheese, Jalapeno, Fatman Special Sauce with Potato Bun.', 730, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 260);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Triple', 520);

  -- Mushroom Melt
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, beef_cat, 'Mushroom Melt', 'Smashed Beef Patty, Mushrooms, Onions, Lettuce, Mushroom Sauce with Potato Bun.', 730, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 260);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Triple', 520);

  -- Texas BBQ Burger (Beef)
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, beef_cat, 'Texas BBQ Burger', 'Smashed Beef Patty, Onion, Lettuce, Tomato, Jalapeno, Cheese, BBQ Sauce with Potato Bun.', 730, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 260);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Triple', 520);

  -- Jalapeno Burger (Beef)
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, beef_cat, 'Jalapeno Burger', 'Smashed Beef Patty, Onion, Lettuce, Tomato, Jalapeno, Cheese, Jalapeno Sauce with Potato Bun.', 730, 5)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 260);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Triple', 520);

  -- ── CHICKEN BURGERS ─────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Classic Burger', 'Grilled Chicken, Lettuce, Onion, Tomato, Jalapeno Sauce, Ketchup, French Mustard.', 650, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Full House', 'Grilled Chicken, Crispy Chicken Patty, Onion, Tomato, Grilled Jalapeno, Cheese, Special Sauce.', 750, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Double the Best', 'Grilled Chicken, Lettuce, Onion, Tomato, Grilled Jalapeno, Cheese.', 650, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Jalapeno Burger', 'Grilled Chicken, Grilled Jalapeno, Lettuce, Onion, Tomato, Jalapeno Sauce.', 650, 4);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Texas BBQ Burger', 'Grilled Chicken, BBQ Smoked Sauce, Jalapeno Sauce, Onion, Tomato, Lettuce, Grilled Jalapeno.', 650, 5);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Zinger Burger', 'Fried Chicken, Lettuce & Sauce of your choice.', 550, 6);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Mighty Zinger Burger', 'Double Fried Chicken, Lettuce & Sauce of your choice.', 750, 7);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Fillet Burger', 'Crispy chicken fillet with fresh toppings and sauce of your choice.', 600, 8);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, chicken_cat, 'Thunder Burger', 'Bold and loaded chicken burger with our signature thunder sauce.', 600, 9);

  -- ── WRAPS ───────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Zinger or Fillet Wrap', 'Crispy zinger or fillet wrapped with fresh veggies and sauce.', 570, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Mighty Zinger or Fillet Wrap', 'Double portion zinger or fillet wrap.', 800, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Grill Wrap', 'Grilled chicken wrap with fresh toppings.', 700, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Beef Wrap', 'Smashed beef patty wrapped with fresh veggies and special sauce.', 900, 4);

  -- ── FRIES ───────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Overloaded Fries', 'Loaded fries topped with Beef or Chicken.', 800, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Beef', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Chicken', 0);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Large Plain Fries', 'Crispy golden fries.', 250, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Masala Fries', 'Fries tossed in our signature masala spice.', 300, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Garlic Sauce Fries', 'Fries drizzled with creamy garlic sauce.', 450, 4);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'BBQ Sauce Fries', 'Fries drizzled with smoky BBQ sauce.', 450, 5);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Jalapeno Sauce Fries', 'Fries drizzled with spicy jalapeno sauce.', 450, 6);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Dynamite Sauce Fries', 'Fries drizzled with fiery dynamite sauce.', 450, 7);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Fatman Sauce Fries', 'Fries drizzled with our signature Fatman sauce.', 450, 8);

  -- ── SIDES ───────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, sides_cat, 'Crunchy Wings', 'Crispy fried chicken wings.', 500, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '5 Pieces', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '10 Pieces', 300);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, sides_cat, 'BBQ Wings', 'Chicken wings glazed with smoky BBQ sauce.', 550, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '5 Pieces', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '10 Pieces', 300);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, sides_cat, 'Chicken Tenders', 'Crispy golden chicken tenders.', 600, 3);

  -- ── DRINKS ──────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Pepsi 345ml', 'Ice-cold Pepsi.', 80, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, '7UP 345ml', 'Refreshing 7UP.', 80, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Fanta 345ml', 'Chilled Fanta.', 80, 3);

  -- ── ADD ONS ─────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Extra Topping', 'Add an extra topping of your choice.', 80, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Cheese Slice', 'Extra cheese slice.', 70, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Beef Patty', 'Extra smashed beef patty.', 400, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Extra Chicken', 'Extra grilled or fried chicken.', 400, 4);

  -- ── DIPS ────────────────────────────────────────────────────────────────────
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, dips_cat, 'Jalapeno Dip', 'Spicy jalapeno dipping sauce.', 80, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, dips_cat, 'BBQ Dip', 'Smoky BBQ dipping sauce.', 80, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, dips_cat, 'Dynamite Dip', 'Fiery dynamite dipping sauce.', 80, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, dips_cat, 'Garlic Herbs Dip', 'Creamy garlic herbs dipping sauce.', 80, 4);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, dips_cat, 'Fatman Special Dip', 'Our signature secret dipping sauce.', 80, 5);

end $$;

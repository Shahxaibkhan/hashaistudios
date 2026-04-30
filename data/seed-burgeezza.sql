-- =============================================================================
-- Burgeezza Restaurant Seed Data for Supabase
-- Run this in the Supabase SQL Editor AFTER the main schema
-- =============================================================================

-- Insert Burgeezza restaurant
insert into restaurants (slug, name, whatsapp_number, owner_email, online_payment_details, city_lat, city_lng)
values (
  'burgeezza',
  'Burgeezza',
  '923044327676',
  'shahzzaib.khan@gmail.com',
  'Contact restaurant for payment details',
  31.5204,
  74.3587
)
on conflict (slug) do nothing;

-- Seed all categories and menu items
do $$
declare
  restaurant_uuid uuid;
  -- Category IDs
  classics_cat uuid;
  premiums_cat uuid;
  stuffed_cat uuid;
  classic_deals_cat uuid;
  premium_deals_cat uuid;
  stuffed_deals_cat uuid;
  wraps_cat uuid;
  burgers_cat uuid;
  fries_cat uuid;
  combo_deals_cat uuid;
  addons_cat uuid;
  extras_cat uuid;
  -- Menu item IDs for options
  item_id uuid;
begin
  select id into restaurant_uuid from restaurants where slug = 'burgeezza';
  
  if restaurant_uuid is null then
    raise exception 'Restaurant not found';
  end if;

  -- =============================================================================
  -- CATEGORIES
  -- =============================================================================
  
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'The Classics (Pizza)', 1) returning id into classics_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'The Premiums (Pizza)', 2) returning id into premiums_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'The Stuffed (Pizza)', 3) returning id into stuffed_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Classic Pizza Deals', 4) returning id into classic_deals_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Premium Pizza Deals', 5) returning id into premium_deals_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Stuffed Pizza Deals', 6) returning id into stuffed_deals_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Wraps', 7) returning id into wraps_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Burgers', 8) returning id into burgers_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Fries Gone Wild', 9) returning id into fries_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Combo Deals', 10) returning id into combo_deals_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Add-Ons', 11) returning id into addons_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Extras', 12) returning id into extras_cat;

  -- =============================================================================
  -- THE CLASSICS (PIZZA) - Base price is Small, options for Medium/Large
  -- =============================================================================
  
  -- Inferno
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classics_cat, 'Inferno', 'A fiery blend of smoky chicken, spicy sauce, capsicum, onions, tomatoes & olives — bold, rich, and dangerously delicious.', 570, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 430);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 820);

  -- Tikka Di'Pollo
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classics_cat, 'Tikka Di''Pollo', 'Tender tikka chicken on a rich red sauce base, layered with cheese, olives, tomato & capsicum — pure desi indulgence with an Italian touch.', 570, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 430);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 820);

  -- Fajita Di'Pollo
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classics_cat, 'Fajita Di''Pollo', 'Zesty fajita chicken with jalapeños, capsicum, and tomato over tangy red sauce — a perfect fusion of spice and flavor.', 570, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 430);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 820);

  -- Cluck'N'Cheese
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classics_cat, 'Cluck''N''Cheese', 'A pinchy white base loaded with juicy chicken and melted cheese — smooth, simple, and irresistibly comforting.', 570, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 430);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 820);

  -- =============================================================================
  -- THE PREMIUMS (PIZZA)
  -- =============================================================================
  
  -- Burgeezza Specialanto
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premiums_cat, 'Burgeezza Specialanto', 'A signature creation with smoky chicken, cheese, mushrooms, olives, sweet corn, tomato & onion — finished with our secret special sauce.', 650, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 500);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 850);

  -- Malai Boti Bianca
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premiums_cat, 'Malai Boti Bianca', 'Succulent malai boti chicken with olives, mushrooms, and sweet corn with a silky malai sauce at base and top.', 650, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 500);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 850);

  -- The White-Shot
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premiums_cat, 'The White-Shot', 'A creamy white sauce pizza crowned with Mughlai chicken, cheese, capsicum & sweet corn — smooth, rich, and royal.', 650, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 500);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 850);

  -- Kebabliano
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premiums_cat, 'Kebabliano', 'A rich special-sauce base topped with tender kebab and tikka chicken, layered with molten cheese, capsicum, sweet corn, and olives — a bold fusion of smoky and creamy perfection.', 650, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 500);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 850);

  -- =============================================================================
  -- THE STUFFED (PIZZA) - No Small size available
  -- =============================================================================
  
  -- Kebab Stuff'd
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, stuffed_cat, 'Kebab Stuff''d', 'Kebab-loaded crust topped with extra kebabs, olives, capsicum & sweet corn — spiced to perfection with our mild sauce.', 1300, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 400);

  -- Cluck Stuff'd
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, stuffed_cat, 'Cluck Stuff''d', 'Chicken-stuffed crust with creamy cheese and pinchy sauce, sweet corn & capsicum — soft, cheesy, and soul-satisfying.', 1300, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 400);

  -- =============================================================================
  -- CLASSIC PIZZA DEALS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classic_deals_cat, 'Classic Combo', '1 Small Pizza + Regular Drink', 620, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classic_deals_cat, 'Duo Small', '2 Small Pizzas + 500ml Drink', 1120, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classic_deals_cat, 'Duo Medium', '2 Medium Pizzas + 1.5 Litre Drink', 1980, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, classic_deals_cat, 'Duo Large', '2 Large Pizzas + 1.5 Litre Drink', 2750, 4);

  -- =============================================================================
  -- PREMIUM PIZZA DEALS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premium_deals_cat, 'Premium Duo Small', '2 Small Premium Pizzas + 500ml Drink', 1280, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premium_deals_cat, 'Premium Duo Medium', '2 Medium Premium Pizzas + 1.5 Litre Drink', 2270, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, premium_deals_cat, 'Premium Duo Large', '2 Large Premium Pizzas + 1.5 Litre Drink', 2950, 3);

  -- =============================================================================
  -- STUFFED PIZZA DEALS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, stuffed_deals_cat, 'Stuffed Duo Medium', '2 Medium Stuffed Pizzas + 1.5 Litre Drink', 2550, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, stuffed_deals_cat, 'Stuffed Duo Large', '2 Large Stuffed Pizzas + 1.5 Litre Drink', 3350, 2);

  -- =============================================================================
  -- WRAPS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Basic Wrap', 'Classic wrap with fresh ingredients', 580, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, wraps_cat, 'Maxxx Wrap', 'Loaded wrap with extra fillings', 730, 2);

  -- =============================================================================
  -- BURGERS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, burgers_cat, 'Zingo Burger', 'Signature Zingo burger', 499, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, burgers_cat, 'Humongous Burger', 'Extra large loaded burger', 730, 2);

  -- =============================================================================
  -- FRIES GONE WILD
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Loaded Fries (M)', 'Medium loaded fries with toppings', 600, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Loaded Fries (L)', 'Large loaded fries with toppings', 750, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Pizza Fries (M)', 'Medium pizza-style fries', 550, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, fries_cat, 'Pizza Fries (L)', 'Large pizza-style fries', 800, 4);

  -- =============================================================================
  -- COMBO DEALS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 1', '2x Zingo Burgers + 1x Loaded Fries(S) + 1x 500ml Drink', 1350, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 2', '2x Basic Wraps + 1x Loaded Fries(S) + 1x 500ml Drink', 1450, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 3', '1x Zingo Burger + 1x Basic Wrap + 1x Loaded Fries(S) + 1x 500ml Drink', 1400, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 4', '2x Zingo Burgers + 2x Basic Wraps + 1x Plain Fries + 1x 1.5L Drink', 2330, 4);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 5', '2x Zingo Burgers + 2x Basic Wraps + 1x Loaded Fries(R) + 1x 1.5L Drink', 2700, 5);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Deal 6', '4x Basic Wraps + 1x Loaded Fries(L) + 1x 1.5L Drink', 2990, 6);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Hat-Trick Deal', '3x Basic Wraps + 1x 1.5L Drink', 1790, 7);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, combo_deals_cat, 'Family Deal', '5x Basic Wraps + 1x 1.5L Drink', 2820, 8);

  -- =============================================================================
  -- ADD-ONS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Olives', 'Extra olives topping', 60, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Jalapeños', 'Extra jalapeños topping', 60, 2);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Dip', 'Extra dipping sauce', 100, 3);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Cheese Slice', 'Extra cheese slice', 60, 4);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, addons_cat, 'Extra Sauce', 'Extra sauce portion', 100, 5);

  -- =============================================================================
  -- EXTRAS
  -- =============================================================================
  
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, extras_cat, 'Plain Fries', 'Classic plain fries', 200, 1);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, extras_cat, 'Make-It-A-Meal', 'Add fries and drink to any item', 250, 2);

  -- Extra Toppings with size options
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, extras_cat, 'Extra Chicken Topping', 'Add extra chicken to your pizza', 150, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 50);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 150);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, extras_cat, 'Extra Cheese Topping', 'Add extra cheese to your pizza', 150, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 50);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 150);

  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, extras_cat, 'Extra Veggie Topping', 'Add extra veggies to your pizza', 50, 5)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Small', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Medium', 100);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 150);

  raise notice 'Burgeezza seeded successfully!';
end $$;

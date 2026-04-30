-- =============================================================================
-- Karachi Biryani House Seed Data for Supabase
-- Run this in the Supabase SQL Editor AFTER the main schema
-- =============================================================================

-- Insert Karachi Biryani House restaurant
insert into restaurants (slug, name, whatsapp_number, owner_email, online_payment_details, city_lat, city_lng)
values (
  'karachi-biryani',
  'Karachi Biryani House',
  '923001234567',
  'shahzzaib.khan@gmail.com',
  'JazzCash: 0300-1234567 | EasyPaisa: 0300-1234567',
  31.5204,
  74.3587
)
on conflict (slug) do nothing;

-- Seed all categories and menu items
do $$
declare
  restaurant_uuid uuid;
  -- Category IDs
  biryani_cat uuid;
  karahi_cat uuid;
  bbq_cat uuid;
  rolls_cat uuid;
  rice_cat uuid;
  drinks_cat uuid;
  desserts_cat uuid;
  -- Menu item IDs for options
  item_id uuid;
begin
  select id into restaurant_uuid from restaurants where slug = 'karachi-biryani';
  
  if restaurant_uuid is null then
    raise exception 'Restaurant not found';
  end if;

  -- =============================================================================
  -- CATEGORIES
  -- =============================================================================
  
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Biryani', 1) returning id into biryani_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Karahi', 2) returning id into karahi_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'BBQ & Tikka', 3) returning id into bbq_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Rolls & Paratha', 4) returning id into rolls_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Rice & Pulao', 5) returning id into rice_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Drinks', 6) returning id into drinks_cat;
  insert into categories (restaurant_id, name, sort_order) values (restaurant_uuid, 'Desserts', 7) returning id into desserts_cat;

  -- =============================================================================
  -- BIRYANI
  -- =============================================================================
  
  -- Chicken Biryani
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, biryani_cat, 'Chicken Biryani', 'Authentic Karachi-style chicken biryani with aromatic basmati rice, tender chicken pieces, and secret spices. Served with raita and salad.', 350, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 200);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Family Pack', 850);

  -- Mutton Biryani
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, biryani_cat, 'Mutton Biryani', 'Premium mutton biryani slow-cooked with saffron-infused rice. Rich, flavorful, and absolutely divine.', 550, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 350);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Family Pack', 1200);

  -- Beef Biryani
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, biryani_cat, 'Beef Biryani', 'Succulent beef pieces layered with fragrant basmati rice, garnished with fried onions and fresh mint.', 450, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 280);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Family Pack', 1000);

  -- Sindhi Biryani
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, biryani_cat, 'Sindhi Biryani', 'Spicier than regular biryani with potatoes, plums, and a tangy tomato base. A Sindhi specialty.', 400, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 250);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Family Pack', 950);

  -- =============================================================================
  -- KARAHI
  -- =============================================================================
  
  -- Chicken Karahi
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, karahi_cat, 'Chicken Karahi', 'Fresh chicken cooked in a wok with tomatoes, green chilies, ginger, and aromatic spices. Served sizzling hot.', 1200, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half KG', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '1 KG', 700);

  -- Mutton Karahi
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, karahi_cat, 'Mutton Karahi', 'Tender mutton pieces cooked in traditional Peshawari style karahi. Rich gravy with a hint of ghee.', 1800, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half KG', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '1 KG', 1000);

  -- White Karahi
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, karahi_cat, 'White Karahi', 'Creamy white karahi without tomatoes, made with yogurt, cream, and mild spices. Absolutely delicious.', 1400, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half KG', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '1 KG', 800);

  -- =============================================================================
  -- BBQ & TIKKA
  -- =============================================================================
  
  -- Chicken Tikka
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, bbq_cat, 'Chicken Tikka', 'Boneless chicken marinated in yogurt and spices, grilled to perfection. Juicy and smoky.', 450, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half Plate', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Full Plate', 300);

  -- Seekh Kabab
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, bbq_cat, 'Seekh Kabab', 'Minced beef kababs with herbs and spices, charcoal grilled. Served with naan and chutney.', 400, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '4 Pieces', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '8 Pieces', 350);

  -- Malai Boti
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, bbq_cat, 'Malai Boti', 'Creamy, tender chicken pieces marinated in malai (cream) and mild spices. Melt-in-mouth texture.', 500, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half Plate', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Full Plate', 350);

  -- Reshmi Kabab
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, bbq_cat, 'Reshmi Kabab', 'Silky smooth chicken kababs with a delicate, mildly spiced flavor. Grilled on charcoal.', 480, 4)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Half Plate', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Full Plate', 320);

  -- BBQ Platter
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, bbq_cat, 'BBQ Platter', 'A mix of chicken tikka, seekh kabab, malai boti, and reshmi kabab. Perfect for sharing.', 1500, 5)
  returning id into item_id;

  -- =============================================================================
  -- ROLLS & PARATHA
  -- =============================================================================
  
  -- Chicken Roll
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rolls_cat, 'Chicken Roll', 'Spicy chicken tikka wrapped in soft paratha with raita and chutney.', 280, 1)
  returning id into item_id;

  -- Seekh Kabab Roll
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rolls_cat, 'Seekh Kabab Roll', 'Two seekh kababs wrapped in fresh paratha with onions and green chutney.', 300, 2)
  returning id into item_id;

  -- Shawarma
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rolls_cat, 'Chicken Shawarma', 'Middle Eastern style chicken shawarma with garlic sauce and pickles.', 350, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Regular', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Large', 100);

  -- Plain Paratha
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rolls_cat, 'Plain Paratha', 'Freshly made layered paratha, crispy and flaky.', 50, 4)
  returning id into item_id;

  -- =============================================================================
  -- RICE & PULAO
  -- =============================================================================
  
  -- Chicken Pulao
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rice_cat, 'Chicken Pulao', 'Fragrant rice cooked with whole chicken pieces and aromatic spices.', 350, 1)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Single', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Double', 200);

  -- Plain Rice
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rice_cat, 'Plain Rice', 'Steamed basmati rice, fluffy and aromatic.', 150, 2)
  returning id into item_id;

  -- Zeera Rice
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, rice_cat, 'Zeera Rice', 'Cumin-flavored rice with whole cumin seeds and ghee.', 180, 3)
  returning id into item_id;

  -- =============================================================================
  -- DRINKS
  -- =============================================================================
  
  -- Raita
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Raita', 'Cool yogurt with cucumber, onion, and spices. Perfect with biryani.', 80, 1)
  returning id into item_id;

  -- Lassi
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Lassi', 'Traditional Pakistani yogurt drink, sweet or salty.', 120, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Sweet', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Salty', 0);

  -- Cold Drink
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, drinks_cat, 'Cold Drink', 'Chilled soft drink (Pepsi, 7Up, or Mirinda).', 100, 3)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, 'Regular', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '1.5L', 120);

  -- =============================================================================
  -- DESSERTS
  -- =============================================================================
  
  -- Kheer
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, desserts_cat, 'Kheer', 'Traditional rice pudding with cardamom, almonds, and pistachios.', 150, 1)
  returning id into item_id;

  -- Gulab Jamun
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, desserts_cat, 'Gulab Jamun', 'Soft milk dumplings soaked in rose-flavored sugar syrup.', 120, 2)
  returning id into item_id;
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '2 Pieces', 0);
  insert into item_options (menu_item_id, label, price_delta) values (item_id, '4 Pieces', 100);

  -- Firni
  insert into menu_items (restaurant_id, category_id, name, description, price, sort_order)
  values (restaurant_uuid, desserts_cat, 'Firni', 'Ground rice pudding set in clay pots, topped with nuts. A Lahori specialty.', 130, 3)
  returning id into item_id;

end $$;

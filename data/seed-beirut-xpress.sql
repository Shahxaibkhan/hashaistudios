-- =============================================================================
-- BEIRUT XPRESS - Authentic Lebanese Cuisine
-- Lahore (Lake City, Dolmen Mall, Faletti's Hotel)
-- =============================================================================

-- Restaurant
INSERT INTO restaurants (
  id, slug, name, whatsapp_number, city_lat, city_lng, 
  delivery_radius_km, is_open, owner_email
) VALUES (
  'b2000000-0000-0000-0000-000000000001',
  'beirut-xpress',
  'Beirut Xpress',
  '923434994409',
  31.5204,  -- Lahore coordinates
  74.3587,
  15,
  true,
  'beirut@hungerai.pk'
);

-- =============================================================================
-- CATEGORIES
-- =============================================================================

INSERT INTO categories (id, restaurant_id, name, sort_order) VALUES
  ('b2100000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'Mezze', 1),
  ('b2100000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', 'Shawarmas', 2),
  ('b2100000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001', 'Rice Bowls', 3),
  ('b2100000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001', 'Platters', 4),
  ('b2100000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', 'Fresh Salads', 5),
  ('b2100000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000001', 'Family Platters', 6),
  ('b2100000-0000-0000-0000-000000000007', 'b2000000-0000-0000-0000-000000000001', 'Kids Deal', 7),
  ('b2100000-0000-0000-0000-000000000008', 'b2000000-0000-0000-0000-000000000001', 'Sweet Endings', 8),
  ('b2100000-0000-0000-0000-000000000009', 'b2000000-0000-0000-0000-000000000001', 'Drinks', 9),
  ('b2100000-0000-0000-0000-000000000010', 'b2000000-0000-0000-0000-000000000001', 'Add Ons & Sauces', 10);

-- =============================================================================
-- MENU ITEMS
-- =============================================================================

-- MEZZE
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'Plain Hummus', 'Classic cold hummus made with chickpeas, tahini, lemon & olive oil', 370, true),
  ('b2200000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'Hummus with Chicken', 'Creamy hummus topped with seasoned chicken pieces', 620, true),
  ('b2200000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'Hummus with Meat', 'Rich hummus topped with spiced minced meat', 880, true),
  ('b2200000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'Hummus with Meat & Chicken', 'The best of both worlds - chicken and meat on hummus', 750, true),
  ('b2200000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'Falafel', 'Crispy deep-fried chickpea fritters with herbs & spices', 450, true),
  ('b2200000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 
   'French Fries', 'Golden crispy fries', 350, true);

-- SHAWARMAS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000010', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Chicken Shawarma', 'Classic Lebanese chicken shawarma in fresh bread', 799, true),
  ('b2200000-0000-0000-0000-000000000011', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Turkish Chicken Shawarma', 'Turkish-style marinated chicken shawarma', 799, true),
  ('b2200000-0000-0000-0000-000000000012', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Al Mexicano Shawarma', 'Shawarma with a Mexican twist - spicy and flavorful', 790, true),
  ('b2200000-0000-0000-0000-000000000013', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Harra Shish Tawook Shawarma', 'Spicy shish tawook chicken shawarma', 880, true),
  ('b2200000-0000-0000-0000-000000000014', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Kafta Shawarma', 'Minced meat kafta wrapped in fresh bread', 850, true),
  ('b2200000-0000-0000-0000-000000000015', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Meat Shawarma', 'Premium beef shawarma with tahini sauce', 1599, true),
  ('b2200000-0000-0000-0000-000000000016', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000002', 
   'Falafel Shawarma', 'Vegetarian shawarma with crispy falafel', 599, true);

-- RICE BOWLS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000020', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000003', 
   'Chicken Rice Bowl', 'Grilled chicken served over aromatic Lebanese rice', 1099, true),
  ('b2200000-0000-0000-0000-000000000021', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000003', 
   'Meat Rice Bowl', 'Tender beef served over aromatic Lebanese rice', 1899, true),
  ('b2200000-0000-0000-0000-000000000022', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000003', 
   'Rotisserie Chicken', 'Whole rotisserie chicken with your choice of sides', 2199, true);

-- PLATTERS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000030', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000004', 
   'Shish Tawook Platter', 'Grilled chicken skewers served with rice, hummus & pickles', 1145, true),
  ('b2200000-0000-0000-0000-000000000031', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000004', 
   'Harra Shish Tawook Platter', 'Spicy grilled chicken skewers with rice, hummus & pickles', 1145, true);

-- FRESH SALADS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000040', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000005', 
   'Fattoush', 'Classic Lebanese salad with crispy pita chips & sumac dressing', 540, true),
  ('b2200000-0000-0000-0000-000000000041', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000005', 
   'Chicken Fattoush Salad', 'Fattoush topped with grilled chicken', 750, true),
  ('b2200000-0000-0000-0000-000000000042', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000005', 
   'Meat Fattoush Salad', 'Fattoush topped with seasoned beef', 949, true),
  ('b2200000-0000-0000-0000-000000000043', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000005', 
   'Falafel Salad', 'Fresh salad topped with crispy falafel', 620, true);

-- FAMILY PLATTERS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000050', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000006', 
   'Family Platter (For 2)', '1 Classic & 1 Turkish Chicken Shawarma, 2 Kafta Kebabs, 4 Shish Tawook, Rice, Hummus, Pickles & 500ml Drink', 1900, true),
  ('b2200000-0000-0000-0000-000000000051', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000006', 
   'Family Platter (For 3)', '3 Classic Shawarmas, 6 Harra Shish Tawook, 3 Kafta Kebabs, 3 Falafels, Rice, Hummus, Fattoush, Pickles & 1L Drink', 3200, true),
  ('b2200000-0000-0000-0000-000000000052', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000006', 
   'Family Platter (For 5)', '5 Turkish Shawarmas, 5 Adana Kebabs, 10 Shish Tawook, 10 Hara Shish Tawook, Hummus, Fattoush, Pickles, 2 Umm Ali & 1.5L Drink', 4300, true);

-- KIDS DEAL
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000060', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000007', 
   'Kids Deal', 'Lebanese Nuggets, Fries, Juice & Free Toy', 730, true);

-- SWEET ENDINGS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000070', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000008', 
   'Baklava', 'Layers of flaky phyllo pastry with nuts & honey syrup', 450, true),
  ('b2200000-0000-0000-0000-000000000071', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000008', 
   'Umm Ali', 'Traditional Egyptian bread pudding with cream & nuts', 459, true),
  ('b2200000-0000-0000-0000-000000000072', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000008', 
   'Lotus Cheesecake', 'Creamy cheesecake topped with Lotus Biscoff', 499, true);

-- DRINKS
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000080', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000009', 
   'Sulemani Tea', 'Traditional Lebanese black tea', 299, true),
  ('b2200000-0000-0000-0000-000000000081', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000009', 
   'Water (Small)', 'Mineral water bottle', 99, true),
  ('b2200000-0000-0000-0000-000000000082', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000009', 
   'Soft Drink', 'Coca-Cola, Pepsi, Sprite or 7Up', 119, true);

-- ADD ONS & SAUCES
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, base_price, is_available) VALUES
  ('b2200000-0000-0000-0000-000000000090', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Lebanese Khubz Bread', 'Traditional Lebanese flatbread', 120, true),
  ('b2200000-0000-0000-0000-000000000091', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Saj Bread', 'Thin Lebanese saj bread', 120, true),
  ('b2200000-0000-0000-0000-000000000092', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Extra Chicken (50g)', 'Additional grilled chicken', 249, true),
  ('b2200000-0000-0000-0000-000000000093', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Extra Meat (50g)', 'Additional beef', 249, true),
  ('b2200000-0000-0000-0000-000000000094', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Chili Paste Sauce', 'Spicy Lebanese chili paste', 189, true),
  ('b2200000-0000-0000-0000-000000000095', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Tahini Sauce', 'Creamy sesame tahini', 150, true),
  ('b2200000-0000-0000-0000-000000000096', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Spicy Tahini Sauce', 'Tahini with a kick of spice', 150, true),
  ('b2200000-0000-0000-0000-000000000097', 'b2000000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000010', 
   'Garlic Sauce', 'Classic Lebanese garlic toum', 140, true);

-- =============================================================================
-- ITEM OPTIONS
-- =============================================================================

-- Make it a Meal option for Shawarmas
INSERT INTO item_options (id, menu_item_id, label, price_delta) VALUES
  ('b2300000-0000-0000-0000-000000000001', 'b2200000-0000-0000-0000-000000000010', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000002', 'b2200000-0000-0000-0000-000000000011', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000003', 'b2200000-0000-0000-0000-000000000012', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000004', 'b2200000-0000-0000-0000-000000000013', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000005', 'b2200000-0000-0000-0000-000000000014', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000006', 'b2200000-0000-0000-0000-000000000015', 'Make it a Meal (Fries + Drink)', 350),
  ('b2300000-0000-0000-0000-000000000007', 'b2200000-0000-0000-0000-000000000016', 'Make it a Meal (Fries + Drink)', 350);

-- Rotisserie Chicken options
INSERT INTO item_options (id, menu_item_id, label, price_delta) VALUES
  ('b2300000-0000-0000-0000-000000000010', 'b2200000-0000-0000-0000-000000000022', 'With Bread + Fries', 0),
  ('b2300000-0000-0000-0000-000000000011', 'b2200000-0000-0000-0000-000000000022', 'With Rice + Fries', 301);

-- =============================================================================
-- Note: Prices are exclusive of tax as mentioned in the menu
-- =============================================================================

-- Add curbside (car plate/color) and dine-in (table number) detail columns
-- Run this in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS car_plate_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS car_color text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_number text;

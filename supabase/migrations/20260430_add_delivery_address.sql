-- Migration: Add delivery_address column to orders table
-- Date: 2026-04-30

ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address text;

COMMENT ON COLUMN orders.delivery_address IS 'Customer delivery address - house #, street, area, city';

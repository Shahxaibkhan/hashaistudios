-- Migration: Add tagline column to restaurants table
-- Date: 2026-04-30

ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS tagline text;

COMMENT ON COLUMN restaurants.tagline IS 'Restaurant tagline/slogan, e.g., Authentic Lebanese Cuisine';

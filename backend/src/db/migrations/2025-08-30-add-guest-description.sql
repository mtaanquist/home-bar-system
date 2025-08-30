-- Migration: Add guest description and recipe visibility controls to drinks
ALTER TABLE drinks ADD COLUMN guest_description TEXT;
ALTER TABLE drinks ADD COLUMN show_recipe_to_guests BOOLEAN DEFAULT 0;

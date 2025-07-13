-- Migration: Add base_spirit to drinks
ALTER TABLE drinks ADD COLUMN base_spirit TEXT;

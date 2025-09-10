-- Migration: Add categories table and category support to drinks
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bar_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bar_id) REFERENCES bars (id) ON DELETE CASCADE,
    UNIQUE(bar_id, name)
);

-- Add category_id to drinks table
ALTER TABLE drinks ADD COLUMN category_id INTEGER;

-- Add foreign key constraint (Note: SQLite doesn't support adding FK constraints to existing tables directly,
-- but we'll handle this in the application logic)

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_bar ON categories(bar_id);
CREATE INDEX IF NOT EXISTS idx_drinks_category ON drinks(category_id);

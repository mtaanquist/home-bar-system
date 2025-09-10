-- Migration: Create user favourites table for per-guest favorites
CREATE TABLE IF NOT EXISTS user_favourites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bar_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    drink_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bar_id) REFERENCES bars (id) ON DELETE CASCADE,
    FOREIGN KEY (drink_id) REFERENCES drinks (id) ON DELETE CASCADE,
    UNIQUE(bar_id, customer_name, drink_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_favourites_customer ON user_favourites(bar_id, customer_name);
CREATE INDEX IF NOT EXISTS idx_user_favourites_drink ON user_favourites(drink_id);

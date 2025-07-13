-- Create tables for the bar system
CREATE TABLE IF NOT EXISTS bars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bartender_password_hash TEXT NOT NULL,
    guest_password_hash TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bar_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    recipe TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bar_id) REFERENCES bars (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bar_id INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    drink_id INTEGER NOT NULL,
    drink_title TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bar_id) REFERENCES bars (id) ON DELETE CASCADE,
    FOREIGN KEY (drink_id) REFERENCES drinks (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_bar_status ON orders(bar_id, status);
CREATE INDEX IF NOT EXISTS idx_drinks_bar_stock ON drinks(bar_id, in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

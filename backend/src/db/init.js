import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || "./data/bar.db";

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created directory: ${dbDir}`);
}

const db = new Database(DB_PATH);

// Read and execute schema
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

// Ensure migrations table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Run migrations in /migrations
const migrationsDir = path.join(__dirname, "migrations");
if (fs.existsSync(migrationsDir)) {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  for (const file of files) {
    const already = db
      .prepare("SELECT 1 FROM migrations WHERE name = ?")
      .get(file);
    if (!already) {
      const migrationSQL = fs.readFileSync(
        path.join(migrationsDir, file),
        "utf8"
      );
      db.exec(migrationSQL);
      db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
      console.log(`Applied migration: ${file}`);
    }
  }
}

console.log("Database initialized successfully!");
console.log(`Database location: ${path.resolve(DB_PATH)}`);
db.close();

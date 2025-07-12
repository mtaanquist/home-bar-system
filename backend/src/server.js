import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Import routes
import barRoutes from "./routes/bars.js";
import drinkRoutes from "./routes/drinks.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";

// WebSocket handler
import { setupWebSocket } from "./websocket/handler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Database setup
const DB_PATH = process.env.DB_PATH || "./data/bar.db";

// Ensure the data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created directory: ${dbDir}`);
}

// Ensure uploads directory exists
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created directory: ${uploadsDir}`);
}

export const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent access
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 5MB." });
    }
    if (error.message === "Only image files are allowed!") {
      return res.status(400).json({ error: "Only image files are allowed." });
    }
    console.error("Middleware error:", error);
    return res.status(500).json({ error: "Server error occurred." });
  }
  next();
});

// Routes
app.use("/api/bars", barRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  try {
    // Test database connection
    const result = db.prepare("SELECT 1").get();
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// WebSocket setup (attach to same HTTP server, path: /ws)
const wss = new WebSocketServer({ server, path: "/ws" });
setupWebSocket(wss);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🍸 Bar API running on port ${PORT}`);
  console.log(`📁 Database: ${path.resolve(DB_PATH)}`);
  console.log(`📁 Uploads: ${path.resolve(uploadsDir)}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `🔗 Frontend proxy: ${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }`
    );
  }
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Close HTTP server
  server.close(() => {
    console.log("HTTP server closed.");

    // Close database connection
    try {
      db.close();
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Error closing database:", error);
    }

    console.log("Graceful shutdown complete.");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../server.js";

const router = express.Router();

// Configure multer for image uploads (v1.x syntax)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, "drink-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Get all drinks for a bar
router.get("/bar/:barId", (req, res) => {
  try {
    const barId = req.params.barId;

    const stmt = db.prepare(
      "SELECT * FROM drinks WHERE bar_id = ? ORDER BY created_at DESC"
    );
    const drinks = stmt.all(barId);

    res.json(drinks);
  } catch (error) {
    console.error("Error fetching drinks:", error);
    res.status(500).json({ error: "Failed to fetch drinks" });
  }
});

// Get single drink
router.get("/bar/:barId/drink/:drinkId", (req, res) => {
  try {
    const { barId, drinkId } = req.params;

    const stmt = db.prepare("SELECT * FROM drinks WHERE id = ? AND bar_id = ?");
    const drink = stmt.get(drinkId, barId);

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    res.json(drink);
  } catch (error) {
    console.error("Error fetching drink:", error);
    res.status(500).json({ error: "Failed to fetch drink" });
  }
});

// Upload image endpoint
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Return the URL path for the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Create new drink
router.post("/", (req, res) => {
  try {
    const { barId, title, imageUrl, recipe, baseSpirit } = req.body;

    if (!barId || !title || !recipe) {
      return res
        .status(400)
        .json({ error: "Bar ID, title, and recipe are required" });
    }

    // Verify bar exists
    const barStmt = db.prepare("SELECT id FROM bars WHERE id = ?");
    const bar = barStmt.get(barId);

    if (!bar) {
      return res.status(404).json({ error: "Bar not found" });
    }

    const stmt = db.prepare(`
      INSERT INTO drinks (bar_id, title, image_url, recipe, in_stock, base_spirit)
      VALUES (?, ?, ?, ?, 1, ?)
    `);

    const result = stmt.run(
      barId,
      title.trim(),
      imageUrl || null,
      recipe.trim(),
      baseSpirit || null
    );

    // Return the created drink
    const newDrinkStmt = db.prepare("SELECT * FROM drinks WHERE id = ?");
    const newDrink = newDrinkStmt.get(result.lastInsertRowid);

    res.status(201).json(newDrink);
  } catch (error) {
    console.error("Error creating drink:", error);
    res.status(500).json({ error: "Failed to create drink" });
  }
});

// Update drink
router.put("/:drinkId", (req, res) => {
  try {
    const drinkId = req.params.drinkId;
    const { barId, title, imageUrl, recipe, inStock, baseSpirit } = req.body;

    if (!barId) {
      return res.status(400).json({ error: "Bar ID is required" });
    }

    // Verify drink exists and belongs to the bar
    const checkStmt = db.prepare(
      "SELECT * FROM drinks WHERE id = ? AND bar_id = ?"
    );
    const existingDrink = checkStmt.get(drinkId, barId);

    if (!existingDrink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title.trim());
    }
    if (imageUrl !== undefined) {
      updates.push("image_url = ?");
      values.push(imageUrl || null);
    }
    if (recipe !== undefined) {
      updates.push("recipe = ?");
      values.push(recipe.trim());
    }
    if (inStock !== undefined) {
      updates.push("in_stock = ?");
      values.push(inStock ? 1 : 0);
    }
    if (baseSpirit !== undefined) {
      updates.push("base_spirit = ?");
      values.push(baseSpirit || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(drinkId, barId);

    const stmt = db.prepare(`
      UPDATE drinks 
      SET ${updates.join(", ")} 
      WHERE id = ? AND bar_id = ?
    `);

    stmt.run(...values);

    // Return updated drink
    const updatedDrink = checkStmt.get(drinkId, barId);
    res.json(updatedDrink);
  } catch (error) {
    console.error("Error updating drink:", error);
    res.status(500).json({ error: "Failed to update drink" });
  }
});

// Toggle drink stock status
router.patch("/:drinkId/stock", (req, res) => {
  try {
    const drinkId = req.params.drinkId;
    const { barId } = req.body;

    if (!barId) {
      return res.status(400).json({ error: "Bar ID is required" });
    }

    // Get current stock status
    const checkStmt = db.prepare(
      "SELECT * FROM drinks WHERE id = ? AND bar_id = ?"
    );
    const drink = checkStmt.get(drinkId, barId);

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    // Toggle stock status
    const newStockStatus = drink.in_stock ? 0 : 1;

    const stmt = db.prepare(
      "UPDATE drinks SET in_stock = ? WHERE id = ? AND bar_id = ?"
    );
    stmt.run(newStockStatus, drinkId, barId);

    // Return updated drink
    const updatedDrink = checkStmt.get(drinkId, barId);
    res.json(updatedDrink);
  } catch (error) {
    console.error("Error toggling stock:", error);
    res.status(500).json({ error: "Failed to toggle stock status" });
  }
});

// Delete drink
router.delete("/:drinkId", (req, res) => {
  try {
    const drinkId = req.params.drinkId;
    const { barId } = req.body;

    if (!barId) {
      return res.status(400).json({ error: "Bar ID is required" });
    }

    // Verify drink exists and belongs to the bar
    const checkStmt = db.prepare(
      "SELECT * FROM drinks WHERE id = ? AND bar_id = ?"
    );
    const drink = checkStmt.get(drinkId, barId);

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    // Delete associated image file if it exists
    if (drink.image_url && drink.image_url.startsWith("/uploads/")) {
      const imagePath = "." + drink.image_url;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the drink
    const stmt = db.prepare("DELETE FROM drinks WHERE id = ? AND bar_id = ?");
    const result = stmt.run(drinkId, barId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Drink not found" });
    }

    res.json({ success: true, message: "Drink deleted successfully" });
  } catch (error) {
    console.error("Error deleting drink:", error);
    res.status(500).json({ error: "Failed to delete drink" });
  }
});

// Get drinks analytics for a bar
router.get("/bar/:barId/analytics", (req, res) => {
  try {
    const barId = req.params.barId;

    // Get popular drinks based on order history
    const popularStmt = db.prepare(`
      SELECT drink_title, COUNT(*) as order_count
      FROM orders 
      WHERE bar_id = ? 
      GROUP BY drink_title 
      ORDER BY order_count DESC 
      LIMIT 10
    `);
    const popularDrinks = popularStmt.all(barId);

    // Get total drinks count
    const totalStmt = db.prepare(
      "SELECT COUNT(*) as total FROM drinks WHERE bar_id = ?"
    );
    const totalDrinks = totalStmt.get(barId).total;

    // Get in-stock drinks count
    const inStockStmt = db.prepare(
      "SELECT COUNT(*) as total FROM drinks WHERE bar_id = ? AND in_stock = 1"
    );
    const inStockDrinks = inStockStmt.get(barId).total;

    res.json({
      popularDrinks,
      totalDrinks,
      inStockDrinks,
      outOfStockDrinks: totalDrinks - inStockDrinks,
    });
  } catch (error) {
    console.error("Error fetching drinks analytics:", error);
    res.status(500).json({ error: "Failed to fetch drinks analytics" });
  }
});

export default router;

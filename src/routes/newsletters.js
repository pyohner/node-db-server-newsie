const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all newsletters
router.get("/", (req, res) => {
    db.all("SELECT * FROM newsletters", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a single newsletter by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM newsletters WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Newsletter not found" });
            return;
        }
        res.json(row);
    });
});

// Create a new newsletter
router.post("/", (req, res) => {
    const { name, summary, category, photo, frequency, description, featured } = req.body;
    if (!name || !summary) {
        res.status(400).json({ error: "Title and summary are required" });
        return;
    }

    const query = "INSERT INTO newsletters (name, summary, category, photo, frequency, description, featured) " + "" +
        "VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.run(query, [name, summary, category || "", photo || "", frequency || "", description || "", featured || 0], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, summary, category, photo, frequency, description, featured  });
    });
});

module.exports = router;

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

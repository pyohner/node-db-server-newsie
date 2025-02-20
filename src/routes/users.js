const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all users
router.get("/", (req, res) => {
    db.all("SELECT id, username, password, email FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create a new user
router.post("/", (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(400).json({ error: "Username, password, and email are required" });
        return;
    }

    const query = `
        INSERT INTO users (username, password, email) 
        VALUES (?, ?, ?)
    `;

    db.run(query, [username, password, email], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, username, password, email });
    });
});

module.exports = router;

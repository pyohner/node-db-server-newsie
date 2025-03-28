const express = require("express");
const db = require("../db");
const bcrypt = require('bcrypt');

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
router.post("/", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required" });
    }

    try {
        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (username, password, email) 
            VALUES (?, ?, ?)
        `;

        db.run(query, [username, hashedPassword, email], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // Don't return the password in the response
            res.json({ id: this.lastID, username, email });
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to hash password" });
    }
});

module.exports = router;

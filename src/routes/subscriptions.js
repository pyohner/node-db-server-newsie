const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all subscriptions
router.get("/", (req, res) => {
    const query = `
        SELECT subscriptions.userId, subscriptions.newsletterId, users.username, newsletters.name AS newsletter 
        FROM subscriptions
        JOIN users ON subscriptions.userId = users.id
        JOIN newsletters ON subscriptions.newsletterId = newsletters.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Subscribe a user to a newsletter
router.post("/", (req, res) => {
    const { userId, newsletterId } = req.body;

    if (!userId || !newsletterId) {
        res.status(400).json({ error: "User ID and Newsletter ID are required" });
        return;
    }

    const query = `
        INSERT INTO subscriptions (userId, newsletterId) 
        VALUES (?, ?)
    `;

    db.run(query, [userId, newsletterId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ userId, newsletterId });
    });
});

// Unsubscribe a user from a newsletter
router.delete("/", (req, res) => {
    const { userId, newsletterId } = req.body;

    if (!userId || !newsletterId) {
        res.status(400).json({ error: "User ID and Newsletter ID are required" });
        return;
    }

    const query = "DELETE FROM subscriptions WHERE userId = ? AND newsletterId = ?";

    db.run(query, [userId, newsletterId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Subscription removed", userId, newsletterId });
    });
});

module.exports = router;

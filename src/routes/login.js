const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Retrieve user by email
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Log for debugging (remove in production)
        // console.log("User from DB:", user);
        // console.log("Submitted password:", password);

        try {
            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // Remove the password from the user object before sending the response
            const { password: _, ...safeUser } = user;
            res.json({ message: "Login successful", user: safeUser });
        } catch (error) {
            res.status(500).json({ error: "Password verification failed" });
        }
    });
});

module.exports = router;

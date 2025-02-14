const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to the database file (inside the "db" directory)
const dbPath = path.join(__dirname, "../db/newsie.db");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

module.exports = db;

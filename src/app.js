const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
app.use("/api/newsletters", require("./routes/newsletters"));
app.use("/api/users", require("./routes/users"));
app.use("/api/subscriptions", require("./routes/subscriptions"));
app.use("/api/login", require("./routes/login"));

// Test route
app.get("/", (req, res) => {
    res.send("Newsie API is running!");
});

module.exports = app;

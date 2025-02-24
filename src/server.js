const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3333;


// Middleware
app.use(cors()); // Allows cross-origin requests from your Angular app
app.use(express.json()); // Parses JSON request bodies

// Import routes
const newslettersRoutes = require("./routes/newsletters");
app.use("/api/newsletters", newslettersRoutes);

const usersRoutes = require("./routes/users");
app.use("/api/users", usersRoutes);

const subscriptionsRoutes = require("./routes/subscriptions");
app.use("/api/subscriptions", subscriptionsRoutes);

// Basic test route
app.get("/", (req, res) => {
    res.send("Newsie API is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// backend/server.js
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

// Import the custom error handling middleware (we'll define this below in this file)
const { errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all routes (important for frontend communication)
app.use(cors());

// --- Register Item Routes ---
app.use("/api/items", require("./routes/itemRoutes"));

// --- Register User Routes --- (NEW)
app.use("/api/users", require("./routes/userRoutes"));

// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("CRUD API is running...");
});

// --- Custom Error Handling Middleware --- (NEW)
// This must be placed after your routes
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController"); // Import user controller functions

// Import the authentication middleware (we'll create this file next)
const { protect } = require("../middleware/authMiddleware");

// Define routes for user registration and login (public routes)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Define a route to get the current logged-in user's data (private route)
// The 'protect' middleware will run first to verify the token before getMe executes
router.get("/me", protect, getMe);

module.exports = router;

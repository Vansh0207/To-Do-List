// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken"); // For verifying JWTs
const asyncHandler = require("express-async-handler"); // For simplifying async error handling
const User = require("../models/User"); // To find user by ID after token verification

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (decoded contains the user ID)
      // Select -password means don't return the password hash
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error("Not authorized, user not found");
      }

      next(); // Call next middleware/controller function
    } catch (error) {
      console.error(error); // Log the actual error for debugging
      res.status(401); // Unauthorized
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };

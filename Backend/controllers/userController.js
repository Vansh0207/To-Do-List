// backend/controllers/userController.js
const asyncHandler = require("express-async-handler"); // Import express-async-handler
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const User = require("../models/User"); // Import the User model

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // Destructure data from request body

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user (password will be hashed by pre-save middleware in User model)
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      // 201 Created
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate and send JWT
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user (login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  // Check if user exists and password matches (using the method from User model)
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate and send JWT
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user data (e.g., current logged-in user's profile)
// @route   GET /api/users/me
// @access  Private (requires authentication)
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware (which we will create next)
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

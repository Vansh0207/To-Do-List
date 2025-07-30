// backend/models/User.js
const mongoose = require("mongoose"); // Import Mongoose
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Email must be unique for each user
      trim: true, // Remove whitespace from both ends of a string
      match: [
        // Regex for basic email format validation
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// --- New: Password Hashing Middleware ---
// This will run BEFORE saving a user document to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Only hash if the password field is new or has been modified
    next(); // Move to the next middleware (or save operation)
  }

  // Generate a salt (random string) to combine with the password before hashing
  const salt = await bcrypt.genSalt(10); // 10 is the salt rounds (cost factor)

  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Move to the next middleware (or save operation)
});

// --- New: Method to Compare Passwords ---
// This will be used during login to check if the entered password matches the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered plaintext password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

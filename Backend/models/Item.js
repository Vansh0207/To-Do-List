// backend/models/Item.js
const mongoose = require("mongoose");

// Define the schema (structure) for a 'To-Do' document
const itemSchema = mongoose.Schema(
  {
    // New: User field to link item to its creator
    user: {
      type: mongoose.Schema.Types.ObjectId, // This type indicates it's an ObjectId from MongoDB
      required: true, // Every item must be associated with a user
      ref: "User", // This tells Mongoose that this ObjectId refers to the 'User' model
    },
    // 'name' field: Represents the task title
    name: {
      type: String,
      required: [true, "Please add a name for the task"],
    },
    // 'description' field: Represents the task's description
    description: {
      type: String,
      required: false,
      default: "",
    },
    // 'estimatedTime' field: New field for time devoted to the task
    estimatedTime: {
      type: Number,
      required: [true, "Please add an estimated time in minutes"],
      min: [0, "Estimated time cannot be negative"],
      default: 0,
    },
    // 'completed' field: New boolean field to mark task as done
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ name: 1, user: 1 }, { unique: true });

// Create a Mongoose Model from the schema
module.exports = mongoose.model("Item", itemSchema);

// backend/models/Item.js
const mongoose = require("mongoose");

// Define the schema (structure) for a 'To-Do' document
const itemSchema = mongoose.Schema(
  {
    // 'name' field: Represents the task title
    name: {
      type: String,
      required: [true, "Please add a name for the task"], // Consistent message for To-Do context
      unique: true, // Task names should still be unique
    },
    // 'description' field: Represents the task's description
    description: {
      type: String,
      required: false, // Description is optional
      default: "", // Default to empty string if not provided
    },
    // 'estimatedTime' field: New field for time devoted to the task
    estimatedTime: {
      type: Number, // Assuming time in minutes or hours (e.g., 60 for 60 minutes)
      required: [true, "Please add an estimated time in minutes"], // Required for a To-Do
      min: [0, "Estimated time cannot be negative"], // Minimum value for time
      default: 0, // Default to 0 if not provided
    },
    // 'completed' field: New boolean field to mark task as done
    completed: {
      type: Boolean, // Data type is Boolean (true/false)
      default: false, // Default to false (not completed) when created
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
);

// Create a Mongoose Model from the schema
module.exports = mongoose.model("Item", itemSchema); // Still using 'Item' as the model name

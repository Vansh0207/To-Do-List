// backend/controllers/itemController.js
const Item = require("../models/Item"); // Import the Item model

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Find all documents
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new item (To-Do Task)
// @route   POST /api/items
// @access  Public
const createItem = async (req, res) => {
  try {
    // Basic server-side validation for required fields
    if (!req.body.name) {
      return res
        .status(400)
        .json({ message: "Please add a name for the task" });
    }
    if (!req.body.estimatedTime) {
      return res
        .status(400)
        .json({ message: "Please add an estimated time in minutes" });
    }

    // Create a new item document, including the new fields
    const item = await Item.create({
      name: req.body.name,
      description: req.body.description || "", // Use default from schema if not provided
      estimatedTime: req.body.estimatedTime,
      completed: req.body.completed || false, // Use default from schema if not provided
    });
    res.status(201).json(item);
  } catch (error) {
    // Handle Mongoose validation errors (e.g., 'name' unique, min value for estimatedTime)
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an item (To-Do Task)
// @route   PUT /api/items/:id
// @access  Public
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Find and update the item using req.body directly.
    // Mongoose will automatically apply schema validators and defaults
    // for fields present in req.body.
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Public
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Item.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ id: req.params.id, message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

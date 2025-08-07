// backend/controllers/itemController.js
const Item = require("../models/Item"); // Import the Item model
const asyncHandler = require("express-async-handler"); // Import express-async-handler for error handling

// @desc    Get all items for the logged-in user
// @route   GET /api/items
// @access  Private
const getItems = asyncHandler(async (req, res) => {
  // This is the CRITICAL line that filters tasks by user ID
  // req.user._id is populated by the 'protect' middleware
  const items = await Item.find({ user: req.user._id });
  res.status(200).json(items);
});

// @desc    Get single item for the logged-in user
// @route   GET /api/items/:id
// @access  Private
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  // This check ensures the found item belongs to the logged-in user
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized to view this item");
  }

  res.status(200).json(item);
});

// @desc    Create new item (To-Do Task) for the logged-in user
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  // Basic server-side validation for required fields
  if (!req.body.name) {
    res.status(400);
    throw new Error("Please add a name for the task");
  }
  if (!req.body.estimatedTime) {
    res.status(400);
    throw new new Error("Please add an estimated time in minutes")();
  }

  // Check if a task with this name already exists for THIS USER
  const existingItem = await Item.findOne({
    name: req.body.name,
    user: req.user._id,
  });
  if (existingItem) {
    res.status(400);
    throw new Error("You already have a task with this name.");
  }

  // Create a new item document, linking it to the logged-in user
  const item = await Item.create({
    user: req.user._id, // This line links the new task to the user
    name: req.body.name,
    description: req.body.description || "",
    estimatedTime: req.body.estimatedTime,
    completed: req.body.completed || false,
  });
  res.status(201).json(item);
});

// @desc    Update an item (To-Do Task) for the logged-in user
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  // This check ensures the item to be updated belongs to the logged-in user
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized to update this item");
  }

  // Check for duplicate name if name is being updated
  if (req.body.name && req.body.name !== item.name) {
    const existingItem = await Item.findOne({
      name: req.body.name,
      user: req.user._id,
    });
    if (existingItem && existingItem._id.toString() !== req.params.id) {
      res.status(400);
      throw new Error("You already have another task with this name.");
    }
  }

  // Find and update the item.
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });
  res.status(200).json(updatedItem);
});

// @desc    Delete an item for the logged-in user
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  // This check ensures the item to be deleted belongs to the logged-in user
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized to delete this item");
  }

  await Item.deleteOne({ _id: req.params.id });
  res
    .status(200)
    .json({ id: req.params.id, message: "Item removed successfully" });
});

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

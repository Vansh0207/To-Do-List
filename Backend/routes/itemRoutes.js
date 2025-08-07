// backend/routes/itemRoutes.js
const express = require("express"); // Import the Express library
const router = express.Router(); // Create a new router instance from Express
const {
  // Destructure (import) the controller functions from itemController.js
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemcontroller"); // Assuming your file is named itemcontroller.js with a lowercase 'c'

// Import the authentication middleware
const { protect } = require("../middleware/authMiddleware"); // <-- THIS LINE IS CRITICAL

// Define routes for the base path '/api/items', now protected
router
  .route("/")
  .get(protect, getItems) // CRITICAL: 'protect' middleware added here
  .post(protect, createItem); // CRITICAL: 'protect' middleware added here

// Define routes for paths like '/api/items/:id', now protected
router
  .route("/:id")
  .get(protect, getItemById) // CRITICAL: 'protect' middleware added here
  .put(protect, updateItem) // CRITICAL: 'protect' middleware added here
  .delete(protect, deleteItem); // CRITICAL: 'protect' middleware added here

module.exports = router; // Export the router so it can be used by the main server file (server.js)

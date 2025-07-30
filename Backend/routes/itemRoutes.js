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
} = require("../controllers/itemcontroller"); //this line maybe wrong so keep an eye on it.

// Define routes for the base path '/api/items' (which will be handled by server.js)
router
  .route("/")
  .get(getItems) // When a GET request comes to /api/items, call the getItems function
  .post(createItem); // When a POST request comes to /api/items, call the createItem function

// Define routes for paths like '/api/items/:id' (where :id is a placeholder for a specific item's ID)
router
  .route("/:id")
  .get(getItemById) // When a GET request comes to /api/items/:id, call getItemById
  .put(updateItem) // When a PUT request comes to /api/items/:id, call updateItem
  .delete(deleteItem); // When a DELETE request comes to /api/items/:id, call deleteItem

module.exports = router; // Export the router so it can be used by the main server file (server.js)

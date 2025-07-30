// backend/config/db.js
const mongoose = require("mongoose"); // Import the Mongoose library

const connectDB = async () => {
  // Define an asynchronous function to connect to the database
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // If connection is successful, log the host it connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    // If an error occurs during connection, log the error message
    console.error(`Error: ${err.message}`);
    // Exit the process with a failure code (1)
    process.exit(1);
  }
};

module.exports = connectDB; // Export the connectDB function so it can be used in other files (like server.js)

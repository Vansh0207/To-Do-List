// backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  // Determine the status code: if a response status was already set, use it; otherwise, default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode); // Set the response status code

  // Send a JSON response with the error message
  res.json({
    message: err.message, // The error message
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Stack trace only in development
  });
};

module.exports = { errorHandler };

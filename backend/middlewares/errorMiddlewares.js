// TODO: Implement centralized error handling middleware for Express.js

// Custom ErrorHandler class to handle errors with a status code
class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  // Express.js middleware to handle errors globally
  const errorMiddleware = (err, req, res, next) => {
    // Set default values if not provided
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    // Handle MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
      err.statusCode = 400;
      err.message = "Duplicate Field Value Entered";
      err = new ErrorHandler(err.message, err.statusCode);
    }
  
    // Handle invalid JWT token error
    if (err.name === "JsonWebTokenError") {
      err.statusCode = 400;
      err.message = "Json Web Token is Invalid, Try again.";
      err = new ErrorHandler(err.message, err.statusCode);
    }
  
    // Handle expired JWT token error
    if (err.name === "TokenExpiredError") {
      err.statusCode = 400;
      err.message = "Json Web Token is Expired, Try again.";
      err = new ErrorHandler(err.message, err.statusCode);
    }
  
    // Handle Mongoose CastError (invalid object ID)
    if (err.name === "CastError") {
      err.statusCode = 400;
      err.message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(err.message, err.statusCode);
    }
  
    // Extract validation error messages if available
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    // Send error response
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  // Export the ErrorHandler class and middleware function
  module.exports = { ErrorHandler, errorMiddleware };
  
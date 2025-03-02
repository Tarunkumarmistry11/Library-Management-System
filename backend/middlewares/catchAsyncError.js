// TODO: Create a middleware to handle asynchronous errors in Express routes

/**
 * Higher-order function to handle async errors in Express routes.
 * Automatically catches errors and forwards them to the error handling middleware.
 *
 * @param {Function} theFunction - The async function to be wrapped.
 * @returns {Function} Middleware function that handles errors.
 */
const catchAsyncErrors = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
  
  module.exports = catchAsyncErrors;
  
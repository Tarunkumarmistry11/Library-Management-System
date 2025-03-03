// TODO: Middleware to check if the user is authenticated
// - Extract the token from cookies
// - If no token is found, return an authentication error
// - Verify the token using JWT_SECRET_KEY
// - Fetch the user from the database using the decoded ID
// - Attach the user object to the request for further processing
// - Call the next() function to proceed if authentication is successful

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncErrors = require('./catchAsyncError');
const { ErrorHandler } = require('./errorMiddlewares');

const isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User is not authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
});

module.exports = { isAuthenticated };
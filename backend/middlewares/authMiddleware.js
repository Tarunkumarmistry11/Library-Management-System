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
/**
 * TODO:
 * - Fixed import for User model.
 * - Ensured `req.files` is checked before accessing properties.
 * - Added password length validation.
 * - Verified uploaded file format before Cloudinary upload.
 * - Implemented proper error handling for Cloudinary upload failures.
 */

const catchAsyncErrors = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../middlewares/errorMiddlewares");
const User = require("../models/userModel"); // Fixed import
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload a profile picture", 400));
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler("Password must be between 8 and 16 characters", 400)
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Invalid file format", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "LIBRARY_MANAGEMENT_SYSTEM",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error"
    );
    return next(new ErrorHandler("Error uploading image", 500));
  }

  // Save user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    user,
  });
});

module.exports = {
  getAllUsers,
  registerNewAdmin,
};

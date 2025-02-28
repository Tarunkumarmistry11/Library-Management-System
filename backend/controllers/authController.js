const catchAsyncErrors = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../middlewares/errorMiddlewares");
const User = require("../models/userModel"); 
const bcrypt = require("bcrypt");
const { sendVerificationCode } = require("../utils/sendVerificationCode");

const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all the fields.", 400));
    }

    // Check if email is already registered & verified
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    // Limit registration attempts for unverified users
    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registrationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please contact support.",
          400
        )
      );
    }

    // Validate password length
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 and 16 characters.", 400)
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate verification code for this user
    const verificationCode = user.generateVerificationCode();

    // Save user with verification code
    await user.save();

    // Send verification email
    await sendVerificationCode(verificationCode, email, res);

  } catch (error) {
    return next(new ErrorHandler("Registration failed.", 500));
  }
});

module.exports = register;

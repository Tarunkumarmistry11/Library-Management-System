// TODO:
// - Implement rate limiting for OTP verification attempts.
// - Improve error handling for unexpected scenarios.
// - Add logging for debugging registration and verification failures.

const catchAsyncErrors = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddlewares");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { sendVerificationCode } = require("../utils/sendVerificationCode");
const { sendToken } = require("../utils/sendToken");
const { generateForgotPasswordEmailTemplate } = require("../utils/emailTemplate");

const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

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

    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler("Password must be between 8 and 16 characters.", 400)
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = (
      Math.floor(Math.random() * 900000) + 100000
    ).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpire: Date.now() + 15 * 60 * 1000, // Expires in 15 minutes
    });

    await user.save();

    await sendVerificationCode(verificationCode, email, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Verification code sent.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return next(new ErrorHandler(error.message || "Registration failed.", 500));
  }
});

const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter email and OTP", 400));
  }

  try {
    const userAllEntries = await User.find({ email }).sort({ createdAt: -1 });
    console.log("User entries found:", userAllEntries);

    if (userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found", 404));
    }

    //Filter for unverified user

    const unverifiedUser = userAllEntries.filter(
      (user) => !user.accountVerified
    );
    if (unverifiedUser.length === 0) {
      return next(new ErrorHandler("User already verified", 400));
    }

    let user = userAllEntries[0];

    if (userAllEntries.length > 1) {
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    }

    console.log("Stored OTP:", user.verificationCode);

    if (user.verificationCode.toString() !== otp.toString()) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
      return next(new ErrorHandler("OTP expired", 400));
    }

    console.log("Before saving:", user);
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save();
    console.log("After saving:", user);

    sendToken(user, 200, "Account verified successfully", res);
  } catch (error) {
    return next(new ErrorHandler(error.message || "Verification failed.", 500));
  }
});

//Implement the login function
const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const emailNormalized = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailNormalized }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", 400));
  }

  sendToken(user, 200, "Login successful", res);
});

//Implement the logout function
const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// implement forgotPassword function
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);
  try{
    await sendEmail({ email: user.email, subject: "Bookworm Library Management System Password Recovery", message });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email could not be sent", 500));
  }
});


module.exports = { register, verifyOTP, login, logout, getUser, forgotPassword };

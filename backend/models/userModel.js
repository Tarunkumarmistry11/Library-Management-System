// TODO:
// - Define Mongoose schema for User model
// - Ensure email uniqueness before saving
// - Hash password before saving
// - Generate and expire 6-digit verification codes
// - Implement JWT token generation for authentication
// - Hide password field in JSON responses
// - Implement reset password token generation and expiration
// - Define user roles ("Admin" and "User")
// - Store user avatar with public ID and URL
// - Manage borrowed books with tracking for return status and due dates
// - Ensure timestamps are included for user creation and updates

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    accountVerified: { type: Boolean, default: false },
    borrowedBooks: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Borrow" },
        returned: { type: Boolean, default: false },
        bookTitle: String,
        borrowedDate: { type: Date, default: Date.now },
        dueDate: {
          type: Date,
          default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }, // 14 days
      },
    ],
    avatar: { public_id: String, url: String },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Ensure Email is Unique Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) return next();
  const existingUser = await mongoose
    .model("User")
    .findOne({ email: this.email });
  if (existingUser) {
    throw new Error("Email already exists. Try logging in.");
  }
  next();
});

// Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate Secure 6-digit Verification Code
userSchema.methods.generateVerificationCode = function () {
  this.verificationCode = Math.floor(100000 + Math.random() * 900000);
  this.verificationCodeExpire = new Date(Date.now() + 15 * 60 * 1000); // Convert to Date object
  return this.verificationCode;
};

// Generate JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Hide Password in Query Results
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and store it in the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration time (15 minutes from now)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Returning plain token to send via email
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

// TODO: Define a Mongoose schema for user data with authentication and book borrowing details

// Create the User Schema
const userSchema = new mongoose.Schema(
  {
    // TODO: Store the user's name with trimming to remove extra spaces
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // TODO: Store the user's email in lowercase and ensure uniqueness
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // Prevents duplicate emails
    },

    // TODO: Store the user's hashed password (not selected by default in queries)
    password: {
      type: String,
      required: true,
      select: false, // Prevents password from being returned in queries
    },

    // TODO: Assign roles to users (either Admin or User, default is User)
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },

    // TODO: Track whether the user's account is verified
    accountVerified: {
      type: Boolean,
      default: false,
    },

    // TODO: Maintain a list of borrowed books by the user
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow", // Ensure this references a valid Mongoose model
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],

    // TODO: Store user's profile picture using Cloudinary or other storage services
    avatar: {
      public_id: String,
      url: String,
    },

    // TODO: Store verification code and expiration time for email verification
    verificationCode: Number,
    verificationCodeExpire: Date,

    // TODO: Store reset token and expiration time for password recovery
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // TODO: Automatically add createdAt and updatedAt fields
  }
);

// TODO: Method to generate a random 5-digit verification code
userSchema.methods.generateVerificationCode = function () {
  const generateRandomFiveDigitNumber = () => {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Ensure the first digit isn't 0
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + remainingDigits);
  };

  this.verificationCode = generateRandomFiveDigitNumber();
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes
  return this.verificationCode;
};

// TODO: Export the User model for database interactions
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

/**
 * TODO:
 * - Defined a Mongoose schema for the Borrow model.
 * - Linked the Borrow model with User and Book models using ObjectId references.
 * - Included fields to track borrow date, due date, return date, fine, and notification status.
 */

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Borrow", borrowSchema);

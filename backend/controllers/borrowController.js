/**
 * TODO:
 * - Retrieve borrowed books for a user
 * - Record a new borrowed book with validation
 * - Prevent multiple borrowing of the same book
 * - Manage stock updates upon borrowing/returning
 * - Implement fine calculation for late returns
 */

const catchAsyncErrors = require("../middlewares/catchAsyncError");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const { ErrorHandler } = require("../middlewares/errorMiddlewares");
const calculateFine = require("../utils/fineCalculator");

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  // Check if book exists
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if book is in stock
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is out of stock", 400));
  }

  // Check if the user has already borrowed the book
  const isAlreadyBorrowed = await Borrow.findOne({
    user: user._id,
    book: book._id,
    returnDate: null,
  });

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book is already borrowed", 400));
  }

  // Update book quantity
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Add borrowed book details to user
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    returned: false,
  });
  await user.save();

  // Create a borrow record
  const newBorrow = await Borrow.create({
    user: user._id, // Use ObjectId only
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  // Debugging: Log the new borrow record
  console.log("New borrow record created:", newBorrow);

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully.",
  });
});

const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find()
    .populate("user", "name email")
    .populate("book", "title");
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  // Find the user
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Debugging: Log the user's borrowed books
  console.log("User's borrowed books:", user.borrowedBooks);

  // Find the borrow record
  const borrow = await Borrow.findOne({
    user: user._id,
    book: bookId,
    returnDate: null,
  });

  // Debugging: Log the borrow record search result
  console.log("Borrow record found:", borrow);

  if (!borrow) {
    return next(new ErrorHandler("Book is not borrowed", 400));
  }

  // Find the book
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Mark book as returned in the user's record
  const borrowedBookIndex = user.borrowedBooks.findIndex(
    (b) => b.bookId && b.bookId.toString() === bookId && b.returned === false
  );

  // Debugging: Log the index of the borrowed book
  console.log(
    "Index of the borrowed book in user's records:",
    borrowedBookIndex
  );

  if (borrowedBookIndex === -1) {
    return next(new ErrorHandler("Book is not borrowed", 400));
  }

  user.borrowedBooks[borrowedBookIndex].returned = true;
  await user.save();

  // Increase book quantity and update availability
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update return date and calculate fine
  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  // Respond to the user
  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has been returned successfully. The total charges, including any applicable fines, are $${
            fine + book.price
          }`
        : `The book has been returned successfully. The total charges are $${book.price}`,
  });
});

module.exports = {
  borrowedBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowedBook,
};

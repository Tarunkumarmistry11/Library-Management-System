const catchAsyncErrors = require("../middlewares/catchAsyncError");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const { ErrorHandler } = require("../middlewares/errorMiddlewares");

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {});

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
    const isAlreadyBorrowed = user.borrowedBooks.find(
      (b) => b.book && b.book.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
      return next(new ErrorHandler("Book is already borrowed", 400));
    }
  
    // Update book quantity
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();
  
    // Add borrowed book details to user
    user.borrowedBooks.push({
      book: book._id,
      borrowedDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      returned: false,
    });
    await user.save();
  
    // Create a borrow record
    await Borrow.create({
      user: user._id,
      book: book._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      price: book.price,
    });
  
    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
    });
  });

const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {});
const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {});

module.exports = {
  borrowedBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowedBook,
};

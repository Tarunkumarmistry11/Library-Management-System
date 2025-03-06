const catchAsyncErrors = require("../middlewares/catchAsyncError");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const { ErrorHandler } = require("../middlewares/errorMiddlewares");
const calculateFine = require("../utils/fineCalculator");

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

  // Debugging: Log the current borrowed books of the user
  console.log("User's borrowed books:", user.borrowedBooks);

  // Check if the user has already borrowed the book
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b && b.bookId && b.bookId.toString() === id && b.returned === false
  );

  // Debugging: Log the result of the borrowed book check
  console.log("Is already borrowed:", isAlreadyBorrowed);

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
  await Borrow.create({
    user: {
      id: user._id.toString(), // Ensure the id is a string
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully.",
  });
});

const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {});
const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  // Find the book
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Find the user
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Debugging: Log the current borrowed books of the user
  console.log("User's borrowed books:", user.borrowedBooks);

  // Find the borrowed book in the user's records
  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId && b.bookId.toString() === bookId && b.returned === false
  );

  // Debugging: Log the result of the borrowed book check
  console.log("Borrowed book check result:", borrowedBook);

  if (!borrowedBook) {
    return next(new ErrorHandler("Book is not borrowed", 400));
  }

  // Mark book as returned in the user's record
  borrowedBook.returned = true;
  await user.save();

  // Increase book quantity and update availability
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Find the borrow record in the database
  console.log(
    "SEARCHING BORROW RECORD WITH BOOK:",
    bookId,
    "and user:",
    user._id
  );
  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });
  console.log("FOUND BORROW RECORD:", borrow);
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

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

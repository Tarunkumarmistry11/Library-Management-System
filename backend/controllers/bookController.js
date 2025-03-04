// TODO:  
// - Develop book management functionalities, including adding, retrieving, and deleting books.  
// - Ensure proper error handling and validation for input fields.  
// - Utilize async error handling for better code maintainability.  

const catchAsyncErrors = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/errorMiddlewares");
const  Book  = require("../models/bookModel");

// TODO: Add a new book to the database with necessary validations.

const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill in all fields", 400));
  }
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });
  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// TODO: Retrieve all books from the database.
const getAllBook = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    success: true,
    books,
  });
});

// TODO: Delete a specific book by ID with error handling.

const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }
  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

module.exports = { addBook, deleteBook, getAllBook };

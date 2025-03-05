const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../middlewares/errorMiddlewares');
const Borrow = require('../models/borrowModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

const borrowedBooks = catchAsyncErrors(async (req, res, next) => {

});

const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const {email} = req.body;
    const book = await Book.findById(id);
    if(!book) {
        return next(new ErrorHandler('Book not found', 404));
    }
    const user = await User.findOne({email});
    if(!user){
        return next(new ErrorHandler('User not found', 404));
    }
    if(book.quantity === 0) {
        return next(new ErrorHandler('Book is out of stock', 400));
    }
    const isAlreadyBorrowed = user.borrowedBooks.find(b => b.book.toString() === id && b.return === false);
    if(!isAlreadyBorrowed) {
        return next(new ErrorHandler('Book is already borrowed', 400));
    }
});

const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {

});
const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {

});

module.exports = { borrowedBooks, recordBorrowedBook, getBorrowedBooksForAdmin, returnBorrowedBook };


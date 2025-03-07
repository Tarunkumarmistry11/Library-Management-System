/**
 * TODO:
 * - Define routes for borrowing and returning books.
 * - Ensure authentication for all routes.
 * - Allow only Admin users to record and view borrowed books.
 * - Enable users to view their own borrowed books.
 * - Provide a route for returning borrowed books.
 */

const express = require("express");
const {
  borrowedBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowedBook,
} = require("../controllers/borrowController");

const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/record-borrow-book/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  recordBorrowedBook
);
router.get(
  "/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getBorrowedBooksForAdmin
);

router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);
router.put(
  "/return-borrowed-book/:bookId",
  isAuthenticated,
  isAuthorized("Admin"),
  returnBorrowedBook
);

module.exports = router;

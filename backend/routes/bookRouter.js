const express = require("express");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");
const { addBook, getAllBook, deleteBook } = require("../controllers/bookController");

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

module.exports = router;
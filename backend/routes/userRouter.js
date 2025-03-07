/**
 * TODO:
 * - Define routes for user management.
 * - Ensure authentication for all routes.
 * - Allow only Admin users to view all users.
 * - Enable Admin users to register new Admins.
 */

const express = require("express");
const {
  getAllUsers,
  registerNewAdmin,
} = require("../controllers/userController");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("Admin"),
  registerNewAdmin
);

module.exports = router;

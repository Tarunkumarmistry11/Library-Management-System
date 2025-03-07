// TODO:
// - Set up authentication routes
// - Implement user registration (`/register`)
// - Implement OTP verification (`/verify-otp`)
// - Implement user login (`/login`)
// - Implement user logout (`/logout`) - requires authentication
// - Implement user profile retrieval (`/me`) - requires authentication
// - Implement forgot password functionality (`/password/forgot`)
// - Implement password reset functionality (`/password/reset/:token`)
// - Implement password update functionality (`/password/update`) - requires authentication
// - Ensure `isAuthenticated` middleware is applied to protected routes

const express = require("express");
const {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

module.exports = router;

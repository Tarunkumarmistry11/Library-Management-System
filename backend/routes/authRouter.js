const express = require("express");
const { register, verifyOTP } = require("../controllers/authController"); // Ensure correct import

const router = express.Router();

router.post("/register", register); // Ensure `register` is correctly imported
router.post("/verify-otp", verifyOTP); // Ensure `verifyOtp` is correctly imported

module.exports = router;

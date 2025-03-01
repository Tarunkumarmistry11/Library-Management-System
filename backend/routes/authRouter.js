const express = require("express");
const { register } = require("../controllers/authController"); // Ensure correct import

const router = express.Router();

router.post("/register", register); // Ensure `register` is correctly imported

module.exports = router;

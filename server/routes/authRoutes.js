const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");


//Register
router.post("/register", authController.register);


// // Login
router.post("/login", authController.login);


// // Verify OTP
router.post("/verify-otp", authController.verifyOtp);


module.exports = router;
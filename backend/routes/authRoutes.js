const express = require('express');
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const { validateUser } = require("../middleware/validator");
const authController  = require("../controllers/authController");

const router = express.Router();

// http://localhost:5000


//@route   POST api/auth/register
//@desc    Register user
//@access  Public
router.post("/register", validateUser, authController.register);

//@route   POST api/auth/login
//@desc    Register user
//@access  Public
router.post("/login", authController.login);

//@route   POST api/auth/logout
//@desc    Logout user
//@access  Private
router.post("/logout", authenticateUser, authController.logout);

//@route   GET api/auth/checkCurrent
//@desc    Get current user profile(by token)
//@access  Private
router.get("/checkCurrent", authenticateUser,  authController.checkCurrent);

//@route   POST api/auth/sendVerifyOtp
//@desc    Send verification OTP to the user email
//@access  Private
router.post("/sendVerifyOtp", authenticateUser, authController.sendVerifyOtp);

//@route   POST api/auth/verifyEmail
//@desc    Verify email by otp
//@access  Private
router.post("/verifyEmail", authenticateUser, authController.verifyEmail);

//@route   POST api/auth/sendResetOtp
//@desc    Get otp to reset password
//@access  Public
router.post("/sendResetOtp", authController.forgotPassword);

//@route   POST api/auth/resetPassword
//@desc    Reset password
//@access  Public
router.post("/resetPassword", authController.resetPassword);


module.exports = router;
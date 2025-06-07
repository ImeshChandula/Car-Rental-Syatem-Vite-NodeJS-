import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateUser } from '../middleware/validator.js';
import { checkCurrent, login, logout, register } from '../controllers/authController.js';
import { forgotPassword, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/passwordController.js';

const router = express.Router();

// http://localhost:5000


//@route   POST api/auth/register
//@desc    Register user
//@access  Public
router.post("/register", validateUser, register);

//@route   POST api/auth/login
//@desc    Register user
//@access  Public
router.post("/login", login);

//@route   POST api/auth/logout
//@desc    Logout user
//@access  Private
router.post("/logout", authenticateUser, logout);

//@route   GET api/auth/checkCurrent
//@desc    Get current user profile(by token)
//@access  Private
router.get("/checkCurrent", authenticateUser, checkCurrent);

//@route   POST api/auth/sendVerifyOtp
//@desc    Send verification OTP to the user email
//@access  Private
router.post("/sendVerifyOtp", sendVerifyOtp);

//@route   POST api/auth/verifyEmail
//@desc    Verify email by otp
//@access  Private
router.post("/verifyEmail", verifyEmail);

//@route   POST api/auth/sendResetOtp
//@desc    Get otp to reset password
//@access  Public
router.post("/sendResetOtp", forgotPassword);

//@route   POST api/auth/resetPassword
//@desc    Reset password
//@access  Public
router.post("/resetPassword", resetPassword);


export default router;
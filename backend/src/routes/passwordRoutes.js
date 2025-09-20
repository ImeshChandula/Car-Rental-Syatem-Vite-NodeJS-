import express from 'express';
import { forgotPassword, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/passwordController.js';
import { validatePasswordUpdate, validateReqOTPUpdate, validateVerifyEmailUpdate } from '../validators/AccountValidator.js';

const router = express.Router();

// http://localhost:5000/api/password

router.post("/sendVerifyOtp", validateReqOTPUpdate, sendVerifyOtp);
router.post("/verifyEmail", validateVerifyEmailUpdate, verifyEmail);
router.post("/sendResetOtp", validateReqOTPUpdate, forgotPassword);
router.post("/resetPassword", validatePasswordUpdate, resetPassword);


export default router;
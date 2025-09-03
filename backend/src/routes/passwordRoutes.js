import express from 'express';
import { forgotPassword, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/passwordController.js';

const router = express.Router();

// http://localhost:5000/api/password



router.post("/sendVerifyOtp", sendVerifyOtp);
router.post("/verifyEmail", verifyEmail);
router.post("/sendResetOtp", forgotPassword);
router.post("/resetPassword", resetPassword);


export default router;
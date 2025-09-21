import express from 'express';
import { googleAuth, linkGoogleAccount, unlinkGoogleAccount } from '../controllers/googleAuthController.js';
import { authenticateUser } from '../middleware/authMiddleware.js'; // Your JWT middleware

const router = express.Router();

// http://localhost:5000/api/google

// Google authentication (register/login)
router.post('/auth', googleAuth);

// Link Google account to existing user (protected route)
router.post('/link', authenticateUser, linkGoogleAccount);

// Unlink Google account (protected route)
router.delete('/unlink', authenticateUser, unlinkGoogleAccount);

export default router;
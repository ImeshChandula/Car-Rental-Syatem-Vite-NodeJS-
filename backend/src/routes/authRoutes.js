import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateUser } from '../middleware/authValidator.js';
import { checkCurrent, login, logout, register } from '../controllers/authController.js';

const router = express.Router();

// http://localhost:5000/api/auth


router.post("/register", validateUser, register);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.get("/checkAuth", authenticateUser, checkCurrent);


export default router;
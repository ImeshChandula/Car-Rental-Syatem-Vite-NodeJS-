import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { checkAuth, login, logout, registerAdmin, registerUser } from '../controllers/auth.controller.js';
import { validateAccount } from '../validators/AccountValidator.js';


const router = express.Router();

// http://localhost:5000/api/auth


router.post("/register/admin", validateAccount, registerAdmin);
router.post("/register/user", validateAccount, registerUser);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.get("/checkAuth", authenticateUser, checkAuth);


export default router;
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

//@route   POST api/auth/checkCurrent
//@desc    Get current user profile(by token)
//@access  Private
router.get("/checkCurrent", authenticateUser,  authController.checkCurrent);




module.exports = router;
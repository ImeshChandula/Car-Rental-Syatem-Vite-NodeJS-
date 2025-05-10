const express = require('express');
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const userController  = require("../controllers/userController");

const router = express.Router();

//@route   POST api/users/getAllUsers
//@desc    Get all users
//@access  private - Admin only
router.get("/getAllUsers", authenticateUser, authorizeRoles("owner"), userController.getAllUsers);

module.exports = router;
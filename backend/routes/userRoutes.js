const express = require('express');
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const userController  = require("../controllers/userController");

const router = express.Router();

//http://localhost:5000

//@route   POST api/users/getAllUsers
//@desc    Get all users
//@access  private - Admin only
router.get("/getAllUsers", authenticateUser, authorizeRoles("owner"), userController.getAllUsers);

//@route   PATCH api/users/updateUserById/:id
//@desc    Update user
//@access  private 
router.patch("/updateUserById/:id", authenticateUser, userController.updateUserById);

//@route   DELETE api/users/deleteUserById/:id
//@desc    Update user
//@access  private 
router.delete("/deleteUserById/:id", authenticateUser, authorizeRoles("owner"), userController.deleteUserById);



module.exports = router;